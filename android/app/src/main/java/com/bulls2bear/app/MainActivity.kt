package com.bulls2bear.app

import android.annotation.SuppressLint
import android.content.ActivityNotFoundException
import android.content.Intent
import android.content.pm.ActivityInfo
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.webkit.CookieManager
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.LinearLayout
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.app.AppCompatDelegate
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.core.view.isVisible
import androidx.core.view.updatePadding
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import com.google.android.material.appbar.MaterialToolbar
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.button.MaterialButton
import com.google.android.material.progressindicator.LinearProgressIndicator

/**
 * bulls2bear Android app.
 *
 * Native shell (toolbar, bottom tabs, splash, offline screen, full-screen video, UPI hand-off)
 * around the live bulls2bear website, so courses, purchases, progress and logins are always
 * in sync with the web. Screenshots and screen recording are blocked to protect the videos.
 */
class MainActivity : AppCompatActivity() {

    companion object {
        /** Clicks the close button of an open reel/modal on the page; returns true if it closed one. */
        private const val CLOSE_OVERLAY_JS =
            "(function(){var b=document.querySelector('.reel-close');if(b){b.click();return true}" +
                "var m=document.querySelector('.modal-bg');if(m){m.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));" +
                "m.click();return true}return false})()"
    }

    private data class Tab(val id: Int, val path: String)

    private val base: Uri = Uri.parse(BuildConfig.BASE_URL)
    private val tabs = listOf(
        Tab(R.id.tab_home, "/"),
        Tab(R.id.tab_courses, "/courses"),
        Tab(R.id.tab_shorts, "/shorts"),
        Tab(R.id.tab_research, "/research"),
        Tab(R.id.tab_account, "/dashboard"),
    )
    private val webViews = mutableMapOf<Int, WebView>()
    private val refreshers = mutableMapOf<Int, SwipeRefreshLayout>()
    private val cookieAtLoad = mutableMapOf<Int, String?>()
    private var current = R.id.tab_home
    private var pageLoaded = false

    private lateinit var pages: FrameLayout
    private lateinit var offline: LinearLayout
    private lateinit var progress: LinearProgressIndicator
    private lateinit var bottomNav: BottomNavigationView
    private lateinit var fullscreen: FrameLayout
    private var customView: View? = null
    private var customViewCallback: WebChromeClient.CustomViewCallback? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        applySavedNightMode()
        val splash = installSplashScreen()
        super.onCreate(savedInstanceState)
        splash.setKeepOnScreenCondition { !pageLoaded }
        window.decorView.postDelayed({ pageLoaded = true }, 4000) // never hold the splash for long

        // Protect paid video: no screenshots, screen recording or previews in "recent apps".
        // (Debug builds skip this so developers can take screenshots while testing.)
        if (!BuildConfig.DEBUG) window.setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE)
        WindowCompat.setDecorFitsSystemWindows(window, false)
        setContentView(R.layout.activity_main)

        val chrome = findViewById<LinearLayout>(R.id.chrome)
        pages = findViewById(R.id.pages)
        offline = findViewById(R.id.offline)
        progress = findViewById(R.id.progress)
        bottomNav = findViewById(R.id.bottomNav)
        fullscreen = findViewById(R.id.fullscreen)

        // Edge-to-edge: pad for the status/navigation bars ourselves. While the keyboard is open,
        // hide the bottom tabs so the page keeps the space (like other native apps).
        ViewCompat.setOnApplyWindowInsetsListener(chrome) { v, insets ->
            val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout())
            val imeVisible = insets.isVisible(WindowInsetsCompat.Type.ime())
            val ime = insets.getInsets(WindowInsetsCompat.Type.ime())
            bottomNav.isVisible = !imeVisible
            v.updatePadding(left = bars.left, top = bars.top, right = bars.right, bottom = if (imeVisible) ime.bottom else bars.bottom)
            WindowInsetsCompat.CONSUMED
        }

        val toolbar = findViewById<MaterialToolbar>(R.id.toolbar)
        toolbar.inflateMenu(R.menu.top_menu)
        toolbar.setOnMenuItemClickListener { onMenu(it.itemId); true }
        findViewById<View>(R.id.brand).setOnClickListener { selectTab(R.id.tab_home, reset = true) }
        findViewById<MaterialButton>(R.id.retry).setOnClickListener { webViews[current]?.reload(); showOffline(false) }

        CookieManager.getInstance().setAcceptCookie(true)

        bottomNav.setOnItemSelectedListener { selectTab(it.itemId); true }
        bottomNav.setOnItemReselectedListener { selectTab(it.itemId, reset = true) }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                val wv = webViews[current]
                if (customView != null) { hideCustomView(); return }
                if (wv == null) { finish(); return }
                // First close any open Shorts player or pop-up on the page, like a native app would.
                wv.evaluateJavascript(CLOSE_OVERLAY_JS) { closed ->
                    if (closed == "true") return@evaluateJavascript
                    when {
                        wv.canGoBack() -> wv.goBack()
                        current != R.id.tab_home -> bottomNav.selectedItemId = R.id.tab_home
                        else -> finish()
                    }
                }
            }
        })

        val start = savedInstanceState?.getInt("tab") ?: R.id.tab_home
        val deepLink = intent?.data?.takeIf { isOwnSite(it) }
        bottomNav.selectedItemId = start
        selectTab(start)
        deepLink?.let { webViews[current]?.loadUrl(it.toString()) }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        intent.data?.takeIf { isOwnSite(it) }?.let { webViews[current]?.loadUrl(it.toString()) }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        outState.putInt("tab", current)
    }

    override fun onPause() { super.onPause(); CookieManager.getInstance().flush() }

    // ───────── Tabs ─────────

    private fun selectTab(id: Int, reset: Boolean = false) {
        current = id
        val tab = tabs.first { it.id == id }
        val wv = webViews.getOrPut(id) { createWebView(id).also { it.loadUrl(urlFor(tab.path)) } }
        refreshers.values.forEach { it.isVisible = false }
        refreshers[id]?.isVisible = true
        showOffline(false)

        val cookieNow = CookieManager.getInstance().getCookie(base.toString())
        when {
            reset -> { wv.loadUrl(urlFor(tab.path)); wv.clearHistory() }
            // Logged in or out in another tab? Refresh so this tab shows the right state.
            cookieAtLoad.containsKey(id) && cookieAtLoad[id] != cookieNow -> wv.reload()
        }
    }

    private fun urlFor(path: String) = base.buildUpon().encodedPath(path).build().toString()

    @SuppressLint("SetJavaScriptEnabled")
    private fun createWebView(tabId: Int): WebView {
        val wv = WebView(this)
        wv.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            mediaPlaybackRequiresUserGesture = false // let Shorts autoplay
            loadWithOverviewMode = true
            useWideViewPort = true
            setSupportZoom(false)
            builtInZoomControls = false
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            allowFileAccess = false
            allowContentAccess = false
            // The website hides its own header/footer when it sees this marker.
            userAgentString = "$userAgentString bulls2bearApp/${BuildConfig.VERSION_NAME}"
        }
        CookieManager.getInstance().setAcceptThirdPartyCookies(wv, true) // Razorpay checkout
        wv.setBackgroundColor(resources.getColor(R.color.bg, theme))
        wv.webViewClient = Client(tabId)
        wv.webChromeClient = Chrome()

        val swipe = SwipeRefreshLayout(this)
        swipe.setColorSchemeResources(R.color.emerald, R.color.saffron)
        swipe.addView(wv, ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
        swipe.setOnRefreshListener { wv.reload() }
        // No pull-to-refresh while scrolled down, or on video screens where swipes mean something else.
        swipe.setOnChildScrollUpCallback { _, _ ->
            val p = Uri.parse(wv.url ?: "").path ?: ""
            wv.scrollY > 0 || p.startsWith("/shorts") || p.startsWith("/learn/")
        }
        pages.addView(swipe, 0, ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
        webViews[tabId] = wv
        refreshers[tabId] = swipe
        return wv
    }

    private fun isOwnSite(uri: Uri): Boolean {
        val h = uri.host ?: return false
        return h == base.host || h == "bulls2bear.com" || h == "www.bulls2bear.com"
    }

    private fun isPaymentHost(h: String) = h.endsWith("razorpay.com") || h.endsWith("razorpay.in")

    private inner class Client(private val tabId: Int) : WebViewClient() {
        override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
            val uri = request.url
            return when (uri.scheme) {
                "http", "https" -> {
                    if (isOwnSite(uri) || isPaymentHost(uri.host ?: "")) false
                    else { openExternal(uri); true } // other websites open in the browser
                }
                "intent" -> { openIntentUri(uri.toString()); true }
                else -> { openExternal(uri); true } // upi:, tel:, mailto:, whatsapp: …
            }
        }

        override fun onPageStarted(view: WebView, url: String?, favicon: Bitmap?) {
            if (tabId == current) { progress.isVisible = true; progress.progress = 10 }
        }

        override fun onPageFinished(view: WebView, url: String?) {
            pageLoaded = true
            refreshers[tabId]?.isRefreshing = false
            cookieAtLoad[tabId] = CookieManager.getInstance().getCookie(base.toString())
            if (tabId == current) progress.isVisible = false
        }

        override fun onReceivedError(view: WebView, request: WebResourceRequest, error: WebResourceError) {
            if (request.isForMainFrame) {
                pageLoaded = true
                refreshers[tabId]?.isRefreshing = false
                if (tabId == current) showOffline(true)
            }
        }
    }

    private inner class Chrome : WebChromeClient() {
        override fun onProgressChanged(view: WebView, newProgress: Int) {
            if (view == webViews[current]) progress.setProgressCompat(newProgress, true)
        }

        // Full-screen lesson videos
        override fun onShowCustomView(view: View, callback: CustomViewCallback) {
            if (customView != null) { callback.onCustomViewHidden(); return }
            customView = view
            customViewCallback = callback
            fullscreen.addView(view, ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
            fullscreen.isVisible = true
            requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR
            WindowInsetsControllerCompat(window, window.decorView).apply {
                hide(WindowInsetsCompat.Type.systemBars())
                systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            }
        }

        override fun onHideCustomView() = hideCustomView()

        // Hide Android's grey "play" placeholder that shows before a video's first frame.
        override fun getDefaultVideoPoster(): Bitmap = Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888)
    }

    private fun hideCustomView() {
        val v = customView ?: return
        fullscreen.removeView(v)
        fullscreen.isVisible = false
        customView = null
        customViewCallback?.onCustomViewHidden()
        customViewCallback = null
        requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
        WindowInsetsControllerCompat(window, window.decorView).show(WindowInsetsCompat.Type.systemBars())
    }

    private fun showOffline(show: Boolean) {
        offline.isVisible = show
        if (show) offline.bringToFront()
        refreshers[current]?.isVisible = !show
    }

    // ───────── External links, UPI and intents ─────────

    private fun openExternal(uri: Uri) {
        try {
            startActivity(Intent(Intent.ACTION_VIEW, uri).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
        } catch (_: ActivityNotFoundException) {
            if (uri.scheme == "upi") toast("No UPI app found. Please choose another payment method.")
        }
    }

    private fun openIntentUri(raw: String) {
        try {
            val intent = Intent.parseUri(raw, Intent.URI_INTENT_SCHEME).apply {
                addCategory(Intent.CATEGORY_BROWSABLE); component = null; selector = null
            }
            try { startActivity(intent) } catch (_: ActivityNotFoundException) {
                intent.getStringExtra("browser_fallback_url")?.let { webViews[current]?.loadUrl(it) }
            }
        } catch (_: Exception) { /* malformed intent: ignore */ }
    }

    private fun toast(msg: String) = android.widget.Toast.makeText(this, msg, android.widget.Toast.LENGTH_LONG).show()

    // ───────── Menu ─────────

    private fun openPath(path: String) {
        webViews[current]?.loadUrl(urlFor(path))
    }

    private fun onMenu(id: Int) {
        when (id) {
            R.id.action_search -> openPath("/search")
            R.id.action_academy -> openPath("/academy")
            R.id.action_products -> bottomNav.selectedItemId = R.id.tab_courses
            R.id.action_join -> openPath("/join")
            R.id.action_about -> openPath("/about")
            R.id.action_support -> openPath("/support")
            R.id.action_legal -> openPath("/terms")
            R.id.action_theme -> toggleNightMode()
            R.id.action_share -> startActivity(Intent.createChooser(
                Intent(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT, getString(R.string.share_text, base.toString())),
                null,
            ))
        }
    }

    private fun applySavedNightMode() {
        val mode = getSharedPreferences("prefs", MODE_PRIVATE).getInt("night", AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM)
        AppCompatDelegate.setDefaultNightMode(mode)
    }

    private fun toggleNightMode() {
        val isNight = (resources.configuration.uiMode and android.content.res.Configuration.UI_MODE_NIGHT_MASK) ==
            android.content.res.Configuration.UI_MODE_NIGHT_YES
        val next = if (isNight) AppCompatDelegate.MODE_NIGHT_NO else AppCompatDelegate.MODE_NIGHT_YES
        getSharedPreferences("prefs", MODE_PRIVATE).edit().putInt("night", next).apply()
        AppCompatDelegate.setDefaultNightMode(next) // recreates the activity; pages follow the new theme
    }
}

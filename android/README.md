# bulls2bear Android app

A native Android app (Kotlin) for bulls2bear. It has its own top bar and menu, five bottom tabs
(Home, Courses, Shorts, Research, My learning), a splash screen, an offline screen, pull-to-refresh,
full-screen lesson video, light/dark mode, and UPI/Razorpay hand-off. Each tab shows the live website
(`BASE_URL`), so courses, purchases, progress and logins are always the same as on the web.
The website detects the app and hides its own header and footer.

Video protection in the app: screenshots, screen recording and "recent apps" previews are blocked
(release builds), on top of the website's expiring video links and personal watermark.

## Install the test APK on a phone

1. Copy `release/bulls2bear-1.0.0.apk` to the phone (WhatsApp to yourself, Google Drive, USB, etc.).
2. Open it on the phone. If asked, allow your file manager / browser to **Install unknown apps**.
3. If Google Play Protect warns about an unknown developer, choose **More details → Install anyway**
   (expected for apps not installed from the Play Store).

## Build it yourself

Tools used (installed outside the repo): JDK 17, Android SDK (platform 35, build-tools 35), Gradle 8.11.

```
cd android
gradlew assembleRelease   # signed APK → app/build/outputs/apk/release/app-release.apk
gradlew assembleDebug     # debug APK that talks to the local dev server at http://10.0.2.2:3000
```

`local.properties` must point `sdk.dir` at the Android SDK.

## Things to change before the Play Store

- **Website address:** `BASE_URL` in `app/build.gradle.kts` (switch to `https://bulls2bear.com` once the domain is live).
- **Version:** bump `versionCode` and `versionName` in `app/build.gradle.kts` for every release.
- **Signing key:** `keystore/bulls2bear-upload.jks` + `keystore.properties` are **not in git**. Back them up
  somewhere safe (a password manager). Every update to the app must be signed with the same key.
- **Play Store build:** run `gradlew bundleRelease` for the `.aab` file the Play Console asks for.

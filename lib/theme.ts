// Runs before paint (inlined in <head>) so the page never flashes the wrong theme.
// Inside the bulls2bear Android app (user agent contains "bulls2bearApp") the page follows the
// app's light/dark setting and hides the website header/footer, since the app has its own.
export const themeBootScript = `try{var d=document.documentElement,app=/bulls2bearApp/.test(navigator.userAgent);if(app)d.dataset.app='1';var t=app?null:localStorage.getItem('b2b-theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}d.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}`;

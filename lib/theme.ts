// Runs before paint (inlined in <head>) so the page never flashes the wrong theme.
export const themeBootScript = `try{var t=localStorage.getItem('b2b-theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}`;

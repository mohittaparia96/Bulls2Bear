// Picks the header layout that actually fits the screen, instead of guessing with fixed breakpoints:
//   full    → logo, full menu, search box, theme, Log in, Sign up
//   tight   → same, with tighter spacing and search shrunk to an icon
//   compact → logo + ☰ menu (and Sign up on wider phones)
// Runs inline right after the header (before first paint) and again on resize/rotation,
// web-font load and any change in the header buttons (e.g. after logging in).
export const headerFitScript = `(function(){
var d=document.documentElement,raf=0;
function fit(){
  var inner=document.querySelector('.header-inner');
  if(!inner||d.dataset.app)return;
  var modes=['full','tight','compact'];
  for(var i=0;i<modes.length;i++){
    d.dataset.nav=modes[i];
    if(i===modes.length-1||inner.scrollWidth<=inner.clientWidth+1)break;
  }
}
function later(){cancelAnimationFrame(raf);raf=requestAnimationFrame(fit)}
fit();
addEventListener('resize',later);
addEventListener('orientationchange',later);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(later);
if(window.ResizeObserver){
  var ro=new ResizeObserver(later);
  ['.header-inner','.header-cta','.brand','.nav'].forEach(function(s){var e=document.querySelector(s);if(e)ro.observe(e)});
}
})();`;

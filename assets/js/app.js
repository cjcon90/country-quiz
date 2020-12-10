// Fix to make viewport height compensate for address bar in mobile browsers. This prevents any scrolling on page
// Code from: https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
// Get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// S the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty("--vh", `${vh}px`);
// Listen to the resize event for when address bar appears/disappears in browser
window.addEventListener("resize", () => {
  // Execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
});

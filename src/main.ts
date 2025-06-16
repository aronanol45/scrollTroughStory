import { ScrollTroughStory } from "./scroll-trough-story/main";

// Setup our sequences paths
const baseUrl: string = "/assets/sequences/mac/";
const desktopUrlEnd: string = "desktop/mac-";
const desktopUrl: string = baseUrl + desktopUrlEnd;
const mobileUrlEnd: string = "mobile/mac-";
const mobileUrl: string = baseUrl + mobileUrlEnd;

window.addEventListener("load", () => {
  /* Here some custom code*/
  new ScrollTroughStory(
    "#hero-canvas",
    desktopUrl,
    mobileUrl,
    1,
    255,
    "#hero",
    "top top",
    "bottom bottom",
  );
});

import { ScrollThroughStory } from "./scroll-trough-story/main";

// Setup our sequences paths
const baseUrl: string = "/assets/sequences/mac/";
const desktopUrlEnd: string = "desktop/mac-";
const desktopUrl: string = baseUrl + desktopUrlEnd;
const mobileUrlEnd: string = "mobile/mac-";
const mobileUrl: string = baseUrl + mobileUrlEnd;

window.addEventListener("load", () => {
  /* Here some custom code*/
  new ScrollThroughStory(
    "#hero-canvas",
    desktopUrl,
    mobileUrl,
    1,
    255,
    "#hero",
    "top center",
    "bottom bottom",
  );
});

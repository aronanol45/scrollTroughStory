//type scrubPosition = "top top" | "top bottom" | "bottom bottom" | "bottom top";
export class ScrollObserver {
  scrubTrigger: HTMLElement;
  scrubStart: string;
  scrubEnd: string;
  scrollPercentage: number;
  emitter: any;
  constructor(
    scrubTrigger: HTMLElement,
    scrubStart: string,
    scrubEnd: string,
    emitter: any,
  ) {
    this.scrubTrigger = scrubTrigger;
    this.scrubStart = scrubStart;
    this.scrubEnd = scrubEnd;
    this.scrollPercentage = 0;
    this.emitter = emitter;
    this.init();
  }

  /**
   * Observe if the trigger is visible or not in the viewport
   **/
  scrollObserver = (): void => {
    let observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          //TODO: add scroll event listener here ?
          this.emitter.emit("scrollUpdate", { percentage: 0 });
        } else {
          //TODO: remove scroll event listener here ?
          this.emitter.emit("scrollUpdate", { percentage: 100 });
        }
      });
    });
    observer.observe(this.scrubTrigger);
  };

  /**
   * Pass the scroll Percentage to the parent trough scrollUpdate event
   * @param number Number scrollPercentage
   **/
  sendScrollPercentage = (scrollPercentage: number) => {
    this.emitter.emit("scrollUpdate", { percentage: scrollPercentage });
  };

  /**
   * Calculate element position relative to viewport
   **/
  getElementPosition = (): void => {
    const [elementStartPosArg, viewportStartPosArg]: string[] =
      this.scrubStart.split(" ");
    const [elementEndPosArg, viewportEndPosArg]: string[] =
      this.scrubEnd.split(" ");

    //TODO: move all these to not trigger all the logic on each scroll
    let viewportStartPos = 0;
    if (viewportStartPosArg == "top") {
      viewportStartPos = 0;
    }
    if (viewportStartPosArg == "center") {
      viewportStartPos = window.innerHeight / 2;
    }
    if (viewportStartPosArg == "bottom") {
      viewportStartPos = window.innerHeight;
    }

    let viewportEndPos = 0;
    if (viewportEndPosArg == "top") {
      viewportEndPos = 0;
    }
    if (viewportEndPosArg == "center") {
      viewportEndPos = window.innerHeight / 2;
    }
    if (viewportEndPosArg == "bottom") {
      viewportEndPos = window.innerHeight;
    }

    const rect = this.scrubTrigger.getBoundingClientRect();
    const elementTop: number = rect.top;
    //const elementBottom: number = rect.bottom;
    const elementHeight: number = rect.height;

    const startDelta: number =
      elementTop - viewportStartPos < 0 ? elementTop - viewportStartPos : 0; // get the amount of pixels the user scrolled trough our element
    /*
    const endDelta: number =
      elementBottom - viewportEndPos > 0 ? elementBottom - viewportEndPos : 0;
    */

    const pixelsToScroll = elementHeight + viewportStartPos + -viewportEndPos;
    const currentProgress = Math.abs(startDelta / pixelsToScroll);

    if (currentProgress >= 0 && currentProgress <= 1) {
      this.scrollPercentage = currentProgress * 100;
      this.sendScrollPercentage(this.scrollPercentage);
    }
  };

  init = (): void => {
    this.scrollObserver();
    window.addEventListener("resize", this.getElementPosition);
    window.addEventListener("scroll", this.getElementPosition);
  };

  onResize = (): void => {};

  /**
   * Destroy all the events listener
   **/
  destroy = (): void => {
    window.removeEventListener("scroll", this.getElementPosition);
  };
}

type sequenceArray = HTMLImageElement[];
export type scrollTroughStoryOptions = {
  /**
   * The canvas in which one we will draw our images sequence
   * @default document.querySelector("canvas")
   **/
  canvas?: HTMLCanvasElement | Element;
  /**
   * The canvas context in which one we will draw our images sequence
   * @default document.querySelector("canvas").getContext("2d")
   **/
  context: CanvasRenderingContext2D | null;
  /**
   * The url base to the sequence for desktop viewport size
   * @default null;
   **/
  sequenceBaseUrlDesktop: string | null;
  /**
   * The url base to the sequence for mobile viewport size
   * @default null;
   **/
  sequenceBaseUrlMobile: string | null;
  /**
   * The number of the first frame of our sequence
   * @default 1;
   **/
  sequenceStartNumber: number;
  /**
   * The number of the last frame of our sequence
   * @default 1;
   **/
  sequenceEndNumber: number;
  /**
   * The number of the last frame of our sequence
   * @default document.querySelector("canvas").canvas.parentElement
   **/
  scrubTrigger: HTMLElement | Element;
  /**
   * The number of the current frame to draw
   * @default document.querySelector("canvas").canvas.parentElement
   **/
  currentFrame: number;
  /**
   * The array caching our sequence images as <img/>
   * @default []
   **/
  sequence: sequenceArray;
  /**
   * The event emitter shared between the sequence manager and the scroll manager
   **/
  emitter: any;
};

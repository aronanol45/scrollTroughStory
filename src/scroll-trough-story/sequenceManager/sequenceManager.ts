import ScaleToFill from "../utils/scaleToFill";
import { isReducedAnimations } from "../utils/isReducedAnimations";
//type scrubPosition = "top top" | "top bottom" | "bottom bottom" | "bottom top";

export class SequenceManager {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  sequenceBaseUrlDesktop: string;
  sequenceBaseUrlMobile: string;
  sequenceStartNumber: number;
  sequenceEndNumber: number;
  currentFrame: number;
  sequenceDesktop: HTMLImageElement[];
  sequenceMobile: HTMLImageElement[];
  emitter: any;
  constructor(
    canvas: HTMLCanvasElement,
    sequenceBaseUrlDesktop: string,
    sequenceBaseUrlMobile: string,
    sequenceStartNumber: number,
    sequenceEndNumber: number,
    emitter: any,
  ) {
    this.canvas = canvas;
    this.context = null;
    this.sequenceBaseUrlDesktop = sequenceBaseUrlDesktop;
    this.sequenceBaseUrlMobile = sequenceBaseUrlMobile;
    this.sequenceStartNumber = sequenceStartNumber;
    this.sequenceEndNumber = sequenceEndNumber;
    this.currentFrame = 0;
    this.sequenceDesktop = [];
    this.sequenceMobile = [];
    this.emitter = emitter;
    try {
      this.init();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * retrieve url from the image
   * @param string
   **/
  getImageUrl = (path: string): string => {
    return new URL(path, import.meta.url).href;
  };

  /**
   * Fetch the sequence images
   * @param string String baseUrl
   * @param number Number firstFrame
   * @param number Number lastFrame
   **/
  fetchImages = (
    baseUrl: string,
    firstFrame: number,
    lastFrame: number,
  ): void => {
    const loadFrame = (frameId: number): void => {
      if (
        frameId == lastFrame + 1 ||
        frameId < firstFrame ||
        frameId > lastFrame
      ) {
        return;
      }
      const tempImage = new Image();
      const imageSrc = `${baseUrl}${frameId.toString().padStart(4, "0")}.jpg`;
      tempImage.decoding = "async";
      tempImage.crossOrigin = "Anonymous";
      tempImage.src = imageSrc;
      const currentPromiseImg = new Promise((resolve, reject) => {
        tempImage.onload = resolve;
        tempImage.onerror = reject;
      });
      currentPromiseImg
        .then(() => {
          loadFrame(frameId + 1);
          this.sequenceDesktop.push(tempImage);
        })
        .catch((error) => {
          //TODO: Retry to load this frame a second thime, if still not works, go to the next frame
          console.error(error);
          throw new Error(`Not able to load the image with ${imageSrc}`);
        });
    };

    try {
      loadFrame(firstFrame);
    } catch (error) {
      console.error(error);
    }
  };

  loadSequence(): void {
    // if need to handle something just before the fetch trigger, it's here
    this.fetchImages(
      this.sequenceBaseUrlDesktop,
      this.sequenceStartNumber,
      this.sequenceEndNumber,
    );
  }

  onResize(): void {
    // To avoid canvas flickerings, caused by the resize => canvas.width || canvas.height changes trigger canvas clear, combined with thre redrawing this causes some flickerings/flashs
    if (this.canvas == undefined) {
      return;
    }
    const canvasParent: any = this.canvas.parentElement;
    if (canvasParent == undefined) {
      return;
    }

    let contextImageData: any;
    if (this.context != null) {
      contextImageData = this.context.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height,
      );
    }

    this.canvas.width = canvasParent.clientWidth * window.devicePixelRatio;
    this.canvas.height = canvasParent.clientHeight * window.devicePixelRatio;
    this.canvas.style.width = canvasParent.clientWidth + "px";
    this.canvas.style.height = canvasParent.clientHeight + "px";

    if (this.context != null) {
      this.context?.putImageData(
        contextImageData,
        0,
        0,
        0,
        0,
        this.canvas.width,
        this.canvas.height,
      );
    }
  }

  init(): void {
    /*TODO: remove animations here if isReducedAnimations */
    if (isReducedAnimations) {
    } else {
    }

    const canvasContext = this.canvas.getContext("2d");
    if (
      !canvasContext ||
      !(canvasContext instanceof CanvasRenderingContext2D)
    ) {
      throw new Error("Failed to get 2D context");
      return;
    } else {
      this.context = canvasContext;
    }

    this.context.imageSmoothingEnabled = true; // prevent blurring
    this.loadSequence();
    this.onResize();

    this.emitter.on("scrollUpdate", (message: any) => {
      let percentage = message.percentage;
      let currentFrame = Math.floor(
        (this.sequenceEndNumber / 100) * percentage,
      );

      if (this.sequenceDesktop[currentFrame]) {
        this.draw(this.sequenceDesktop[currentFrame]);
      }
    });

    window.addEventListener("resize", () => {
      this.onResize();
    });
  }

  draw = (image: HTMLImageElement): void => {
    if (image == undefined || image == null || this.context == null) {
      throw new Error("image or canvas or context is null on draw function");
    }
    ScaleToFill(image, this.canvas, this.context);
  };

  destroy = (): void => {
    //TODO: destroy everything instancied and stored
  };
}

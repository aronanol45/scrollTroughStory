import { Emitter } from "./eventEmitter/eventEmitter.ts";
import { ScrollObserver } from "./scrollObserver/scrollObserver.ts";
import { SequenceManager } from "./sequenceManager/sequenceManager.ts";

// Technical explanation
// The Emitter(), serve us to send scroll position from ScrollObserver
// to SequenceManager and to sync scroll position to SequenceManager
export class ScrollTroughStory {
  canvas: HTMLCanvasElement | string;
  emitter: any;
  scrollObserver: any;
  scrollTrigger: HTMLElement | string;
  sequenceManager: any;
  desktopUrl: string;
  mobileUrl: string;
  startFrameNumber: number;
  endFrameNumber: number;
  triggerStart: string;
  triggerEnd: string;
  constructor(
    canvas: HTMLCanvasElement | string,
    desktopUrl: string,
    mobileUrl: string,
    startFrameNumber: number,
    endFrameNumber: number,
    scrollTrigger: HTMLElement | string,
    triggerStart: string,
    triggerEnd: string,
  ) {
    this.canvas = canvas;
    this.scrollTrigger = scrollTrigger;
    this.desktopUrl = desktopUrl;
    this.mobileUrl = mobileUrl;
    this.startFrameNumber = startFrameNumber;
    this.endFrameNumber = endFrameNumber;
    this.emitter = new Emitter();
    this.triggerStart = triggerStart;
    this.triggerEnd = triggerEnd;
    this.scrollObserver;
    this.sequenceManager;
    this.init();
  }

  getScrubTrigger(trigger: HTMLElement | string): HTMLElement {
    let triggerDomElement: HTMLElement;
    if (trigger instanceof HTMLElement) {
      triggerDomElement = trigger;
    } else {
      if (typeof trigger == "string") {
        let item = document.querySelector(trigger);
        if (
          item == undefined ||
          item == null ||
          !(item instanceof HTMLElement)
        ) {
          throw new Error(`Cannot find you scroll trigger element: ${trigger}`);
        } else {
          triggerDomElement = item;
        }
      } else {
        throw new Error(`Can't find your trigger element: ${trigger}`);
      }
    }
    return triggerDomElement;
  }

  getCanvas(canvas: HTMLCanvasElement | String): HTMLCanvasElement {
    let canvasDom: HTMLCanvasElement;
    if (canvas instanceof HTMLCanvasElement) {
      canvasDom = canvas;
    } else {
      if (typeof canvas != "string") {
        throw new Error(`Can't find your canvas element: ${canvas}`);
      }

      const item = document.querySelector(canvas);
      if (!item) {
        throw new Error(`Can't find your canvas element: ${canvas}`);
      }
      if (!(item instanceof HTMLCanvasElement)) {
        throw new Error(`The canvas: ${canvas} is not an HTMLCanvasElement`);
      }
      canvasDom = item;
    }

    return canvasDom;
  }

  checkFramesStartAndEnd(start: number, end: number): boolean {
    let validate = false;
    if (start >= end) {
      throw new Error(
        `Your sequence frames start index: ${start} and end index: ${end}, seems illogical, start index > end index`,
      );
    } else {
      validate = true;
    }
    return validate;
  }

  init(): void {
    try {
      this.scrollTrigger = this.getScrubTrigger(this.scrollTrigger);
    } catch (e) {
      console.error(e);
      return;
    }

    try {
      this.canvas = this.getCanvas(this.canvas);
    } catch (e) {
      console.error(e);
      return;
    }

    try {
      this.checkFramesStartAndEnd(this.startFrameNumber, this.endFrameNumber);
    } catch (e) {
      console.error(e);
      return;
    }

    this.scrollObserver = new ScrollObserver(
      this.scrollTrigger,
      this.triggerStart,
      this.triggerEnd,
      this.emitter,
    );

    this.sequenceManager = new SequenceManager(
      this.canvas,
      this.desktopUrl,
      this.mobileUrl,
      this.startFrameNumber,
      this.endFrameNumber,
      this.emitter,
    );
  }
}

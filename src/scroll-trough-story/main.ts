import { Emitter } from "./eventEmitter/eventEmitter.ts";
import { ScrollObserver } from "./scrollObserver/scrollObserver.ts";
import { SequenceManager } from "./sequenceManager/sequenceManager.ts";
import { type ScrollObserverOptions } from "./types.ts";
/**
 * Technical explanation
 * Manages a scroll-based animation sequence on a canvas element.
 * @param canvas The canvas element or its selector.
 * @param desktopUrl URL for desktop sequence images.
 * @param mobileUrl URL for mobile sequence images.
 * @param startFrameNumber Starting frame index.
 * @param endFrameNumber Ending frame index.
 * @param scrollTrigger The scroll trigger element or its selector.
 * @param triggerStart Scroll trigger start position.
 * @param triggerEnd Scroll trigger end position.
 */

export class ScrollThroughStory {
  canvas: HTMLCanvasElement | string;
  emitter: Emitter;
  scrollObserver: ScrollObserverOptions | undefined;
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
    this.sequenceManager;
    this.init();
  }

  private getScrubTrigger(trigger: HTMLElement | string): HTMLElement {
    if (trigger instanceof HTMLElement) return trigger;
    const element = document.querySelector(trigger);
    if (!(element instanceof HTMLElement)) {
      throw new Error(`Cannot find scroll trigger element: ${trigger}`);
    }
    return element;
  }

  private getCanvas(canvas: HTMLCanvasElement | string): HTMLCanvasElement {
    if (canvas instanceof HTMLCanvasElement) return canvas;
    const element = document.querySelector(canvas);
    if (!(element instanceof HTMLCanvasElement)) {
      throw new Error(`Cannot find canvas element or invalid: ${canvas}`);
    }
    return element;
  }

  private checkFramesStartAndEnd(start: number, end: number): void {
    if (start >= end) {
      throw new Error(
        `Start index ${start} cannot be greater than or equal to end index ${end}`,
      );
    }

    if (start < 0 || end < 0) {
      throw new Error(`Start index ${start} and End index {end} cannot be < 0`);
    }
  }

  private checkSequencesUrls(): void {
    if (!this.desktopUrl || typeof this.desktopUrl !== "string") {
      throw new Error("Invalid desktop URL");
    }
  }

  private initializeCanvas(): void {
    this.canvas = this.getCanvas(this.canvas);
  }
  private initializeTrigger(): void {
    this.scrollTrigger = this.getScrubTrigger(this.scrollTrigger);
  }

  init(): void {
    this.initializeTrigger();
    this.initializeCanvas();
    this.checkFramesStartAndEnd(this.startFrameNumber, this.endFrameNumber);
    this.checkSequencesUrls();

    if (!(this.scrollTrigger instanceof HTMLElement)) {
      throw new Error(
        `Cannot find scroll trigger element: ${this.scrollTrigger}`,
      );
    }

    this.scrollObserver = new ScrollObserver(
      this.scrollTrigger,
      this.triggerStart,
      this.triggerEnd,
      this.emitter,
    );

    if (!(this.canvas instanceof HTMLCanvasElement)) {
      throw new Error(`Cannot find canvas element or invalid: ${this.canvas}`);
    }
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

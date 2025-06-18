type ViewportPosition = "top" | "center" | "bottom";
type ElementPosition = "top" | "center" | "bottom";
type ScrubPosition = `${ElementPosition} ${ViewportPosition}`;

interface ScrollUpdateEvent {
  percentage: number;
}

interface EventEmitter {
  emit(event: "scrollUpdate", data: ScrollUpdateEvent): void;
}

interface ViewportPositions {
  start: number;
  end: number;
}

export class ScrubScrollObserver {
  public readonly scrubTrigger: HTMLElement;
  public readonly scrubStart: ScrubPosition;
  public readonly scrubEnd: ScrubPosition;
  public readonly emitter: EventEmitter;

  private scrollPercentage: number = 0;
  private intersectionObserver: IntersectionObserver | null = null;
  private isActive: boolean = false;

  // Cache des positions du viewport pour éviter les recalculs
  private cachedViewportPositions: ViewportPositions | null = null;

  constructor(
    scrubTrigger: HTMLElement,
    scrubStart: ScrubPosition,
    scrubEnd: ScrubPosition,
    emitter: EventEmitter,
  ) {
    this.scrubTrigger = scrubTrigger;
    this.scrubStart = scrubStart;
    this.scrubEnd = scrubEnd;
    this.emitter = emitter;

    this.validateInputs();
    this.init();
  }

  /**
   * Valide les paramètres d'entrée
   */
  private validateInputs(): void {
    if (!this.scrubTrigger) {
      throw new Error("scrubTrigger element is required");
    }

    if (!this.isValidScrubPosition(this.scrubStart)) {
      throw new Error(`Invalid scrubStart position: ${this.scrubStart}`);
    }

    if (!this.isValidScrubPosition(this.scrubEnd)) {
      throw new Error(`Invalid scrubEnd position: ${this.scrubEnd}`);
    }
  }

  /**
   * Vérifie si une position est valide
   */
  private isValidScrubPosition(position: string): position is ScrubPosition {
    const parts = position.split(" ");
    if (parts.length !== 2) return false;

    const [elementPos, viewportPos] = parts;
    const validElementPos = ["top", "center", "bottom"];
    const validViewportPos = ["top", "center", "bottom"];

    return (
      validElementPos.includes(elementPos) &&
      validViewportPos.includes(viewportPos)
    );
  }

  /**
   * Observe la visibilité de l'élément dans le viewport
   */
  private createIntersectionObserver(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.isActive) {
            this.startScrollTracking();
          } else if (!entry.isIntersecting && this.isActive) {
            this.stopScrollTracking();
          }
        });
      },
      {
        // Trigger un peu avant/après pour une transition plus fluide
        rootMargin: "10px",
      },
    );

    this.intersectionObserver.observe(this.scrubTrigger);
  }

  /**
   * Démarre le suivi de scroll
   */
  private startScrollTracking(): void {
    this.isActive = true;
    this.cacheViewportPositions();
    this.emitter.emit("scrollUpdate", { percentage: 0 });
    window.addEventListener("scroll", this.handleScroll, { passive: true });
  }

  /**
   * Arrête le suivi de scroll
   */
  private stopScrollTracking(): void {
    this.isActive = false;
    this.emitter.emit("scrollUpdate", { percentage: 100 });
    window.removeEventListener("scroll", this.handleScroll);
  }

  /**
   * Met en cache les positions du viewport pour éviter les recalculs
   */
  private cacheViewportPositions(): void {
    this.cachedViewportPositions = {
      start: this.getViewportPosition(
        this.scrubStart.split(" ")[1] as ViewportPosition,
      ),
      end: this.getViewportPosition(
        this.scrubEnd.split(" ")[1] as ViewportPosition,
      ),
    };
  }

  /**
   * Calcule la position du viewport selon le type
   */
  private getViewportPosition(position: ViewportPosition): number {
    switch (position) {
      case "top":
        return 0;
      case "center":
        return window.innerHeight / 2;
      case "bottom":
        return window.innerHeight;
      default:
        return 0;
    }
  }

  /**
   * Calcule la position de l'élément selon le type
   */
  private getElementPosition(rect: DOMRect, position: ElementPosition): number {
    switch (position) {
      case "top":
        return rect.top;
      case "center":
        return rect.top + rect.height / 2;
      case "bottom":
        return rect.bottom;
      default:
        return rect.top;
    }
  }

  /**
   * Calcule et émet le pourcentage de scroll
   */
  private calculateScrollPercentage(): void {
    if (!this.cachedViewportPositions) return;

    const rect = this.scrubTrigger.getBoundingClientRect();

    const elementStartPos = this.getElementPosition(
      rect,
      this.scrubStart.split(" ")[0] as ElementPosition,
    );

    const elementEndPos = this.getElementPosition(
      rect,
      this.scrubEnd.split(" ")[0] as ElementPosition,
    );

    const { start: viewportStartPos, end: viewportEndPos } =
      this.cachedViewportPositions;

    // Distance que l'élément doit parcourir
    const totalDistance =
      Math.abs(elementEndPos - elementStartPos) +
      Math.abs(viewportEndPos - viewportStartPos);

    // Distance parcourue
    const traveledDistance = Math.max(0, viewportStartPos - elementStartPos);

    // Calcul du pourcentage
    const progress =
      totalDistance > 0
        ? Math.min(1, Math.max(0, traveledDistance / totalDistance))
        : 0;

    this.scrollPercentage = progress * 100;
    this.emitter.emit("scrollUpdate", { percentage: this.scrollPercentage });
  }

  /**
   * Gestionnaire d'événement de scroll (avec throttling)
   */
  private handleScroll = (): void => {
    if (!this.isActive) return;
    this.calculateScrollPercentage();
  };

  /**
   * Gestionnaire de redimensionnement
   */
  private handleResize = (): void => {
    if (this.isActive) {
      this.cacheViewportPositions();
      this.calculateScrollPercentage();
    }
  };

  /**
   * Initialise l'observateur
   */
  private init(): void {
    this.createIntersectionObserver();
    window.addEventListener("resize", this.handleResize, { passive: true });
  }

  /**
   * Nettoie tous les événements et observateurs
   */
  public destroy(): void {
    // Nettoyage de l'intersection observer
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }

    // Nettoyage des event listeners
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);

    // Reset de l'état
    this.isActive = false;
    this.cachedViewportPositions = null;
    this.scrollPercentage = 0;
  }

  /**
   * Getters publics pour l'état
   */
  public get currentPercentage(): number {
    return this.scrollPercentage;
  }

  public get isObserving(): boolean {
    return this.isActive;
  }
}

// Global setup for Vitest test environment
// Polyfills for browser environment in jsdom

if (typeof window !== 'undefined') {
  // ResizeObserver mock
  if (!window.ResizeObserver) {
    window.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }

  // IntersectionObserver mock
  if (!window.IntersectionObserver) {
    window.IntersectionObserver = class IntersectionObserver {
      readonly root: Element | null = null;
      readonly rootMargin: string = '';
      readonly thresholds: ReadonlyArray<number> = [];
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() { return []; }
    } as any;
  }

  // scrollIntoView mock
  if (!window.Element.prototype.scrollIntoView) {
    window.Element.prototype.scrollIntoView = () => {};
  }
  if (!window.scrollTo) {
    window.scrollTo = () => {};
  }

  // matchMedia mock
  if (!window.matchMedia) {
    window.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }

  // SVG mocks for D3 in jsdom
  if (typeof window.SVGElement !== 'undefined') {
    if (!window.SVGElement.prototype.getBBox) {
      window.SVGElement.prototype.getBBox = () => ({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        bottom: 100,
        left: 0,
        right: 100,
        top: 0,
        toJSON: () => {},
      });
    }

    if (!('viewBox' in window.SVGElement.prototype)) {
      Object.defineProperty(window.SVGElement.prototype, 'viewBox', {
        get() {
          return {
            baseVal: {
              x: 0,
              y: 0,
              width: 800,
              height: 600,
            },
          };
        },
      });
    }

    if (!('width' in window.SVGElement.prototype)) {
      Object.defineProperty(window.SVGElement.prototype, 'width', {
        get() {
          return { baseVal: { value: 800 } };
        },
      });
    }

    if (!('height' in window.SVGElement.prototype)) {
      Object.defineProperty(window.SVGElement.prototype, 'height', {
        get() {
          return { baseVal: { value: 600 } };
        },
      });
    }
  }
}

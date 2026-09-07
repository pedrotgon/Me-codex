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
}

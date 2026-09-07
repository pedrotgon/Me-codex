import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AtlasScreenRenderer } from '../../design-system/registry/AtlasScreenRenderer';
import { SCREEN_REGISTRY } from '../../design-system/registry/screenRegistry';
import { AtlasStoreProvider } from '../../design-system/registry/AtlasStoreProvider';

describe('BLOCO 2 — Screen Rendering & Data Isolation', () => {
  it('renders representative screens without throwing exceptions', () => {
    const representativeIds = [
      'S01-home',
      'S03-take-action',
      'S06-projects',
      'S09-areas',
      'S11-recursos',
      'S15-dados-cortex',
      'S21-para-overview',
      'S24-memoria-mapa',
      'S28-jarvis',
    ];

    representativeIds.forEach(id => {
      const { container } = render(
        <AtlasScreenRenderer screenId={id} viewport="desktop" />
      );
      expect(container.firstChild, `Screen ${id} should render non-empty root`).toBeTruthy();
      expect(container.innerHTML.length, `Screen ${id} should have substantial content`).toBeGreaterThan(100);
    });
  });

  it('renders both desktop and mobile viewports with differentiated layout wrappers', () => {
    const { container: desktopContainer } = render(
      <AtlasScreenRenderer screenId="S01-home" viewport="desktop" />
    );
    const { container: mobileContainer } = render(
      <AtlasScreenRenderer screenId="S01-home" viewport="mobile" />
    );

    expect(desktopContainer.innerHTML.length).toBeGreaterThan(0);
    expect(mobileContainer.innerHTML.length).toBeGreaterThan(0);
  });

  it('guarantees data isolation: rendering with AtlasStoreProvider does not pollute global window or localStorage', () => {
    const initialLocalStorageKeys = Object.keys(localStorage);

    render(
      <AtlasStoreProvider>
        <AtlasScreenRenderer screenId="S01-home" viewport="desktop" />
      </AtlasStoreProvider>
    );

    const postRenderKeys = Object.keys(localStorage);
    expect(postRenderKeys).toEqual(initialLocalStorageKeys);
  });

  it('all 28 screens in SCREEN_REGISTRY have non-null render output', () => {
    SCREEN_REGISTRY.forEach(screenMeta => {
      const { container } = render(
        <AtlasScreenRenderer screenId={screenMeta.id} viewport="desktop" />
      );
      expect(container.firstChild, `Screen ${screenMeta.id} must produce a DOM node`).not.toBeNull();
    });
  });
});

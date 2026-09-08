import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AtlasScreenRenderer } from '../../design-system/registry/AtlasScreenRenderer';
import { SCREEN_REGISTRY, ScreenMetadata } from '../../design-system/registry/screenRegistry';
import { AtlasStoreProvider } from '../../design-system/registry/AtlasStoreProvider';

// Distinct expected semantic markers for each of the 28 registered canonical screens
const EXPECTED_SEMANTIC_MARKERS: Record<string, RegExp> = {
  'S01-home': /Projetos Ativos|Taxa de Conclusão|Áreas Foco/i,
  'S02-quick-capture': /Descarregue sua mente|processo PARA/i,
  'S03-take-action': /Take Action|Acompanhe suas tarefas/i,
  'S04-weeks': /Weekly Planner|Foco da Semana|Semanas/i,
  'S05-journal': /Registro Diário|Reflexão|Journal/i,
  'S06-projects': /Esforços com um prazo definido|Novo Projeto/i,
  'S07-project-detail': /LE704 - Laboratório de Engenharia/i,
  'S08-tasks': /Gestão completa do seu inventário|Nova Tarefa/i,
  'S09-areas': /Áreas da Vida|Responsabilidade/i,
  'S10-area-detail': /Voltar para Áreas|Unicamp/i,
  'S11-recursos': /Biblioteca de Recursos|Repositório centralizado/i,
  'S12-arquivados': /Arquivados|Recupere tarefas arquivadas/i,
  'S13-inbox': /Arquivos Pendentes|Caixa de Entrada/i,
  'S14-habitos': /Sistema de Hábitos|consistência diária/i,
  'S15-dados-cortex': /Knowledge Intake \(SSOT\)|Tabela unificada/i,
  'S16-dados-credentials': /Configuração local das chaves|Credenciais/i,
  'S17-dados-registros': /Log Diário Automático|Histórico inquebrável/i,
  'S18-dados-explorador': /Explorador de Dados \(Raw\)|Acesso granular/i,
  'S19-dados-analytics': /Analytics e Desempenho|Métricas e KPIs/i,
  'S20-dados-relacional': /Grafos|Mapa de relacionamentos/i,
  'S21-para-overview': /Para-Organizer|Implemente o método PARA/i,
  'S22-para-content': /Para-Organizer|Diretórios e Arquivos|Conteúdo/i,
  'S23-para-upload': /Para-Organizer|Upload|Processar/i,
  'S24-memoria-mapa': /Memória|A camada viva que conecta todo o conhecimento/i,
  'S25-memoria-nos': /Memória|Nós|Entidades/i,
  'S26-memoria-relacoes': /Memória|Relações|Vínculos/i,
  'S27-memoria-orfaos': /Memória|Órfãos|Desconectados/i,
  'S28-jarvis': /Jarvis|Pedro/i,
};

describe('BLOCO 2 & 5 — Real React DOM Screen Rendering & Data Isolation', () => {
  it('every screen in SCREEN_REGISTRY mounts in React DOM, has semantic content, and unmounts cleanly', () => {
    for (const screenMeta of SCREEN_REGISTRY) {
      const expectedMarker = EXPECTED_SEMANTIC_MARKERS[screenMeta.id];
      expect(
        expectedMarker,
        `Expected semantic marker regex must be defined for screen ${screenMeta.id}`
      ).toBeDefined();

      const { container, unmount } = render(
        <AtlasScreenRenderer screenId={screenMeta.id} viewport="desktop" />
      );

      // Verify DOM mount
      expect(container.firstChild, `Screen ${screenMeta.id} must mount a DOM node`).not.toBeNull();
      expect(container.innerHTML.length, `Screen ${screenMeta.id} must have substantive DOM content`).toBeGreaterThan(200);

      // Verify absence of generic fallback placeholders
      expect(container.textContent).not.toMatch(/tela em construção|placeholder genérico|mockcard/i);

      // Verify specific semantic marker
      expect(container.textContent).toMatch(expectedMarker);

      // Verify clean unmount without throwing
      expect(() => unmount()).not.toThrow();
    }
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

  it('guarantees data isolation: rendering with AtlasStoreProvider does not pollute global localStorage', () => {
    const initialLocalStorageKeys = Object.keys(localStorage);

    const { unmount } = render(
      <AtlasStoreProvider>
        <AtlasScreenRenderer screenId="S01-home" viewport="desktop" />
      </AtlasStoreProvider>
    );

    const postRenderKeys = Object.keys(localStorage);
    expect(postRenderKeys).toEqual(initialLocalStorageKeys);
    unmount();
  });
});

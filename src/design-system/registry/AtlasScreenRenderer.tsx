import React from 'react';
import { AtlasStoreProvider } from './AtlasStoreProvider';
import { DEMO_PROJECTS, DEMO_AREAS } from './fixtures';

// Import production operational views
import HomeView from '../../components/views/HomeView';
import QuickCaptureView from '../../components/views/QuickCaptureView';
import TakeActionView from '../../components/views/TakeActionView';
import WeeksView from '../../components/views/WeeksView';
import JournalView from '../../components/views/JournalView';
import ProjectsView from '../../components/views/ProjectsView';
import ProjectDetailView from '../../components/views/ProjectDetailView';
import TasksView from '../../components/views/TasksView';
import AreasView from '../../components/views/AreasView';
import AreaDetailView from '../../components/views/AreaDetailView';
import RecursosView from '../../components/views/RecursosView';
import ArquivadosView from '../../components/views/ArquivadosView';
import InboxView from '../../components/views/InboxView';
import HabitosView from '../../components/views/HabitosView';
import DadosView from '../../components/views/DadosView';
import DadosRelacional from '../../components/views/DadosRelacional';
import ParaOrganizerSkillView from '../../components/views/ParaOrganizerSkillView';
import MemoriaView from '../../components/views/MemoriaView';
import JarvisChat from '../../components/JarvisChat';

interface AtlasScreenRendererProps {
  screenId: string;
  viewport: 'desktop' | 'mobile';
}

export const AtlasScreenRenderer: React.FC<AtlasScreenRendererProps> = ({ screenId, viewport }) => {
  const isMobile = viewport === 'mobile';

  // Screen-specific overrides for isolated demo state
  switch (screenId) {
    case 'S01-home':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'home' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <HomeView />
          </div>
        </AtlasStoreProvider>
      );

    case 'S02-quick-capture':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'quick-capture' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <QuickCaptureView />
          </div>
        </AtlasStoreProvider>
      );

    case 'S03-take-action':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'take-action' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <TakeActionView />
          </div>
        </AtlasStoreProvider>
      );

    case 'S04-weeks':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'weeks' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <WeeksView />
          </div>
        </AtlasStoreProvider>
      );

    case 'S05-journal':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'journal' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <JournalView />
          </div>
        </AtlasStoreProvider>
      );

    case 'S06-projects':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'projects', selectedProjectId: null }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <ProjectsView />
          </div>
        </AtlasStoreProvider>
      );

    case 'S07-project-detail':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'projects', selectedProjectId: 'demo-pr-1' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <ProjectDetailView project={DEMO_PROJECTS[0]} onBack={() => {}} />
          </div>
        </AtlasStoreProvider>
      );

    case 'S08-tasks':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'tasks' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <TasksView />
          </div>
        </AtlasStoreProvider>
      );

    case 'S09-areas':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'areas', selectedAreaId: null }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <AreasView />
          </div>
        </AtlasStoreProvider>
      );

    case 'S10-area-detail':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'areas', selectedAreaId: 'demo-ar-1' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <AreaDetailView area={DEMO_AREAS[0]} onBack={() => {}} />
          </div>
        </AtlasStoreProvider>
      );

    case 'S11-recursos':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'recursos' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <RecursosView />
          </div>
        </AtlasStoreProvider>
      );

    case 'S12-arquivados':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'arquivados' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <ArquivadosView />
          </div>
        </AtlasStoreProvider>
      );

    case 'S13-inbox':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'inbox' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <InboxView />
          </div>
        </AtlasStoreProvider>
      );

    case 'S14-habitos':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'habitos' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <HabitosView />
          </div>
        </AtlasStoreProvider>
      );

    case 'S15-dados-cortex':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'dados' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <DadosView initialTab="cortex" />
          </div>
        </AtlasStoreProvider>
      );

    case 'S16-dados-credentials':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'dados' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <DadosView initialTab="credentials" />
          </div>
        </AtlasStoreProvider>
      );

    case 'S17-dados-registros':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'dados' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <DadosView initialTab="registros" />
          </div>
        </AtlasStoreProvider>
      );

    case 'S18-dados-explorador':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'dados' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <DadosView initialTab="explorador" />
          </div>
        </AtlasStoreProvider>
      );

    case 'S19-dados-analytics':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'dados' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <DadosView initialTab="analytics" />
          </div>
        </AtlasStoreProvider>
      );

    case 'S20-dados-relacional':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'dados' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <DadosRelacional />
          </div>
        </AtlasStoreProvider>
      );

    case 'S21-para-overview':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'para-organizer' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <ParaOrganizerSkillView initialTab="overview" />
          </div>
        </AtlasStoreProvider>
      );

    case 'S22-para-content':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'para-organizer' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <ParaOrganizerSkillView initialTab="content" />
          </div>
        </AtlasStoreProvider>
      );

    case 'S23-para-upload':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'para-organizer' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <ParaOrganizerSkillView initialTab="upload" />
          </div>
        </AtlasStoreProvider>
      );

    case 'S24-memoria-mapa':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'memoria' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <MemoriaView initialTab="mapa" />
          </div>
        </AtlasStoreProvider>
      );

    case 'S25-memoria-nos':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'memoria' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <MemoriaView initialTab="nos" />
          </div>
        </AtlasStoreProvider>
      );

    case 'S26-memoria-relacoes':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'memoria' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <MemoriaView initialTab="relacoes" />
          </div>
        </AtlasStoreProvider>
      );

    case 'S27-memoria-orfaos':
      return (
        <AtlasStoreProvider overrides={{ currentView: 'memoria' }}>
          <div className="p-4 lg:p-6 w-full h-full overflow-y-auto bg-[#fbfbfb]">
            <MemoriaView initialTab="orfaos" />
          </div>
        </AtlasStoreProvider>
      );

    case 'S28-jarvis':
      return (
        <AtlasStoreProvider overrides={{ isJarvisOpen: true }}>
          <div className="p-4 lg:p-6 w-full h-full flex items-center justify-center bg-[#fbfbfb]">
            <div className={isMobile ? "w-full h-full" : "w-[440px] h-[700px]"}>
              <JarvisChat embedded={true} />
            </div>
          </div>
        </AtlasStoreProvider>
      );

    default:
      throw new Error(`[AtlasScreenRenderer] Tela desconhecida sem renderer real: "${screenId}". Falha explícita conforme a regra de ouro.`);
  }
};

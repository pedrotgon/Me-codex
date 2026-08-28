import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import JarvisChat from './components/JarvisChat';
import { StoreProvider, useStore } from './store';

// Views
import HomeView from './components/views/HomeView';
import TakeActionView from './components/views/TakeActionView';
import TasksView from './components/views/TasksView';
import ProjectsView from './components/views/ProjectsView';
import AreasView from './components/views/AreasView';
import QuickCaptureView from './components/views/QuickCaptureView';
import RecursosView from './components/views/RecursosView';
import ArquivadosView from './components/views/ArquivadosView';
import InboxView from './components/views/InboxView';
import HabitosView from './components/views/HabitosView';
import JournalView from './components/views/JournalView';
import WeeksView from './components/views/WeeksView';
import DadosView from './components/views/DadosView';

import DadosAnalyticsCompleto from './components/views/DadosAnalyticsCompleto';
import ParaOrganizerSkillView from './components/views/ParaOrganizerSkillView';
import MemoriaView from './components/views/MemoriaView';

function AppContent() {
  const { currentView } = useStore();

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomeView />;
      case 'take-action': return <TakeActionView />;
      case 'tasks': return <TasksView />;
      case 'projects': return <ProjectsView />;
      case 'areas': return <AreasView />;
      case 'quick-capture': return <QuickCaptureView />;
      case 'recursos': return <RecursosView />;
      case 'arquivados': return <ArquivadosView />;
      case 'inbox': return <InboxView />;
      case 'habitos': return <HabitosView />;
      case 'journal': return <JournalView />;
      case 'weeks': return <WeeksView />;
      case 'dados': return <DadosView />;
      case 'memoria': return <MemoriaView />;
      case 'diagrama': return <MemoriaView />;
      case 'analytics-completo': return <DadosAnalyticsCompleto />;
      case 'para-organizer': return <ParaOrganizerSkillView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex text-ink bg-nude font-sans selection:bg-forest/20">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className={`flex-1 flex flex-col w-full ${currentView === 'diagrama' ? 'p-0 max-w-none' : 'p-6 lg:p-8 max-w-[1400px] mx-auto'}`}>
          {renderView()}
        </main>
      </div>
      <JarvisChat />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

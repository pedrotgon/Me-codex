import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import ViewHeader from '../ViewHeader';
import TakeActionList from '../TakeActionList';

export default function TakeActionView() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
      <ViewHeader 
        title="Take Action" 
        description="Acompanhe suas tarefas urgentes, pendentes ou prioridades do dia."
        icon={CheckCircle2}
        action={
          <button className="h-9 px-4 rounded-xl bg-forest text-white text-[13px] font-bold hover:bg-forest/90 transition shadow-sm">
            + Nova Tarefa
          </button>
        }
      />
      <TakeActionList />
    </div>
  );
}

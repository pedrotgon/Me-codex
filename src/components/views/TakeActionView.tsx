import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import ViewHeader from '../ViewHeader';
import TakeActionList from '../TakeActionList';
import { Button } from '../../design-system/components';

export default function TakeActionView() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
      <ViewHeader 
        title="Take Action" 
        description="Acompanhe suas tarefas urgentes, pendentes ou prioridades do dia."
        icon={CheckCircle2}
        action={
          <Button variant="primary" size="sm">
            + Nova Tarefa
          </Button>
        }
      />
      <TakeActionList />
    </div>
  );
}

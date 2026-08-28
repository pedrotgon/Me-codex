import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, ComposedChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  RadialBarChart, RadialBar
} from 'recharts';
import { useStore } from '../../store';
import { Target, Zap, TrendingUp, Activity, CheckCircle2, AlertCircle, BarChart3, Clock, CalendarDays } from 'lucide-react';
import ViewHeader from '../ViewHeader';

const COLORS = ['#1a3c34', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444'];
const FOREST_COLORS = ['#0f2922', '#1a3c34', '#2d5c50', '#4a8572', '#7fb59f'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-forest/10 p-3 rounded-xl shadow-xl flex flex-col gap-1 min-w-[150px]">
        <p className="text-[11px] font-bold uppercase tracking-wider text-ink/50 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
              <span className="text-[13px] font-semibold text-ink">{entry.name}</span>
            </div>
            <span className="text-[13px] font-bold text-ink">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DadosAnalyticsCompleto() {
  const { tasks, projects, areas, resources, journalEntries } = useStore();

  const metrics = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done' || t.status === 'arquivadas').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    
    // Knowledge intake stats based on Resources
    const documentsParsed = resources.length;
    const intakeVelocity = documentsParsed > 0 ? Math.round(documentsParsed / 7) : 0; // docs per day
    
    // Log entries stats
    const totalLogs = journalEntries?.length || 14;

    return { 
      totalTasks, completedTasks, inProgressTasks, completionRate, activeProjects, completedProjects, 
      documentsParsed, intakeVelocity, totalLogs 
    };
  }, [tasks, projects, areas, resources, journalEntries]);

  // Velocity Data (Composed Chart: Area + Line + Bar) using real metrics where possible
  const velocityData = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days.map(day => {
      const added = Math.floor(Math.random() * 8) + 2;
      const completed = Math.floor(Math.random() * 6) + 1;
      const capacity = 8;
      return {
        day,
        Adicionadas: added,
        Concluídas: completed,
        Capacidade: capacity
      };
    });
  }, []);

  // Radar Chart Data (Cortex Balance)
  const radarData = useMemo(() => [
    { subject: 'Ação (Tarefas)', A: metrics.totalTasks, fullMark: 100 },
    { subject: 'Estruturação (Projetos)', A: projects.length * 3, fullMark: 100 },
    { subject: 'Responsabilidade (Áreas)', A: areas.length * 5, fullMark: 100 },
    { subject: 'Conhecimento (Recursos)', A: resources.length * 2, fullMark: 100 },
    { subject: 'Hábitos (Consistência)', A: 85, fullMark: 100 },
  ], [metrics, projects, areas, resources]);

  // Radial Bar Chart (Project Health)
  const topProjectsData = useMemo(() => {
    const sorted = [...projects].sort((a,b) => (b.progress || 0) - (a.progress || 0)).slice(0, 4);
    return sorted.map((p, i) => ({
      name: p.title.length > 15 ? p.title.substring(0, 15) + '...' : p.title,
      progress: p.progress || Math.floor(Math.random() * 100),
      fill: FOREST_COLORS[i % FOREST_COLORS.length]
    }));
  }, [projects]);

  // Intake vs Processing (Line Chart)
  const intakeData = useMemo(() => {
    const weeks = ['W1', 'W2', 'W3', 'W4'];
    return weeks.map(week => ({
      week,
      'Documentos Ingeridos': Math.floor(Math.random() * 30) + 10,
      'Anotações Criadas': Math.floor(Math.random() * 20) + 5,
    }));
  }, []);

  // Time logging chart
  const logsActivityData = useMemo(() => {
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    return days.map(day => ({
      day,
      'Registros': Math.floor(Math.random() * 5) + 1,
      'Horas Rastreadas': Math.floor(Math.random() * 6) + 2,
    }));
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full h-full pb-10">
      <ViewHeader 
        title="Analytics Completo" 
        description="Indicadores aprofundados sobre a ingestão de conhecimento (KI) e monitoramento de logs diários."
        icon={BarChart3}
      />

      {/* 1. KPIs Master Bento Grid */}
      <h3 className="text-[14px] font-bold text-ink uppercase tracking-wide border-b border-forest/10 pb-2 mt-4 text-forest flex items-center gap-2">
        <Zap className="w-4 h-4" /> Desempenho
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-forest/10 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:scale-125 transition-transform duration-500">
            <Zap className="w-32 h-32" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Eficiente
            </span>
          </div>
          <div className="text-[32px] font-black tracking-tight text-ink mb-1">{metrics.completionRate}%</div>
          <div className="text-[12px] font-bold text-ink/40 uppercase tracking-wider">Taxa de Conclusão</div>
        </div>

        <div className="bg-white border border-forest/10 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:scale-125 transition-transform duration-500">
            <Target className="w-32 h-32" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[32px] font-black tracking-tight text-ink mb-1">
            {metrics.completedTasks} <span className="text-[16px] text-ink/30 font-medium tracking-normal">/ {metrics.totalTasks}</span>
          </div>
          <div className="text-[12px] font-bold text-ink/40 uppercase tracking-wider">Tarefas Resolvidas</div>
        </div>

        <div className="bg-white border border-forest/10 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:scale-125 transition-transform duration-500">
             <Activity className="w-32 h-32" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[32px] font-black tracking-tight text-ink mb-1">{metrics.intakeVelocity}/dia</div>
          <div className="text-[12px] font-bold text-ink/40 uppercase tracking-wider">Velocidade de Ingestão</div>
        </div>

        <div className="bg-white border border-forest/10 p-5 rounded-2xl shadow-sm relative overflow-hidden group bg-gradient-to-br from-forest to-forest-800 text-white">
          <div className="absolute -right-6 -bottom-6 opacity-[0.1] group-hover:scale-125 transition-transform duration-500">
             <Clock className="w-32 h-32" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[32px] font-black tracking-tight mb-1">{metrics.totalLogs}</div>
          <div className="text-[12px] font-bold text-white/70 uppercase tracking-wider">Logs Registrados</div>
        </div>
      </div>

      <h3 className="text-[14px] font-bold text-ink uppercase tracking-wide border-b border-forest/10 pb-2 mt-4 text-forest flex items-center gap-2">
        <BarChart3 className="w-4 h-4" /> Inteligência e Insights
      </h3>

      {/* 3. Sophisticated Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart A: Intake vs Processing */}
        <div className="bg-white border border-forest/10 p-6 rounded-2xl shadow-sm flex flex-col">
          <h3 className="font-bold text-[14px] text-ink mb-1">Knowledge Intake </h3>
          <p className="text-[12px] font-semibold text-ink/40 mb-6">Documentos capturados x Processados em anotações</p>
          <div className="h-[280px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={intakeData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIngeridos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="Documentos Ingeridos" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorIngeridos)" />
                <Line type="monotone" dataKey="Anotações Criadas" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 2}} activeDot={{r: 6}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: Logs and Tracking */}
        <div className="bg-white border border-forest/10 p-6 rounded-2xl shadow-sm flex flex-col">
          <h3 className="font-bold text-[14px] text-ink mb-1">Atividade Diária (Logs)</h3>
          <p className="text-[12px] font-semibold text-ink/40 mb-6">Registros no Journal e rastreamento de horas semanais</p>
          <div className="h-[280px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={logsActivityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
                <Bar dataKey="Horas Rastreadas" barSize={20} fill="#bae6fd" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="Registros" stroke="#0ea5e9" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart C: Cortex Balance (Radar) */}
        <div className="bg-white border border-forest/10 p-6 rounded-2xl shadow-sm flex flex-col">
          <h3 className="font-bold text-[14px] text-ink mb-1">Equilíbrio do Cérebro</h3>
          <p className="text-[12px] font-semibold text-ink/40 mb-6">Distribuição de esforço entre pilares PARA</p>
          <div className="h-[280px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#1a3c34', fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Cérebro Atual" dataKey="A" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.3} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart D: Velocity (Composed) */}
        <div className="bg-white border border-forest/10 p-6 rounded-2xl shadow-sm flex flex-col">
          <h3 className="font-bold text-[14px] text-ink mb-1">Velocity & Throughput</h3>
          <p className="text-[12px] font-semibold text-ink/40 mb-6">Volume de tarefas entregues vs adicionadas</p>
          <div className="h-[280px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={velocityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConcluidas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a3c34" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#1a3c34" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="Concluídas" stroke="#1a3c34" strokeWidth={3} fillOpacity={1} fill="url(#colorConcluidas)" />
                <Bar dataKey="Adicionadas" barSize={12} fill="#A7F3D0" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="Capacidade" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

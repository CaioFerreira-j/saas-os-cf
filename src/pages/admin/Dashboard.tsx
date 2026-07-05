import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts";
import { TrendingUp, Banknote, Car, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const revenueData = [
  { name: "Seg", total: 450 },
  { name: "Ter", total: 320 },
  { name: "Qua", total: 580 },
  { name: "Qui", total: 410 },
  { name: "Sex", total: 850 },
  { name: "Sáb", total: 1100 },
  { name: "Dom", total: 950 },
];

const washesData = [
  { name: "Seg", count: 10 },
  { name: "Ter", count: 7 },
  { name: "Qua", count: 13 },
  { name: "Qui", count: 9 },
  { name: "Sex", count: 20 },
  { name: "Sáb", count: 35 },
  { name: "Dom", count: 28 },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 p-4 md:p-0">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Visão Geral</h1>
        <p className="text-slate-500 text-sm">Resumo operacional e financeiro de hoje</p>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Faturamento (Hoje)"
          value="R$ 1.100"
          trend="+12% em relação a ontem"
          icon={<Banknote size={20} className="text-emerald-600" />}
          bgColor="bg-emerald-50"
        />
        <MetricCard
          title="Ticket Médio"
          value="R$ 72,50"
          trend="+5% nesta semana"
          icon={<TrendingUp size={20} className="text-blue-600" />}
          bgColor="bg-blue-50"
        />
        <MetricCard
          title="Lavagens (Hoje)"
          value="35"
          trend="8 na fila agora"
          icon={<Car size={20} className="text-indigo-600" />}
          bgColor="bg-indigo-50"
        />
        <MetricCard
          title="Produtividade"
          value="95%"
          trend="Equipe em alta"
          icon={<Activity size={20} className="text-violet-600" />}
          bgColor="bg-violet-50"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-24 md:pb-8">
        {/* Gráfico 1: Faturamento Semanal */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800">Faturamento da Semana</h3>
            <p className="text-xs text-slate-500">Últimos 7 dias (R$)</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `R$${value}`} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Lavagens por Dia */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800">Lavagens Concluídas</h3>
            <p className="text-xs text-slate-500">Volume diário de carros atendidos</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={washesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                />
                <Bar 
                  dataKey="count" 
                  fill="#3b82f6" 
                  radius={[6, 6, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, icon, bgColor }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-xl", bgColor)}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-slate-500 text-xs font-medium mb-0.5">{title}</p>
        <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        <p className="text-slate-400 text-[10px] md:text-xs mt-1 font-medium">{trend}</p>
      </div>
    </div>
  );
}

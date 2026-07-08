import { useState, useEffect } from "react";
import { Clock, Play, CheckCircle2, Car, Banknote, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/services/supabase";

type OSStatus = "esperando" | "lavando" | "lavado";

interface Service {
  name: string;
  price: number;
}

interface OSData {
  id: string;
  plate: string;
  model: string;
  status: OSStatus;
  created_at: string;
  services: Service;
}

export default function OSList() {
  const [activeTab, setActiveTab] = useState<OSStatus | "todas">("todas");
  const [osList, setOsList] = useState<OSData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOS();
  }, []);

  const fetchOS = async () => {
    try {
      const { data, error } = await supabase
        .from('os')
        .select(`
          id,
          plate,
          model,
          status,
          created_at,
          services (name, price)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setOsList(data as unknown as OSData[]);
    } catch (err) {
      console.error("Erro ao buscar OS:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: OSStatus) => {
    try {
      const { error } = await supabase
        .from('os')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      fetchOS();
    } catch (err) {
      console.error("Erro ao atualizar:", err);
    }
  };

  const filteredOS = osList.filter((os) =>
    activeTab === "todas" ? true : os.status === activeTab
  );

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 p-4 md:p-0">
      {/* Header & Filtros */}
      <div className="mb-6 sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 py-2 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fila de Lavagem</h1>
            <p className="text-slate-500 text-sm">Gerencie o pátio em tempo real</p>
          </div>
        </div>

        <Tabs defaultValue="todas" onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-slate-200/50 p-1 rounded-xl">
            <TabsTrigger value="todas" className="rounded-lg text-xs md:text-sm font-medium">Todas</TabsTrigger>
            <TabsTrigger value="esperando" className="rounded-lg text-xs md:text-sm font-medium">Fila</TabsTrigger>
            <TabsTrigger value="lavando" className="rounded-lg text-xs md:text-sm font-medium">Lavando</TabsTrigger>
            <TabsTrigger value="lavado" className="rounded-lg text-xs md:text-sm font-medium">Prontos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Lista de Cards */}
      <div className="flex flex-col gap-4 pb-4">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-slate-400" size={32} /></div>
        ) : filteredOS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Car size={48} className="mb-4 opacity-20" />
            <p className="font-medium">Nenhum veículo nesta lista.</p>
          </div>
        ) : (
          filteredOS.map((os) => (
            <OSCard key={os.id} os={os} onUpdateStatus={updateStatus} />
          ))
        )}
      </div>
    </div>
  );
}

function OSCard({ os, onUpdateStatus }: { os: OSData; onUpdateStatus: (id: string, s: OSStatus) => void }) {
  const statusConfig = {
    esperando: {
      color: "bg-amber-100 text-amber-700 border-amber-200",
      icon: <Clock size={14} className="mr-1" />,
      label: "Aguardando",
      actionText: "Iniciar",
      nextStatus: "lavando" as OSStatus,
      actionIcon: <Play size={16} className="mr-2" />,
      actionColor: "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20",
    },
    lavando: {
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: <Clock size={14} className="mr-1 animate-pulse" />,
      label: "Lavando",
      actionText: "Finalizar",
      nextStatus: "lavado" as OSStatus,
      actionIcon: <CheckCircle2 size={16} className="mr-2" />,
      actionColor: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20",
    },
    lavado: {
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: <CheckCircle2 size={14} className="mr-1" />,
      label: "Concluído",
      actionText: "Concluído",
      nextStatus: "lavado" as OSStatus,
      actionIcon: <CheckCircle2 size={16} className="mr-2" />,
      actionColor: "bg-emerald-100 text-emerald-700 cursor-default shadow-none pointer-events-none opacity-80",
    },
  };

  const config = statusConfig[os.status] || statusConfig.esperando;
  
  // Format time
  const time = new Date(os.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 transition-all hover:shadow-md flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-slate-800 font-mono tracking-tight">
              {os.plate}
            </h3>
            <span className="text-sm font-medium text-slate-400">• {os.model}</span>
          </div>
          <p className="text-sm font-medium text-slate-600">{os.services?.name}</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline" className={cn("px-2.5 py-0.5 rounded-full border font-semibold flex items-center", config.color)}>
            {config.icon}
            {config.label}
          </Badge>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
            Chegada {time}
          </span>
        </div>
      </div>

      <div className="h-px w-full bg-slate-50" />

      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Total</p>
          <p className="text-lg font-bold text-slate-900">
            R$ {Number(os.services?.price || 0).toFixed(2).replace(".", ",")}
          </p>
        </div>

        <button
          onClick={() => {
            if (os.status !== 'lavado') onUpdateStatus(os.id, config.nextStatus);
          }}
          disabled={os.status === 'lavado'}
          className={cn(
            "flex items-center justify-center h-11 px-5 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-95",
            config.actionColor
          )}
        >
          {config.actionIcon}
          {config.actionText}
        </button>
      </div>
    </div>
  );
}

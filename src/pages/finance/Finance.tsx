import { useState, useEffect } from "react";
import { Download, FileText, Search, ArrowUpRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/services/supabase";

interface ServiceData {
  name: string;
  price: number;
}

interface FinishedOS {
  id: string;
  model: string;
  created_at: string;
  services: ServiceData;
}

export default function Finance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState<FinishedOS[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinishedOS();
  }, []);

  const fetchFinishedOS = async () => {
    try {
      const { data, error } = await supabase
        .from('os')
        .select(`
          id,
          model,
          created_at,
          services (name, price)
        `)
        .eq('status', 'lavado')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setTransactions(data as unknown as FinishedOS[]);
    } catch (err) {
      console.error("Erro ao buscar transações:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    tx.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tx.services?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalIncome = transactions.reduce((acc, tx) => acc + Number(tx.services?.price || 0), 0);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 p-4 md:p-0 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 py-4 -mx-4 px-4 md:mx-0 md:px-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financeiro</h1>
          <p className="text-slate-500 text-sm">Controle de caixa (Apenas concluídos)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-10 rounded-xl bg-white border-slate-200 text-slate-700 shadow-sm">
            <FileText size={16} className="mr-2" />
            Excel
          </Button>
          <Button className="h-10 rounded-xl bg-slate-900 hover:bg-slate-800 shadow-sm">
            <Download size={16} className="mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Resumo Rápido */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-xs font-medium mb-1">Total de Serviços Concluídos</p>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">{transactions.length}</h3>
        </div>
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
          <p className="text-emerald-700 text-xs font-medium mb-1">Total Arrecadado</p>
          <h3 className="text-xl md:text-2xl font-bold text-emerald-900">
            R$ {totalIncome.toFixed(2).replace(".", ",")}
          </h3>
        </div>
      </div>

      {/* Lista de Transações */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Buscar por modelo ou serviço..." 
              className="pl-10 h-11 bg-white border-slate-200 rounded-xl focus-visible:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-col">
          {loading ? (
             <div className="flex justify-center py-12"><Loader2 className="animate-spin text-slate-400" size={32} /></div>
          ) : filteredTransactions.length === 0 ? (
             <div className="flex justify-center py-12 text-slate-500">Nenhum serviço concluído encontrado.</div>
          ) : (
            filteredTransactions.map((tx) => {
              const date = new Date(tx.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
              return (
                <div key={tx.id} className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-600">
                      <ArrowUpRight size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm md:text-base">{tx.model} - {tx.services?.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm md:text-base text-emerald-600">
                      R$ {Number(tx.services?.price || 0).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

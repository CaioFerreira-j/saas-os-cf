import { useState } from "react";
import { Download, FileText, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MOCK_TRANSACTIONS = [
  { id: "tx-1", date: "Hoje, 14:30", description: "Lavagem Premium - ABC-1234", amount: 150.0, type: "income", method: "PIX" },
  { id: "tx-2", date: "Hoje, 10:15", description: "Ducha Simples - XYZ-9876", amount: 40.0, type: "income", method: "Dinheiro" },
  { id: "tx-3", date: "Ontem, 16:45", description: "Compra de Produtos (Shampoo)", amount: -120.0, type: "expense", method: "Cartão" },
  { id: "tx-4", date: "Ontem, 09:20", description: "Lavagem Completa - DEF-5678", amount: 80.0, type: "income", method: "PIX" },
];

export default function Finance() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 p-4 md:p-0 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 py-4 -mx-4 px-4 md:mx-0 md:px-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financeiro</h1>
          <p className="text-slate-500 text-sm">Controle de caixa e relatórios</p>
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-xs font-medium mb-1">Saldo Atual</p>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">R$ 2.450,00</h3>
        </div>
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
          <p className="text-emerald-700 text-xs font-medium mb-1">Entradas (Mês)</p>
          <h3 className="text-xl md:text-2xl font-bold text-emerald-900">R$ 3.120,00</h3>
        </div>
        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 hidden md:block">
          <p className="text-red-700 text-xs font-medium mb-1">Saídas (Mês)</p>
          <h3 className="text-xl md:text-2xl font-bold text-red-900">R$ 670,00</h3>
        </div>
      </div>

      {/* Lista de Transações */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Buscar transação..." 
              className="pl-10 h-11 bg-white border-slate-200 rounded-xl focus-visible:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-col">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  tx.type === "income" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                )}>
                  {tx.type === "income" ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm md:text-base">{tx.description}</p>
                  <p className="text-xs text-slate-500 font-medium">{tx.date} • {tx.method}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-bold text-sm md:text-base",
                  tx.type === "income" ? "text-emerald-600" : "text-slate-900"
                )}>
                  {tx.type === "income" ? "+" : "-"} R$ {Math.abs(tx.amount).toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

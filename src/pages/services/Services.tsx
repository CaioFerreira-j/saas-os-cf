import { useState, useEffect } from "react";
import { Plus, Wrench, Trash2, Edit2, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/services/supabase";

interface ServiceData {
  id: string;
  name: string;
  price: number;
  time: string;
}

export default function Services() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ id: "", name: "", price: "", time: "30 min" });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase.from('services').select('*').order('price', { ascending: true });
      if (error) throw error;
      if (data) setServices(data);
    } catch (err) {
      console.error("Erro ao buscar serviços:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return alert("Preencha o nome e o valor.");
    
    setIsSubmitting(true);
    try {
      const priceVal = parseFloat(formData.price.replace(",", "."));
      if (formData.id) {
        const { error } = await supabase.from('services').update({
          name: formData.name, price: priceVal, time: formData.time
        }).eq('id', formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('services').insert({
          name: formData.name, price: priceVal, time: formData.time
        });
        if (error) throw error;
      }
      setFormData({ id: "", name: "", price: "", time: "30 min" });
      fetchServices();
    } catch (err) {
      console.error("Erro ao salvar serviço:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (s: ServiceData) => {
    setFormData({ id: s.id, name: s.name, price: s.price.toString(), time: s.time });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este serviço?")) return;
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      fetchServices();
    } catch (err) {
      console.error("Erro ao excluir serviço:", err);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 p-4 md:p-0 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 py-4 -mx-4 px-4 md:mx-0 md:px-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Serviços</h1>
          <p className="text-slate-500 text-sm">Gerencie os serviços oferecidos no lava-jato</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Wrench size={20} className="text-blue-600" />
              {formData.id ? "Editar Serviço" : "Novo Serviço"}
            </h2>
            
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome do Serviço</Label>
              <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Lavagem Premium" required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="price">Valor (R$)</Label>
              <Input id="price" type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Ex: 50.00" required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="time">Tempo Estimado</Label>
              <Input id="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} placeholder="Ex: 40 min" />
            </div>

            <div className="pt-2 flex gap-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11">
                {isSubmitting ? <Loader2 className="animate-spin" /> : formData.id ? <><Check size={16} className="mr-2"/> Salvar</> : <><Plus size={16} className="mr-2"/> Adicionar</>}
              </Button>
              {formData.id && (
                <Button type="button" variant="outline" onClick={() => setFormData({ id: "", name: "", price: "", time: "30 min" })} className="rounded-xl h-11 px-4">
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 min-h-[300px]">
             {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-slate-400" size={32} /></div>
             ) : services.length === 0 ? (
                <div className="flex justify-center py-12 text-slate-500">Nenhum serviço cadastrado.</div>
             ) : (
                <div className="space-y-3">
                  {services.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/80 transition-colors">
                      <div>
                        <p className="font-bold text-slate-800">{s.name}</p>
                        <p className="text-xs text-slate-500 font-medium">Duração: {s.time}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-slate-900">R$ {Number(s.price).toFixed(2).replace(".", ",")}</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(s)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(s.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

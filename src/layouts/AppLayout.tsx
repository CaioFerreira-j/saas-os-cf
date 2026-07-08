import { Outlet, Link, useLocation } from "react-router-dom";
import { ListTodo, PlusCircle, Car, Users, Settings, LogOut, LayoutDashboard, DollarSign, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = [
  { name: "Fila", path: "/app/os", icon: ListTodo, mobile: true, roles: ["admin", "funcionario"] },
  { name: "Nova OS", path: "/app/os/new", icon: PlusCircle, mobile: true, roles: ["admin", "funcionario"] },
  { name: "Dashboard", path: "/app/dashboard", icon: LayoutDashboard, mobile: false, roles: ["admin"] },
  { name: "Serviços", path: "/app/services", icon: Wrench, mobile: false, roles: ["admin"] },
  { name: "Financeiro", path: "/app/finance", icon: DollarSign, mobile: false, roles: ["admin"] },
];

export default function AppLayout() {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  
  const role = profile?.role || "funcionario";
  const visibleNavItems = NAV_ITEMS.filter(item => item.roles.includes(role));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-white min-h-screen sticky top-0">
        <div className="p-6 border-b flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">LavaJato PRO</h1>
          <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full uppercase">{role}</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon size={20} className={isActive ? "text-blue-600" : "text-slate-400"} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          {role === "admin" && (
            <Link
              to="/app/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <Settings size={20} />
              Configurações
            </Link>
          )}
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 mt-1">
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-[100dvh] pb-20 md:pb-0 relative">
        <div className="flex-1 w-full max-w-7xl mx-auto md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav (Mobile) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around items-center h-16 px-2 pb-safe z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
        {visibleNavItems.filter((i) => i.mobile).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={cn(
                  "p-1.5 rounded-xl transition-all duration-300",
                  isActive ? "bg-blue-100 text-blue-600" : "text-slate-400"
                )}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-blue-600" : "text-slate-500"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

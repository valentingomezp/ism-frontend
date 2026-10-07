import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, FolderOpen, CreditCard, Settings, LogOut, Menu, X, ShieldAlert } from 'lucide-react';

export default function DashboardLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const token = localStorage.getItem('token');
  let userRole = 'user';
  
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = payload.role;
    } catch (e) {
      console.error("Token inválido");
    }
  }

  const baseMenuItems = [
    { path: '/dashboard', icon: Home, label: 'Inicio' },
    { path: '/dashboard/partidos', icon: FolderOpen, label: 'Mis Partidos' },
    { path: '/dashboard/suscripcion', icon: CreditCard, label: 'Suscripción' },
    { path: '/dashboard/ajustes', icon: Settings, label: 'Configuración' },
  ];

  const menuItems = userRole === 'admin' 
    ? [...baseMenuItems, { path: '/dashboard/admin', icon: ShieldAlert, label: 'Panel Admin' }]
    : baseMenuItems;

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-900">
      
      {/* BARRA SUPERIOR MOBILE */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 shadow-md flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-3">
          <img src="/ISM.jpg" alt="Logo" className="w-8 h-8 rounded-lg shadow-sm" />
          <span className="font-black text-white tracking-tight text-sm">INFO SOCCER MATCH</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* BARRA LATERAL */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen z-50 w-64 bg-white border-r border-slate-200/80 shadow-xl md:shadow-md flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* CABECERA CENTRADA Y CON LÍNEA DIVISORIA */}
        <div className="p-6 hidden md:flex flex-col items-center text-center border-b border-slate-100">
          <img src="/ISM.jpg" alt="Logo" className="w-12 h-12 rounded-2xl shadow-sm border border-slate-100 mb-3 object-cover" />
          <span className="font-black text-emerald-700 tracking-tight text-sm leading-tight">
            INFO SOCCER<br />MATCH
          </span>
        </div>
        
        <div className="h-16 md:hidden flex-shrink-0 bg-white border-b border-slate-200 flex items-center px-6">
           <span className="font-black text-emerald-700 tracking-tight text-sm">MENÚ PRINCIPAL</span>
        </div>

        <nav className="flex-1 px-4 py-6 md:py-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors font-bold text-sm">
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-4 pt-24 md:pt-10 md:p-10 overflow-y-auto min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
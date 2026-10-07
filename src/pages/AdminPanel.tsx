import { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, XCircle, CreditCard, Star } from 'lucide-react';

interface User {
  id: number;
  email: string;
  role: string;
  subscription: string;
  isActive: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  // 1. Obtener todos los usuarios
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      // CORRECCIÓN: La ruta real en NestJS es simplemente /users
      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('No tienes permisos o tu sesión expiró');
      
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Cambiar suscripción
  const toggleSubscription = async (id: number, currentSub: string) => {
    const newSub = currentSub === 'free' ? 'premium' : 'free';
    try {
      const token = localStorage.getItem('token');
      // CORRECCIÓN: La ruta real es /users/:id/subscription
      await fetch(`${API_URL}/users/${id}/subscription`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ subscription: newSub })
      });
      setUsers(users.map(u => u.id === id ? { ...u, subscription: newSub } : u));
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Bloquear / Desbloquear usuario
  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      // CORRECCIÓN: La ruta real es /users/:id/status
      await fetch(`${API_URL}/users/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      setUsers(users.map(u => u.id === id ? { ...u, isActive: !currentStatus } : u));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="w-8 h-8 text-emerald-600" />
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Panel de Control</h1>
          <p className="text-slate-500">Gestiona cuentas y planes de los entrenadores.</p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between h-full">
            <div className="mb-4">
              <h3 className="font-bold text-slate-900 truncate text-lg">{user.email}</h3>
              <span className={`inline-block mt-1 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                Rol: {user.role}
              </span>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 mt-auto">
              {/* Botón Suscripción */}
              <button
                onClick={() => toggleSubscription(user.id, user.subscription)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-colors active:scale-[0.98] ${
                  user.subscription === 'premium'
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  {user.subscription === 'premium' ? <Star className="w-5 h-5 fill-current" /> : <CreditCard className="w-5 h-5" />}
                  {user.subscription === 'premium' ? 'Plan Premium' : 'Plan Gratis'}
                </span>
                <span className="text-xs uppercase tracking-wider underline">Cambiar</span>
              </button>

              {/* Botón Estado (Bloqueo) */}
              <button
                onClick={() => toggleStatus(user.id, user.isActive)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-colors active:scale-[0.98] ${
                  user.isActive
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  {user.isActive ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  {user.isActive ? 'Cuenta Activa' : 'Bloqueada'}
                </span>
                <span className="text-xs uppercase tracking-wider underline">{user.isActive ? 'Suspender' : 'Activar'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
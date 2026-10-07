import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Trophy, Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function Dashboard() {
  const [userName, setUserName] = useState('Entrenador');
  const [userSub, setUserSub] = useState('none'); // Ahora arranca asumiendo 'none' por seguridad
  const [totalMatches, setTotalMatches] = useState(0);
  const [showPlanWarning, setShowPlanWarning] = useState(false); // Estado para mostrar la alerta en el botón

  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.nombre) {
        setUserName(`${payload.nombre}${'!'}`.trim());
      }
      if (payload.subscription) {
        setUserSub(payload.subscription);
      }
    } catch (e) {
      console.error("Error al decodificar el token", e);
    }

    fetch(`${API_URL}/matches/mis-partidos`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTotalMatches(data.length);
        }
      })
      .catch(err => console.error("Error al cargar contador de partidos", err));
  }, []);

  // Constantes de ayuda para facilitar la lectura del código
  const isPremium = userSub === 'premium';
  const isFree = userSub === 'free';
  const isNone = userSub === 'none';

  // Interceptor del click en "Iniciar Nuevo Partido"
  const handleStartMatch = (e: React.MouseEvent) => {
    if (isNone) {
      e.preventDefault(); // Evita que el Link cambie de página
      setShowPlanWarning(true); // Muestra el mensaje de error abajo
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* CABECERA CON RELIEVE Y SOMBRA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200/70 shadow-xl shadow-slate-200/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-emerald-50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Hola, {userName}</h1>
          <p className="text-slate-500 mt-1.5 text-base">Bienvenido a tu panel analítico de INFO SOCCER MATCH.</p>
        </div>
        
        <Link 
          to="/dashboard/partidos"
          className="relative z-10 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all hover:translate-y-[-1px]"
        >
          Ver historial <ArrowRight className="w-4 h-4 text-emerald-400" />
        </Link>
      </div>

      {/* TARJETAS DE RESUMEN ELEVADAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Tarjeta de Suscripción */}
        <div className="bg-white p-7 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/70 flex items-center justify-between relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -z-0 group-hover:bg-emerald-100 transition-colors"></div>
          <div className="relative z-10">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">Plan Actual</p>
            <p className={`text-2xl font-black tracking-tight ${isPremium ? 'text-indigo-600' : isNone ? 'text-slate-500' : 'text-emerald-600'}`}>
              {/* Lógica condicional para el Título del Plan */}
              {isPremium ? 'Plan Premium' : isNone ? 'Sin Plan Activo' : 'Inicial / Prueba'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {/* Lógica condicional para el Subtítulo del Plan */}
              {isPremium ? 'Acceso total a PDF, CSV y análisis ilimitado' : isNone ? 'Activa un plan en Suscripciones para comenzar' : 'Funciones básicas de pizarra táctica'}
            </p>
          </div>
          <div className={`relative z-10 p-4 rounded-2xl shadow-sm ${isPremium ? 'bg-indigo-50 text-indigo-600' : isNone ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600'}`}>
            {isPremium ? <Sparkles className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
          </div>
        </div>
        
        {/* Tarjeta de Partidos */}
        <div className="bg-white p-7 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/70 flex flex-col justify-center relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -z-0 group-hover:bg-blue-100 transition-colors"></div>
          <div className="flex items-center justify-between w-full relative z-10">
            <div>
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">Partidos Históricos</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">
                {/* Si es Free muestra 'X/1', si es Premium o None muestra solo el número 'X' */}
                {isFree ? `${totalMatches}/1` : totalMatches}
              </p>
              <p className="text-xs text-slate-500 mt-1">Encuentros registrados y almacenados</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 shadow-sm">
              <Trophy className="w-7 h-7" />
            </div>
          </div>
          
          {/* ALERTA AMARILLA DE LÍMITE ALCANZADO */}
          {isFree && totalMatches >= 1 && (
            <div className="relative z-10 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              No tienes más partidos para guardar. Te recomendamos mejorar tu plan en Suscripciones.
            </div>
          )}
        </div>

      </div>

      {/* CALL TO ACTION PROFUNDO Y LLAMATIVO */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden border border-slate-800">
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="inline-block p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4 border border-emerald-500/30 shadow-inner">
            <Play className="w-8 h-8 fill-current ml-0.5" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">¿Día de partido?</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto text-base sm:text-lg leading-relaxed font-medium">
            Abrí tu tablero y comenzá a registrar estadísticas en tiempo real sin apartar la vista de la cancha.
          </p>
          
          <Link 
            to="/tablero" 
            onClick={handleStartMatch}
            className={`inline-flex items-center gap-3 font-extrabold px-9 py-4 rounded-2xl shadow-lg transition-all text-lg ${
              isNone 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-90' // Apariencia bloqueada
                : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/30 hover:scale-105' // Apariencia normal
            }`}
          >
            Iniciar Nuevo Partido
          </Link>

          {/* MENSAJE EMERGENTE DE ADVERTENCIA */}
          {showPlanWarning && (
            <div className="mt-6 animate-in fade-in slide-in-from-top-2">
              <p className="text-rose-400 font-bold text-sm bg-rose-500/10 border border-rose-500/20 py-3 px-5 rounded-xl inline-flex items-center gap-2 justify-center">
                <AlertTriangle className="w-4 h-4" /> 
                Debes tener un plan activo para iniciar un partido.{' '}
                <Link to="/dashboard/suscripcion" className="underline hover:text-rose-300 ml-1">
                  Elige uno aquí
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
import { useState, useEffect } from 'react';
import { CheckCircle2, Zap, ShieldCheck, ArrowRight, Crown, CircleAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function Suscripcion() {
  const navigate = useNavigate();
  const [userSub, setUserSub] = useState('none');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(''); // <-- Estado para confirmación

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return; 
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.subscription) {
        setUserSub(payload.subscription);
      }
    } catch (e) {
      console.error("Error al decodificar el token");
    }
  }, [navigate]);

  const handleSelectFree = async () => {
    setIsLoading(true);
    setSuccessMsg(''); // Limpiamos mensajes previos
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/users/activate-free`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error al activar el plan');

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Reemplazamos el alert por nuestro estado UI
      setSuccessMsg("¡Plan Inicial activado con éxito! Ya puedes iniciar tu primer partido.");
      setUserSub('free'); 
      setIsLoading(false);
      
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      // Aquí también podrías poner un setErrorMsg si lo desearas
    }
  };

  const handleSelectPremium = () => {
    alert("Redirigiendo al checkout seguro de Mercado Pago...");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-300 pb-12">
      
      {/* CABECERA */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest border border-indigo-100">
          <Crown className="w-4 h-4" /> Planes y Facturación
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Elige el plan ideal para tu equipo</h1>
        <p className="text-slate-500 text-lg leading-relaxed">
          Comienza a registrar estadísticas tácticas hoy mismo. Mejora tu plan cuando necesites analizar todo tu historial sin límites.
        </p>
        
        {/* MENSAJE DE ÉXITO INCRUSTADO */}
        {successMsg && (
          <div className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-200 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" /> {successMsg}
          </div>
        )}
      </div>

      {/* TARJETAS DE PLANES */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
        
        {/* PLAN FREE */}
        <div className={`bg-white rounded-3xl p-8 border ${userSub === 'free' ? 'border-emerald-500 shadow-lg shadow-emerald-500/10' : 'border-slate-200 shadow-xl shadow-slate-200/50'} relative flex flex-col h-full transition-all`}>
          {userSub === 'free' && (
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
              Tu plan actual
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="text-xl font-black text-slate-900">Plan Inicial</h3>
            <p className="text-slate-500 text-sm mt-2">Perfecto para probar el tablero y familiarizarse con la plataforma.</p>
          </div>
          
          <div className="mb-8 flex items-baseline gap-2">
            <span className="text-5xl font-black text-slate-900">$0</span>
            <span className="text-slate-500 font-medium">/ para siempre</span>
          </div>

          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-slate-700 font-medium">Límite de <strong className="text-slate-900">1 partido guardado</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-slate-700 font-medium">Tablero táctico en tiempo real</span>
            </li>
            <li className="flex items-start gap-3">
              <CircleAlert className="w-5 h-5 text-red-500 shrink-0" />
              <span className="text-slate-700 font-medium">Exportación de reportes en PDF</span>
            </li>
            <li className="flex items-start gap-3">
              <CircleAlert className="w-5 h-5 text-red-500 shrink-0" />
              <span className="text-slate-700 font-medium">Exportación de datos en CSV</span>
            </li>
          </ul>

          <button 
            onClick={handleSelectFree}
            disabled={userSub === 'free' || isLoading}
            className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              userSub === 'free' 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg'
            }`}
          >
            {isLoading ? 'Activando...' : userSub === 'free' ? 'Plan Activo' : 'Comenzar Gratis'}
          </button>
        </div>

        {/* PLAN PREMIUM */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl shadow-slate-900/40 relative flex flex-col h-full transform md:-translate-y-4">
          <div className="absolute right-0 top-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-500/30 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 fill-current" /> Recomendado
          </div>

          <div className="mb-6 relative z-10">
            <h3 className="text-xl font-black text-white">Plan Premium</h3>
            <p className="text-slate-300 text-sm mt-2">Análisis profundo para cuerpos técnicos y entrenadores profesionales.</p>
          </div>
          
          <div className="mb-8 flex items-baseline gap-2 relative z-10">
            <span className="text-5xl font-black text-white">$10.000</span>
            <span className="text-slate-400 font-medium">/ mes</span>
          </div>

          <ul className="space-y-4 mb-8 flex-1 relative z-10">
            <li className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-slate-200 font-medium"><strong className="text-white">Partidos ilimitados</strong> en el historial</span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-slate-200 font-medium">Acceso a futuras actualizaciones</span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-slate-200 font-medium">Soporte prioritario 24/7</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-slate-200 font-medium">Exportación de reportes en PDF</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-slate-200 font-medium">Exportación de datos en CSV</span>
            </li>
          </ul>

          <button 
            onClick={handleSelectPremium}
            disabled={userSub === 'premium'}
            className="relative z-10 w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
          >
            {userSub === 'premium' ? 'Eres Premium' : 'Suscribirse con Mercado Pago'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
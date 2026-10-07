import { useState, useEffect } from 'react';
import { Play, Pause, Save, FileText, Download, Sun, Moon, RotateCcw, AlertTriangle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const initialStats = {
  '1T': { periodTime: 0, timeA: 0, timeB: 0, passesA: 0, failsA: 0, goalsA: 0, chancesA: 0, passesB: 0, failsB: 0, goalsB: 0, chancesB: 0 },
  '2T': { periodTime: 0, timeA: 0, timeB: 0, passesA: 0, failsA: 0, goalsA: 0, chancesA: 0, passesB: 0, failsB: 0, goalsB: 0, chancesB: 0 }
};

type Lang = 'es' | 'pt' | 'en' | 'it' | 'fr';

const t = {
  es: { activeTime: "Efectivo", pauseAction: "Pausar: Pelota Parada", ballDead: "Pelota Parada (Pausado)", passOk: "+ PASE LOGRADO", chance: "SITUACIÓN", goal: "GOL", passesOk: "Pases Ok", chances: "Chances", save: "Guardar", metric: "MÉTRICA", goals: "Goles", possession: "Posesión", passesOkErr: "Pases (Ok/Err)", effPasses: "Efect. Pases", chancesGoal: "Chances Gol", effGoal: "Efect. Gol", resetConfirm: "¿Seguro que deseas resetear los datos de este tiempo?", cancel: "Cancelar", reset: "Reiniciar", resetTitle: "Confirmar Reinicio", saveMatchTitle: "Guardar Partido", matchName: "Nombre del Partido", matchDesc: "Descripción (Opcional)", passesCompleted: "Pases Concretados", passesFailed: "Pases Errados", passEffectiveness: "Efectividad Pases", situations: "Situaciones Gol", goalEffectiveness: "Efectividad Gol", undoGoal: "Anular Gol" },
  pt: { activeTime: "Efetivo", pauseAction: "Pausar: Bola Parada", ballDead: "Bola Parada (Pausado)", passOk: "+ PASSE CERTO", chance: "OPORTUN.", goal: "GOL", passesOk: "Passes Ok", chances: "Chances", save: "Salvar", metric: "MÉTRICA", goals: "Gols", possession: "Possessão", passesOkErr: "Passes (Ok/Err)", effPasses: "Efic. Passes", chancesGoal: "Chances Gol", effGoal: "Efic. Gol", resetConfirm: "Tem certeza de que deseja redefinir os dados deste tempo?", cancel: "Cancelar", reset: "Redefinir", resetTitle: "Confirmar Redefinição", saveMatchTitle: "Salvar Jogo", matchName: "Nome do Jogo", matchDesc: "Descrição (Opcional)", passesCompleted: "Passes Completos", passesFailed: "Passes Errados", passEffectiveness: "Eficácia Passes", situations: "Situações de Gol", goalEffectiveness: "Eficácia Gol", undoGoal: "Anular Gol" },
  en: { activeTime: "Active", pauseAction: "Pause: Dead Ball", ballDead: "Dead Ball (Paused)", passOk: "+ PASS OK", chance: "CHANCE", goal: "GOAL", passesOk: "Passes OK", chances: "Chances", save: "Save", metric: "METRIC", goals: "Goals", possession: "Possession", passesOkErr: "Passes (Ok/Err)", effPasses: "Pass Acc.", chancesGoal: "Goal Chances", effGoal: "Goal Acc.", resetConfirm: "Are you sure you want to reset this period's data?", cancel: "Cancel", reset: "Reset", resetTitle: "Confirm Reset", saveMatchTitle: "Save Match", matchName: "Match Name", matchDesc: "Description (Optional)", passesCompleted: "Completed Passes", passesFailed: "Failed Passes", passEffectiveness: "Pass Effectiveness", situations: "Goal Chances", goalEffectiveness: "Goal Effectiveness", undoGoal: "Undo Goal" },
  it: { activeTime: "Effettivo", pauseAction: "Pausa: Palla Inattiva", ballDead: "Palla Inattiva (In Pausa)", passOk: "+ PASSAGGIO OK", chance: "OCCASIONE", goal: "GOL", passesOk: "Passaggi OK", chances: "Occasioni", save: "Salva", metric: "METRICA", goals: "Gol", possession: "Possesso", passesOkErr: "Passaggi (Ok/Err)", effPasses: "Prec. Passaggi", chancesGoal: "Occasioni Gol", effGoal: "Conv. Gol", resetConfirm: "Sei sicuro di voler resettare i dati di questo tempo?", cancel: "Annulla", reset: "Resetta", resetTitle: "Conferma Reset", saveMatchTitle: "Salva Partita", matchName: "Nome Partita", matchDesc: "Descrizione (Opzionale)", passesCompleted: "Passaggi Riusciti", passesFailed: "Passaggi Sbagliati", passEffectiveness: "Efficacia Passaggi", situations: "Occasioni Gol", goalEffectiveness: "Efficacia Gol", undoGoal: "Annulla Gol" },
  fr: { activeTime: "Effectif", pauseAction: "Pause: Balle Arrêtée", ballDead: "Balle Arrêtée (En Pause)", passOk: "+ PASSE OK", chance: "OCCASION", goal: "BUT", passesOk: "Passes OK", chances: "Occasions", save: "Enregistrer", metric: "MÉTRIQUE", goals: "Buts", possession: "Possession", passesOkErr: "Passes (Ok/Err)", effPasses: "Préc. Passes", chancesGoal: "Occasions But", effGoal: "Conv. But", resetConfirm: "Voulez-vous vraiment réinitialiser les données de cette période?", cancel: "Annuler", reset: "Réinitialiser", resetTitle: "Confirmer la Réinit.", saveMatchTitle: "Enregistrer Match", matchName: "Nom du Match", matchDesc: "Description (Optionnel)", passesCompleted: "Passes Réussies", passesFailed: "Passes Ratées", passEffectiveness: "Efficacité Passes", situations: "Occasions de But", goalEffectiveness: "Efficacité But", undoGoal: "Annuler But" }
};

export default function Tablero() {
  const navigate = useNavigate();
  
  const [userSub, setUserSub] = useState('free');
  const [teamA, setTeamA] = useState('LOCAL');
  const [teamB, setTeamB] = useState('VISITANTE');
  
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<Lang>('es');
  
  // Modales
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [saveDesc, setSaveDesc] = useState('');
  const [saveError, setSaveError] = useState(''); // <-- Nuevo estado para el error
  
  const langTexts = t[lang];

  const [periodo, setPeriodo] = useState<'1T' | '2T' | 'GLOBAL'>('1T');
  const [isRunning, setIsRunning] = useState(false);
  const [activePossession, setActivePossession] = useState<'A' | 'B' | null>(null);
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserSub(payload.subscription);
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && periodo !== 'GLOBAL') {
      interval = setInterval(() => {
        const currentPeriod = periodo as '1T' | '2T';
        
        setStats(prev => ({
          ...prev,
          [currentPeriod]: {
            ...prev[currentPeriod],
            periodTime: prev[currentPeriod].periodTime + 1,
            ...(activePossession ? {
              [activePossession === 'A' ? 'timeA' : 'timeB']: prev[currentPeriod][activePossession === 'A' ? 'timeA' : 'timeB'] + 1
            } : {})
          }
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, activePossession, periodo]);

  const handleCambiarPeriodo = (nuevoPeriodo: '1T' | '2T' | 'GLOBAL') => {
    setPeriodo(nuevoPeriodo);
    setIsRunning(false);
    setActivePossession(null);
  };

  const requestReset = () => {
    if (periodo === 'GLOBAL') return;
    setShowResetModal(true);
  };

  const confirmReset = () => {
    if (periodo === 'GLOBAL') return;
    const p = periodo as '1T' | '2T';
    
    setIsRunning(false);
    setActivePossession(null);
    setStats(prev => ({
      ...prev,
      [p]: { ...initialStats[p] }
    }));
    setShowResetModal(false);
  };

  const getActiveStats = () => {
    if (periodo === 'GLOBAL') {
      return {
        periodTime: stats['1T'].periodTime + stats['2T'].periodTime,
        timeA: stats['1T'].timeA + stats['2T'].timeA,
        timeB: stats['1T'].timeB + stats['2T'].timeB,
        passesA: stats['1T'].passesA + stats['2T'].passesA,
        passesB: stats['1T'].passesB + stats['2T'].passesB,
        failsA: stats['1T'].failsA + stats['2T'].failsA,
        failsB: stats['1T'].failsB + stats['2T'].failsB,
        chancesA: stats['1T'].chancesA + stats['2T'].chancesA,
        chancesB: stats['1T'].chancesB + stats['2T'].chancesB,
        goalsA: stats['1T'].goalsA + stats['2T'].goalsA,
        goalsB: stats['1T'].goalsB + stats['2T'].goalsB,
      };
    }
    return stats[periodo];
  };

  const handleSaveMatch = async () => {
    setSaveError(''); // Limpiamos errores previos al intentar guardar
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/matches/guardar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: saveTitle || `${teamA} vs ${teamB}`,
          description: saveDesc,
          teamA,
          teamB,
          stats: { ...stats, 'GLOBAL': getActiveStats() }
        })
      });
      
      if (res.ok) {
        setShowSaveModal(false);
        navigate('/dashboard/partidos');
      } else {
        const errorData = await res.json();
        // Asignamos el error al estado en vez de usar alert()
        setSaveError(errorData.message || "Error al guardar el partido.");
      }
    } catch (e) {
      console.error(e);
      setSaveError("Error de conexión al servidor.");
    }
  };

  const handleAction = (equipo: 'A' | 'B', accion: 'pase' | 'chance' | 'gol' | 'restar_gol') => {
    if (periodo === 'GLOBAL') return;

    setStats(prev => {
      const current = { ...prev[periodo] };

      if (accion === 'pase') {
        if (activePossession && activePossession !== equipo) {
          if (activePossession === 'A') current.failsA += 1;
          if (activePossession === 'B') current.failsB += 1;
        }
        
        if (equipo === 'A') current.passesA += 1;
        if (equipo === 'B') current.passesB += 1;
      }
      
      if (accion === 'chance') {
        if (equipo === 'A') current.chancesA += 1;
        if (equipo === 'B') current.chancesB += 1;
      }
      
      if (accion === 'gol') {
        if (equipo === 'A') { current.goalsA += 1; current.chancesA += 1; }
        if (equipo === 'B') { current.goalsB += 1; current.chancesB += 1; }
      }

      if (accion === 'restar_gol') {
        if (equipo === 'A') { current.goalsA = Math.max(0, current.goalsA - 1); }
        if (equipo === 'B') { current.goalsB = Math.max(0, current.goalsB - 1); }
      }

      return { ...prev, [periodo]: current };
    });

    if (accion === 'pase') setActivePossession(equipo);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const currentStats = getActiveStats();
  const totalEfectivo = currentStats.timeA + currentStats.timeB;
  const pctA = totalEfectivo > 0 ? Math.round((currentStats.timeA / totalEfectivo) * 100) : 0;
  const pctB = totalEfectivo > 0 ? Math.round((currentStats.timeB / totalEfectivo) * 100) : 0;
  
  const totalGoalsA = stats['1T'].goalsA + stats['2T'].goalsA;
  const totalGoalsB = stats['1T'].goalsB + stats['2T'].goalsB;

  const getMetrics = (d: typeof initialStats['1T']) => {
    const tEfectivo = d.timeA + d.timeB;
    const pA = tEfectivo > 0 ? Math.round((d.timeA / tEfectivo) * 100) : 0;
    const pB = tEfectivo > 0 ? Math.round((d.timeB / tEfectivo) * 100) : 0;
    const ppmA = d.timeA > 0 ? (d.passesA / (d.timeA / 60)).toFixed(1) : "0.0";
    const ppmB = d.timeB > 0 ? (d.passesB / (d.timeB / 60)).toFixed(1) : "0.0";
    
    const totPassA = d.passesA + d.failsA;
    const totPassB = d.passesB + d.failsB;
    const effPassA = totPassA > 0 ? ((d.passesA / totPassA) * 100).toFixed(1) : "0.0";
    const effPassB = totPassB > 0 ? ((d.passesB / totPassB) * 100).toFixed(1) : "0.0";
    
    const effGoalA = d.chancesA > 0 ? ((d.goalsA / d.chancesA) * 100).toFixed(1) : "0.0";
    const effGoalB = d.chancesB > 0 ? ((d.goalsB / d.chancesB) * 100).toFixed(1) : "0.0";
    
    return { pA, pB, ppmA, ppmB, effPassA, effPassB, effGoalA, effGoalB };
  };

  const bgApp = isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-800';
  const bgCard = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 sm:shadow-slate-300';
  const bgPanel = isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-inner';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const bgSubPanel = isDark ? 'bg-slate-800' : 'bg-white shadow-sm border border-slate-100';
  const btnPauseClass = isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700';
  const btnResetClass = isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-400' : 'bg-slate-200 hover:bg-slate-300 text-slate-500';
  const textMain = isDark ? 'text-white' : 'text-slate-900';

  const isBallDead = activePossession === null;
  const m = getMetrics(currentStats);

  const renderStatsTable = (title: string, d: typeof initialStats['1T']) => {
    const metrics = getMetrics(d);
    return (
      <div className={`${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'} rounded-xl p-3 border mb-4 shadow-sm`}>
        <h3 className={`${isDark ? 'text-emerald-500' : 'text-emerald-700'} font-bold text-center mb-3 text-xs tracking-widest`}>{title}</h3>
        <div className="grid grid-cols-3 text-xs text-center gap-y-2 gap-x-1 items-center">
          <div className={`font-bold ${textMuted} text-left`}>{langTexts.metric}</div>
          <div className="font-bold text-emerald-500 truncate">{teamA}</div>
          <div className="font-bold text-rose-500 truncate">{teamB}</div>
          
          <div className={`text-left ${textMuted}`}>{langTexts.goals}</div>
          <div className={`font-bold ${textMain}`}>{d.goalsA}</div>
          <div className={`font-bold ${textMain}`}>{d.goalsB}</div>

          <div className={`text-left ${textMuted}`}>{langTexts.possession}</div>
          <div className={textMain}>{formatTime(d.timeA)} ({metrics.pA}%)</div>
          <div className={textMain}>{formatTime(d.timeB)} ({metrics.pB}%)</div>

          <div className={`text-left ${textMuted}`}>PPM</div>
          <div className={textMain}>{metrics.ppmA}</div>
          <div className={textMain}>{metrics.ppmB}</div>

          <div className={`text-left ${textMuted}`}>{langTexts.passesOkErr}</div>
          <div className={textMain}>{d.passesA} / {d.failsA}</div>
          <div className={textMain}>{d.passesB} / {d.failsB}</div>

          <div className={`text-left ${textMuted}`}>{langTexts.effPasses}</div>
          <div className={textMain}>{metrics.effPassA}%</div>
          <div className={textMain}>{metrics.effPassB}%</div>

          <div className={`text-left ${textMuted}`}>{langTexts.chancesGoal}</div>
          <div className={textMain}>{d.chancesA}</div>
          <div className={textMain}>{d.chancesB}</div>

          <div className={`text-left ${textMuted}`}>{langTexts.effGoal}</div>
          <div className={textMain}>{metrics.effGoalA}%</div>
          <div className={textMain}>{metrics.effGoalB}%</div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-[100dvh] flex flex-col justify-center sm:p-4 font-sans select-none touch-manipulation transition-colors duration-300 ${bgApp}`}>
      
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-sm p-6 rounded-2xl shadow-xl border ${bgCard}`}>
            <div className="flex justify-center mb-4 text-amber-500">
              <AlertTriangle className="w-12 h-12" />
            </div>
            <h3 className={`text-xl font-bold text-center mb-2 ${textMain}`}>{langTexts.resetTitle}</h3>
            <p className={`text-center text-sm mb-6 ${textMuted}`}>{langTexts.resetConfirm}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowResetModal(false)} className={`flex-1 py-3 rounded-xl font-bold transition-colors ${btnPauseClass}`}>{langTexts.cancel}</button>
              <button onClick={confirmReset} className="flex-1 py-3 rounded-xl font-bold transition-colors bg-rose-600 hover:bg-rose-500 text-white">{langTexts.reset}</button>
            </div>
          </div>
        </div>
      )}

      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-sm p-6 rounded-2xl shadow-xl border ${bgCard}`}>
            <div className="flex justify-center mb-4 text-emerald-500">
              <Save className="w-12 h-12" />
            </div>
            <h3 className={`text-xl font-bold text-center mb-4 ${textMain}`}>{langTexts.saveMatchTitle}</h3>
            
            <div className="space-y-4 mb-6 text-left">
              <div>
                <label className={`block text-xs font-bold mb-1 ${textMuted}`}>{langTexts.matchName}</label>
                <input 
                  type="text" 
                  placeholder={`${teamA} vs ${teamB}`}
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  className={`w-full p-3 rounded-xl border focus:outline-none focus:border-emerald-500 transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                />
              </div>
              <div>
                <label className={`block text-xs font-bold mb-1 ${textMuted}`}>{langTexts.matchDesc}</label>
                <textarea 
                  rows={3}
                  placeholder="..."
                  value={saveDesc}
                  onChange={(e) => setSaveDesc(e.target.value)}
                  className={`w-full p-3 rounded-xl border focus:outline-none focus:border-emerald-500 resize-none transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowSaveModal(false)} 
                className={`flex-1 py-3 rounded-xl font-bold transition-colors ${btnPauseClass}`}
              >
                {langTexts.cancel}
              </button>
              <button 
                onClick={handleSaveMatch} 
                className="flex-1 py-3 rounded-xl font-bold transition-colors bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                {langTexts.save}
              </button>
            </div>
            
            {/* MENSAJE DE ERROR EN ROJO INCRUSTADO */}
            {saveError && (
              <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span className="text-left">{saveError}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tarjeta Principal estirada con flex-1 */}
      <div className={`flex flex-col w-full max-w-md mx-auto h-[100dvh] sm:h-[95dvh] sm:rounded-3xl border-0 sm:border sm:shadow-2xl transition-colors duration-300 p-4 ${bgCard}`}>
        
        {/* Cabecera, Controles Globales y Marcador */}
        <div className="text-center mb-4 shrink-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/dashboard')}
                title="Volver al Dashboard"
                className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-slate-700 text-slate-400 hover:text-white' : 'bg-slate-200 text-slate-600 hover:text-slate-900'}`}
              >
                <LogOut className="w-4 h-4 rotate-180" />
              </button>
              <button 
                onClick={() => setIsDark(!isDark)} 
                className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-slate-700 text-yellow-400' : 'bg-slate-200 text-slate-600'}`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
            <h1 className="text-emerald-500 font-black tracking-widest text-sm uppercase">INFO SOCCER</h1>
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as Lang)}
              className={`text-xs font-bold p-1.5 rounded outline-none cursor-pointer ${isDark ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'}`}
            >
              <option value="es">ES</option>
              <option value="pt">PT</option>
              <option value="en">EN</option>
              <option value="it">IT</option>
              <option value="fr">FR</option>
            </select>
          </div>
          
          <div className={`${bgPanel} rounded-xl p-3 border flex justify-between items-center mb-3 transition-colors`}>
            {/* Marcador Equipo Local */}
            <div className="text-center w-1/3 flex flex-col items-center justify-center">
              <input 
                type="text" 
                value={teamA} 
                onChange={e => setTeamA(e.target.value.toUpperCase())} 
                onFocus={e => e.target.select()}
                className={`bg-transparent w-full text-center text-xs font-bold focus:outline-none uppercase ${textMuted}`} 
              />
              <div className="text-4xl font-black text-emerald-500">{totalGoalsA}</div>
              <button onClick={() => handleAction('A', 'restar_gol')} className={`text-[0.6rem] font-bold uppercase px-2 py-0.5 rounded-md mt-1 transition-colors ${isDark ? 'bg-slate-800 text-slate-500 hover:text-rose-400' : 'bg-slate-200 text-slate-500 hover:text-rose-500'}`}>- {langTexts.undoGoal}</button>
            </div>
            
            <div className="text-center w-1/3">
              <div className={`text-3xl font-mono font-bold mb-1 ${textMain}`}>{formatTime(currentStats.periodTime)}</div>
              <div className={`text-[0.65rem] ${textMuted}`}>{langTexts.activeTime} <span className="text-amber-500 font-bold">{formatTime(totalEfectivo)}</span></div>
              
              <div className="flex justify-center gap-1 mt-2">
                <button 
                  onClick={() => setIsRunning(!isRunning)}
                  disabled={periodo === 'GLOBAL'}
                  className={`p-2 rounded-full transition-colors disabled:opacity-30 ${isRunning ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}`}
                >
                  {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <button 
                  onClick={requestReset}
                  disabled={periodo === 'GLOBAL'}
                  className={`p-2 rounded-full transition-colors disabled:opacity-30 ${btnResetClass}`}
                  title={langTexts.reset}
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Marcador Equipo Visitante */}
            <div className="text-center w-1/3 flex flex-col items-center justify-center">
              <input 
                type="text" 
                value={teamB} 
                onChange={e => setTeamB(e.target.value.toUpperCase())} 
                onFocus={e => e.target.select()}
                className={`bg-transparent w-full text-center text-xs font-bold focus:outline-none uppercase ${textMuted}`} 
              />
              <div className="text-4xl font-black text-rose-500">{totalGoalsB}</div>
              <button onClick={() => handleAction('B', 'restar_gol')} className={`text-[0.6rem] font-bold uppercase px-2 py-0.5 rounded-md mt-1 transition-colors ${isDark ? 'bg-slate-800 text-slate-500 hover:text-rose-400' : 'bg-slate-200 text-slate-500 hover:text-rose-500'}`}>- {langTexts.undoGoal}</button>
            </div>
          </div>

          <div className={`${bgPanel} flex gap-2 p-1 rounded-lg border transition-colors`}>
            {['1T', '2T', 'GLOBAL'].map(p => (
              <button 
                key={p} 
                onClick={() => handleCambiarPeriodo(p as '1T' | '2T' | 'GLOBAL')}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${periodo === p ? 'bg-emerald-600 text-white shadow-sm' : `${textMuted} hover:${textMain}`}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENEDOR ELÁSTICO */}
        <div className="flex-1 flex flex-col min-h-0 mb-4">
          {periodo === 'GLOBAL' ? (
            <div className="h-full overflow-y-auto pr-1">
              {renderStatsTable('1T', stats['1T'])}
              {renderStatsTable('2T', stats['2T'])}
              {renderStatsTable('GLOBAL', { ...getActiveStats(), goalsA: totalGoalsA, goalsB: totalGoalsB } as any)}
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              <button 
                onClick={() => setActivePossession(null)}
                className={`w-full font-bold py-3 rounded-xl mb-3 flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0 ${
                  isBallDead 
                    ? 'bg-amber-500/20 text-amber-600 border border-amber-500/50 shadow-inner' 
                    : btnPauseClass
                }`}
              >
                <Pause className="w-5 h-5" /> {isBallDead ? langTexts.ballDead : langTexts.pauseAction}
              </button>

              <div className="flex-1 grid grid-cols-2 gap-3 min-h-0">
                
                {/* EQUIPO A */}
                <div className={`${bgPanel} rounded-xl p-3 border-t-4 border-t-emerald-500 flex flex-col transition-colors min-h-0`}>
                  <div className="text-center mb-3 shrink-0">
                    <div className={`text-xs font-mono ${bgSubPanel} p-1.5 rounded flex flex-col gap-0.5 font-bold`}>
                      <span className="text-emerald-500">{formatTime(currentStats.timeA)} ({pctA}%)</span>
                      <span className="text-amber-500 text-[0.65rem]">PPM: {m.ppmA}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleAction('A', 'pase')}
                    className="flex-1 min-h-[60px] bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-600 font-bold rounded-xl mb-3 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <span className="text-sm md:text-base leading-tight px-2">{langTexts.passOk}</span>
                  </button>

                  <div className={`text-[0.7rem] ${textMain} ${bgSubPanel} p-3 rounded-lg mb-3 shrink-0 transition-colors border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <div className="flex justify-between mb-1.5"><span className={textMuted}>{langTexts.passesCompleted}:</span> <b>{currentStats.passesA}</b></div>
                    <div className="flex justify-between mb-1.5"><span className={textMuted}>{langTexts.passesFailed}:</span> <b>{currentStats.failsA}</b></div>
                    <div className="flex justify-between mb-3"><span className={textMuted}>{langTexts.passEffectiveness}:</span> <b>{m.effPassA}%</b></div>
                    <div className={`h-px w-full mb-3 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                    <div className="flex justify-between mb-1.5"><span className={textMuted}>{langTexts.situations}:</span> <b>{currentStats.chancesA}</b></div>
                    <div className="flex justify-between"><span className={textMuted}>{langTexts.goalEffectiveness}:</span> <b>{m.effGoalA}%</b></div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleAction('A', 'chance')} className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 py-3 rounded-lg flex justify-center items-center active:scale-95 transition-colors font-bold text-[0.65rem] uppercase">{langTexts.chance}</button>
                    <button onClick={() => handleAction('A', 'gol')} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg flex justify-center items-center active:scale-95 transition-colors font-bold text-[0.65rem] uppercase">{langTexts.goal}</button>
                  </div>
                </div>

                {/* EQUIPO B */}
                <div className={`${bgPanel} rounded-xl p-3 border-t-4 border-t-rose-500 flex flex-col transition-colors min-h-0`}>
                  <div className="text-center mb-3 shrink-0">
                    <div className={`text-xs font-mono ${bgSubPanel} p-1.5 rounded flex flex-col gap-0.5 font-bold`}>
                      <span className="text-rose-500">{formatTime(currentStats.timeB)} ({pctB}%)</span>
                      <span className="text-amber-500 text-[0.65rem]">PPM: {m.ppmB}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleAction('B', 'pase')}
                    className="flex-1 min-h-[60px] bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/30 text-rose-600 font-bold rounded-xl mb-3 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <span className="text-sm md:text-base leading-tight px-2">{langTexts.passOk}</span>
                  </button>

                  <div className={`text-[0.7rem] ${textMain} ${bgSubPanel} p-3 rounded-lg mb-3 shrink-0 transition-colors border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <div className="flex justify-between mb-1.5"><span className={textMuted}>{langTexts.passesCompleted}:</span> <b>{currentStats.passesB}</b></div>
                    <div className="flex justify-between mb-1.5"><span className={textMuted}>{langTexts.passesFailed}:</span> <b>{currentStats.failsB}</b></div>
                    <div className="flex justify-between mb-3"><span className={textMuted}>{langTexts.passEffectiveness}:</span> <b>{m.effPassB}%</b></div>
                    <div className={`h-px w-full mb-3 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                    <div className="flex justify-between mb-1.5"><span className={textMuted}>{langTexts.situations}:</span> <b>{currentStats.chancesB}</b></div>
                    <div className="flex justify-between"><span className={textMuted}>{langTexts.goalEffectiveness}:</span> <b>{m.effGoalB}%</b></div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleAction('B', 'chance')} className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 py-3 rounded-lg flex justify-center items-center active:scale-95 transition-colors font-bold text-[0.65rem] uppercase">{langTexts.chance}</button>
                    <button onClick={() => handleAction('B', 'gol')} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg flex justify-center items-center active:scale-95 transition-colors font-bold text-[0.65rem] uppercase">{langTexts.goal}</button>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* PIE DE PÁGINA */}
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={() => { setShowSaveModal(true); setSaveError(''); }} 
            className={`flex-1 font-bold py-3 rounded-xl flex justify-center items-center gap-2 text-sm transition-colors ${btnPauseClass}`}
          >
            <Save className="w-4 h-4" /> {langTexts.save}
          </button>
          
          {userSub === 'premium' && (
            <>
              <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl flex justify-center items-center gap-2 text-sm font-bold transition-colors">
                <FileText className="w-4 h-4" /> PDF
              </button>
              <button className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl flex justify-center items-center gap-2 text-sm font-bold transition-colors">
                <Download className="w-4 h-4" /> CSV
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
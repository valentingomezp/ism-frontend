import { useState, useEffect } from 'react';
import { Calendar, FileText, Download, ArrowDownUp, Search, ChevronDown, ChevronUp, Clock, AlignLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

interface MatchData {
  id: number;
  title: string;
  description: string;
  teamA: string;
  teamB: string;
  stats: any;
  createdAt: string;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export default function MisPartidos() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [userSub, setUserSub] = useState('free');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [expandedId, setExpandedId] = useState<number | null>(null);

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

    fetch(`${API_URL}/matches/mis-partidos`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // CORRECCIÓN: Verificamos que sea un arreglo válido. Si el backend manda un error, no rompemos la UI.
        if (Array.isArray(data)) {
          setMatches(data);
        } else {
          console.warn("El servidor devolvió un error o datos no válidos:", data);
          setMatches([]); 
        }
      })
      .catch(err => {
        console.error("Error al cargar partidos", err);
        setMatches([]); // Mantenemos el estado seguro
      });
  }, [navigate]);

  const filteredMatches = matches
    .filter(m => 
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.teamA.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.teamB.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatsForPeriod = (match: MatchData, period: '1T' | '2T' | 'GLOBAL') => {
    let s;
    if (period === 'GLOBAL') {
      const s1 = match.stats['1T'] || {};
      const s2 = match.stats['2T'] || {};
      s = {
        periodTime: (s1.periodTime || 0) + (s2.periodTime || 0),
        timeA: (s1.timeA || 0) + (s2.timeA || 0),
        timeB: (s1.timeB || 0) + (s2.timeB || 0),
        passesA: (s1.passesA || 0) + (s2.passesA || 0),
        passesB: (s1.passesB || 0) + (s2.passesB || 0),
        failsA: (s1.failsA || 0) + (s2.failsA || 0),
        failsB: (s1.failsB || 0) + (s2.failsB || 0),
        goalsA: (s1.goalsA || 0) + (s2.goalsA || 0),
        goalsB: (s1.goalsB || 0) + (s2.goalsB || 0),
        chancesA: (s1.chancesA || 0) + (s2.chancesA || 0),
        chancesB: (s1.chancesB || 0) + (s2.chancesB || 0),
      };
    } else {
      const pStats = match.stats[period] || {};
      s = {
        periodTime: pStats.periodTime || 0,
        timeA: pStats.timeA || 0, timeB: pStats.timeB || 0,
        passesA: pStats.passesA || 0, passesB: pStats.passesB || 0,
        failsA: pStats.failsA || 0, failsB: pStats.failsB || 0,
        goalsA: pStats.goalsA || 0, goalsB: pStats.goalsB || 0,
        chancesA: pStats.chancesA || 0, chancesB: pStats.chancesB || 0,
      };
    }

    const tEfectivo = s.timeA + s.timeB;
    const pA = tEfectivo > 0 ? Math.round((s.timeA / tEfectivo) * 100) : 0;
    const pB = tEfectivo > 0 ? Math.round((s.timeB / tEfectivo) * 100) : 0;
    const ppmA = s.timeA > 0 ? (s.passesA / (s.timeA / 60)).toFixed(1) : "0.0";
    const ppmB = s.timeB > 0 ? (s.passesB / (s.timeB / 60)).toFixed(1) : "0.0";
    const totPassA = s.passesA + s.failsA;
    const totPassB = s.passesB + s.failsB;
    const effPassA = totPassA > 0 ? ((s.passesA / totPassA) * 100).toFixed(1) : "0.0";
    const effPassB = totPassB > 0 ? ((s.passesB / totPassB) * 100).toFixed(1) : "0.0";
    const effGoalA = s.chancesA > 0 ? ((s.goalsA / s.chancesA) * 100).toFixed(1) : "0.0";
    const effGoalB = s.chancesB > 0 ? ((s.goalsB / s.chancesB) * 100).toFixed(1) : "0.0";

    return { s, tEfectivo, pA, pB, ppmA, ppmB, effPassA, effPassB, effGoalA, effGoalB };
  };

  const handleExportPDF = (e: React.MouseEvent, match: MatchData) => {
    e.stopPropagation();
    const doc = new jsPDF();
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42); 
    doc.text('INFO SOCCER MATCH', 105, 10, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105); 
    doc.text(`Reporte Táctico: ${match.title}`, 105, 15, { align: 'center' });
    
    const dateStr = new Date(match.createdAt).toLocaleDateString();
    const timeStr = new Date(match.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    doc.setFontSize(8);
    doc.text(`Fecha: ${dateStr} - Hora: ${timeStr}`, 105, 19, { align: 'center' });

    let startY = 23;
    const blockHeight = 77;

    const periods = [
      { key: 'GLOBAL', title: 'GLOBAL DEL PARTIDO' },
      { key: '1T', title: 'PRIMER TIEMPO (1T)' },
      { key: '2T', title: 'SEGUNDO TIEMPO (2T)' }
    ] as const;

    periods.forEach((period) => {
      const data = getStatsForPeriod(match, period.key);
      
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.roundedRect(15, startY, 180, blockHeight, 3, 3);

      doc.setFillColor(248, 250, 252);
      doc.roundedRect(20, startY + 3, 170, 6, 1.5, 1.5, 'FD');

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(period.title, 105, startY + 7, { align: 'center' });

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      const subTxt = `Tiempo Total: ${formatTime(data.s.periodTime)}   |   Tiempo Efectivo: ${formatTime(data.tEfectivo)}`;
      doc.text(subTxt, 105, startY + 12.5, { align: 'center' });

      const subBoxY = startY + 15;
      const subBoxWidth = 82;
      const subBoxHeight = 58;

      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(20, subBoxY, subBoxWidth, subBoxHeight, 2, 2);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(match.teamA, 20 + (subBoxWidth / 2), subBoxY + 5, { align: 'center' });

      doc.roundedRect(108, subBoxY, subBoxWidth, subBoxHeight, 2, 2);
      doc.text(match.teamB, 108 + (subBoxWidth / 2), subBoxY + 5, { align: 'center' });

      const rows = [
        { label: 'Goles:', valA: data.s.goalsA.toString(), valB: data.s.goalsB.toString() },
        { label: 'Posesión:', valA: `${formatTime(data.s.timeA)} (${data.pA}%)`, valB: `${formatTime(data.s.timeB)} (${data.pB}%)` },
        { label: 'PPM:', valA: data.ppmA, valB: data.ppmB },
        { label: 'Pases Concretados:', valA: data.s.passesA.toString(), valB: data.s.passesB.toString() },
        { label: 'Pases Errados:', valA: data.s.failsA.toString(), valB: data.s.failsB.toString() },
        { label: 'Efectividad Pases:', valA: `${data.effPassA}%`, valB: `${data.effPassB}%` },
        { label: 'Situaciones Gol:', valA: data.s.chancesA.toString(), valB: data.s.chancesB.toString() },
        { label: 'Efectividad Gol:', valA: `${data.effGoalA}%`, valB: `${data.effGoalB}%` }
      ];

      let rowY = subBoxY + 11;
      rows.forEach(row => {
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text(row.label, 24, rowY);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(row.valA, 20 + subBoxWidth - 4, rowY, { align: 'right' });

        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text(row.label, 112, rowY);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(row.valB, 108 + subBoxWidth - 4, rowY, { align: 'right' });

        rowY += 5.8; 
      });

      startY += blockHeight + 4.5; 
    });

    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Generado de forma automática por INFO SOCCER MATCH - Página 1 de 1', 105, 292, { align: 'center' });

    doc.save(`Reporte_${match.teamA}_vs_${match.teamB}.pdf`);
  };

  const handleExportCSV = (e: React.MouseEvent, match: MatchData) => {
    e.stopPropagation();
    
    const sep = ',';
    
    const teamA = match.teamA || 'Equipo A';
    const teamB = match.teamB || 'Equipo B';
    const matchDate = new Date(match.createdAt).toLocaleDateString('es-ES');

    // Mantiene en formato Número decimal solo los campos requeridos para análisis
    const timeToDecimal = (seconds: number) => (seconds / 60).toFixed(2);
    const formatNumber = (val: string | number) => String(val);

    const global = getStatsForPeriod(match, 'GLOBAL');
    const t1 = getStatsForPeriod(match, '1T');
    const t2 = getStatsForPeriod(match, '2T');

    const headers = [
      'Fecha', 'Equipo A', 'Equipo B',
      'Goles A (Global)', 'Goles B (Global)',
      'Tiempo Juego (Global)', 'Tiempo Efectivo (Global)',
      'Tiempo Posesion A (Global)', 'Tiempo Posesion B (Global)',
      '% Posesion A (Global)', '% Posesion B (Global)',
      'Pases Concretados A (Global)', 'Pases Concretados B (Global)',
      'Pases Errados A (Global)', 'Pases Errados B (Global)',
      'Situaciones Gol A (Global)', 'Situaciones Gol B (Global)',
      
      'Goles A (1T)', 'Goles B (1T)',
      'Tiempo Juego (1T)', 'Tiempo Efectivo (1T)',
      'Tiempo Posesion A (1T)', 'Tiempo Posesion B (1T)',
      '% Posesion A (1T)', '% Posesion B (1T)',
      
      'Goles A (2T)', 'Goles B (2T)',
      'Tiempo Juego (2T)', 'Tiempo Efectivo (2T)',
      'Tiempo Posesion A (2T)', 'Tiempo Posesion B (2T)',
      '% Posesion A (2T)', '% Posesion B (2T)'
    ];

    const rowData = [
      matchDate, teamA, teamB,
      
      // GLOBAL
      global.s.goalsA, global.s.goalsB,
      formatTime(global.s.periodTime), // Tiempo de Juego Normal (ej: 04:33)
      timeToDecimal(global.tEfectivo), // Efectivo Decimal
      timeToDecimal(global.s.timeA),   // Posesion A Decimal
      timeToDecimal(global.s.timeB),   // Posesion B Decimal
      formatNumber(global.pA), formatNumber(global.pB),
      global.s.passesA, global.s.passesB,
      global.s.failsA, global.s.failsB,
      global.s.chancesA, global.s.chancesB,

      // 1T
      t1.s.goalsA, t1.s.goalsB,
      formatTime(t1.s.periodTime),     // Tiempo de Juego Normal (ej: 04:33)
      timeToDecimal(t1.tEfectivo),     // Efectivo Decimal
      timeToDecimal(t1.s.timeA),       // Posesion A Decimal
      timeToDecimal(t1.s.timeB),       // Posesion B Decimal
      formatNumber(t1.pA), formatNumber(t1.pB),

      // 2T
      t2.s.goalsA, t2.s.goalsB,
      formatTime(t2.s.periodTime),     // Tiempo de Juego Normal (ej: 04:33)
      timeToDecimal(t2.tEfectivo),     // Efectivo Decimal
      timeToDecimal(t2.s.timeA),       // Posesion A Decimal
      timeToDecimal(t2.s.timeB),       // Posesion B Decimal
      formatNumber(t2.pA), formatNumber(t2.pB)
    ];

    const csvContent = "\uFEFF" + headers.join(sep) + '\n' + rowData.join(sep);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Datos_Partido_${teamA}_vs_${teamB}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStatsGrid = (match: MatchData) => {
    const data = getStatsForPeriod(match, 'GLOBAL');
    const d = data.s;

    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mt-4">
        <div className="bg-slate-50 border-b border-slate-200 p-3 text-center">
          <h4 className="font-black text-slate-800 tracking-widest text-sm">REPORTE GLOBAL TÁCTICO</h4>
          <div className="flex items-center justify-center gap-4 mt-2">
            <p className="text-xs text-slate-500 font-mono">
              TIEMPO TOTAL: <span className="font-bold text-slate-800">{formatTime(d.periodTime)}</span>
            </p>
            <p className="text-xs text-slate-500 font-mono">
              TIEMPO EFECTIVO: <span className="font-bold text-amber-600">{formatTime(data.tEfectivo)}</span>
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 text-sm text-center items-center divide-y divide-slate-100">
          <div className="font-bold text-slate-400 p-3 text-left bg-slate-50/50">MÉTRICA</div>
          <div className="font-bold text-emerald-600 p-3 truncate bg-emerald-50/30">{match.teamA}</div>
          <div className="font-bold text-rose-600 p-3 truncate bg-rose-50/30">{match.teamB}</div>
          
          <div className="text-left font-semibold text-slate-600 p-3">Goles</div>
          <div className="font-black text-lg text-slate-800 p-3">{d.goalsA}</div>
          <div className="font-black text-lg text-slate-800 p-3">{d.goalsB}</div>

          <div className="text-left font-medium text-slate-600 p-3">Posesión</div>
          <div className="text-slate-800 p-3">{formatTime(d.timeA)} <span className="text-emerald-600 font-bold text-xs ml-1">({data.pA}%)</span></div>
          <div className="text-slate-800 p-3">{formatTime(d.timeB)} <span className="text-rose-600 font-bold text-xs ml-1">({data.pB}%)</span></div>

          <div className="text-left font-medium text-slate-600 p-3">PPM (Pases por Min)</div>
          <div className="text-slate-800 font-mono p-3">{data.ppmA}</div>
          <div className="text-slate-800 font-mono p-3">{data.ppmB}</div>

          <div className="text-left font-medium text-slate-600 p-3">Pases (Ok / Errados)</div>
          <div className="text-slate-800 p-3">{d.passesA} <span className="text-slate-400 text-xs">/ {d.failsA}</span></div>
          <div className="text-slate-800 p-3">{d.passesB} <span className="text-slate-400 text-xs">/ {d.failsB}</span></div>

          <div className="text-left font-medium text-slate-600 p-3">Efectividad Pases</div>
          <div className="text-slate-800 p-3 font-bold">{data.effPassA}%</div>
          <div className="text-slate-800 p-3 font-bold">{data.effPassB}%</div>

          <div className="text-left font-medium text-slate-600 p-3">Situaciones de Gol</div>
          <div className="text-slate-800 p-3">{d.chancesA}</div>
          <div className="text-slate-800 p-3">{d.chancesB}</div>

          <div className="text-left font-medium text-slate-600 p-3">Efectividad de Gol</div>
          <div className="text-slate-800 p-3 font-bold">{data.effGoalA}%</div>
          <div className="text-slate-800 p-3 font-bold">{data.effGoalB}%</div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-6rem)]">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mis Partidos</h1>
          <p className="text-slate-500">Historial táctico y estadísticas almacenadas.</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar partido..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 shadow-sm transition-colors"
            />
          </div>
          <button 
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
            title={sortOrder === 'desc' ? 'Más recientes primero' : 'Más antiguos primero'}
          >
            <ArrowDownUp className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-4 pb-12">
        {filteredMatches.length === 0 ? (
          <div className="text-center p-12 text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed">
            No se encontraron partidos almacenados.
          </div>
        ) : (
          filteredMatches.map(match => {
            const isExpanded = expandedId === match.id;
            
            return (
              <div 
                key={match.id} 
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${isExpanded ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500' : 'border-slate-200 shadow-sm hover:border-emerald-300'}`}
              >
                <div 
                  onClick={() => toggleExpand(match.id)}
                  className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 truncate">{match.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(match.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(match.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      <span className="px-2 py-0.5 bg-slate-100 rounded-md text-slate-600 uppercase tracking-wide border border-slate-200 truncate max-w-[200px]">{match.teamA} vs {match.teamB}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    <div className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-5 sm:p-6 animate-in slide-in-from-top-2 duration-200">
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      <button 
                        disabled={userSub === 'free'}
                        onClick={(e) => handleExportPDF(e, match)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:grayscale text-sm"
                      >
                        <FileText className="w-4 h-4" /> Exportar PDF
                      </button>
                      <button 
                        disabled={userSub === 'free'}
                        onClick={(e) => handleExportCSV(e, match)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-cyan-600 text-white hover:bg-cyan-500 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:grayscale text-sm"
                      >
                        <Download className="w-4 h-4" /> Exportar CSV
                      </button>
                    </div>

                    {match.description && (
                      <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200 text-sm text-slate-700 flex gap-3 shadow-sm w-full">
                        <AlignLeft className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                        <p className="leading-relaxed break-words whitespace-pre-wrap flex-1 overflow-hidden">{match.description}</p>
                      </div>
                    )}

                    {renderStatsGrid(match)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
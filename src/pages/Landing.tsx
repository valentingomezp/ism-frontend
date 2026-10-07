import { Smartphone, BarChart3, Globe, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <img 
            src="/ISM.jpg" 
            alt="INFO SOCCER MATCH Logo" 
            className="w-10 h-10 rounded-lg shadow-sm"
          />
          <div className="text-xl font-black text-emerald-700 tracking-tight">
            INFO SOCCER MATCH
          </div>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 font-semibold text-slate-600 hover:text-emerald-700 transition-colors flex items-center">
            Iniciar Sesión
          </Link>
          {/* BOTÓN MODIFICADO: Redirige a /register */}
          <Link to="/register" className="hidden sm:inline-flex items-center justify-center px-4 py-2 font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-md transition-all">
            Crear cuenta gratis
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
          Dirige tu equipo <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
            en tiempo real.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          La pizarra táctica digital definitiva diseñada para entrenadores. Registra estadísticas, analiza el rendimiento y toma decisiones ganadoras desde cualquier dispositivo.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {/* BOTÓN MODIFICADO: Redirige a /register */}
          <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-emerald-600 rounded-full shadow-lg hover:bg-emerald-700 hover:shadow-emerald-500/30 transition-all">
            Empezar ahora — Es gratis
          </Link>
          <button className="px-8 py-4 text-lg font-bold text-slate-700 bg-white border-2 border-slate-200 rounded-full hover:border-slate-300 hover:bg-slate-50 transition-all">
            Ver demostración
          </button>
        </div>
      </main>

      {/* FEATURES SECTION */}
      <section className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Diseñado para la alta competencia</h2>
            <p className="text-slate-500 mt-4">Todo lo que necesitas para gestionar el partido sin apartar la vista de la cancha.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">100% Optimizado Mobile</h3>
              <p className="text-slate-600">Interfaz basada en memoria muscular. Registra pases y goles con botones amplios sin tener que mirar la pantalla.</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Historial y Estadísticas</h3>
              <p className="text-slate-600">Todos tus partidos se guardan en la nube. Analiza la posesión y efectividad histórica de tu equipo.</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Suscripciones Globales</h3>
              <p className="text-slate-600">Planes Freemium y Premium con soporte para pagos internacionales y roles de administrador.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-slate-50 py-20 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Preguntas Frecuentes</h2>
            <p className="text-slate-500 mt-4">Resuelve tus dudas y descubre todo el potencial de la plataforma.</p>
          </div>
          
          <div className="space-y-4">
            <details className="group bg-white rounded-xl border border-slate-200 p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer font-bold text-slate-900 text-lg">
                ¿Puedo exportar los datos de mis partidos?
                <ChevronDown className="w-5 h-5 text-slate-500 transition-transform group-open:rotate-180" />
              </summary>
              <p className="text-slate-600 mt-4 leading-relaxed">
                Si, se puede exportar el reporte de cualquier partido en formato PDF para compartirlo rápidamente con tu cuerpo técnico, o descargar la información cruda en CSV. El formato CSV es ideal si buscas importar las métricas a software de análisis avanzado y crear gráficas personalizadas en plataformas como Power BI o Excel.
              </p>
            </details>

            <details className="group bg-white rounded-xl border border-slate-200 p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer font-bold text-slate-900 text-lg">
                ¿Necesito instalar una aplicación pesada?
                <ChevronDown className="w-5 h-5 text-slate-500 transition-transform group-open:rotate-180" />
              </summary>
              <p className="text-slate-600 mt-4 leading-relaxed">
                No. INFO SOCCER MATCH funciona directamente desde el navegador web de cualquier dispositivo. Solo necesitas iniciar sesión y estarás listo para registrar los eventos del partido.
              </p>
            </details>

            <details className="group bg-white rounded-xl border border-slate-200 p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer font-bold text-slate-900 text-lg">
                ¿Existen planes de pago?
                <ChevronDown className="w-5 h-5 text-slate-500 transition-transform group-open:rotate-180" />
              </summary>
              <p className="text-slate-600 mt-4 leading-relaxed">
                Sí, ofrecemos un plan gratuito con funcionalidades esenciales para que puedas empezar. Si buscas análisis estadístico ilimitado y exportaciones en CSV, puedes actualizar a nuestro plan Premium abonando de manera segura desde cualquier parte del mundo.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* FOOTER BASICO */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        <p>© 2026 INFO SOCCER MATCH. Todos los derechos reservados.</p>
      </footer>

    </div>
  )
}

export default App
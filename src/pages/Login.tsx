import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function Login() {
  // Estados para guardar lo que el usuario escribe
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate(); // Herramienta para redireccionar de página

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario
    setError('');
    setIsLoading(true);

    try {
      // Hacemos la petición a tu API de NestJS
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Correo o contraseña incorrectos');
      }

      const data = await response.json();
      
      // ¡Éxito! Guardamos el token en la bóveda del navegador
      localStorage.setItem('token', data.access_token);
      
      // Redirigimos al usuario a su tablero (próximo paso)
      navigate('/dashboard');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
        <div className="text-center mb-8">
          <img src="/ISM.jpg" alt="ISM Logo" className="w-16 h-16 mx-auto rounded-xl shadow-sm mb-4" />
          <h2 className="text-2xl font-bold text-slate-900">Iniciar Sesión</h2>
          <p className="text-slate-500 mt-2">Accede a tu pizarra táctica y estadísticas</p>
        </div>

        {/* Aquí conectamos la función handleLogin al formulario */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Cartel de error condicional */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="entrenador@club.com"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 shadow-md transition-all disabled:opacity-70"
          >
            {isLoading ? 'Conectando...' : 'Entrar'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-slate-500">
          ¿No tienes una cuenta? <Link to="/register" className="text-emerald-600 font-bold hover:underline">Regístrate gratis</Link>
        </div>
        
        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
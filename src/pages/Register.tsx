import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Estado para el mensaje de éxito

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(''); // Limpiamos mensajes previos
    
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        // Mostramos el mensaje de éxito
        setSuccess('¡Registrado correctamente! Redirigiendo al login...');
        
        // Esperamos 2.5 segundos (2500 milisegundos) antes de navegar
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      } else {
        const data = await res.json();
        setError(data.message || 'Error al registrar la cuenta');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-black">
            ISM
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Crear Cuenta</h2>
          <p className="text-slate-500 mt-2">Únete a INFO SOCCER MATCH</p>
        </div>

        {/* Mensaje de Error (Rojo) */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-sm text-center rounded-xl border border-rose-100 font-medium">
            {error}
          </div>
        )}

        {/* Mensaje de Éxito (Verde) */}
        {success && (
          <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 text-sm text-center rounded-xl border border-emerald-100 font-bold">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nombre</label>
              <input 
                type="text" 
                name="nombre"
                required
                value={formData.nombre}
                onChange={handleChange}
                disabled={!!success} // Deshabilita el input si ya se registró
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors disabled:opacity-50"
                placeholder="Juan"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Apellido</label>
              <input 
                type="text" 
                name="apellido"
                required
                value={formData.apellido}
                onChange={handleChange}
                disabled={!!success}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors disabled:opacity-50"
                placeholder="Pérez"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={!!success}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors disabled:opacity-50"
              placeholder="entrenador@club.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              disabled={!!success}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors disabled:opacity-50"
              placeholder="••••••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={!!success} // Deshabilita el botón mientras redirige
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {success ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-emerald-600 font-bold hover:underline">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

export function AuthScreen({
  onLoginSuccess,
  onBack,
}: {
  onLoginSuccess: (user?: any) => void;
  onBack?: () => void;
}) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;

        if (data.user) {
          await supabase.from('profiles').insert([
            {
              id: data.user.id,
              full_name: fullName,
              email,
              is_pro: false,
              xp_points: 0,
              streak_days: 1,
            },
          ]);
        }
        if (typeof window !== 'undefined' && typeof window.alert === 'function') {
          window.alert('¡Registro exitoso! Ya puedes iniciar sesión.');
        }
        setIsSignUp(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLoginSuccess(data?.user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 relative">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0B2F64] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>
      )}

      <div className="text-center space-y-2">
        <span className="text-[10px] font-bold text-[#00875A] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          ICFES MASTER H 2.5
        </span>
        <h2 className="text-2xl font-black text-[#0B2F64]">
          {isSignUp ? 'Crear Cuenta Estudiante' : 'Iniciar Sesión'}
        </h2>
        <p className="text-xs text-slate-500">
          Accede a tus simulacros, puntajes y reportes guardados en la nube.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium border border-red-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleAuth} className="space-y-4">
        {isSignUp && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Nombre Completo</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej. Eider Hurtado"
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B2F64]"
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Correo Electrónico</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="estudiante@correo.com"
            className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B2F64]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B2F64]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#0B2F64] text-white font-bold rounded-xl text-sm shadow-sm hover:bg-blue-900 transition-all cursor-pointer"
        >
          {loading ? 'Procesando...' : isSignUp ? 'Registrarse en la Plataforma' : 'Entrar a la Plataforma'}
        </button>
      </form>

      <div className="text-center pt-2">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-xs font-bold text-[#00875A] hover:underline cursor-pointer"
        >
          {isSignUp ? '¿Ya tienes cuenta? Inicia sesión aquí' : '¿No tienes cuenta? Regístrate gratis'}
        </button>
      </div>
    </div>
  );
}

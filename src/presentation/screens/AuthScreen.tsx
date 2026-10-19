import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, CheckCircle2, AlertCircle, Sparkles, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: () => void;
  onBack?: () => void;
}

export function AuthScreen({ onLoginSuccess, onBack }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isSignUp) {
        // Registro de nuevo usuario
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;

        // Crear perfil inicial en la tabla profiles
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

        setSuccessMsg('¡Registro exitoso! Ya puedes iniciar sesión con tus credenciales.');
        setIsSignUp(false);
        setPassword('');
      } else {
        // Inicio de sesión
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLoginSuccess();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#AFF2D4]/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#0B2F64]/10 rounded-full blur-2xl pointer-events-none" />

        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0B2F64] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>
        )}

        <div className="text-center space-y-2 relative">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#00875A] uppercase tracking-wider bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3 text-[#00875A]" />
            ICFES MASTER H 2.5
          </span>
          <h2 className="text-2xl font-black text-[#0B2F64] tracking-tight">
            {isSignUp ? 'Crear Cuenta Estudiante' : 'Iniciar Sesión'}
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Accede a tus simulacros, puntajes y reportes guardados en la nube.
          </p>
        </div>

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-medium border border-emerald-200 flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#00875A] shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium border border-red-200 flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4 relative">
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                Nombre Completo
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Eider Hurtado"
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B2F64] focus:ring-2 focus:ring-[#0B2F64]/10 transition-all bg-slate-50/50 focus:bg-white"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" />
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="estudiante@correo.com"
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B2F64] focus:ring-2 focus:ring-[#0B2F64]/10 transition-all bg-slate-50/50 focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B2F64] focus:ring-2 focus:ring-[#0B2F64]/10 transition-all bg-slate-50/50 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#0B2F64] text-white font-bold rounded-xl text-sm shadow-md hover:bg-[#071f43] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Procesando...
              </span>
            ) : isSignUp ? (
              'Registrarse en la Plataforma'
            ) : (
              'Entrar a la Plataforma'
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 space-y-3">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className="text-xs font-bold text-[#00875A] hover:underline cursor-pointer block w-full text-center"
          >
            {isSignUp ? '¿Ya tienes cuenta? Inicia sesión aquí' : '¿No tienes cuenta? Regístrate gratis'}
          </button>

          <button
            type="button"
            onClick={() => {
              setEmail('eiderhurtado82@gmail.com');
              setFullName('Eider Felipe Hurtado');
              setPassword('Admin123*');
            }}
            className="text-[11px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>🛡️ Rellenar datos de Administrador Master</span>
          </button>
        </div>
      </div>
    </div>
  );
}

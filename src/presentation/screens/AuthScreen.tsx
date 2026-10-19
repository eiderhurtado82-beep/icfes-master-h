import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Eye, EyeOff, ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

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
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    // ACCESO DIRECTO DE ADMINISTRADOR (Bypass de límite de correo de Supabase)
    if (email.toLowerCase().trim() === 'eiderhurtado82@gmail.com') {
      const adminUser = {
        id: 'admin-eider-001',
        email: 'eiderhurtado82@gmail.com',
        user_metadata: { full_name: fullName || 'Eider Felipe Hurtado Peña' },
      };

      // Intentar también en Supabase en segundo plano si la cuenta ya existe
      supabase.auth.signInWithPassword({ email, password }).catch(() => {});

      setTimeout(() => {
        setLoading(false);
        onLoginSuccess(adminUser);
      }, 500);
      return;
    }

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
        setSuccessMsg('¡Registro exitoso! Ya puedes iniciar sesión.');
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

  const handleFillAdmin = () => {
    setEmail('eiderhurtado82@gmail.com');
    setPassword('AdminMaster2026*');
    setFullName('Eider Felipe Hurtado Peña');
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
      {/* Subtle decorative background gradient */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#AFF2D4]/30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#0B2F64]/10 rounded-full blur-2xl pointer-events-none" />

      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0B2F64] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>
      )}

      <div className="text-center space-y-2 relative">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#00875A] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          <Sparkles className="w-3 h-3 text-[#00875A]" />
          ICFES MASTER H 2.5
        </span>
        <h2 className="text-2xl font-black text-[#0B2F64]">
          {isSignUp ? 'Crear Cuenta Estudiante' : 'Iniciar Sesión'}
        </h2>
        <p className="text-xs text-slate-500">
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
          className="w-full py-3.5 bg-[#0B2F64] text-white font-bold rounded-xl text-sm shadow-sm hover:bg-blue-900 transition-all cursor-pointer flex items-center justify-center gap-2"
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

        {/* Botón rápido para rellenar y entrar como Administrador */}
        <button
          type="button"
          onClick={handleFillAdmin}
          className="w-full py-2.5 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-red-200 shadow-2xs"
        >
          <ShieldCheck className="w-4 h-4" />
          🛡️ Rellenar datos de Administrador Master
        </button>
      </form>

      <div className="text-center pt-2">
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setErrorMsg('');
            setSuccessMsg('');
          }}
          className="text-xs font-bold text-[#00875A] hover:underline cursor-pointer"
        >
          {isSignUp ? '¿Ya tienes cuenta? Inicia sesión aquí' : '¿No tienes cuenta? Regístrate gratis'}
        </button>
      </div>
    </div>
  );
}

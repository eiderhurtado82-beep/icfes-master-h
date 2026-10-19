import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Zap,
  CreditCard,
  Smartphone,
  ExternalLink,
  BookOpen,
  Award,
} from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';

interface CheckoutScreenProps {
  onBack: () => void;
  onSuccess?: () => void;
}

export function CheckoutScreen({ onBack, onSuccess }: CheckoutScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<'nequi' | 'daviplata' | 'paypal'>('nequi');
  const [paymentReference, setPaymentReference] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleConfirmPayment = () => {
    if (!paymentReference.trim()) {
      setErrorMessage('Por favor ingresa el número de comprobante o referencia de tu pago.');
      return;
    }
    setErrorMessage('');
    setIsSubmitted(true);

    try {
      const stored = localStorage.getItem('icfes_master_pending_payments');
      const existing = stored ? JSON.parse(stored) : [];
      const newPayment = {
        id: `p-${Date.now()}`,
        studentName: 'Estudiante Nuevo',
        email: 'estudiante@saber11.edu.co',
        method: selectedMethod === 'nequi' ? 'Nequi' : selectedMethod === 'daviplata' ? 'Daviplata' : 'PayPal',
        amount: '$29.900 COP',
        reference: paymentReference.trim(),
        timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'pending'
      };
      localStorage.setItem('icfes_master_pending_payments', JSON.stringify([newPayment, ...existing]));
      
      // Sincronizar reporte con Supabase
      supabaseService.reportPayment({
        student_name: newPayment.studentName,
        method: newPayment.method,
        amount: newPayment.amount,
        reference: newPayment.reference
      }).catch(() => {});
    } catch {
      // Ignore storage errors in restricted contexts
    }

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 pb-24">
      {/* Encabezado */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-[#F7F9FC] border border-[#E1E7F0] flex items-center justify-center text-[#0B2F64] hover:bg-[#DCE4F9] transition-colors cursor-pointer shrink-0"
            title="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-bold text-[#00875A] uppercase tracking-wider bg-[#00875A]/10 px-2 py-0.5 rounded-full inline-block mb-1">
              Versión Comercial EdTech
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B2F64]">
              Suscripción ICFES MASTER Pro
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/60 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-[#00875A]" />
          <span>Activación Rápida & Segura</span>
        </div>
      </div>

      {!isSubmitted ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Columna Izquierda: Resumen del Plan & Beneficios */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-gradient-to-br from-[#0B2F64] via-[#0E3D7E] to-[#00668B] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-[#AFF2D4] mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pase Temporada Saber 11</span>
              </div>

              <h3 className="text-xl font-black">Plan Pro Estudiante</h3>
              <p className="text-xs text-blue-100 mt-1 mb-4 leading-relaxed">
                Acceso irrestricto a todas las herramientas pedagógicas y simulacros oficiales.
              </p>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 my-4">
                <span className="text-xs text-blue-200 uppercase font-semibold block">Inversión única</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black font-mono">$29.900</span>
                  <span className="text-xs text-blue-200 font-medium">COP / temporada</span>
                </div>
                <span className="text-[11px] text-[#AFF2D4] mt-1 block">Ahorro del 60% frente a preicfes presenciales</span>
              </div>

              <div className="space-y-2.5 text-xs text-blue-50 mt-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#AFF2D4] shrink-0" />
                  <span>Simulacros Oficiales y Express Ilimitados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#AFF2D4] shrink-0" />
                  <span>Consultas con el Tutor Eider (IA Pedagógica)</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#AFF2D4] shrink-0" />
                  <span>Explicaciones y distractores analizados paso a paso</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#AFF2D4] shrink-0" />
                  <span>Diagnóstico predictivo de percentil y becas</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#AFF2D4]/40 text-[#00875A] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="leading-snug">
                Pagos respaldados por la pasarela oficial colombiana. Activación automática en cuanto verificas tu referencia.
              </p>
            </div>
          </div>

          {/* Columna Derecha: Métodos de Pago y Confirmación */}
          <div className="md:col-span-7 space-y-4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-5">
              <div>
                <h3 className="text-base font-bold text-[#0B2F64]">
                  Selecciona tu Método de Pago Preferido
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Transfiere desde tu celular o app bancaria y registra el comprobante.
                </p>
              </div>

              {/* Selector de Métodos */}
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('nequi')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    selectedMethod === 'nequi'
                      ? 'border-[#E00067] bg-[#E00067]/5 shadow-xs ring-2 ring-[#E00067]/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#E00067] text-white flex items-center justify-center font-bold text-xs">
                    N
                  </div>
                  <span className="text-xs font-bold text-[#191C1E]">Nequi</span>
                  <span className="text-[10px] text-slate-500">Colombia</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('daviplata')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    selectedMethod === 'daviplata'
                      ? 'border-[#ED1C24] bg-[#ED1C24]/5 shadow-xs ring-2 ring-[#ED1C24]/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#ED1C24] text-white flex items-center justify-center font-bold text-xs">
                    D
                  </div>
                  <span className="text-xs font-bold text-[#191C1E]">Daviplata</span>
                  <span className="text-[10px] text-slate-500">Davivienda</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('paypal')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    selectedMethod === 'paypal'
                      ? 'border-[#003087] bg-[#003087]/5 shadow-xs ring-2 ring-[#003087]/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#003087] text-white flex items-center justify-center font-bold text-xs">
                    P
                  </div>
                  <span className="text-xs font-bold text-[#191C1E]">PayPal</span>
                  <span className="text-[10px] text-slate-500">Tarjetas / USD</span>
                </button>
              </div>

              {/* Detalles según el método seleccionado */}
              <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E1E7F0] space-y-3">
                {selectedMethod === 'nequi' && (
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-600">Número de celular Nequi:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#0B2F64]">312 456 7890</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('3124567890', 'nequi')}
                          className="px-2 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[11px] font-semibold flex items-center gap-1"
                        >
                          {copiedText === 'nequi' ? <Check className="w-3 h-3 text-[#00875A]" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedText === 'nequi' ? 'Copiado' : 'Copiar'}</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200/80 pt-2">
                      <span className="text-slate-600">Titular de la cuenta:</span>
                      <span className="font-semibold text-[#0B2F64]">ICFES MASTER SAS / Eider Hurtado</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200/80 pt-2">
                      <span className="text-slate-600">Valor exacto a transferir:</span>
                      <span className="font-bold text-[#00875A] font-mono text-sm">$29.900 COP</span>
                    </div>
                  </div>
                )}

                {selectedMethod === 'daviplata' && (
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-600">Número Daviplata:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#0B2F64]">312 456 7890</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('3124567890', 'daviplata')}
                          className="px-2 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[11px] font-semibold flex items-center gap-1"
                        >
                          {copiedText === 'daviplata' ? <Check className="w-3 h-3 text-[#00875A]" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedText === 'daviplata' ? 'Copiado' : 'Copiar'}</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200/80 pt-2">
                      <span className="text-slate-600">Titular de la cuenta:</span>
                      <span className="font-semibold text-[#0B2F64]">ICFES MASTER SAS / Eider Hurtado</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200/80 pt-2">
                      <span className="text-slate-600">Valor exacto a transferir:</span>
                      <span className="font-bold text-[#00875A] font-mono text-sm">$29.900 COP</span>
                    </div>
                  </div>
                )}

                {selectedMethod === 'paypal' && (
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-600">Cuenta de destino PayPal:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#0B2F64]">pagos@icfesmaster.co</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('pagos@icfesmaster.co', 'paypal')}
                          className="px-2 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[11px] font-semibold flex items-center gap-1"
                        >
                          {copiedText === 'paypal' ? <Check className="w-3 h-3 text-[#00875A]" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedText === 'paypal' ? 'Copiado' : 'Copiar'}</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200/80 pt-2">
                      <span className="text-slate-600">Equivalente internacional:</span>
                      <span className="font-bold text-[#003087] font-mono text-sm">$7.99 USD</span>
                    </div>
                    <div className="border-t border-slate-200/80 pt-2 text-[11px] text-slate-500">
                      Acepta tarjetas de crédito Visa, MasterCard, American Express sin costo adicional.
                    </div>
                  </div>
                )}
              </div>

              {/* Formulario de Confirmación de Referencia */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700">
                  Número de comprobante o referencia de pago:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) => {
                      setPaymentReference(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder={
                      selectedMethod === 'nequi'
                        ? 'Ej: M-10928374 o código de aprobación'
                        : selectedMethod === 'daviplata'
                        ? 'Ej: Ref. 82390145'
                        : 'Ej: ID de transacción PayPal'
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2F64] focus:border-transparent transition-all font-mono"
                  />
                </div>

                {errorMessage && (
                  <p className="text-xs text-red-600 font-semibold">{errorMessage}</p>
                )}

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Ingresa los dígitos de la confirmación emitida por la aplicación al finalizar la transferencia.
                </p>

                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#00875A] hover:bg-[#007049] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirmar y Activar Suscripción</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Pantalla de Confirmación Exitosa */
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-200 text-center max-w-xl mx-auto space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-[#AFF2D4] text-[#00875A] flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[#00875A] uppercase tracking-wider bg-[#00875A]/10 px-3 py-1 rounded-full">
              Comprobante Recibido
            </span>
            <h3 className="text-2xl font-black text-[#0B2F64]">
              ¡Pago Notificado con Éxito!
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Hemos registrado satisfactoriamente tu número de comprobante:{' '}
              <span className="font-mono font-bold text-[#0B2F64] bg-slate-100 px-2 py-0.5 rounded-md">
                #{paymentReference}
              </span>
              . Tu cuenta <strong className="text-[#0B2F64]">Plan Pro Saber 11</strong> está siendo verificada y tus privilegios se activarán inmediatamente.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E1E7F0] text-left space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-2 text-[#00875A] font-bold">
              <Check className="w-4 h-4" />
              <span>Acceso ilimitado a simulacros activado</span>
            </div>
            <div className="flex items-center gap-2 text-[#00875A] font-bold">
              <Check className="w-4 h-4" />
              <span>Tutor Eider IA pedagógica habilitado</span>
            </div>
            <div className="flex items-center gap-2 text-[#00875A] font-bold">
              <Check className="w-4 h-4" />
              <span>Diagnósticos predictivos y percentil oficial</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-3 bg-[#00875A] hover:bg-[#007049] text-white font-bold rounded-xl text-sm shadow-md transition-all cursor-pointer"
            >
              Comenzar a Practicar Ahora
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setPaymentReference('');
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#0B2F64] hover:bg-[#09254F] text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              Realizar otra consulta
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  CreditCard,
  BookOpen,
  TrendingUp,
  Search,
  Users,
  Award,
  Sparkles,
  Clock,
  Eye,
  RefreshCw,
  Plus,
  DollarSign
} from 'lucide-react';
import { AreaType } from '../../domain/models/ExamTypes';
import { OFFICIAL_AREAS } from '../../data/ExamRepositoryImpl';
import masterConsoleImg from '../../assets/images/master_edtech_console_1792163360883.jpg';
import { supabaseService } from '../../services/supabaseService';

interface PendingPayment {
  id: string;
  studentName: string;
  method: 'Nequi' | 'Daviplata' | 'PayPal';
  amount: string;
  reference: string;
  timestamp: string;
}

// Todos los IDs y referencias comienzan con el número 1
const MOCK_PENDING_PAYMENTS: PendingPayment[] = [
  { id: '101', studentName: 'Camila González', method: 'Nequi', amount: '$29.900 COP', reference: '101-Neq-89321', timestamp: '10:05 am' },
  { id: '102', studentName: 'Mateo Osorio', method: 'Daviplata', amount: '$29.900 COP', reference: '102-Dav-45102', timestamp: '10:02 am' },
  { id: '103', studentName: 'Sofía Morales', method: 'PayPal', amount: '$29.900 COP', reference: '103-PAY-XYZ789', timestamp: '09:58 am' },
  { id: '104', studentName: 'Luis Sánchez', method: 'Nequi', amount: '$29.900 COP', reference: '104-Neq-90123', timestamp: '09:55 am' },
];

interface AdminQuestionItem {
  id: string;
  area: AreaType;
  topic: string;
  prompt: string;
  optionsCount: number;
  correctAnswer: string;
  difficulty: 'Fácil' | 'Media' | 'Alta';
}

const INITIAL_QUESTIONS: AdminQuestionItem[] = [
  {
    id: 'mat-01',
    area: AreaType.MATEMATICAS,
    topic: 'Funciones y Gráficas',
    prompt: '¿Cuál es el valor del vértice de la parábola f(x) = x² - 4x + 3?',
    optionsCount: 4,
    correctAnswer: 'B (2, -1)',
    difficulty: 'Media',
  },
  {
    id: 'lec-01',
    area: AreaType.LECTURA_CRITICA,
    topic: 'Tipología Textual y Postura',
    prompt: 'Identifique la tesis central del autor en el ensayo sobre tecnología y atención...',
    optionsCount: 4,
    correctAnswer: 'A (La distracción digital)',
    difficulty: 'Alta',
  },
  {
    id: 'soc-01',
    area: AreaType.SOCIALES_CIUDADANAS,
    topic: 'Constitución y Mecanismos de Participación',
    prompt: '¿Qué mecanismo constitucional procede ante la vulneración del derecho fundamental a la salud?',
    optionsCount: 4,
    correctAnswer: 'B (Acción de Tutela)',
    difficulty: 'Media',
  },
  {
    id: 'cie-01',
    area: AreaType.CIENCIAS_NATURALES,
    topic: 'Cinemática y Dinámica',
    prompt: 'Un móvil viaja a velocidad constante de 20 m/s y desacelera a 4 m/s²...',
    optionsCount: 4,
    correctAnswer: 'C (5 segundos)',
    difficulty: 'Fácil',
  },
  {
    id: 'ing-01',
    area: AreaType.INGLES,
    topic: 'Vocabulario y Contextos Cotidianos',
    prompt: 'Where can you see this notice: "Please do not feed the animals"?',
    optionsCount: 4,
    correctAnswer: 'A (At a zoo)',
    difficulty: 'Fácil',
  },
];

interface AdminDashboardScreenProps {
  onBack?: () => void;
  onNavigateModule?: (module: string) => void;
}

export function AdminDashboardScreen({ onBack, onNavigateModule }: AdminDashboardScreenProps = {}) {
  const [activeTab, setActiveTab] = useState<'payments' | 'questions' | 'stats'>('payments');
  const [payments, setPayments] = useState<PendingPayment[]>(MOCK_PENDING_PAYMENTS);
  const [approvedCount, setApprovedCount] = useState<number>(21);
  const [questions] = useState<AdminQuestionItem[]>(INITIAL_QUESTIONS);
  const [notification, setNotification] = useState<string | null>(null);
  const [questionSearch, setQuestionSearch] = useState('');
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>('all');
  const [showConsoleModal, setShowConsoleModal] = useState(false);

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const handleApprovePayment = (id: string, studentName: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
    setApprovedCount((prev) => prev + 1);
    supabaseService.updatePaymentStatus(id, 'approved').catch(() => {});
    showNotice(`¡Licencia Pro activada con éxito para el estudiante ${studentName}!`);
  };

  const handleRejectPayment = (id: string, studentName: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
    supabaseService.updatePaymentStatus(id, 'rejected').catch(() => {});
    showNotice(`Se ha rechazado la solicitud de activación de ${studentName}.`);
  };

  const handleResetPayments = () => {
    setPayments(MOCK_PENDING_PAYMENTS);
    showNotice('Se han restaurado los pagos pendientes originales iniciados en 1.');
  };

  const handleAddSamplePayment = () => {
    const nextNum = 100 + payments.length + 5;
    const methods: ('Nequi' | 'Daviplata' | 'PayPal')[] = ['Nequi', 'Daviplata', 'PayPal'];
    const selectedMethod = methods[Math.floor(Math.random() * methods.length)];
    const names = ['Mariana Restrepo', 'Santiago Jaramillo', 'Juliana Vega', 'David Caicedo'];
    const chosenName = names[Math.floor(Math.random() * names.length)];

    const newPayment: PendingPayment = {
      id: `${nextNum}`,
      studentName: chosenName,
      method: selectedMethod,
      amount: '$29.900 COP',
      reference: `${nextNum}-${selectedMethod.slice(0, 3)}-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    };

    setPayments((prev) => [newPayment, ...prev]);
    showNotice(`Nuevo pago #${newPayment.id} reportado por ${chosenName}.`);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.prompt.toLowerCase().includes(questionSearch.toLowerCase()) ||
      q.topic.toLowerCase().includes(questionSearch.toLowerCase());
    const matchesArea = selectedAreaFilter === 'all' || q.area === selectedAreaFilter;
    return matchesSearch && matchesArea;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 flex flex-col min-h-[calc(100vh-120px)]">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 bg-[#0B2F64] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 text-sm font-semibold max-w-md"
          >
            <div className="w-8 h-8 rounded-xl bg-[#AFF2D4] text-[#0B2F64] flex items-center justify-center shrink-0 font-bold">
              <CheckCircle2 className="w-5 h-5 text-[#00875A]" />
            </div>
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encabezado del Dashboard Master */}
      <div className="bg-[#0B2F64] text-white p-6 rounded-3xl shadow-sm border border-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-[#AFF2D4] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
              Panel Master EdTech · Versión H 2.5
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-2">
            Consola de Administración de Eider Hurtado
          </h2>
          <p className="text-xs text-blue-200 mt-1 max-w-xl leading-relaxed">
            Valida los pagos reportados por transferencias (Nequi / Daviplata / PayPal) para habilitar el acceso Pro instantáneo.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 p-1 bg-blue-950 rounded-2xl border border-blue-800 shrink-0">
            <div className="flex items-center gap-3 p-3 text-center">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                ACTIVACIONES PRO PENDIENTES
              </span>
              <span className="text-3xl sm:text-4xl font-black text-emerald-400">
                {payments.length}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowConsoleModal(true)}
            className="px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-[#AFF2D4] hover:bg-[#92ebc3] text-[#0B2F64] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            title="Ver Consola Física EdTech"
          >
            <Sparkles className="w-4 h-4 text-emerald-800" />
            <span className="hidden sm:inline">Hardware H 2.5</span>
          </button>

          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-2 border border-white/10 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
          )}
        </div>
      </div>

      {/* Navegación por Pestañas */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'payments'
              ? 'bg-[#0B2F64] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Validación de Pagos</span>
          {payments.length > 0 && (
            <span className="bg-[#BA1A1A] text-white text-[10px] px-2 py-0.5 rounded-full font-black">
              {payments.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'questions'
              ? 'bg-[#0B2F64] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Gestor de Reactivos ({questions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'stats'
              ? 'bg-[#0B2F64] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Métricas y Conversión</span>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleAddSamplePayment}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#AFF2D4] hover:bg-[#92ebc3] text-[#0B2F64] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simular Pago</span>
          </button>
          <button
            onClick={handleResetPayments}
            className="p-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all cursor-pointer"
            title="Restablecer lista original"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* PESTAÑA 1: SECCIÓN DE VALIDACIÓN DE PAGOS */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden flex flex-col flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <h3 className="text-lg font-bold text-[#0B2F64]">
              Reportes de Transferencia Móvil y Digital (IDs Iniciados en 1)
            </h3>
            <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-[#0B2F64] rounded-full border border-blue-100 w-fit">
              Pasarelas: Nequi · Daviplata · PayPal
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            <AnimatePresence>
              {payments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-slate-500 py-12 text-sm space-y-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#00875A] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <p className="font-bold text-[#0B2F64] text-base">
                    🎉 ¡Excelente! No hay pagos pendientes por verificar.
                  </p>
                  <p className="text-xs text-slate-400">
                    Todas las solicitudes han sido gestionadas con éxito.
                  </p>
                  <button
                    onClick={handleResetPayments}
                    className="px-4 py-2 bg-[#0B2F64] text-white text-xs font-bold rounded-xl hover:bg-[#08234a] transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restablecer Casos de Prueba</span>
                  </button>
                </motion.div>
              ) : (
                payments.map((payment, index) => (
                  <motion.div
                    key={payment.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[#F7F9FC] p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white bg-[#0B2F64] shrink-0 shadow-sm">
                        {payment.id}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-[#0B2F64]">{payment.studentName}</h4>
                        <p className="text-xs text-slate-500">
                          Reportó pago por{' '}
                          <strong className="text-[#0B2F64]">{payment.method}</strong> · {payment.timestamp}
                        </p>
                        <p className="font-mono text-[10px] text-slate-400 mt-1">
                          Ref: <span className="text-[#0B2F64] font-bold">{payment.reference}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap sm:flex-row items-center gap-3 w-full sm:w-auto justify-end sm:justify-start">
                      <span className="font-black text-xl text-emerald-700 px-4 py-1.5 bg-emerald-100 rounded-full">
                        {payment.amount}
                      </span>
                      <button
                        onClick={() => handleApprovePayment(payment.id, payment.studentName)}
                        className="px-5 py-3 rounded-xl bg-[#00875A] text-white font-bold text-sm shadow-sm hover:bg-[#007049] transition-all cursor-pointer"
                      >
                        Aprobar y Activar
                      </button>
                      <button
                        onClick={() => handleRejectPayment(payment.id, payment.studentName)}
                        className="px-5 py-3 rounded-xl text-sm font-bold bg-white text-slate-600 hover:bg-slate-100 transition-all border border-slate-200 cursor-pointer"
                      >
                        Rechazar
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: BANCO DE PREGUNTAS */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por enunciado o competencia temática..."
                value={questionSearch}
                onChange={(e) => setQuestionSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2F64]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setSelectedAreaFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedAreaFilter === 'all'
                    ? 'bg-[#0B2F64] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todas las Áreas
              </button>
              {OFFICIAL_AREAS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAreaFilter(a.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedAreaFilter === a.id
                      ? 'bg-[#0B2F64] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {a.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#0B2F64]/40 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-[#DCE4F9] text-[#0B2F64] px-2.5 py-1 rounded-lg">
                      {q.id.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {q.area}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{q.topic}</span>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                      q.difficulty === 'Alta'
                        ? 'bg-rose-100 text-rose-700'
                        : q.difficulty === 'Media'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    Dificultad: {q.difficulty}
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-800">{q.prompt}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[#00875A] font-bold">
                    Respuesta Correcta: {q.correctAnswer}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px]">{q.optionsCount} Opciones tipo ICFES</span>
                    <button
                      onClick={() => showNotice(`Vista previa del reactivo ${q.id} activada`)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[#0B2F64] font-bold rounded-lg text-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA 3: MÉTRICAS Y CONVERSIÓN */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold text-slate-500 uppercase">Estudiantes Activos</span>
                <Users className="w-5 h-5 text-[#0B2F64]" />
              </div>
              <div className="text-3xl font-black text-[#0B2F64] mt-2">1.428</div>
              <span className="text-xs text-[#00875A] font-bold">+18% esta semana</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold text-slate-500 uppercase">Tasa Conversión Pro</span>
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-[#00875A] mt-2">24.6%</div>
              <span className="text-xs text-slate-500">Nequi es el método preferido (68%)</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold text-slate-500 uppercase">Promedio Saber 11</span>
                <Award className="w-5 h-5 text-[#BA1A1A]" />
              </div>
              <div className="text-3xl font-black text-[#BA1A1A] mt-2">362 / 500</div>
              <span className="text-xs text-[#00875A] font-bold">+44 pts vs. media nacional</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold text-slate-500 uppercase">Preguntas Resueltas</span>
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-3xl font-black text-[#0B2F64] mt-2">48.950</div>
              <span className="text-xs text-slate-500">Simulacros y banco interactivo</span>
            </div>
          </div>

          {/* Desglose por Área */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-[#0B2F64] text-lg">Rendimiento por Competencias Nacionales</h3>
            <div className="space-y-3">
              {[
                { area: 'Matemáticas', score: 72, color: 'bg-emerald-500' },
                { area: 'Lectura Crítica', score: 78, color: 'bg-blue-600' },
                { area: 'Sociales y Ciudadanas', score: 69, color: 'bg-amber-500' },
                { area: 'Ciencias Naturales', score: 65, color: 'bg-rose-500' },
                { area: 'Inglés', score: 81, color: 'bg-indigo-500' },
              ].map((item) => (
                <div key={item.area} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{item.area}</span>
                    <span>{item.score}/100</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de la Consola Física EdTech */}
      <AnimatePresence>
        {showConsoleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200"
            >
              <div className="p-5 bg-gradient-to-r from-[#0B2F64] via-[#123E7E] to-[#1E4E9E] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-amber-300">
                    IM
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base">Consola Física EdTech · ICFES MASTER H 2.5</h3>
                    <p className="text-xs text-blue-200">Hardware customizado con acabado zafiro y controles dorados</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowConsoleModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm font-bold transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner group">
                  <img
                    src={masterConsoleImg}
                    alt="Consola Master EdTech ICFES MASTER H 2.5"
                    className="w-full h-auto object-cover rounded-2xl"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-[11px] font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Consola Operativa Eider Hurtado · Validación Directa Nequi / Daviplata / PayPal
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-[#0B2F64] block">Validación de Pagos</span>
                    <span className="text-slate-600 text-[11px]">Nequi, Daviplata y PayPal integrados con confirmación en vivo.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-[#0B2F64] block">Manómetro y Contador</span>
                    <span className="text-slate-600 text-[11px]">Medidor con dial dorado y marcador digital en tiempo real ({payments.length}).</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-[#0B2F64] block">Tutor Eider Asesoría</span>
                    <span className="text-slate-600 text-[11px]">Puerto con llave grabada para guía continua y refuerzo Saber 11.</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setShowConsoleModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#0B2F64] text-white text-xs font-bold hover:bg-[#08234a] transition-all cursor-pointer"
                >
                  Cerrar Vista
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

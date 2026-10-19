import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  FileText,
  GraduationCap,
  Home,
  Layers,
  Play,
  Sparkles,
  Wifi,
  Battery,
  AlertTriangle,
  ShieldCheck,
  User,
  LogOut,
  Share2,
} from 'lucide-react';
import { handleShareApp } from './lib/shareApp';
import { AreaType, ExamMode, ExamSession } from './domain/models/ExamTypes';
import { examRepository } from './data/ExamRepositoryImpl';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { M3TopAppBar } from './presentation/components/m3/M3TopAppBar';
import { M3NavigationBar, M3NavItem } from './presentation/components/m3/M3NavigationBar';
import { DeviceFrameToggle } from './presentation/components/m3/DeviceFrameToggle';
import { HomeScreen } from './presentation/screens/HomeScreen';
import { SimulacroScreen } from './presentation/screens/SimulacroScreen';
import { InteractiveQuizScreen } from './presentation/screens/InteractiveQuizScreen';
import { FormulasScreen } from './presentation/screens/FormulasScreen';
import { StatsScreen } from './presentation/screens/StatsScreen';
import { AiTutorScreen } from './presentation/screens/AiTutorScreen';
import { ArchitectureScreen } from './presentation/screens/ArchitectureScreen';
import { CheckoutScreen } from './presentation/screens/CheckoutScreen';
import { ErrorReviewScreen } from './presentation/screens/ErrorReviewScreen';
import { AdminDashboardScreen } from './presentation/screens/AdminDashboardScreen';
import { MasterProScreen } from './presentation/screens/MasterProScreen';
import { ExamSimulatorScreen } from './presentation/screens/ExamSimulatorScreen';
import { AdmissionPrognosisScreen } from './presentation/screens/AdmissionPrognosisScreen';
import { GamificationScreen } from './presentation/screens/GamificationScreen';
import { AuthScreen } from './presentation/screens/AuthScreen';
import { PWAInstallButton } from './presentation/components/pwa/PWAInstallButton';
import { OfflineIndicator } from './presentation/components/pwa/OfflineIndicator';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [history, setHistory] = useState<ExamSession[]>(() => examRepository.getExamHistory());
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | undefined>(undefined);
  const [session, setSession] = useState<Session | null>(null);
  const [adminBypassUser, setAdminBypassUser] = useState<any>(null);
  const currentUser = adminBypassUser || session?.user || null;
  const hasValidSession = Boolean(session || adminBypassUser);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Active simulacro parameters
  const [simulacroMode, setSimulacroMode] = useState<ExamMode>('simulacro_completo');
  const [practiceArea, setPracticeArea] = useState<AreaType | undefined>(undefined);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const refreshHistory = () => {
    setHistory(examRepository.getExamHistory());
  };

  const handleNavigateModule = (module: string) => {
    setCurrentTab(module);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartSimulacro = (mode: ExamMode, area?: AreaType) => {
    setSimulacroMode(mode);
    setPracticeArea(area);
    setCurrentTab('simulacro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPractice = (area?: AreaType) => {
    setPracticeArea(area);
    setCurrentTab('cuestionario');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenInteractiveQuiz = (area?: AreaType) => {
    setPracticeArea(area);
    setCurrentTab('cuestionario');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isMasterAdmin =
    currentUser?.email === 'eiderhurtado82@gmail.com' ||
    currentUser?.email === 'tu-correo-eiderhurtado82@gmail.com' ||
    currentUser?.email === 'eider@educacity.com';

  const navItems: M3NavItem[] = [
    {
      id: 'home',
      label: 'Inicio',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'cuestionario',
      label: 'Práctica Guiada',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: 'simulacro',
      label: 'Simulacro',
      icon: <Play className="w-5 h-5" />,
    },
    {
      id: 'formulas',
      label: 'Fórmulas',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'stats',
      label: 'Diagnóstico',
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      id: 'tutor',
      label: 'Tutor Eider',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: 'errores',
      label: 'Banco Errores',
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    // El módulo de Arquitectura solo se muestra si eres el administrador
    ...(isMasterAdmin
      ? [
          {
            id: 'arquitectura',
            label: 'Arquitectura',
            icon: <Layers className="w-5 h-5" />,
          },
        ]
      : []),
  ];

  // Screen routing
  const renderScreen = () => {
    // Si intenta entrar a zonas protegidas sin iniciar sesión
    const protectedScreens = [
      'simulacro',
      'simulador',
      'simulador_real',
      'evaluacion',
      'examsimulator',
      'tutor',
      'errores',
      'repaso',
      'practica',
      'cuestionario',
    ];

    if (!hasValidSession && protectedScreens.includes(currentTab)) {
      return (
        <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-center space-y-6 animate-in fade-in">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner">
            🔒
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-[#0B2F64]">Acceso Exclusivo para Estudiantes</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Para acceder a los simulacros oficiales, el Tutor IA y el Banco de Errores, debes iniciar sesión o crear tu cuenta en ICFES MASTER H 2.5.
            </p>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => handleNavigateModule('auth')}
              className="w-full py-3.5 bg-[#0B2F64] text-white font-bold rounded-xl text-sm shadow-sm hover:bg-blue-900 transition-all cursor-pointer"
            >
              Iniciar Sesión / Registrarse
            </button>
            <button
              onClick={() => handleNavigateModule('home')}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer block w-full py-1.5"
            >
              Volver a Inicio
            </button>
          </div>
        </div>
      );
    }

    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            onStartExam={() => handleStartSimulacro('simulacro_completo')}
            onStartExpress={() => handleStartSimulacro('simulacro_express')}
            onStartSimulacro={handleStartSimulacro}
            onOpenPractice={handleOpenPractice}
            onOpenInteractiveQuiz={handleOpenInteractiveQuiz}
            onOpenFormulas={() => handleNavigateModule('formulas')}
            onOpenStats={() => handleNavigateModule('stats')}
            onOpenAiTutor={() => {
              setTutorInitialPrompt(undefined);
              handleNavigateModule('tutor');
            }}
            onOpenCheckout={() => handleNavigateModule('checkout')}
            onOpenErrors={() => handleNavigateModule('errores')}
            onOpenAdmin={() => handleNavigateModule('admin')}
            onOpenMasterPro={() => handleNavigateModule('masterpro')}
            onOpenExamSimulator={() => handleNavigateModule('simulador_real')}
            onOpenAuth={() => handleNavigateModule('auth')}
            onOpenArchitecture={() => handleNavigateModule('arquitectura')}
            currentUser={currentUser}
            history={history}
          />
        );
      case 'cuestionario':
      case 'practica':
        return (
          <InteractiveQuizScreen
            onBackToHome={() => handleNavigateModule('home')}
            onNavigateModule={handleNavigateModule}
          />
        );
      case 'simulacro':
        return (
          <SimulacroScreen
            mode={simulacroMode}
            areaFilter={practiceArea}
            onFinishSimulacro={(score) => {
              refreshHistory();
            }}
            onExit={() => {
              refreshHistory();
              handleNavigateModule('home');
            }}
            onSessionFinished={refreshHistory}
            onNavigateModule={handleNavigateModule}
          />
        );
      case 'formulas':
        return <FormulasScreen onNavigateModule={handleNavigateModule} />;
      case 'stats':
        return (
          <StatsScreen
            history={history}
            onNavigateModule={handleNavigateModule}
            onStartSimulacro={() => handleStartSimulacro('simulacro_completo')}
          />
        );
      case 'tutor':
        return (
          <AiTutorScreen
            onNavigateModule={handleNavigateModule}
            initialPrompt={tutorInitialPrompt}
          />
        );
      case 'errores':
      case 'repaso':
        return (
          <ErrorReviewScreen
            onBack={() => handleNavigateModule('home')}
            onNavigateModule={handleNavigateModule}
            onOpenAiTutor={(prompt) => {
              setTutorInitialPrompt(prompt);
              handleNavigateModule('tutor');
            }}
            history={history}
          />
        );
      case 'checkout':
      case 'suscripcion':
        return <CheckoutScreen onBack={() => handleNavigateModule('home')} />;
      case 'admin':
      case 'dashboard':
      case 'admin-console':
        return (
          <AdminDashboardScreen
            user={currentUser}
            onBack={() => handleNavigateModule('home')}
            onNavigateModule={handleNavigateModule}
          />
        );
      case 'masterpro':
      case 'alto_rendimiento':
        return (
          <MasterProScreen
            onBack={() => handleNavigateModule('home')}
            onNavigateModule={handleNavigateModule}
          />
        );
      case 'simulador_real':
      case 'evaluacion':
      case 'examsimulator':
        return (
          <ExamSimulatorScreen
            onBack={() => handleNavigateModule('masterpro')}
            onNavigateModule={handleNavigateModule}
          />
        );
      case 'admision':
      case 'pronostico':
      case 'semaforo':
        return (
          <AdmissionPrognosisScreen
            onBack={() => handleNavigateModule('masterpro')}
            onNavigateModule={handleNavigateModule}
          />
        );
      case 'logros':
      case 'gamificacion':
      case 'xp':
        return (
          <GamificationScreen
            onBack={() => handleNavigateModule('masterpro')}
            onNavigateModule={handleNavigateModule}
          />
        );
      case 'auth':
      case 'login':
      case 'registro':
        return (
          <AuthScreen
            onLoginSuccess={(userObj) => {
              if (userObj) {
                setAdminBypassUser(userObj);
              }
              handleNavigateModule('home');
            }}
            onBack={() => handleNavigateModule('home')}
          />
        );
      case 'arquitectura':
        if (!isMasterAdmin) {
          return (
            <div className="max-w-md mx-auto mt-20 text-center p-8 bg-red-50 rounded-3xl border border-red-200 space-y-4 shadow-sm animate-in fade-in">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner">
                <Layers className="w-7 h-7 text-red-600" />
              </div>
              <h2 className="text-xl font-black text-red-700">Módulo Restringido</h2>
              <p className="text-xs text-red-600 leading-relaxed">
                El módulo de Arquitectura es exclusivo para el administrador del sistema (eiderhurtado82@gmail.com).
              </p>
              <button 
                onClick={() => handleNavigateModule('home')}
                className="px-6 py-2.5 bg-[#0B2F64] text-white text-xs font-bold rounded-xl hover:bg-[#071f43] transition-all cursor-pointer shadow-sm"
              >
                Volver al Inicio
              </button>
            </div>
          );
        }
        return <ArchitectureScreen />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#191C1E] flex flex-col items-center">
      {/* Device wrapper: if isMobileFrame is true, render an authentic Android Pixel frame */}
      <div
        className={`w-full transition-all duration-300 flex flex-col ${
          isMobileFrame
            ? 'max-w-[430px] my-6 min-h-[900px] bg-white rounded-[44px] shadow-2xl border-[10px] border-[#1E293B] overflow-hidden relative'
            : 'max-w-6xl min-h-screen'
        }`}
      >
        {/* Android Phone Status Bar (Visible in Mobile Frame Mode) */}
        {isMobileFrame && (
          <div className="h-8 bg-[#F7F9FC] px-6 flex items-center justify-between text-xs font-semibold text-[#191C1E] select-none border-b border-[#E1E7F0]/40 shrink-0">
            <span className="font-mono text-[11px]">12:45</span>
            {/* Camera Punch-Hole Mockup */}
            <div className="w-3.5 h-3.5 rounded-full bg-black/80 mx-auto" />
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-[10px] font-bold">5G</span>
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Material 3 Top App Bar with Desktop Navigation Tabs */}
        <M3TopAppBar
          title="ICFES MASTER"
          subtitle="Saber 11 · Colombia"
          isScrolled={isScrolled}
          navigationIcon={
            <div className="w-8 h-8 rounded-lg bg-[#0B2F64] text-white flex items-center justify-center font-black text-xs shadow-xs">
              IM
            </div>
          }
          onNavigationClick={() => handleNavigateModule('home')}
          navItems={navItems.map((n) => ({ id: n.id, label: n.label, icon: n.icon }))}
          activeNavId={currentTab === 'practica' ? 'cuestionario' : currentTab}
          onSelectNav={handleNavigateModule}
          actions={
            <div className="flex items-center gap-2">
              {currentUser ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-[#0B2F64]">
                  <User className="w-3.5 h-3.5 text-[#00875A]" />
                  <span className="max-w-[100px] truncate">
                    {currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setSession(null);
                      setAdminBypassUser(null);
                    }}
                    title="Cerrar sesión"
                    className="p-1 hover:text-red-600 transition-colors cursor-pointer ml-1"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNavigateModule('auth')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0B2F64] text-xs font-bold transition-all cursor-pointer border border-slate-200"
                >
                  <User className="w-3.5 h-3.5 text-[#00875A]" />
                  <span>Acceder</span>
                </button>
              )}
              {/* Validación en la interfaz para Administrador Master */}
              {(currentUser?.email === 'tu-correo-eiderhurtado82@gmail.com' ||
                currentUser?.email === 'eiderhurtado82@gmail.com' ||
                currentUser?.email === 'eider@educacity.com') && (
                <button
                  onClick={() => handleNavigateModule('admin-console')}
                  title="Consola Master EdTech (Solo Admin)"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  <span>🛡️ Consola Master</span>
                </button>
              )}
              <button
                onClick={() => handleNavigateModule('checkout')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#00875A] to-[#00A86B] text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Plan Pro</span>
              </button>
              <button
                onClick={handleShareApp}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                title="Compartir plataforma"
              >
                📤 Compartir
              </button>
              <PWAInstallButton />
              <DeviceFrameToggle
                isMobileFrame={isMobileFrame}
                onToggle={() => setIsMobileFrame(!isMobileFrame)}
              />
            </div>
          }
        />

        {/* Main Content Area with Animated Transitions */}
        <main className="flex-1 px-4 sm:px-6 pt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as const }}
              className="w-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Android Gesture Navigation Bar Pill (Visible in Mobile Frame) */}
        {isMobileFrame && (
          <div className="fixed bottom-1 left-0 right-0 flex justify-center z-50 pointer-events-none pb-1">
            <div className="w-32 h-1 bg-black/40 rounded-full" />
          </div>
        )}

        {/* Material 3 Bottom Navigation Bar */}
        <M3NavigationBar
          items={navItems}
          activeId={currentTab === 'practica' ? 'cuestionario' : currentTab}
          onSelect={handleNavigateModule}
          className={isMobileFrame ? 'absolute bottom-0' : ''}
        />

        {/* PWA Offline Notification Indicator */}
        <OfflineIndicator />
      </div>
    </div>
  );
}

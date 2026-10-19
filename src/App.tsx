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
} from 'lucide-react';
import { AreaType, ExamMode, ExamSession } from './domain/models/ExamTypes';
import { examRepository } from './data/ExamRepositoryImpl';
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
import { PWAInstallButton } from './presentation/components/pwa/PWAInstallButton';
import { OfflineIndicator } from './presentation/components/pwa/OfflineIndicator';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [history, setHistory] = useState<ExamSession[]>(() => examRepository.getExamHistory());
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | undefined>(undefined);

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
    {
      id: 'arquitectura',
      label: 'Arquitectura',
      icon: <Layers className="w-5 h-5" />,
    },
  ];

  // Screen routing
  const renderScreen = () => {
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
        return (
          <AdminDashboardScreen
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
      case 'arquitectura':
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
              <button
                onClick={() => handleNavigateModule('admin')}
                title="Consola Master EdTech"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0B2F64] text-xs font-bold transition-all cursor-pointer border border-slate-200"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#0B2F64]" />
                <span>Admin</span>
              </button>
              <button
                onClick={() => handleNavigateModule('checkout')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#00875A] to-[#00A86B] text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Plan Pro</span>
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

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Bot } from 'lucide-react';
import { handleSpeak, stopSpeak } from '../../lib/speech';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const PRESET_PROMPTS = [
  '¿Por qué se descarta la opción incorrecta en física?',
  'Explícame cómo resolver problemas de proporciones',
  'Dame un tip clave para Lectura Crítica',
  '¿Qué evalúa el ICFES en competencias ciudadanas?'
];

interface AiTutorScreenProps {
  onNavigateModule?: (module: string) => void;
  initialPrompt?: string;
}

export function AiTutorScreen({ onNavigateModule, initialPrompt }: AiTutorScreenProps = {}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: '¡Hola! Soy Eider, tu tutor personal de inteligencia artificial en ICFES MASTER. Estoy aquí para explicarte conceptos complejos, resolver tus dudas sobre preguntas difíciles y darte estrategias de descarte para la prueba Saber 11. ¿Qué materia o tema repasamos hoy?',
      timestamp: '12:00 p. m.'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialPromptSent = useRef(false);

  useEffect(() => {
    return () => {
      stopSpeak();
    };
  }, []);

  useEffect(() => {
    if (initialPrompt && !initialPromptSent.current) {
      initialPromptSent.current = true;
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    // Simulación de respuesta pedagógica personalizada de Eider
    setTimeout(() => {
      let aiReply = 'Entendido. Analicemos este punto clave para asegurar el mejor puntaje en tu prueba Saber 11.';
      const lower = text.toLowerCase();
      if (lower.includes('física') || lower.includes('incorrecta')) {
        aiReply = 'Para triunfar en física, recuerda revisar siempre las unidades del Sistema Internacional y separar los datos conocidos antes de aplicar fórmulas como F = m·a.';
      } else if (lower.includes('lectura') || lower.includes('tip')) {
        aiReply = 'Un consejo de oro: en Lectura Crítica la respuesta correcta siempre debe desprenderse estrictamente del texto guía, sin asumir supuestos externos.';
      } else if (lower.includes('proporciones')) {
        aiReply = 'Los problemas de proporciones se resuelven planteando con claridad las magnitudes directamente o inversamente proporcionales. ¡Vamos paso a paso!';
      } else if (lower.includes('ciudadanas') || lower.includes('sociales')) {
        aiReply = 'En Competencias Ciudadanas, el ICFES evalúa el multiperspectivismo: comprender un conflicto desde los derechos, deberes y la Constitución de 1991.';
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 flex flex-col h-[calc(100vh-120px)]">
      {/* Encabezado con el nombre Tutor Eider */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#DCE4F9] text-[#0B2F64] flex items-center justify-center font-black text-lg">
            🤖
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#00875A] uppercase tracking-wider">Asistente Pedagógico IA</span>
            <h2 className="text-base font-bold text-[#0B2F64]">Tutor Eider</h2>
          </div>
        </div>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
          ● Activo
        </span>
      </div>

      {/* Contenedor del Chat (Mensajes + Barra de Entrada Unidos) */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 overflow-y-auto flex flex-col space-y-4">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#0B2F64] text-white rounded-br-none'
                      : 'bg-[#F7F9FC] text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  
                  {msg.sender === 'ai' ? (
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400">Tutor Eider · Explicación Pedagógica</span>
                      
                      <button
                        onClick={() => {
                          if (speakingId === msg.id) {
                            stopSpeak();
                            setSpeakingId(null);
                          } else {
                            setSpeakingId(msg.id);
                            handleSpeak(msg.text);
                          }
                        }}
                        className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-[#00875A] hover:bg-emerald-100 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        title="Escuchar explicación en voz alta"
                      >
                        {speakingId === msg.id ? '⏹️ Detener' : '🔊 Escuchar'}
                      </button>
                    </div>
                  ) : (
                    <span className="block text-[10px] mt-1 text-right text-blue-200">
                      {msg.timestamp}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#F7F9FC] border border-slate-200 p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                <span className="w-2 h-2 bg-[#0B2F64] rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-[#0B2F64] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-[#0B2F64] rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Barra de Entrada de Texto integrada directamente debajo del chat */}
        <div className="bg-[#F7F9FC] p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 shrink-0">
          <input
            type="text"
            placeholder="Escribe tu duda sobre cualquier pregunta o tema..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={() => handleSendMessage()}
            className="px-5 py-2.5 rounded-xl bg-[#00875A] text-white font-bold text-sm shadow-sm hover:bg-[#007049] transition-all cursor-pointer"
          >
            Enviar
          </button>
        </div>
      </div>

      {/* Preguntas Rápidas situadas abajo de todo */}
      <div className="flex gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        {PRESET_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap bg-[#DCE4F9] text-[#0B2F64] hover:bg-slate-200 transition-all border border-transparent shadow-sm cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

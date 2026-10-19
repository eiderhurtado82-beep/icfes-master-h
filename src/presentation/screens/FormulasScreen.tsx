import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModuleNavigationHub, MainModuleId } from '../components/m3/ModuleNavigationHub';

export interface FormulaItem {
  id: string;
  area: 'Matemáticas' | 'Ciencias Naturales' | 'Sociales y Ciudadanas' | 'Lectura Crítica' | 'Inglés';
  title: string;
  formulaOrConcept: string;
  description: string;
  examTip: string;
}

export const FORMULAS_DATA: FormulaItem[] = [
  {
    id: 'f-1',
    area: 'Matemáticas',
    title: 'Teorema de Pitágoras y Triángulos Notables',
    formulaOrConcept: 'a² + b² = c² (Triángulos rectángulos)',
    description: 'Relación fundamental en geometría euclidiana entre los catetos y la hipotenusa.',
    examTip: 'Identifica siempre los triángulos 3-4-5 y 5-12-13 para resolver problemas de distancias sin cálculo largo.',
  },
  {
    id: 'f-2',
    area: 'Matemáticas',
    title: 'Probabilidad Simple y Compuesta',
    formulaOrConcept: 'P(A) = Casos Favorables / Casos Posibles',
    description: 'Medida de la frecuencia con la que se obtiene un resultado al realizar un experimento aleatorio.',
    examTip: 'En preguntas del ICFES, recuerda que la suma de probabilidades de eventos excluyentes siempre es igual a 1.',
  },
  {
    id: 'f-3',
    area: 'Ciencias Naturales',
    title: 'Segunda Ley de Newton (Dinámica)',
    formulaOrConcept: 'F = m · a (Fuerza = Masa × Aceleración)',
    description: 'Establece que la aceleración de un objeto es directamente proporcional a la fuerza neta aplicada.',
    examTip: 'Si la fuerza es constante pero la masa se duplica, la aceleración se reduce exactamente a la mitad.',
  },
  {
    id: 'f-4',
    area: 'Ciencias Naturales',
    title: 'Concentración Solución (% m/m)',
    formulaOrConcept: '% m/m = (Masa de Soluto / Masa Total de Solución) · 100',
    description: 'Porcentaje de masa de soluto presente en una cantidad determinada de solución acuosa.',
    examTip: 'No olvides sumar la masa del soluto más la del solvente para obtener la masa total en el denominador.',
  },
  {
    id: 'f-5',
    area: 'Sociales y Ciudadanas',
    title: 'Acción de Tutela (Art. 86 Constitución 1991)',
    formulaOrConcept: 'Protección inmediata de Derechos Fundamentales',
    description: 'Mecanismo judicial rápido y preferente ante la vulneración o amenaza de derechos como la vida y la salud.',
    examTip: 'La tutela procede contra autoridades públicas y, en casos específicos, contra particulares (EPS, colegios).',
  },
  {
    id: 'f-6',
    area: 'Inglés',
    title: 'Conectores de Contraste (Linking Words)',
    formulaOrConcept: 'However, Although, Despite, In spite of',
    description: 'Expresiones clave para relacionar ideas opuestas en textos argumentativos y de comprensión lectora.',
    examTip: 'Recuerda que "Despite" y "In spite of" van seguidos de un sustantivo o gerundio (-ing), no de una oración completa.',
  },
  {
    id: 'f-7',
    area: 'Matemáticas',
    title: 'Vértice de la Parábola y Optimización',
    formulaOrConcept: 'x_v = -b / (2a)  |  y_v = f(x_v)',
    description: 'Permite encontrar valores máximos o mínimos en funciones cuadráticas de costos, ingresos o trayectorias parabólicas.',
    examTip: 'Cuando una pregunta del ICFES pregunte por "el tiempo de altura máxima" o "la utilidad máxima", calcula la coordenada x del vértice.',
  },
  {
    id: 'f-8',
    area: 'Ciencias Naturales',
    title: 'Conservación de la Energía Mecánica',
    formulaOrConcept: 'E_m = E_cinética + E_potencial = ½·m·v² + m·g·h = Constante',
    description: 'En ausencia de fricción o rozamiento con el aire, la energía total del sistema permanece invariable.',
    examTip: 'En el punto más alto la velocidad es cero (energía potencial máxima); en el punto más bajo toda la energía se convierte en cinética.',
  },
  {
    id: 'f-9',
    area: 'Sociales y Ciudadanas',
    title: 'Mecanismos de Participación Ciudadana (Ley 134 de 1994)',
    formulaOrConcept: 'Plebiscito, Referendo, Consulta Popular, Cabildo Abierto',
    description: 'Mecanismos que permiten a los ciudadanos participar activamente en decisiones de trascendencia nacional o local.',
    examTip: 'Diferencia clave: El Plebiscito apoya o rechaza una decisión del Presidente; el Referendo aprueba o deroga una norma jurídica.',
  },
  {
    id: 'f-10',
    area: 'Lectura Crítica',
    title: 'Marcadores de Consecuencia y Causalidad',
    formulaOrConcept: 'Causalidad: Dado que, puesto que | Consecuencia: Por ende, por lo tanto',
    description: 'Conectores determinantes para identificar las premisas y conclusiones de un argumento en textos continuos.',
    examTip: 'Las conclusiones del autor suelen ir precedidas de marcadores consecutivos ("por consiguiente", "así pues").',
  },
];

interface FormulasScreenProps {
  onNavigateModule?: (module: MainModuleId | 'home') => void;
}

export function FormulasScreen({ onNavigateModule }: FormulasScreenProps = {}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('Todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const areas = ['Todos', 'Matemáticas', 'Ciencias Naturales', 'Sociales y Ciudadanas', 'Lectura Crítica', 'Inglés'];

  const filteredFormulas = FORMULAS_DATA.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.formulaOrConcept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.examTip.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea === 'Todos' || item.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 pb-28">
      {/* Hub de Navegación entre Módulos */}
      {onNavigateModule && (
        <ModuleNavigationHub
          currentModule="formulas"
          onNavigate={(mod) => onNavigateModule(mod)}
          title="Cuaderno de Fórmulas y Leyes"
          description="Repaso acelerado de fórmulas matemáticas, leyes físicas, principios químicos, artículos constitucionales y conectores en inglés para Saber 11."
          badge="Compendio Académico"
          badgeColor="primary"
        />
      )}

      {/* Encabezado del Módulo */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
        <div>
          <span className="text-xs font-bold text-[#00875A] uppercase tracking-wider">Compendio Académico</span>
          <h2 className="text-xl font-bold text-[#0B2F64]">Cuaderno de Fórmulas y Leyes</h2>
          <p className="text-sm text-slate-600 mt-1">
            Repasa en pocos minutos las leyes físicas, fórmulas matemáticas, artículos constitucionales y reglas gramaticales clave para la prueba Saber 11.
          </p>
        </div>

        {/* Buscador Predictivo */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar fórmula, ley o concepto (ej. Pitágoras, Tutela, Newton)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F7F9FC] border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B2F64] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-200 px-2 py-1 rounded-lg"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Chips de Filtrado por Área */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedArea === area
                  ? 'bg-[#0B2F64] text-white shadow-sm'
                  : 'bg-[#DCE4F9] text-[#0B2F64] hover:bg-slate-200'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Listado de Tarjetas de Fórmulas con Animaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredFormulas.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#0B2F64]/30 hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold px-3 py-1 bg-[#DCE4F9] text-[#0B2F64] rounded-full">
                    {item.area}
                  </span>
                  <button
                    onClick={() => handleCopy(item.formulaOrConcept, item.id)}
                    className="text-xs font-semibold text-slate-500 hover:text-[#0B2F64] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === item.id ? '✓ ¡Copiado!' : 'Copiar fórmula'}
                  </button>
                </div>

                <h3 className="font-bold text-base text-[#0B2F64] leading-tight">
                  {item.title}
                </h3>

                <div className="p-3 bg-[#F7F9FC] rounded-2xl border border-slate-100 font-mono text-xs font-bold text-[#0B2F64] select-all">
                  {item.formulaOrConcept}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-start gap-2 bg-[#AFF2D4]/20 p-3 rounded-2xl">
                <span className="text-emerald-700 font-bold text-xs shrink-0">💡 Tip ICFES:</span>
                <p className="text-[11px] text-emerald-900 leading-snug font-medium">
                  {item.examTip}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredFormulas.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <p className="text-slate-500 text-sm font-semibold">No se encontraron fórmulas o conceptos con ese término.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedArea('Todos');
            }}
            className="mt-3 px-4 py-2 bg-[#0B2F64] text-white rounded-xl text-xs font-bold hover:bg-[#001944] transition-colors cursor-pointer"
          >
            Ver todas las fórmulas
          </button>
        </div>
      )}
    </div>
  );
}

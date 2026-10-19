import { Question, AreaType, OptionLetter } from '../models/ExamTypes';

export const MORE_SAMPLE_QUESTIONS: Question[] = [
  // ==========================================
  // MATEMÁTICAS
  // ==========================================
  {
    id: 'mat-04',
    area: AreaType.MATEMATICAS,
    topic: 'Estadística / Interpretación de Gráficas',
    contextText: 'El registro de ventas mensuales de un almacén durante el primer semestre muestra: Enero ($20 millones), Febrero ($25 millones), Marzo ($30 millones), Abril ($35 millones), Mayo ($30 millones) y Junio ($40 millones).',
    prompt: '¿En qué porcentaje aumentaron las ventas desde el mes de Enero hasta el mes de Junio?',
    options: [
      { id: OptionLetter.A, text: '50%' },
      { id: OptionLetter.B, text: '100%' },
      { id: OptionLetter.C, text: '120%' },
      { id: OptionLetter.D, text: '200%' }
    ],
    correctAnswer: OptionLetter.B,
    explanation: 'El incremento absoluto es de Junio ($40M) - Enero ($20M) = $20M. El porcentaje de aumento con respecto al valor inicial de Enero ($20M) se calcula como: (20 / 20) * 100 = 100%.'
  },

  // ==========================================
  // LECTURA CRÍTICA
  // ==========================================
  {
    id: 'lec-04',
    area: AreaType.LECTURA_CRITICA,
    topic: 'Análisis de Textos Periodísticos / Opinión',
    contextText: '«La hiperconectividad digital actual promete acercarnos a todos, pero con frecuencia genera una paradoja: estamos permanentemente enlazados a pantallas globales mientras nos distanciamos de las comunidades físicas que habitamos cotidianamente.»',
    prompt: 'La expresión "paradoja" empleada por el autor se refiere a que:',
    options: [
      { id: OptionLetter.A, text: 'La tecnología digital destruye por completo los canales de comunicación física.' },
      { id: OptionLetter.B, text: 'Un fenómeno genera un resultado opuesto o contradictorio al que teóricamente promete.' },
      { id: OptionLetter.C, text: 'Las comunidades físicas son mucho más eficientes que las redes virtuales.' },
      { id: OptionLetter.D, text: 'El uso de pantallas y redes sociales es perjudicial para la salud mental.' }
    ],
    correctAnswer: OptionLetter.B,
    explanation: 'Una paradoja denota una contradicción lógica aparente: la promesa de conectar a todos digitalmente termina generando aislamiento de la comunidad cercana y física.'
  },

  // ==========================================
  // CIENCIAS NATURALES
  // ==========================================
  {
    id: 'cie-04',
    area: AreaType.CIENCIAS_NATURALES,
    topic: 'Química / Termoquímica y Reacciones',
    contextText: 'Durante una práctica de laboratorio, se mezclan dos sustancias en un recipiente de vidrio y se observa que la temperatura del sistema baja drásticamente de 25°C a 12°C en pocos segundos.',
    prompt: 'De acuerdo con el cambio de temperatura observado, ¿cómo se clasifica este tipo de reacción química?',
    options: [
      { id: OptionLetter.A, text: 'Exotérmica, porque libera energía al entorno en forma de calor.' },
      { id: OptionLetter.B, text: 'Endotérmica, porque absorbe energía calórica de su entorno.' },
      { id: OptionLetter.C, text: 'Neutralización, porque equilibra el pH de los reactivos.' },
      { id: OptionLetter.D, text: 'Combustión espontánea por oxidación rápida.' }
    ],
    correctAnswer: OptionLetter.B,
    explanation: 'Cuando una reacción absorbe calor del entorno, la temperatura del sistema desciende de forma perceptible. Esto caracteriza a los procesos endotérmicos.'
  },

  // ==========================================
  // SOCIALES Y CIUDADANAS
  // ==========================================
  {
    id: 'soc-04',
    area: AreaType.SOCIALES_CIUDADANAS,
    topic: 'Mecanismos de Participación Ciudadana',
    contextText: 'Un grupo significativo de ciudadanos inconformes con las decisiones administrativas y presupuestales de su concejo municipal busca destituir al alcalde actual antes de que culmine su período constitucional.',
    prompt: '¿Cuál es el mecanismo de participación ciudadana específico consagrado en la Constitución de 1991 para este propósito?',
    options: [
      { id: OptionLetter.A, text: 'El Plebiscito' },
      { id: OptionLetter.B, text: 'El Cabildo Abierto' },
      { id: OptionLetter.C, text: 'La Revocatoria del Mandato' },
      { id: OptionLetter.D, text: 'El Referendo Aprobatorio' }
    ],
    correctAnswer: OptionLetter.C,
    explanation: 'La Revocatoria del Mandato es un derecho político mediante el cual los ciudadanos pueden dar por terminado el período de un alcalde o gobernador electo por insatisfacción popular.'
  },

  // ==========================================
  // INGLÉS
  // ==========================================
  {
    id: 'ing-04',
    area: AreaType.INGLES,
    topic: 'Gramática / Modal Verbs',
    contextText: '"Students _____ study hard and review past exams if they want to get a high score on the Saber 11 test."',
    prompt: 'Choose the correct option to complete the advice:',
    options: [
      { id: OptionLetter.A, text: 'should' },
      { id: OptionLetter.B, text: 'might' },
      { id: OptionLetter.C, text: 'could not' },
      { id: OptionLetter.D, text: 'must not' }
    ],
    correctAnswer: OptionLetter.A,
    explanation: '"Should" se utiliza para dar consejos, recomendaciones o sugerencias convenientes (los estudiantes deberían estudiar duro).'
  }
];

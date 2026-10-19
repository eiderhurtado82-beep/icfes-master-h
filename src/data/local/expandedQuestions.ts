import { Question, AreaType, OptionLetter } from '../models/ExamTypes';

export const EXPANDED_SAMPLE_QUESTIONS: Question[] = [
  // ==========================================
  // CIENCIAS NATURALES (FÍSICA / CINEMÁTICA)
  // ==========================================
  {
    id: 'cie-03',
    area: AreaType.CIENCIAS_NATURALES,
    topic: 'Física / Movimiento Rectilíneo Uniformemente Acelerado (MRUA)',
    contextText: 'Un automóvil deportivo parte del reposo en una pista recta con una aceleración constante de 2 m/s². El vehículo se desplaza durante 5 segundos antes de alcanzar una velocidad máxima, la cual mantiene constante durante el resto de su trayecto.',
    prompt: '¿Cuál es la velocidad que alcanza el automóvil al cabo de los 5 segundos de aceleración?',
    options: [
      { id: OptionLetter.A, text: '2 m/s' },
      { id: OptionLetter.B, text: '5 m/s' },
      { id: OptionLetter.C, text: '10 m/s' },
      { id: OptionLetter.D, text: '25 m/s' }
    ],
    correctAnswer: OptionLetter.C,
    explanation: 'Utilizando la ecuación cinemática V = V₀ + a·t. Como parte del reposo (V₀ = 0), la velocidad final es V = (2 m/s²) · (5 s) = 10 m/s.'
  },

  // ==========================================
  // SOCIALES Y CIUDADANAS (MULTIPERSPECTIVISMO)
  // ==========================================
  {
    id: 'soc-03',
    area: AreaType.SOCIALES_CIUDADANAS,
    topic: 'Multiperspectivismo y Análisis de Conflictos Urbanos',
    contextText: 'En una gran ciudad se debate la construcción de una nueva troncal de transporte masivo que atravesará un parque ecológico protegido. Por un lado, la administración distrital argumenta que la obra reducirá los tiempos de viaje de miles de ciudadanos de estratos bajos; por otro lado, colectivos ambientales sostienen que se destruirá el hábitat de especies endémicas y se afectará el aire de la zona.',
    prompt: '¿Por qué este caso genera un dilema complejo desde la perspectiva de las competencias ciudadanas?',
    options: [
      { id: OptionLetter.A, text: 'Porque prioriza de manera absoluta el bienestar económico sobre cualquier otra norma.' },
      { id: OptionLetter.B, text: 'Porque enfrenta dos derechos y objetivos legítimos de interés colectivo: la movilidad urbana y la protección ambiental.' },
      { id: OptionLetter.C, text: 'Porque las decisiones de infraestructura vial no deben consultarse con la ciudadanía.' },
      { id: OptionLetter.D, text: 'Porque los colectivos ambientales buscan impedir el desarrollo tecnológico de la región.' }
    ],
    correctAnswer: OptionLetter.B,
    explanation: 'El dilema surge porque ambos argumentos defienden valores colectivos válidos (el derecho al transporte eficiente y el derecho a un ambiente sano), lo que exige ponderar derechos y buscar soluciones de desarrollo sostenible.'
  },

  // ==========================================
  // INGLÉS (PARTE 7: READING COMPREHENSION)
  // ==========================================
  {
    id: 'ing-03',
    area: AreaType.INGLES,
    topic: 'Comprensión de Lectura Avanzada (Reading Comprehension)',
    contextText: '"Remote work has drastically transformed modern employment structures. While employees enjoy greater flexibility and no daily commuting time, companies have had to redesign their cybersecurity protocols and virtual communication channels to maintain team productivity."',
    prompt: 'According to the passage, what has been one of the main consequences for companies implementing remote work?',
    options: [
      { id: OptionLetter.A, text: 'They have eliminated all communication channels.' },
      { id: OptionLetter.B, text: 'They had to adapt cybersecurity protocols and virtual tools.' },
      { id: OptionLetter.C, text: 'They forced employees to commute every day.' },
      { id: OptionLetter.D, text: 'They reduced overall team productivity.' }
    ],
    correctAnswer: OptionLetter.B,
    explanation: 'El texto menciona explícitamente que las empresas han tenido que rediseñar sus protocolos de ciberseguridad y canales de comunicación virtual ("had to redesign their cybersecurity protocols and virtual communication channels").'
  },

  // ==========================================
  // MATEMÁTICAS (GEOMETRÍA Y RAZONAMIENTO)
  // ==========================================
  {
    id: 'mat-03',
    area: AreaType.MATEMATICAS,
    topic: 'Geometría / Áreas y Perímetros',
    contextText: 'Un terreno rectangular tiene un perímetro de 60 metros. Si el largo del terreno es el doble de su ancho, se requiere calcular las dimensiones exactas para cercarlo.',
    prompt: '¿Cuáles son las medidas del largo y del ancho del terreno rectangular?',
    options: [
      { id: OptionLetter.A, text: 'Largo = 20 m, Ancho = 10 m' },
      { id: OptionLetter.B, text: 'Largo = 30 m, Ancho = 15 m' },
      { id: OptionLetter.C, text: 'Largo = 24 m, Ancho = 12 m' },
      { id: OptionLetter.D, text: 'Largo = 40 m, Ancho = 20 m' }
    ],
    correctAnswer: OptionLetter.A,
    explanation: 'Planteando el perímetro: P = 2(Largo + Ancho) = 60. Como Largo = 2(Ancho), sustituimos: 2(2x + x) = 60 => 6x = 60 => x = 10 (Ancho). Por tanto, el Largo es 2(10) = 20 metros.'
  },

  // ==========================================
  // LECTURA CRÍTICA (ANÁLISIS DE TEXTOS LITERARIOS)
  // ==========================================
  {
    id: 'lec-03',
    area: AreaType.LECTURA_CRITICA,
    topic: 'Análisis de Textos Literarios y Sentido Implícito',
    contextText: '«El tiempo no es una carretera rectilínea en la que avanzamos hacia el futuro dejando atrás el pasado como un paisaje muerto; es más bien un laberinto de espejos donde cada decisión presente reverbera en lo que fuimos y en lo que todavía no terminamos de ser.»',
    prompt: 'La metáfora del "laberinto de espejos" empleada en el fragmento sugiere que:',
    options: [
      { id: OptionLetter.A, text: 'El pasado, el presente y el futuro están interconectados y se reflejan mutuamente.' },
      { id: OptionLetter.B, text: 'La memoria humana es frágil y tiende a olvidar los acontecimientos trágicos.' },
      { id: OptionLetter.C, text: 'Las decisiones humanas carecen de consecuencias reales en el tiempo.' },
      { id: OptionLetter.D, text: 'El futuro es completamente predecible si se analizan los errores del pasado.' }
    ],
    correctAnswer: OptionLetter.A,
    explanation: 'La imagen de los espejos en un laberinto denota reflejos mutuos y conexión simultánea, indicando que el tiempo no es lineal ni aislado, sino que el presente resuena constantemente con el pasado y el porvenir.'
  }
];

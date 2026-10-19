import { FormulaCard } from '../../domain/models/ExamTypes';

export const STUDY_FORMULAS: FormulaCard[] = [
  // MATEMÁTICAS
  {
    id: 'form-mat-01',
    area: 'matematicas',
    topic: 'Álgebra y Funciones',
    title: 'Ecuación de la Recta y Pendiente',
    formulaOrRule: 'm = (y₂ - y₁) / (x₂ - x₁)   |   y - y₁ = m(x - x₁)',
    explanation:
      'La pendiente m mide la tasa de variación constante. Si m > 0 es creciente, si m < 0 es decreciente, y si m = 0 es horizontal. Dos rectas paralelas tienen m₁ = m₂. Dos rectas perpendiculares cumplen m₁ · m₂ = -1.',
    example: 'Puntos A(2, 4) y B(6, 12) => m = (12 - 4) / (6 - 2) = 8 / 4 = 2. Creciente a razón de 2 unidades por cada unidad en x.',
    icfesTip: 'En el ICFES suelen darte una tabla de costo fijo vs variable. Identifica el costo fijo como el intercepto b en el eje y (x = 0), y el costo por unidad como la pendiente m.',
  },
  {
    id: 'form-mat-02',
    area: 'matematicas',
    topic: 'Geometría y Medición',
    title: 'Áreas y Volúmenes Críticos',
    formulaOrRule: 'A_círculo = π·r²   |   V_cilindro = π·r²·h   |   V_cono = (1/3)·π·r²·h',
    explanation:
      'El volumen del cono es exactamente un tercio del cilindro con la misma base y altura. Para prismas y cilindros: Volumen = Área de la base × altura.',
    example: 'Cilindro con radio r = 3 cm y altura h = 10 cm => V = π · 3² · 10 = 90π cm³.',
    icfesTip: 'Casi nunca necesitas multiplicar por 3.1416 en el ICFES. Las respuestas suelen dejar π expresado o piden relaciones de proporcionalidad (ej. ¿se duplica o se cuadruplica?).',
  },
  {
    id: 'form-mat-03',
    area: 'matematicas',
    topic: 'Estadística y Probabilidad',
    title: 'Regla de Laplace y Probabilidad Condicionada',
    formulaOrRule: 'P(A) = Casos Favorables / Casos Posibles   |   P(A y B) = P(A) · P(B|A)',
    explanation:
      'Para eventos independientes con reposición: P(A y B) = P(A) · P(B). Sin reposición, el denominador del espacio muestral total disminuye en 1 para la segunda extracción.',
    example: 'Baraja de 52 cartas. Probabilidad de dos ases consecutivos sin reposición = (4/52) × (3/51).',
    icfesTip: 'Revisa siempre si el enunciado indica "con reposición / con reemplazo" o "sin reposición". Cambia por completo el resultado.',
  },

  // CIENCIAS NATURALES
  {
    id: 'form-cie-01',
    area: 'ciencias_naturales',
    topic: 'Física - Mecánica',
    title: 'Conservación de Energía Mecánica',
    formulaOrRule: 'Em = Ep + Ek = constante   |   Ep = m·g·h   |   Ek = (1/2)·m·v²',
    explanation:
      'En ausencia de rozamiento (fricción nula), la energía mecánica no se crea ni se destruye. En el punto más alto, toda la energía es potencial; en el punto más bajo (suelo), toda la energía se ha transformado en cinética.',
    example: 'Un objeto de 2 kg cae desde 20 m (g = 10 m/s²). Ep inicial = 2 · 10 · 20 = 400 J. En el suelo, Ek = 400 J => v = √(2 · 400 / 2) = 20 m/s.',
    icfesTip: 'En preguntas de caída libre o montañas rusas, la masa del cuerpo se cancela: (1/2)mv² = mgh => v = √(2gh). Dos cuerpos de masas distintas caen con la misma velocidad si no hay aire.',
  },
  {
    id: 'form-cie-02',
    area: 'ciencias_naturales',
    topic: 'Química - Ley de Gases Ideales',
    title: 'Ley Combinada de los Gases Ideales',
    formulaOrRule: 'P · V = n · R · T   |   (P₁ · V₁) / T₁ = (P₂ · V₂) / T₂',
    explanation:
      'Ley combinada de los gases: A temperatura constante (Isotérmico, Boyle), presión y volumen son inversamente proporcionales. A presión constante (Isobárico, Charles), volumen y temperatura absoluta (Kelvin) son directamente proporcionales.',
    example: 'Si un gas a 1 atm y 2 L se comprime a 1 L manteniendo temperatura constante: P₂ = (1 · 2) / 1 = 2 atm.',
    icfesTip: 'Recuerda que la temperatura siempre debe expresarse en escala absoluta Kelvin (K = °C + 273) en cualquier cálculo de gases.',
  },

  // SOCIALES Y CIUDADANAS
  {
    id: 'form-soc-01',
    area: 'sociales_ciudadanas',
    topic: 'Constitución de 1991',
    title: 'Mecanismos Constitucionales de Protección',
    formulaOrRule: 'Tutela (Art. 86) | Derecho Petición (Art. 23) | Acción Popular (Art. 88)',
    explanation:
      '• Acción de Tutela: Protege derechos fundamentales individuales inmediatos (vida, salud, debido proceso, educación). Término judicial: 10 días.\n• Derecho de Petición: Solicita información o copias a entidades públicas o privadas. Término ordinario: 15 días hábiles.\n• Acción Popular: Protege derechos colectivos (medio ambiente sano, espacio público, seguridad comunitaria).',
    example: 'Si una EPS no entrega medicina vital => Tutela. Si una fábrica contamina el río comunal => Acción Popular. Si pides el reporte de tus notas al colegio => Derecho de Petición.',
    icfesTip: 'Pregunta fija del ICFES: Diferenciar derecho individual (Tutela) vs derecho colectivo (Acción Popular). ¡Nunca selecciones Tutela si el daño es al medio ambiente general de un pueblo!',
  },
  {
    id: 'form-soc-02',
    area: 'sociales_ciudadanas',
    topic: 'Mecanismos de Participación',
    title: 'Mecanismos de Participación Ciudadana (Art. 103)',
    formulaOrRule: 'Plebiscito | Referendo | Consulta Popular | Cabildo Abierto | Revocatoria',
    explanation:
      '• Plebiscito: El Presidente consulta al pueblo sobre una decisión política del Ejecutivo (Sí o No).\n• Referendo: El pueblo aprueba o deroga un texto legal o constitucional.\n• Consulta Popular: Pregunta de carácter general sobre un asunto de trascendencia nacional o departamental/municipal.\n• Cabildo Abierto: Reunión pública de concejos o juntas administradoras con los ciudadanos.',
    example: 'Plebiscito por la Paz en 2016 fue convocado por el Presidente de la República.',
    icfesTip: 'El Plebiscito lo convoca exclusivamente el Presidente de la República. El Referendo somete a votación un texto normativo.',
  },

  // LECTURA CRÍTICA
  {
    id: 'form-lec-01',
    area: 'lectura_critica',
    topic: 'Análisis Textual y Tesis',
    title: 'Estructura Argumentativa y Detección de Falacias',
    formulaOrRule: 'Tesis (Postura central) + Premisas (Razones) + Evidencia (Datos) - Falacias',
    explanation:
      '• Falacia Ad Hominem: Atacar a la persona que emite el argumento en lugar de refutar su razonamiento.\n• Falacia del Hombre de Paja: Distorsionar o exagerar la postura del oponente para refutarla fácilmente.\n• Falacia de Falsa Causa (Post hoc): Afirmar que porque B ocurrió después de A, A causó necesariamente a B.',
    example: '«El doctor Pérez defiende la vacuna, pero él se viste mal, así que su estudio es falso» => Falacia Ad Hominem.',
    icfesTip: 'El ICFES premia no caer en afirmaciones extremas ("siempre", "nunca", "absolutamente"). Las respuestas correctas suelen ser ponderadas y respaldadas textualmente en la lectura.',
  },

  // INGLÉS
  {
    id: 'form-ing-01',
    area: 'ingles',
    topic: 'Conectores y Cohesión',
    title: 'Linking Words & Transition Connectors',
    formulaOrRule: 'Contrast (However, Although) | Cause (Because, Due to) | Result (Therefore, As a result)',
    explanation:
      '• Contrast: However (Sin embargo), Although / Even though (Aunque), Whereas (Mientras que).\n• Cause & Effect: Since / Because (Puesto que / Porque), Therefore / Thus (Por lo tanto).\n• Addition: Furthermore / In addition (Además), Moreover (Es más).',
    example: '«Although it was raining heavily, the students went to class. Therefore, they did not miss the exam».',
    icfesTip: 'Identifica la puntuación: "However" suele ir seguido de coma (","), mientras que "Although" une dos oraciones subordinadas sin punto y coma previo.',
  },
];

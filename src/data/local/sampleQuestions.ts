import { Question } from '../../domain/models/ExamTypes';

export const SAMPLE_QUESTIONS: Question[] = [
  // ================= MATEMÁTICAS =================
  {
    id: 'mat-001',
    area: 'matematicas',
    topic: 'Álgebra y Funciones',
    officialCompetency: 'Formulación y Ejecución',
    contextText:
      'Una empresa de transporte intermunicipal en Colombia cobra una tarifa base fija de $5.000 COP más $1.200 COP por cada kilómetro recorrido. Un pasajero dispone de un presupuesto máximo de $41.000 COP para su viaje.',
    prompt:
      '¿Cuál es la distancia máxima en kilómetros que puede recorrer el pasajero sin exceder su presupuesto?',
    options: [
      { id: 'A', text: '25 km' },
      { id: 'B', text: '30 km' },
      { id: 'C', text: '35 km' },
      { id: 'D', text: '38 km' },
    ],
    correctAnswer: 'B',
    explanation:
      'Se plantea la inecuación lineal del costo total: 5.000 + 1.200 · x ≤ 41.000. Restando la tarifa fija: 1.200 · x ≤ 36.000. Despejando x: x ≤ 36.000 / 1.200 = 30 km. Por lo tanto, puede recorrer como máximo 30 kilómetros exactos.',
    distractorAnalysis: {
      A: '25 km resulta de olvidar restar la tarifa base y dividir erróneamente.',
      C: '35 km excede el presupuesto disponible ($47.000 COP).',
      D: '38 km es el resultado de un cálculo erróneo de la razón.',
    },
    difficulty: 'Básico',
  },
  {
    id: 'mat-002',
    area: 'matematicas',
    topic: 'Geometría y Medición',
    officialCompetency: 'Argumentación y Razonamiento',
    contextText:
      'En un terreno rectangular de 40 metros de largo por 30 metros de ancho, un agricultor planea instalar una manguera de riego subterránea que una de forma recta dos esquinas opuestas diagonalmente.',
    prompt:
      '¿Cuál es la longitud exacta de la manguera que necesita el agricultor?',
    options: [
      { id: 'A', text: '70 metros' },
      { id: 'B', text: '60 metros' },
      { id: 'C', text: '50 metros' },
      { id: 'D', text: '45 metros' },
    ],
    correctAnswer: 'C',
    explanation:
      'El terreno forma un triángulo rectángulo con catetos a = 40 m y b = 30 m. Aplicando el Teorema de Pitágoras: c² = a² + b² = 40² + 30² = 1.600 + 900 = 2.500. Por lo tanto, c = √2.500 = 50 metros (tríada pitagórica 3-4-5 multiplicada por 10).',
    distractorAnalysis: {
      A: '70 metros es la suma lineal del largo y el ancho (perímetro parcial), no la diagonal.',
      B: '60 metros es una estimación sin sustento trigonométrico.',
      D: '45 metros confunde el promedio con la hipotenusa.',
    },
    difficulty: 'Básico',
  },
  {
    id: 'mat-003',
    area: 'matematicas',
    topic: 'Estadística y Probabilidad',
    officialCompetency: 'Interpretación y Representación',
    contextText:
      'En una urna hay 5 balotas rojas, 3 balotas azules y 2 balotas verdes, todas de igual tamaño y peso. Se extrae una balota al azar y no se devuelve a la urna.',
    prompt:
      'Si la primera balota extraída fue verde, ¿cuál es la probabilidad de que la segunda balota extraída sea roja?',
    options: [
      { id: 'A', text: '5 / 10' },
      { id: 'B', text: '5 / 9' },
      { id: 'C', text: '4 / 9' },
      { id: 'D', text: '1 / 2' },
    ],
    correctAnswer: 'B',
    explanation:
      'Inicialmente hay 10 balotas. Al extraer una verde sin reposición, el espacio muestral total se reduce a 9 balotas. Como no se extrajo ninguna roja, la cantidad de balotas rojas sigue siendo 5. Por la regla de Laplace: P(Roja | Verde extraída) = 5 / 9.',
    distractorAnalysis: {
      A: '5 / 10 no toma en cuenta que el evento es sin reposición.',
      C: '4 / 9 asume erróneamente que la primera balota fue roja.',
      D: '1 / 2 simplifica 5/10 sin considerar la reducción muestral a 9.',
    },
    difficulty: 'Medio',
  },
  {
    id: 'mat-004',
    area: 'matematicas',
    topic: 'Cálculo y Razones de Cambio',
    officialCompetency: 'Formulación y Ejecución',
    contextText:
      'El volumen de agua en un tanque de reserva para una vereda en Cundinamarca está modelado por la función V(t) = 1.200 - 40t, donde V es el volumen en litros y t es el tiempo transcurrido en horas desde que se abrió la válvula de suministro.',
    prompt:
      '¿En cuánto tiempo el tanque quedará completamente vacío?',
    options: [
      { id: 'A', text: '20 horas' },
      { id: 'B', text: '24 horas' },
      { id: 'C', text: '30 horas' },
      { id: 'D', text: '40 horas' },
    ],
    correctAnswer: 'C',
    explanation:
      'El tanque queda vacío cuando el volumen V(t) = 0. Planteamos 0 = 1.200 - 40t. Despejando t: 40t = 1.200 => t = 1.200 / 40 = 30 horas.',
    distractorAnalysis: {
      A: '20 horas asume un caudal de 60 L/h.',
      B: '24 horas es un número común por ser un día completo pero incorrecto matemáticamente.',
      D: '40 horas confunde la tasa de vaciado con el tiempo.',
    },
    difficulty: 'Medio',
  },

  // ================= LECTURA CRÍTICA =================
  {
    id: 'lec-001',
    area: 'lectura_critica',
    topic: 'Textos Filosóficos y Argumentativos',
    officialCompetency: 'Reflexión y Evaluación del Contenido y la Forma',
    contextText:
      '«Nadie niega que el conocimiento empírico es indispensable para la vida práctica. No obstante, confiar ciegamente en los sentidos sin el examen riguroso de la razón es como navegar en altamar guiándose únicamente por el oleaje inmediato sin consultar la brújula ni las constelaciones. Quien sólo cree en lo que toca termina siendo esclavo de las apariencias y rehén de la ilusión cotidiana».',
    prompt:
      'En el texto, la analogía del navegante cumple la función primordial de:',
    options: [
      { id: 'A', text: 'Demostrar que la navegación marítima requiere conocimientos astronómicos.' },
      { id: 'B', text: 'Ilustrar los riesgos de depender exclusivamente de la percepción sensible sin el juicio racional.' },
      { id: 'C', text: 'Desestimar por completo la utilidad de los sentidos en la vida cotidiana de las personas.' },
      { id: 'D', text: 'Proponer un nuevo método para la enseñanza de las ciencias naturales modernas.' },
    ],
    correctAnswer: 'B',
    explanation:
      'El autor usa la comparación náutica para ejemplificar la tesis: los sentidos proporcionan datos inmediatos (como el oleaje), pero sin la razón ordenadora (brújula/constelaciones), el individuo queda desorientado ante las apariencias.',
    distractorAnalysis: {
      A: 'Toma la analogía de forma literal en lugar de figurativa.',
      C: 'El texto inicia diciendo "Nadie niega que el conocimiento empírico es indispensable...", por lo que no lo desestima por completo.',
      D: 'El texto no propone reformas educativas pedagógicas.',
    },
    difficulty: 'Medio',
  },
  {
    id: 'lec-002',
    area: 'lectura_critica',
    topic: 'Estructura Semántica y Tesis',
    officialCompetency: 'Comprensión del Sentido Global del Texto',
    contextText:
      '«La proliferación desmedida de algoritmos de recomendación en redes sociales crea cámaras de eco donde los usuarios solo reciben ideas que refuerzan sus sesgos previos. Lejos de democratizar el saber, esta polarización algorítmica erosiona la deliberación pública democrática, pues el ciudadano deja de confrontarse con posturas divergentes y asume su burbuja como la totalidad de lo real».',
    prompt:
      '¿Cuál es la tesis central que defiende el autor del fragmento anterior?',
    options: [
      { id: 'A', text: 'Las redes sociales deben ser prohibidas para proteger la privacidad de los datos.' },
      { id: 'B', text: 'Los algoritmos de recomendación debilitan el debate democrático al aislar a los ciudadanos en burbujas de opinión.' },
      { id: 'C', text: 'El conocimiento se ha democratizado gracias al acceso universal a plataformas de internet.' },
      { id: 'D', text: 'Los sesgos de confirmación son una invención reciente derivada de la tecnología.' },
    ],
    correctAnswer: 'B',
    explanation:
      'La tesis es la afirmación cardinal sostenida y argumentada: la polarización algorítmica erosiona la deliberación democrática al confinar a las personas en cámaras de eco que confirman sus prejuicios.',
    distractorAnalysis: {
      A: 'Extrapolación no mencionada; el autor no pide prohibición de redes.',
      C: 'Es lo contrario de lo que afirma ("Lejos de democratizar el saber...").',
      D: 'Los sesgos cognitivos son humanos y preexistentes; el algoritmo solo los amplifica.',
    },
    difficulty: 'Medio',
  },
  {
    id: 'lec-003',
    area: 'lectura_critica',
    topic: 'Textos Continuos Literarios',
    officialCompetency: 'Identificación de Elementos Locales y Vocabulario en Contexto',
    contextText:
      '«Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo. Macondo era entonces una aldea de veinte casas de barro y cañabrava construidas a la orilla de un río de aguas diáfanas que se precipitaban por un lecho de piedras pulidas, blancas y enormes como huevos prehistóricos». (Cien años de soledad)',
    prompt:
      'El adjetivo "diáfanas" utilizado para calificar las aguas del río expresa con mayor precisión que eran:',
    options: [
      { id: 'A', text: 'Turbias y caudalosas.' },
      { id: 'B', text: 'Cristalinas y transparentes.' },
      { id: 'C', text: 'Extremadamente frías y gélidas.' },
      { id: 'D', text: 'Profundas y peligrosas.' },
    ],
    correctAnswer: 'B',
    explanation:
      'Etimológica y contextualmente, "diáfano" describe un cuerpo o líquido a través del cual pasa la luz casi en su totalidad, siendo sinónimo directo de transparente, claro y cristalino.',
    distractorAnalysis: {
      A: 'Turbias es el antónimo directo.',
      C: 'Aunque el párrafo menciona el hielo más adelante, diáfanas no califica temperatura.',
      D: 'No guarda relación con la profundidad topográfica del río.',
    },
    difficulty: 'Básico',
  },

  // ================= CIENCIAS NATURALES =================
  {
    id: 'cie-001',
    area: 'ciencias_naturales',
    topic: 'Física - Cinemática y Energía',
    officialCompetency: 'Uso Comprensivo del Conocimiento Científico',
    contextText:
      'Un carro de montaña rusa de masa m se suelta desde el reposo en la cima de una colina a una altura H (Punto 1). Despreciando el rozamiento con los rieles y la resistencia del aire, el carro desciende hasta el nivel del suelo (Punto 2) y luego sube a una segunda colina de altura h, donde h < H.',
    prompt:
      'De acuerdo con la ley de conservación de la energía mecánica, la energía cinética del carro en el Punto 2 (nivel del suelo):',
    options: [
      { id: 'A', text: 'Es igual a cero porque el carro se detiene al tocar el suelo.' },
      { id: 'B', text: 'Es igual a la energía potencial gravitacional inicial en el Punto 1 (m · g · H).' },
      { id: 'C', text: 'Es menor que la energía mecánica en el punto inicial debido a la gravedad.' },
      { id: 'D', text: 'Es independiente de la altura H y depende únicamente de la masa.' },
    ],
    correctAnswer: 'B',
    explanation:
      'Al no haber fuerzas disipativas (rozamiento nulo), la energía mecánica total se conserva: Em₁ = Em₂. En el Punto 1 (reposo a altura H): Em₁ = Ep₁ + Ek₁ = m·g·H + 0. En el Punto 2 (suelo, altura 0): Em₂ = Ep₂ + Ek₂ = 0 + Ek₂. Por ende, Ek₂ = m·g·H.',
    distractorAnalysis: {
      A: 'En el suelo el carro alcanza su máxima rapidez, no se detiene.',
      C: 'La gravedad es una fuerza conservativa, no reduce la energía mecánica total.',
      D: 'La energía cinética depende directamente de la altura H de la cual descendió.',
    },
    difficulty: 'Medio',
  },
  {
    id: 'cie-002',
    area: 'ciencias_naturales',
    topic: 'Química - Estequiometría y Reacciones',
    officialCompetency: 'Explicación de Fenómenos',
    contextText:
      'Considere la combustión completa del gas propano utilizado en estufas domésticas: C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. Las masas molares aproximadas son: C₃H₈ = 44 g/mol, O₂ = 32 g/mol, CO₂ = 44 g/mol y H₂O = 18 g/mol.',
    prompt:
      'Si se hacen reaccionar completamente 44 gramos de propano (1 mol) con suficiente oxígeno, ¿qué masa de agua (H₂O) se producirá en la reacción?',
    options: [
      { id: 'A', text: '18 gramos' },
      { id: 'B', text: '36 gramos' },
      { id: 'C', text: '72 gramos' },
      { id: 'D', text: '132 gramos' },
    ],
    correctAnswer: 'C',
    explanation:
      'Según los coeficientes estequiométricos de la ecuación balanceada, 1 mol de C₃H₈ produce 4 moles de H₂O. Como la masa molar del agua es 18 g/mol, la masa producida es: 4 mol × 18 g/mol = 72 gramos de agua.',
    distractorAnalysis: {
      A: '18 g corresponde a un solo mol de agua (coeficiente 1 en lugar de 4).',
      B: '36 g corresponde a 2 moles de agua.',
      D: '132 g es la masa producida de dióxido de carbono (3 moles × 44 g/mol).',
    },
    difficulty: 'Medio',
  },
  {
    id: 'cie-003',
    area: 'ciencias_naturales',
    topic: 'Biología - Ecosistemas y Flujo de Materia',
    officialCompetency: 'Indagación y Modelamiento',
    contextText:
      'En los páramos de los Andes colombianos, los frailejones (Espeletia) capturan la niebla ambiental y regulan los caudales hídricos que alimentan los ríos de las cuencas bajas. Si una quema no controlada destruye una franja significativa de frailejones en la alta montaña:',
    prompt:
      '¿Cuál es el efecto ecológico e hidrológico más inmediato y probable en la cuenca hidrográfica?',
    options: [
      { id: 'A', text: 'Aumento permanente y estable de los caudales en época de sequía.' },
      { id: 'B', text: 'Pérdida de retención de humedad, erosión del suelo y alternancia entre crecientes súbitas y escasez de agua.' },
      { id: 'C', text: 'Incremento instantáneo de la fotosíntesis por mayor absorción de cenizas en el aire.' },
      { id: 'D', text: 'Disminución de la radiación solar incidente sobre los valles interandinos.' },
    ],
    correctAnswer: 'B',
    explanation:
      'Los frailejones y el suelo esponjoso del páramo funcionan como amortiguadores hídricos naturales ("esponjas"). Sin ellos, el agua de lluvia escurre rápidamente provocando crecientes y erosión, mientras que en verano no hay reserva retenida, causando sequías agudas.',
    distractorAnalysis: {
      A: 'Contradice la función ecológica de regulación del frailejón.',
      C: 'La ceniza y el fuego destruyen la biomasa vegetal fotosintética.',
      D: 'La pérdida de vegetación local no altera la radiación astronómica solar.',
    },
    difficulty: 'Básico',
  },

  // ================= SOCIALES Y CIUDADANAS =================
  {
    id: 'soc-001',
    area: 'sociales_ciudadanas',
    topic: 'Constitución Política de Colombia de 1991',
    officialCompetency: 'Pensamiento Social y Constitucional',
    contextText:
      'A una ciudadana de 68 años con hipertensión arterial severa, su Entidad Promotora de Salud (EPS) le niega repetidamente la entrega de un medicamento vital formulado por su médico especialista, argumentando que no se encuentra en el listado básico institucional.',
    prompt:
      'Según la Constitución Política de Colombia de 1991, ¿cuál es el mecanismo judicial idóneo e inmediato que la ciudadana debe interponer para proteger su derecho fundamental a la salud y a la vida?',
    options: [
      { id: 'A', text: 'Una Acción Popular ante el Tribunal Contencioso Administrativo.' },
      { id: 'B', text: 'Una Acción de Tutela (Artículo 86 de la Constitución).' },
      { id: 'C', text: 'Un Referendo Derogatorio de la ley de salud.' },
      { id: 'D', text: 'Una Consulta Previa con las autoridades locales.' },
    ],
    correctAnswer: 'B',
    explanation:
      'El Artículo 86 de la Constitución de 1991 consagra la Acción de Tutela como el instrumento preferente y sumario para la protección inmediata de los derechos constitucionales fundamentales (como la salud conexa a la vida) cuando resulten vulnerados o amenazados por cualquier autoridad o particular que preste servicios públicos.',
    distractorAnalysis: {
      A: 'La Acción Popular protege derechos colectivos (espacio público, medio ambiente sano), no derechos individuales fundamentales.',
      C: 'El referendo es un mecanismo de participación democrática para modificar leyes, no para reclamos individuales inmediatos.',
      D: 'La consulta previa es un derecho fundamental de comunidades étnicas e indígenas sobre proyectos en sus territorios.',
    },
    difficulty: 'Básico',
  },
  {
    id: 'soc-002',
    area: 'sociales_ciudadanas',
    topic: 'Estructura del Estado Colombiano',
    officialCompetency: 'Multiperspectivismo y Estructura Institucional',
    contextText:
      'En el sistema democrático colombiano rige el principio de separación y equilibrio de poderes entre tres ramas del poder público: Ejecutiva, Legislativa y Judicial, además de los órganos de control autónomos.',
    prompt:
      '¿Cuál de las siguientes entidades forma parte de los órganos de control y NO pertenece a ninguna de las tres ramas del poder público?',
    options: [
      { id: 'A', text: 'El Ministerio de Hacienda y Crédito Público.' },
      { id: 'B', text: 'La Corte Constitucional de Colombia.' },
      { id: 'C', text: 'La Procuraduría General de la Nación.' },
      { id: 'D', text: 'El Congreso de la República (Senado y Cámara).' },
    ],
    correctAnswer: 'C',
    explanation:
      'La Procuraduría General de la Nación, junto con la Defensoría del Pueblo y la Contraloría General de la República, integra los Órganos de Control Autónomos del Estado colombiano (Ministerio Público y Control Fiscal), dotados de independencia constitucional frente al Ejecutivo, Legislativo y Judicial.',
    distractorAnalysis: {
      A: 'Pertenece a la Rama Ejecutiva del poder público.',
      B: 'Es cabeza de la jurisdicción constitucional en la Rama Judicial.',
      D: 'Constituye la Rama Legislativa del poder público.',
    },
    difficulty: 'Medio',
  },
  {
    id: 'soc-003',
    area: 'sociales_ciudadanas',
    topic: 'Competencias Ciudadanas y Resolución de Conflictos',
    officialCompetency: 'Argumentación y Análisis de Perspectivas',
    contextText:
      'En un municipio con vocación agrícola y fuentes hídricas protegidas, una multinacional presenta un proyecto de explotación minera a cielo abierto que promete generar 800 empleos directos y duplicar los ingresos tributarios locales, pero implicaría el desvío temporal de una quebrada comunitaria.',
    prompt:
      'Desde el análisis de perspectivas y resolución democrática de conflictos en el marco Saber 11, ¿cuál es el dilema fundamental que enfrenta la comunidad?',
    options: [
      { id: 'A', text: 'Determinar si la maquinaria pesada empleará diésel o biodiésel.' },
      { id: 'B', text: 'La tensión entre el desarrollo económico inmediato por regalías/empleo y la sostenibilidad ambiental y soberanía hídrica a largo plazo.' },
      { id: 'C', text: 'Establecer cuál partido político ganará las próximas elecciones legislativas.' },
      { id: 'D', text: 'Impedir cualquier tipo de actividad productiva en todo el territorio departamental.' },
    ],
    correctAnswer: 'B',
    explanation:
      'El núcleo del conflicto enfrenta dos intereses legítimos en tensión: el beneficio económico y laboral a corto plazo frente a la preservación del patrimonio hídrico, la salud comunitaria y la vocación agroalimentaria a perpetuidad.',
    distractorAnalysis: {
      A: 'Es un detalle técnico secundario que ignora el fondo del debate social.',
      C: 'Enfoca la situación como un interés partidista y no como un dilema ciudadano.',
      D: 'Es una postura extremista que desvirtúa la deliberación constructiva.',
    },
    difficulty: 'Medio',
  },

  // ================= INGLÉS =================
  {
    id: 'ing-001',
    area: 'ingles',
    topic: 'Parte 1: Avisos y Carteles Cotidianos',
    officialCompetency: 'Comprensión de Avisos en Entornos Reales',
    contextText:
      'NOTICE IN A PUBLIC VENUE:\n«PLEASE KEEP SILENCE WHILE STUDYING. RETURN BOOKS TO THE RECEPTION CART BEFORE 6:00 PM».',
    prompt:
      'Where would you usually see this notice?',
    options: [
      { id: 'A', text: 'At a public swimming pool.' },
      { id: 'B', text: 'In a school or university library.' },
      { id: 'C', text: 'At a railway station platform.' },
      { id: 'D', text: 'Inside a cinema hall.' },
    ],
    correctAnswer: 'B',
    explanation:
      'Las palabras clave "KEEP SILENCE WHILE STUDYING" (guarde silencio mientras estudia) y "RETURN BOOKS TO THE RECEPTION CART" (devuelva los libros al carrito de recepción) identifican de manera inequívoca las normas usuales de una biblioteca escolar o universitaria.',
    distractorAnalysis: {
      A: 'En una piscina pública no hay recepción de libros para estudio.',
      C: 'En estaciones de tren no se guardan libros de estudio en carritos antes de las 6:00 PM.',
      D: 'En el cine se pide silencio para la película, no para estudiar libros.',
    },
    difficulty: 'Básico',
  },
  {
    id: 'ing-002',
    area: 'ingles',
    topic: 'Parte 4: Textos con Huecos Léxicos y Gramaticales',
    officialCompetency: 'Uso de la Lengua y Cohesión Gramatical',
    contextText:
      '«Solar energy is becoming increasingly popular in Colombia because the country ______ high levels of sunlight throughout the entire year».',
    prompt:
      'Which word best completes the blank space in the sentence?',
    options: [
      { id: 'A', text: 'receives' },
      { id: 'B', text: 'received' },
      { id: 'C', text: 'is receiving' },
      { id: 'D', text: 'receive' },
    ],
    correctAnswer: 'A',
    explanation:
      'La oración expresa un hecho permanente o científico (presente simple). Como el sujeto "the country" (el país) es tercera persona del singular (he/she/it), el verbo regular debe llevar la terminación en "-s" (receives).',
    distractorAnalysis: {
      B: 'Past simple no aplica para un hecho geográfico permanente.',
      C: 'Present continuous no describe hechos científicos atemporales.',
      D: 'Receive no tiene la conjugación de tercera persona del singular (-s).',
    },
    difficulty: 'Básico',
  },
  {
    id: 'ing-003',
    area: 'ingles',
    topic: 'Parte 7: Comprensión Lectora Literal e Inferencial',
    officialCompetency: 'Lectura Crítica en Lengua Extranjera',
    contextText:
      '«Biodiversity loss is not just an environmental issue; it is an urgent economic crisis. When pollinators like bees disappear, agricultural yields fall drastically, increasing food prices and threatening livelihoods across rural communities».',
    prompt:
      'According to the author, the disappearance of bees directly leads to:',
    options: [
      { id: 'A', text: 'Lower food production and higher prices for consumers.' },
      { id: 'B', text: 'An immediate drop in global transportation costs.' },
      { id: 'C', text: 'Higher profits for local farm owners.' },
      { id: 'D', text: 'The creation of new robotic pollinating tools.' },
    ],
    correctAnswer: 'A',
    explanation:
      'El texto afirma explícitamente: "When pollinators like bees disappear, agricultural yields fall drastically, increasing food prices" (Cuando los polinizadores desaparecen, los rendimientos agrícolas caen drásticamente, incrementando los precios de los alimentos).',
    distractorAnalysis: {
      B: 'No menciona costos de transporte internacional.',
      C: 'Es lo opuesto ("threatening livelihoods across rural communities").',
      D: 'Extrapolación tecnológica no sustentada en el pasaje.',
    },
    difficulty: 'Medio',
  },
];

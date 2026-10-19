-- ============================================================================
-- ICFES MASTER H 2.5 - Supabase Database Schema
-- Tablas de Perfiles, Pagos Reportados y Reactivos Saber 11
-- ============================================================================

-- 1. Tabla de Perfiles de Estudiantes y Licencias Pro
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY DEFAULT '101',
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  is_pro BOOLEAN DEFAULT FALSE,
  xp_points INT DEFAULT 1250,
  streak_days INT DEFAULT 7,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Tabla de Pagos Reportados (Nequi, Daviplata, PayPal)
CREATE TABLE IF NOT EXISTS pending_payments (
  id TEXT PRIMARY KEY DEFAULT '101',
  student_name TEXT NOT NULL,
  method TEXT NOT NULL, -- 'Nequi', 'Daviplata', 'PayPal'
  amount TEXT NOT NULL,
  reference TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tabla de Banco de Preguntas y Simulacros Saber 11
CREATE TABLE IF NOT EXISTS exam_questions (
  id TEXT PRIMARY KEY DEFAULT '101',
  area TEXT NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option TEXT NOT NULL,
  explanation TEXT NOT NULL
);

-- ============================================================================
-- Registros Iniciales (IDs iniciados en 1)
-- ============================================================================

INSERT INTO profiles (id, full_name, email, is_pro, xp_points, streak_days) 
VALUES ('101', 'Eider Felipe Hurtado', 'eider@educacity.com', TRUE, 1250, 7)
ON CONFLICT (email) DO UPDATE 
SET full_name = EXCLUDED.full_name, is_pro = EXCLUDED.is_pro;

INSERT INTO pending_payments (id, student_name, method, amount, reference, status) 
VALUES 
('101', 'Camila González', 'Nequi', '$29.900 COP', '101-Neq-89321', 'pending'),
('102', 'Mateo Osorio', 'Daviplata', '$29.900 COP', '102-Dav-45102', 'pending')
ON CONFLICT (id) DO NOTHING;

-- Reactivos de Evaluación Oficial Saber 11 (IDs iniciados en 1)
INSERT INTO exam_questions (id, area, question_text, options, correct_option, explanation)
VALUES 
(
  '101',
  'Matemáticas',
  'En una pista circular de atletismo de 400 metros, dos corredores parten simultáneamente...',
  '[{"id": "A", "text": "A) 50 segundos"}, {"id": "B", "text": "B) 80 segundos"}, {"id": "C", "text": "C) 100 segundos"}, {"id": "D", "text": "D) 120 segundos"}]'::jsonb,
  'C',
  'Se plantea una ecuación de velocidades relativas igualando las distancias recorridas en función del tiempo t.'
),
(
  '102',
  'Lectura Crítica',
  'De acuerdo con el fragmento sobre la hiperconectividad, la paradoja se refiere a que:',
  '[{"id": "A", "text": "A) La tecnología destruye los canales físicos."}, {"id": "B", "text": "B) Se promete cercanía digital pero genera aislamiento físico."}, {"id": "C", "text": "C) Las redes sociales son perjudiciales para la salud."}, {"id": "D", "text": "D) Las comunidades virtuales reemplazan a las ciudades."}]'::jsonb,
  'B',
  'El texto contrasta la promesa de enlace global con la desconexión de la comunidad inmediata.'
),
(
  '103',
  'Ciencias Naturales (Física)',
  '¿Cuál es la velocidad final que alcanza un cuerpo con aceleración constante de 2 m/s² tras 5 segundos?',
  '[{"id": "A", "text": "A) 5 m/s"}, {"id": "B", "text": "B) 8 m/s"}, {"id": "C", "text": "C) 10 m/s"}, {"id": "D", "text": "D) 25 m/s"}]'::jsonb,
  'C',
  'Aplicando la ecuación cinemática V = a · t, se tiene (2 m/s²) · (5 s) = 10 m/s.'
),
(
  '104',
  'Sociales y Ciudadanas',
  '¿Cuál es el mecanismo de participación para revocar el mandato de un alcalde electo?',
  '[{"id": "A", "text": "A) Cabildo Abierto"}, {"id": "B", "text": "B) Revocatoria del Mandato"}, {"id": "C", "text": "C) Plebiscito"}, {"id": "D", "text": "D) Referendo"}]'::jsonb,
  'B',
  'La revocatoria del mandato es el derecho político específico consagrado en la Constitución de 1991.'
)
ON CONFLICT (id) DO NOTHING;

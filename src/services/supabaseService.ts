import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type PendingPaymentRow = Database['public']['Tables']['pending_payments']['Row'];
export type ExamQuestionRow = Database['public']['Tables']['exam_questions']['Row'];
export * from './paymentsService';

// Datos semilla de respaldo si Supabase está en modo offline o credenciales por defecto
const FALLBACK_PROFILE: ProfileRow = {
  id: '101',
  full_name: 'Eider Felipe Hurtado',
  email: 'eider@educacity.com',
  is_pro: true,
  xp_points: 1250,
  streak_days: 7,
  created_at: new Date().toISOString()
};

const FALLBACK_PAYMENTS: PendingPaymentRow[] = [
  {
    id: '101',
    student_name: 'Camila González',
    method: 'Nequi',
    amount: '$29.900 COP',
    reference: '101-Neq-89321',
    status: 'pending',
    created_at: new Date().toISOString()
  },
  {
    id: '102',
    student_name: 'Mateo Osorio',
    method: 'Daviplata',
    amount: '$29.900 COP',
    reference: '102-Dav-45102',
    status: 'pending',
    created_at: new Date().toISOString()
  }
];

export const supabaseService = {
  /**
   * Obtiene el perfil de estudiante por ID o el primer perfil activo
   */
  async getProfile(id = '101'): Promise<ProfileRow> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) {
        return FALLBACK_PROFILE;
      }
      return data;
    } catch {
      return FALLBACK_PROFILE;
    }
  },

  /**
   * Obtiene la lista de pagos reportados pendientes
   */
  async getPendingPayments(): Promise<PendingPaymentRow[]> {
    try {
      const { data, error } = await supabase
        .from('pending_payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return FALLBACK_PAYMENTS;
      }
      return data;
    } catch {
      return FALLBACK_PAYMENTS;
    }
  },

  /**
   * Actualiza el estado de un pago (aprobado o rechazado)
   */
  async updatePaymentStatus(id: string, status: 'approved' | 'rejected'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('pending_payments')
        .update({ status })
        .eq('id', id);

      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Registra un nuevo reporte de pago por transferencia móvil
   */
  async reportPayment(payment: {
    id?: string;
    student_name: string;
    method: 'Nequi' | 'Daviplata' | 'PayPal' | string;
    amount: string;
    reference: string;
  }): Promise<boolean> {
    try {
      const { error } = await supabase.from('pending_payments').insert({
        id: payment.id || `${Date.now()}`,
        student_name: payment.student_name,
        method: payment.method,
        amount: payment.amount,
        reference: payment.reference,
        status: 'pending'
      });
      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Obtiene los reactivos oficiales del examen Saber 11
   */
  async getExamQuestions(): Promise<ExamQuestionRow[]> {
    try {
      const { data, error } = await supabase
        .from('exam_questions')
        .select('*')
        .order('id', { ascending: true });

      if (error || !data) {
        return [];
      }
      return data;
    } catch {
      return [];
    }
  }
};

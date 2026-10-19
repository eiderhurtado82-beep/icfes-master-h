import { supabase } from '../lib/supabase';

export interface PendingPaymentRecord {
  id: string;
  student_name: string;
  method: 'Nequi' | 'Daviplata' | 'PayPal';
  amount: string;
  reference: string;
  status: string;
}

// Obtener pagos pendientes desde Supabase
export async function fetchPendingPayments(): Promise<PendingPaymentRecord[]> {
  const { data, error } = await supabase
    .from('pending_payments')
    .select('*')
    .eq('status', 'pending');

  if (error) {
    console.error('Error al consultar pagos en Supabase:', error.message);
    return [];
  }

  return (data as unknown as PendingPaymentRecord[]) || [];
}

// Aprobar pago y activar licencia Pro
export async function approveStudentPayment(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('pending_payments')
    .update({ status: 'approved' })
    .eq('id', id);

  if (error) {
    console.error('Error al aprobar el pago:', error.message);
    return false;
  }

  return true;
}

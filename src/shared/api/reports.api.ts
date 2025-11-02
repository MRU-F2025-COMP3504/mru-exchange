import { supabase } from '@shared/api';
import type { DatabaseQuery, PickOmit, Report } from '@shared/types';
import { ok, err } from '@shared/utils';

export async function createReport(
  report: PickOmit<Report, 'description'>,
): DatabaseQuery<Report> {
  const { data, error } = await supabase
    .from('Reports')
    .insert(report)
    .select()
    .single();

  return error ? err(error) : ok(data);
}

export async function getAllReports(
  columns: string,
): DatabaseQuery<Report[]> {
  const { data, error } = await supabase
    .from('Reports')
    .select(columns as '*')
    .order('created_at', { ascending: false });

  return error ? err(error) : ok(data);
}

export async function getUserReports(
  id: string,
  columns: string,
): DatabaseQuery<Report[]> {
  const { data, error } = await supabase
    .from('Reports')
    .select(columns as '*')
    .eq('created_by_id', id)
    .order('created_at', { ascending: false });

  return error ? err(error) : ok(data);
}

export async function getReportsAgainstUser(
  id: string,
  columns: string,
): DatabaseQuery<Report[]> {
  const { data, error } = await supabase
    .from('Reports')
    .select(columns as '*')
    .eq('created_by_id', id)
    .order('created_at', { ascending: false });

  return error ? err(error) : ok(data);
}

export async function closeReports(id: number): DatabaseQuery<Report> {
  const { data, error } = await supabase
    .from('Reports')
    .update({
      is_closed: true,
      closed_date: new Date().toISOString().split('T')[0],
    })
    .eq('id', id)
    .select()
    .single();

  return error ? err(error) : ok(data);
}

export async function reopenReport(id: number): DatabaseQuery<Report> {
  const { data, error } = await supabase
    .from('Reports')
    .update({
      is_closed: false,
      closed_date: null,
    })
    .eq('id', id)
    .select()
    .single();

  return error ? err(error) : ok(data);
}

export async function updateReport(
  id: number,
  linkedInformation: string,
): DatabaseQuery<Report> {
  const { data, error } = await supabase
    .from('Reports')
    .update({ linked_information: linkedInformation })
    .eq('id', id)
    .select()
    .single();

  return error ? err(error) : ok(data);
}

export async function deleteReport(id: number): DatabaseQuery<unknown> {
  const { error } = await supabase.from('Reports').delete().eq('id', id);

  return error ? err(error) : ok({});
}

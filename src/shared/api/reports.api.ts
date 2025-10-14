import { supabase } from '../utils/supabase';
import type { Report } from '../types/database.types';

export const reportsApi = {
  createReport: async (
    reporterId: string,
    reportedUserId: string,
    linkedInformation: string
  ) => {
    const { data, error } = await supabase
      .from('Reports')
      .insert({
        created_by_id: reporterId,
        created_on_id: reportedUserId,
        linked_information: linkedInformation,
        is_closed: false,
      })
      .select()
      .single();

    return { data, error };
  },

  getAllReports: async (includeClosed: boolean = false) => {
    let query = supabase
      .from('Reports')
      .select(
        `
        *,
        reporter:created_by_id (
          id,
          first_name,
          last_name,
          user_name,
          email,
          supabase_id
        ),
        reported_user:created_on_id (
          id,
          first_name,
          last_name,
          user_name,
          email,
          supabase_id
        )
      `
      )
      .order('created_at', { ascending: false });

    if (!includeClosed) {
      query = query.eq('is_closed', false);
    }

    const { data, error } = await query;

    return { data, error };
  },

  getUserReports: async (userId: string) => {
    const { data, error } = await supabase
      .from('Reports')
      .select(
        `
        *,
        reported_user:created_on_id (
          first_name,
          last_name,
          user_name
        )
      `
      )
      .eq('created_by_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  getReportsAgainstUser: async (userId: string) => {
    const { data, error } = await supabase
      .from('Reports')
      .select(
        `
        *,
        reporter:created_by_id (
          first_name,
          last_name,
          user_name
        )
      `
      )
      .eq('created_on_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  closeReport: async (reportId: number) => {
    const { data, error } = await supabase
      .from('Reports')
      .update({
        is_closed: true,
        closed_date: new Date().toISOString().split('T')[0],
      })
      .eq('id', reportId)
      .select()
      .single();

    return { data, error };
  },

  reopenReport: async (reportId: number) => {
    const { data, error } = await supabase
      .from('Reports')
      .update({
        is_closed: false,
        closed_date: null,
      })
      .eq('id', reportId)
      .select()
      .single();

    return { data, error };
  },

  updateReport: async (reportId: number, linkedInformation: string) => {
    const { data, error } = await supabase
      .from('Reports')
      .update({ linked_information: linkedInformation })
      .eq('id', reportId)
      .select()
      .single();

    return { data, error };
  },

  deleteReport: async (reportId: number) => {
    const { error } = await supabase.from('Reports').delete().eq('id', reportId);

    return { error };
  },
};

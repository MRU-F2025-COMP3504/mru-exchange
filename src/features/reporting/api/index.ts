import type {
  DatabaseQuery,
  RequiredColumns,
  Result,
  UserProfile,
  UserReport,
} from '@shared/types';
import { query, supabase } from '@shared/api';
import type { UserReporter } from '@features/reporting';
import { err, ok } from '@shared/utils';

export async function getByReporter(
  reporter: RequiredColumns<UserProfile, 'supabase_id'>,
): DatabaseQuery<UserReport[], '*'> {
  return query(
    await supabase
      .from('Reports')
      .select('*')
      .eq('created_by_id', reporter.supabase_id)
      .order('created_at', { ascending: false }),
  );
}

export async function getByReported(
  reported: RequiredColumns<UserProfile, 'supabase_id'>,
): DatabaseQuery<UserReport[], '*'> {
  return query(
    await supabase
      .from('Reports')
      .select('*')
      .eq('created_on_id', reported.supabase_id)
      .order('created_at', { ascending: false }),
  );
}

export function create(): UserReporter {
  const report: Partial<UserReport> = {};

  return {
    description(description: string): Result<UserReporter> {
      if (!description) {
        return err(new Error('User report description is not specified'));
      }

      return ok(this);
    },
    link(link: string): Result<UserReporter> {
      if (!link) {
        return err(new Error('User report link information is not specified'));
      }

      return ok(this);
    },
    async report(
      target: RequiredColumns<UserProfile, 'supabase_id'>,
    ): DatabaseQuery<UserReport, 'id'> {
      return query(
        await supabase
          .from('Reports')
          .insert({
            ...report,
            created_on_id: target.supabase_id,
          })
          .select('id')
          .single(),
      );
    },
  };
}

export async function remove(
  ...reports: RequiredColumns<UserReport, 'id'>[]
): DatabaseQuery<UserReport[], 'id'> {
  return query(
    await supabase
      .from('Reports')
      .delete()
      .in(
        'id',
        reports.map((report) => report.id),
      )
      .select('id'),
  );
}

export async function close(
  ...reports: RequiredColumns<UserReport, 'id'>[]
): DatabaseQuery<UserReport[], 'id'> {
  return query(
    await supabase
      .from('Reports')
      .update({
        is_closed: false,
        closed_date: new Date().toISOString().split('T')[0],
      })
      .in(
        'id',
        reports.map((report) => report.id),
      )
      .select(),
  );
}

export async function open(
  ...reports: RequiredColumns<UserReport, 'id'>[]
): DatabaseQuery<UserReport[], 'id'> {
  return query(
    await supabase
      .from('Reports')
      .update({
        is_closed: false,
        closed_date: null,
      })
      .in(
        'id',
        reports.map((report) => report.id),
      )
      .select('id'),
  );
}

export async function setDescription(
  report: RequiredColumns<UserReport, 'id' | 'description'>,
): DatabaseQuery<UserReport, 'id'> {
  return query(
    await supabase
      .from('Reports')
      .update(report)
      .eq('id', report.id)
      .select('id')
      .single(),
  );
}

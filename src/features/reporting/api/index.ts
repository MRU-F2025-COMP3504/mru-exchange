import type {
  DatabaseQuery,
  DatabaseQueryArray,
  DatabaseView,
  PickOmit,
  Result,
  UserReport,
} from '@shared/types';
import { ok, err } from '@shared/utils';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@shared/api';
import { query, view } from '@shared/api/database.ts';
import type { UserReporter } from '@features/reporting/types';

export async function getByReporter(
  reporter: PickOmit<User, 'id'>,
): DatabaseView<UserReport[]> {
  return view(
    await supabase
      .from('Reports')
      .select('*')
      .eq('created_by_id', reporter.id)
      .order('created_at', { ascending: false }),
  );
}

export async function getByReported(
  reported: PickOmit<User, 'id'>,
): DatabaseView<UserReport[]> {
  return view(
    await supabase
      .from('Reports')
      .select('*')
      .eq('created_on_id', reported.id)
      .order('created_at', { ascending: false }),
  );
}

export function create(): UserReporter {
  const report: Partial<UserReport> = {};

  return {
    description(description: string): Result<UserReporter, Error> {
      if (!description) {
        return err(new Error('User report description is not specified'));
      }

      return ok(this);
    },
    link(link: string): Result<UserReporter, Error> {
      if (!link) {
        return err(new Error('User report link information is not specified'));
      }

      return ok(this);
    },
    async report(
      target: PickOmit<User, 'id'>,
    ): DatabaseQuery<UserReport, 'id'> {
      return query(
        await supabase
          .from('Reports')
          .insert({
            ...report,
            created_on_id: target.id,
          })
          .select('id')
          .single(),
      );
    },
  };
}

export async function remove(
  ...reports: PickOmit<UserReport, 'id'>[]
): DatabaseQueryArray<UserReport, 'id'> {
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
  ...reports: PickOmit<UserReport, 'id'>[]
): DatabaseQueryArray<UserReport, 'id'> {
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
  ...reports: PickOmit<UserReport, 'id'>[]
): DatabaseQueryArray<UserReport, 'id'> {
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
  report: PickOmit<UserReport, 'id' | 'description'>,
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

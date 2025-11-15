import type {
  DatabaseQuery,
  RequiredColumns,
  Result,
  UserProfile,
  UserReport,
} from '@shared/types';
import { query, supabase } from '@shared/api';
import type { UserReporter } from '@features/reporting';
import { err, ok, REGEX_TEXT_PATH } from '@shared/utils';

interface UserReporting {
  /**
   * Retrieves user reports made by the given user.
   * Selects all columns.
   *
   * @param reporter the given user's identifier
   * @returns a promise that resolves to the corresponding user reports from the given user
   */
  getByReporter: (
    reporter: RequiredColumns<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<UserReport[], '*'>;

  /**
   * Retrieves user reports against the given user.
   * Selects all columns.
   *
   * @param reported the given user's identifier
   * @returns a promise that resolves to the corresponding user reports against the given user
   */
  getByReported: (
    reported: RequiredColumns<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<UserReport[], '*'>;

  /**
   * Creates a new report.
   *
   * @returns the user reporting builder
   */
  create: () => UserReporter;

  /**
   * Removes the given user report(s) made by the given user.
   *
   * @param reporter the given user's identifier
   * @param reports the given report identifier(s)
   * @returns a promise that resolves to the corresponding deleted user reports from the given user
   */
  remove: (
    reporter: RequiredColumns<UserProfile, 'supabase_id'>,
    reports: RequiredColumns<UserReport, 'id'>[],
  ) => DatabaseQuery<UserReport[], 'id'>;

  /**
   * Closes the given user report(s) made by the given user.
   *
   * @param reporter the given user's identifier
   * @param reports the given report identifier(s)
   * @returns a promise that resolves to the corresponding closed user reports from the given user
   */
  close: (
    reporter: RequiredColumns<UserProfile, 'supabase_id'>,
    reports: RequiredColumns<UserReport, 'id'>[],
  ) => DatabaseQuery<UserReport[], 'id'>;

  /**
   * Reopens the given user report(s) made by the given user.
   *
   * @param reporter the given user's identifier
   * @param reprots the given report identifier(s)
   * @returns a promise that resolves to the corresponding reopened user reports from the given user
   */
  open: (
    reporter: RequiredColumns<UserProfile, 'supabase_id'>,
    reports: RequiredColumns<UserReport, 'id'>[],
  ) => DatabaseQuery<UserReport[], 'id'>;

  /**
   * Modifies the given user report (description).
   *
   * @returns a promise that resolves to the corresponding modified user report
   */
  modify: (
    report: RequiredColumns<UserReport, 'id' | 'description'>,
  ) => DatabaseQuery<UserReport, 'id'>;
}

export const UserReporting: UserReporting = {
  getByReporter: async (
    reporter: RequiredColumns<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<UserReport[], '*'> => {
    return query(
      await supabase
        .from('Reports')
        .select('*')
        .eq('created_by_id', reporter.supabase_id)
        .order('created_at', { ascending: false }),
    );
  },
  getByReported: async (
    reported: RequiredColumns<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<UserReport[], '*'> => {
    return query(
      await supabase
        .from('Reports')
        .select('*')
        .eq('created_on_id', reported.supabase_id)
        .order('created_at', { ascending: false }),
    );
  },
  create: (): UserReporter => {
    const report: Partial<UserReport> = {};

    return {
      description(description: string): Result<UserReporter> {
        if (!description) {
          return err(new Error('User report description is not specified'));
        }

        return ok(this);
      },
      link(link: string): Result<UserReporter> {
        if (!REGEX_TEXT_PATH.test(link)) {
          return err(
            new Error('User report link information is not specified'),
          );
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
            } as UserReport)
            .select('id')
            .single(),
        );
      },
    };
  },
  remove: async (
    reporter: RequiredColumns<UserProfile, 'supabase_id'>,
    reports: RequiredColumns<UserReport, 'id'>[],
  ): DatabaseQuery<UserReport[], 'id'> => {
    return query(
      await supabase
        .from('Reports')
        .delete()
        .eq('created_by_id', reporter.supabase_id)
        .in(
          'id',
          reports.map((report) => report.id),
        )
        .select('id'),
    );
  },
  close: async (
    reporter: RequiredColumns<UserProfile, 'supabase_id'>,
    reports: RequiredColumns<UserReport, 'id'>[],
  ): DatabaseQuery<UserReport[], 'id'> => {
    return query(
      await supabase
        .from('Reports')
        .update({
          is_closed: false,
          closed_date: new Date().toISOString().split('T')[0],
        })
        .eq('created_by_id', reporter.supabase_id)
        .in(
          'id',
          reports.map((report) => report.id),
        )
        .select(),
    );
  },
  open: async (
    reporter: RequiredColumns<UserProfile, 'supabase_id'>,
    reports: RequiredColumns<UserReport, 'id'>[],
  ): DatabaseQuery<UserReport[], 'id'> => {
    return query(
      await supabase
        .from('Reports')
        .update({
          is_closed: false,
          closed_date: null,
        })
        .eq('created_by_id', reporter.supabase_id)
        .in(
          'id',
          reports.map((report) => report.id),
        )
        .select('id'),
    );
  },
  modify: async (
    report: RequiredColumns<UserReport, 'id' | 'description'>,
  ): DatabaseQuery<UserReport, 'id'> => {
    return query(
      await supabase
        .from('Reports')
        .update(report)
        .eq('id', report.id)
        .select('id')
        .single(),
    );
  },
};

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
      if (!REGEX_TEXT_PATH.test(link)) {
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
          } as UserReport)
          .select('id')
          .single(),
      );
    },
  };
}

export async function remove(
  reporter: RequiredColumns<UserProfile, 'supabase_id'>,
  ...reports: RequiredColumns<UserReport, 'id'>[]
): DatabaseQuery<UserReport[], 'id'> {
  return query(
    await supabase
      .from('Reports')
      .delete()
      .eq('created_by_id', reporter.supabase_id)
      .in(
        'id',
        reports.map((report) => report.id),
      )
      .select('id'),
  );
}

export async function close(
  reporter: RequiredColumns<UserProfile, 'supabase_id'>,
  ...reports: RequiredColumns<UserReport, 'id'>[]
): DatabaseQuery<UserReport[], 'id'> {
  return query(
    await supabase
      .from('Reports')
      .update({
        is_closed: false,
        closed_date: new Date().toISOString().split('T')[0],
      })
      .eq('created_by_id', reporter.supabase_id)
      .in(
        'id',
        reports.map((report) => report.id),
      )
      .select(),
  );
}

export async function open(
  reporter: RequiredColumns<UserProfile, 'supabase_id'>,
  ...reports: RequiredColumns<UserReport, 'id'>[]
): DatabaseQuery<UserReport[], 'id'> {
  return query(
    await supabase
      .from('Reports')
      .update({
        is_closed: false,
        closed_date: null,
      })
      .eq('created_by_id', reporter.supabase_id)
      .in(
        'id',
        reports.map((report) => report.id),
      )
      .select('id'),
  );
}

export async function modify(
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

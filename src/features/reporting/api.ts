import type { UserReporter } from '@features/reporting';
import { supabase } from '@shared/api';
import type {
  DatabaseQuery,
  RequireProperty,
  Result,
  UserProfile,
  UserReport,
} from '@shared/types';
import { err, FormUtils, ok, query, REGEX_TEXT_PATH } from '@shared/utils';
import { link } from 'fs';

/**
 * See the implementation below for more information.
 */
interface UserReporting {
  /**
   * Retrieves user reports made by the given user.
   * Selects all columns.
   *
   * @param reporter the given user identifier
   * @returns the {@link Promise} that resolves to the corresponding user reports from the given user
   */
  getByReporter: (
    reporter: RequireProperty<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<UserReport[], '*'>;

  /**
   * Retrieves user reports against the given user.
   * Selects all columns.
   *
   * @param reported the given user identifier
   * @returns the {@link Promise} that resolves to the corresponding user reports against the given user
   */
  getByReported: (
    reported: RequireProperty<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<UserReport[], '*'>;

  /**
   * Creates a new report.
   *
   * @returns the user reporting builder
   * @see {@link UserReporting} for more information on its builder features
   */
  create: () => UserReporter;

  /**
   * Removes the given user report(s) made by the given user.
   *
   * @param reporter the given user identifier
   * @param reports the given report identifier(s)
   * @returns the {@link Promise} that resolves to the corresponding deleted user reports from the given user
   */
  remove: (
    reporter: RequireProperty<UserProfile, 'supabase_id'>,
    reports: RequireProperty<UserReport, 'id'>[],
  ) => DatabaseQuery<UserReport[], 'id'>;

  /**
   * Closes the given user report(s) made by the given user.
   *
   * @param reporter the given user identifier
   * @param reports the given report identifier(s)
   * @returns the {@link Promise} that resolves to the corresponding closed user reports from the given user
   */
  close: (
    reporter: RequireProperty<UserProfile, 'supabase_id'>,
    reports: RequireProperty<UserReport, 'id'>[],
  ) => DatabaseQuery<UserReport[], 'id'>;

  /**
   * Reopens the given user report(s) made by the given user.
   *
   * @param reporter the given user identifier
   * @param reprots the given report identifier(s)
   * @returns the {@link Promise} that resolves to the corresponding reopened user reports from the given user
   */
  open: (
    reporter: RequireProperty<UserProfile, 'supabase_id'>,
    reports: RequireProperty<UserReport, 'id'>[],
  ) => DatabaseQuery<UserReport[], 'id'>;

  /**
   * Modifies the given user report (description).
   *
   * @returns the {@link Promise} that resolves to the corresponding modified user report
   */
  modify: (
    report: RequireProperty<UserReport, 'id' | 'description'>,
  ) => DatabaseQuery<UserReport, 'id'>;
}

/**
 * The user reporting feature is used to flag users and products if they believe that service or community rule violation(s) has occured.
 * Site moderators may review and manage user messaging and product reports through a review system.
 * Users may be shadow-banned depending on the type and severity of violation.
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @author Andrew Krawiec (AndrewTries)
 */
export const UserReporting: UserReporting = {
  async getByReporter(
    reporter: RequireProperty<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<UserReport[], '*'> {
    return query(
      await supabase
        .from('Reports')
        .select('*')
        .eq('created_by_id', reporter.supabase_id)
        .order('created_at', { ascending: false }),
    );
  },
  async getByReported(
    reported: RequireProperty<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<UserReport[], '*'> {
    return query(
      await supabase
        .from('Reports')
        .select('*')
        .eq('created_on_id', reported.supabase_id)
        .order('created_at', { ascending: false }),
    );
  },
  create(): UserReporter {
    const report: Partial<UserReport> = {};

    return {
      description(form: FormData, key = 'description'): Result<string> {
        const { data, error } = FormUtils.getString(form, key);

        if (error) {
          return err('Invalid report description', error);
        } else if (!data) {
          return err('Description cannot be empty', report);
        } else {
          return ok((report.description = data));
        }
      },
      link(form: FormData, key = 'link'): Result<string> {
        const { data, error } = FormUtils.getString(form, key);

        if (error) {
          return err('Invalid report link', error);
        } else if (!data) {
          return err('Link cannot be empty', report);
        } else if (!REGEX_TEXT_PATH.test(data)) {
          return err('Link cannot be a non-text file', data);
        } else {
          return ok((report.linked_information = data));
        }
      },
      isSatisfied(): boolean {
        if (!report.description) {
          return false;
        }

        return true;
      },
      async submit(
        target: RequireProperty<UserProfile, 'supabase_id'>,
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
  async remove(
    reporter: RequireProperty<UserProfile, 'supabase_id'>,
    reports: RequireProperty<UserReport, 'id'>[],
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
  },
  async close(
    reporter: RequireProperty<UserProfile, 'supabase_id'>,
    reports: RequireProperty<UserReport, 'id'>[],
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
  },
  async open(
    reporter: RequireProperty<UserProfile, 'supabase_id'>,
    reports: RequireProperty<UserReport, 'id'>[],
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
  },
  async modify(
    report: RequireProperty<UserReport, 'id' | 'description'>,
  ): DatabaseQuery<UserReport, 'id'> {
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

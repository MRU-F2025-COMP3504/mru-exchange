import type {
  DatabaseQuery,
  RequiredColumns,
  Result,
  UserProfile,
  UserReport,
} from '@shared/types';

export interface UserReporter {
  description: (description: string) => Result<this>;
  link: (link: string) => Result<this>;
  report: (
    target: RequiredColumns<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<UserReport, 'id'>;
}

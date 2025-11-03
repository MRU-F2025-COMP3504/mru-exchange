import type { User } from '@supabase/supabase-js';
import type {
  DatabaseQuery,
  RequiredColumns,
  Result,
  UserReport,
} from '@shared/types';

export interface UserReporter {
  description(description: string): Result<this, Error>;
  link(link: string): Result<this, Error>;
  report(target: RequiredColumns<User, 'id'>): DatabaseQuery<UserReport, 'id'>;
}

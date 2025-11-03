import type { User } from '@supabase/supabase-js';
import type {
  DatabaseQuery,
  PickOmit,
  Result,
  UserReport,
} from '@shared/types';

export interface UserReporter {
  description(description: string): Result<this, Error>;
  link(link: string): Result<this, Error>;
  report(target: PickOmit<User, 'id'>): DatabaseQuery<UserReport, 'id'>;
}

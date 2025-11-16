import type { PromiseResult, Result } from '@shared/types';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@shared/types';

export interface UserCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface UserCredentialsValidator {
  email: (email: string) => Result<this>;
  password: (password: string) => Result<this>;
  fullname: (first: string, last: string) => Result<this>;
  username: (username: string) => Result<this>;
  submit: () => PromiseResult<User | UserProfile>;
}

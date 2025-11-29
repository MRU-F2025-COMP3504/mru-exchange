import type { Result } from '@shared/types';
import { err, ok } from '@shared/utils';

interface FormUtils {
  getString: (form: FormData, key: string) => Result<string>;
  getFile: (form: FormData, key: string) => Result<File>;
}

export const FormUtils: FormUtils = {
  getString(form: FormData, key: string): Result<string> {
    const input = form.get(key);

    if (typeof input === 'string') {
      return ok(input.trim());
    }

    return err(
      `No string found in the form data (key: ${JSON.stringify(input)})`,
    );
  },
  getFile(form: FormData, key: string): Result<File> {
    const input = form.get(key);

    if (input && typeof input !== 'string') {
      return ok(input);
    }

    return err(`No file found in the form data (key: ${input})`);
  },
};

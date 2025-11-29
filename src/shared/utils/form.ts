import type { Result } from '@shared/types';
import { err, ok } from '@shared/utils';

interface FormUtils {
  getStrings: (form: FormData, key: string) => Result<string[]>;
  getString: (form: FormData, key: string) => Result<string>;
  getFile: (form: FormData, key: string) => Result<File>;
  getFiles: (form: FormData, key: string) => Result<File[]>;
}

export const FormUtils: FormUtils = {
  getStrings(form: FormData, key: string): Result<string[]> {
    const input = form.getAll(key);
    const values: string[] = [];

    for (const value of input) {
      if (typeof value !== 'string') {
        return err(
          `Invalid string detected in the form data (key: ${key}, input: ${JSON.stringify(input)})`,
        );
      }

      values.push(value.trim());
    }

    return ok(values);
  },
  getString(form: FormData, key: string): Result<string> {
    const input = form.get(key);

    if (typeof input === 'string') {
      return ok(input.trim());
    }

    return err(
      `No string found in the form data (key: ${key}, input: ${JSON.stringify(input)})`,
    );
  },
  getFiles(form: FormData, key: string): Result<File[]> {
    const input = form.getAll(key);

    for (const value of input) {
      if (typeof value === 'string') {
        return err(
          `Invalid file detected in the form data (key: ${key}, input: ${JSON.stringify(input)})`,
        );
      }
    }

    return ok(input as File[]);
  },
  getFile(form: FormData, key: string): Result<File> {
    const input = form.get(key);

    if (input && typeof input !== 'string') {
      return ok(input);
    }

    return err(`No file found in the form data (key: ${key}, input: ${input})`);
  },
};

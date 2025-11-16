import type { Dispatch, SetStateAction } from 'react';

interface HookUtils {
  /**
   * A hook utility function that automatically assigns the loading state upon during the awaiting process of the given {@link Promise}.
   * - The {@link setLoading()} is assigned as `true` before awaiting the promise.
   * - After the awaited promise, the {@link setLoading()} is assigned to `false` and the given promise is returned back.
   *
   * @returns the given promise
   */
  load: <T>(
    setLoading: Dispatch<SetStateAction<boolean>>,
    promise: Promise<T>,
  ) => Promise<T>;
}

/**
 * The hook utilities are used to automate the creation and usage of React hooks and serves as a quality-of-life.
 */
export const HookUtils = {
  load: async <T>(
    setLoading: Dispatch<SetStateAction<boolean>>,
    promise: Promise<T>,
  ): Promise<T> => {
    setLoading(true);

    const result = await promise;

    setLoading(false);

    return result;
  },
};

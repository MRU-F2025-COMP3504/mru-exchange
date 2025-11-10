import type { Dispatch, SetStateAction } from 'react';

export async function load<T>(setLoading: Dispatch<SetStateAction<boolean>>, promise: Promise<T>): Promise<T> {
  setLoading(true);
  
  const result = await promise;
  
  setLoading(false);
  
  return result;
}
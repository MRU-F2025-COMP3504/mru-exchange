export type RequiredColumns<T, K extends keyof T> = Pick<T, K> &
  Partial<Omit<T, K>>;

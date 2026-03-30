export interface KVStoreOptions {
  ttlSeconds?: number;
  metadata?: Record<string, string>;
}

export interface KVListResult {
  keys: Array<{ name: string; metadata?: Record<string, string> }>;
  cursor?: string;
  complete: boolean;
}

export interface KVStorePort {
  get<T = string>(key: string): Promise<T | null>;

  put(
    key: string,
    value: string | ArrayBuffer,
    options?: KVStoreOptions,
  ): Promise<void>;

  delete(key: string): Promise<void>;

  list(
    prefix?: string,
    cursor?: string,
    limit?: number,
  ): Promise<KVListResult>;
}

export interface StorageMetadata {
  contentType?: string;
  contentLength?: number;
  customMetadata?: Record<string, string>;
}

export interface StorageObject {
  key: string;
  data: ReadableStream | ArrayBuffer;
  metadata: StorageMetadata;
}

export interface StorageListResult {
  objects: Array<{ key: string; metadata: StorageMetadata }>;
  cursor?: string;
}

export interface StoragePort {
  get(key: string): Promise<StorageObject | null>;

  put(
    key: string,
    data: ReadableStream | ArrayBuffer,
    metadata?: StorageMetadata,
  ): Promise<void>;

  delete(key: string): Promise<void>;

  list(
    prefix?: string,
    cursor?: string,
    limit?: number,
  ): Promise<StorageListResult>;

  getSignedUrl(key: string, expiresInSeconds: number): Promise<string>;
}

export interface VectorEntry {
  id: string;
  values: number[];
  metadata?: Record<string, string | number | boolean>;
}

export interface VectorQueryResult {
  id: string;
  score: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface VectorizePort {
  upsert(vectors: VectorEntry[]): Promise<void>;

  query(
    vector: number[],
    topK?: number,
    filter?: Record<string, unknown>,
  ): Promise<VectorQueryResult[]>;

  deleteByIds(ids: string[]): Promise<void>;
}

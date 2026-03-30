export interface QueryResult<T = Record<string, unknown>> {
  rows: T[];
  rowsAffected: number;
  lastRowId?: number;
}

export interface DatabasePort {
  query<T = Record<string, unknown>>(
    sql: string,
    params?: unknown[],
  ): Promise<QueryResult<T>>;

  execute(sql: string, params?: unknown[]): Promise<QueryResult>;

  batch(
    statements: Array<{ sql: string; params?: unknown[] }>,
  ): Promise<QueryResult[]>;
}

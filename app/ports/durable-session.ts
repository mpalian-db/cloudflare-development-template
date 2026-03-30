// WebSocket refers to the standard Web API WebSocket, not a Cloudflare-specific type.
export interface DurableSessionPort<TState = Record<string, unknown>> {
  getState(): Promise<TState>;
  setState(state: Partial<TState>): Promise<void>;
  alarm(scheduledTime: Date): Promise<void>;
  acceptWebSocket(): WebSocket;
  broadcast(message: string | ArrayBuffer): Promise<void>;
}

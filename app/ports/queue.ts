export interface QueueMessage<T = unknown> {
  id: string;
  body: T;
  timestamp: Date;
}

export interface QueuePort<T = unknown> {
  send(message: T): Promise<void>;
  sendBatch(messages: T[]): Promise<void>;
}

export interface QueueConsumer<T = unknown> {
  process(
    handler: (messages: QueueMessage<T>[]) => Promise<void>,
  ): void;
}

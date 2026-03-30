export interface AITextOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface AIPort {
  generateText(prompt: string, options?: AITextOptions): Promise<string>;
  generateEmbedding(text: string, model?: string): Promise<number[]>;
}

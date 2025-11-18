
export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export type View = 'chat' | 'image';

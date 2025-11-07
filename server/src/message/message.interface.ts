export interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'file';
  sender: string;
  timestamp: Date;
  fileName?: string;
  fileSize?: number;
}

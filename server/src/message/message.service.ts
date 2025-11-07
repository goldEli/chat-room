import { Injectable } from '@nestjs/common';
import { Message } from './message.interface';

@Injectable()
export class MessageService {
  private messages: Message[] = [];

  addMessage(message: Omit<Message, 'id' | 'timestamp'>): Message {
    const newMessage: Message = {
      ...message,
      id: this.generateId(),
      timestamp: new Date(),
    };
    this.messages.push(newMessage);
    return newMessage;
  }

  getAllMessages(): Message[] {
    return this.messages.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}

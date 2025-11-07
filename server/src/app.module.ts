import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { MessageService } from './message/message.service';
import { UploadController } from './upload/upload.controller';

@Module({
  imports: [],
  controllers: [AppController, UploadController],
  providers: [AppService, MessageService, ChatGateway],
})
export class AppModule {}

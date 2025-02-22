import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { AppService } from './app.service';
import { OllamaService } from './ollama/ollama.service';
import { DataProcessingService } from './data-processing/data-processing.service';
import { DatabaseService } from './database/database.service';
import { RagService } from './rag/rag/rag.service';
import  CustomConfigLoader  from './custom-config/custom-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      // @ts-expect-error the typings are wrong
      load: [CustomConfigLoader]
    })
  ],
  controllers: [AppController],
  providers: [AppService, OllamaService, DataProcessingService, DatabaseService, RagService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { AppService } from './app.service';
import { OllamaService } from './ollama/ollama.service';
import  CustomConfigLoader  from './custom-config/custom-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      // @ts-expect-error the typings are wrong
      load: [CustomConfigLoader]
    })
  ],
  controllers: [AppController],
  providers: [AppService, OllamaService],
})
export class AppModule {}

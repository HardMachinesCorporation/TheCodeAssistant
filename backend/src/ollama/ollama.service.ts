import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OllamaEmbeddings, ChatOllama } from '@langchain/ollama';

@Injectable()
export class OllamaService {
    embeddings:OllamaEmbeddings;
    chat: ChatOllama

    constructor(private readonly configService: ConfigService){
        // Setup our Ebmbeddins using our kuzcorc config file.
        this.embeddings = new OllamaEmbeddings({
            model: this.configService.get<string>("model"), // "llama2", //default value
            baseUrl: this.configService.get<string>("url"), // http://localhost:11434, // default value
            requestOptions: this.configService.get<Record<string,string>>("requestOptions")
       
        })

        // Setup our chat 
        this.chat = new ChatOllama({
            model : this.configService.get<string>("model"),  // "llama2", //default value
            baseUrl: this.configService.get<string>("url"), // http://localhost:11434, // default value
            format: this.configService.get<string>("format"),// "json",  // default value
            temperature: this.configService.get<number>("chatTemperature", 0.5), //defaut value
            topP:this.configService.get<number>("toP", 1), //defaut value
            topK: this.configService.get<number>("topK", 40) //defaut value
        })    
        
    }


    getEbeddings(): OllamaEmbeddings {
        return this.embeddings
    }

    getChat(): ChatOllama {
        return this.chat;
    }

    async sendPrompt(prompt:string){
        return this.chat.invoke(prompt);
    }
}

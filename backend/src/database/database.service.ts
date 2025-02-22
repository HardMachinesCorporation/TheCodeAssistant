import { Injectable } from '@nestjs/common';
import {PrismaVectorStore} from "@langchain/community/vectorstores/prisma"
import { ConfigService } from '@nestjs/config';
import { OllamaService } from 'src/ollama/ollama.service';

import { PrismaClient, Prisma } from '@prisma/client';


@Injectable()
export class DatabaseService {
    private vectorStore;
    private readonly prisma = new PrismaClient()

    constructor(
        private readonly ollamaService:OllamaService, 
        private readonly configService:ConfigService){
            this.initVectorStore()
        }


        getVectorStore(){
            console.log("getting vector store")
            return this.vectorStore
        }

    async addDocuments(document: any[]): Promise<void>{
        await this.vectorStore.addDocuments(document)
    }

        async initVectorStore(): Promise<void>{
            console.log("calling init vector store")
            this.vectorStore = await new PrismaVectorStore(
                this.ollamaService.getEbeddings(),
                {
                    db:this.prisma,
                    prisma: Prisma,
                    tableName: this.configService.get<string>("database.tableName") ?? "documents",
                    vectorColumnName: this.configService.get<string>("database.columnName") ?? "match_document",
                    columns : {
                        id: PrismaVectorStore.IdColumn,
                        content: PrismaVectorStore.ContentColumn
                    }
                }
            )
            // ... (Code for initializin the vector store)
        }
}

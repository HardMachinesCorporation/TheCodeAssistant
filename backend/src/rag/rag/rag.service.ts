import { Injectable } from '@nestjs/common';
import { END, MemorySaver, START, StateGraph} from '@langchain/langgraph';
import { OllamaService } from 'src/ollama/ollama.service';
import {StringOutputParser} from "@langchain/core/output_parsers"
import { pull } from "langchain/hub";
import { RetriverService } from 'src/rag/retriver/retriver.service';
import { Utils } from '../utils/utils';
import type { Document } from "@langchain/core/documents";

interface RAGState {
    question: string;
    generation: string;
    document: Document[];
    channels: any;
   
}

@Injectable()
export class RagService {
    ragChain:any
    graph:any 

    constructor(
        private readonly ollamaService: OllamaService,
        private readonly retrieverService: RetriverService
    ){
        // Initialize the ragChain asynchronously
        this.initializeRagChain();
    }


    private async initializeRagChain() {
        try {
            // Retrieve the prompt module
            const module = await pull('sde/rag-prompot');
            // Set up the ragChain
            this.ragChain = module.pipe(this.ollamaService.chat).pipe(new StringOutputParser());
        } catch (error) {
            console.error('Error initializing ragChain:', error);
        }
    }


    async run(question:string): Promise<string>{
        const app = this.graph.compile({
            checkpointer:MemorySaver,
        })
        return app.invoke(question)
    }

    async setupGraph(_graphState:RAGState){
        this.graph = new StateGraph({
            channels:_graphState
        })
            .addNode("retrive", this.retrieve)
            .addNode("generate", this.generate)
    }

    async retrieve(state:RAGState){
        const document = await this.retrieverService
        .getRetriever()
        .invoke(state.question)
        return {document}
    }

    async generate(state:RAGState){
        const generation = await this.ragChain.invoke({
            context: Utils.formatDocs(state.document),
            question:state.question
        })

        return { generation }
    }
}

import { Injectable } from '@nestjs/common';
import type { BaseRetrieverInterface } from '@langchain/core/dist/retrievers';
import {createRetrieverTool} from "langchain/tools/retriever"
import {ToolExecutor,ToolNode} from "@langchain/langgraph/prebuilt"
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RetriverService {
    retriever: BaseRetrieverInterface<Record<string, any>>
    toolExecutor:any 
    constructor(private readonly database:DatabaseService){
        this.retriever = this.database.getVectorStore().asRetriever()

        const tool = createRetrieverTool(this.retriever, {
            name: "retriver_code_files",
            description: "Retrives code files"
        })
        // @deprecated — Use ToolNode instead.
        this.toolExecutor = new ToolExecutor({
            tools:[tool]
        })
    }

   public getRetriever(){
        return this.retriever
    }
}

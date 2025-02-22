import { Injectable } from '@nestjs/common';
import {
    DirectoryLoader, // Use to load our file from the fs
    UnknownHandling, // used to handle any unknown errors 
} from "langchain/document_loaders/fs/directory"
import { RecursiveCharacterTextSplitter} from "langchain/text_splitter"
import {TextLoader} from "langchain/document_loaders/fs/text"
import {ConfigService} from "@nestjs/config"
import { DatabaseService} from "src/database/database.service"


@Injectable()
export class DataProcessingService {
    constructor(
        private readonly configService:ConfigService,
        private readonly databaseService: DatabaseService
    ){}


    async extractAndStoreData(directory):Promise<void>{
        // OUTPUT is a list of docs
        const docs = await this.loadWorkspace(directory)
        const texts = await this.extract(docs)
        // OUTPUT turn text into embeddings
        await this.storeGraph(texts)
    }


    async loadWorkspace(directory){
        const REPO_PATH = directory || this.configService.get<string>("workspace")
        // This tell langchain we wanna looks for file with those extensions.
        const loaders = this.configService.get<string[]>("extensions") || [
            ".ts",
            ".js",
            ".json",
            ".jsonc",
            ".md"
        ]
        // We only want the source code
        const exclude_globs = this.configService.get<string[]>("exclude")

        const loads = loaders.reduce( (acc, cur)=> {
            acc[cur] = (path) => new TextLoader(path)
            return acc
        }, {})

        const loader = new DirectoryLoader(
            REPO_PATH,
            loads,
            true, // tell langchain that we would like to go to the directory recursively.
            UnknownHandling.Ignore, // stagery when we run into unknown type of file
            
        )

        const docs = (await loader.load()).filter(doc =>
            !exclude_globs?.some(pattern => doc.metadata.source.includes(pattern))

            /*** 
            ✅ Respects DirectoryLoader API – No extra parameters.
            ✅ Excludes files properly – Filters documents after loading.
            ✅ Simple & Effective – Keeps your code clean.
            ***/
        );

        return docs
    }


    async extract(docs:any){
        const javascriptSplitter = RecursiveCharacterTextSplitter.fromLanguage(
            "js",{
                chunkOverlap:200,
                chunkSize:2000
            }
        )
        const texts = await javascriptSplitter.splitDocuments(docs)
        console.log("loaded",texts.length, "documents.")
        return texts
    }


    async storeGraph(texts:any): Promise<any>{
        this.databaseService.addDocuments(texts)
    }
}

import { Disposable, ChatRequest,ChatContext, ChatResult, ChatResponseStream, CancellationToken, commands } from "vscode";

export const hmcChat = {
    _disposable: [] as Disposable[],
    async intialize(
        request : ChatRequest,
        context: ChatContext,
        stream: ChatResponseStream,
        token: CancellationToken
    ): Promise<ChatResult>{
        if (request.command === "ingest") {
            stream.progess("Ingesting your repo");
            this.ingestCall(request.prompt);
        }

        return { metadata: {command : "ingest"} };
    },

    async ingestCall(prompt:string){
        return prompt;

    }
}
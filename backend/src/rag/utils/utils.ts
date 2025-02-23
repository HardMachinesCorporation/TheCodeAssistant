import type { Document } from "@langchain/core/documents";
export const Utils ={
    formatDocs:(documents:Document[]) => {
        return documents.map( (doc) => doc.pageContent).join("\n\n")
    }
}

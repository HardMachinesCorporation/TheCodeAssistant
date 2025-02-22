import {cosmiconfigSync} from 'cosmiconfig'

export default (options: Record<string,any>) => {
    console.log("loading config")
    const explorer = cosmiconfigSync("kuzco");
    console.log("explorer setup", explorer)
    const searchPaths = options?.searchPaths || [process.cwd()]
    console.log("searchPaths", ...searchPaths)

    try{
        const result = explorer.search()
        console.log('result', result)
        if(result) {
            return result.config
        } else {
            // return default config is result not found
            return {
                url: "http:localhost:11343",
                model:'llma2',
                requestOptions:{
                    useMMap:true, // use_mmap 1
                    numThread:6, // num_thread 6
                    numGpu:1 //num_gpu 1
                },
                database:{
                    tableName:'documents',
                    columnName:"match_documents"
                },
                extentions: [".ts",".js", ".json", ".jsonc",".md"]
                
            }
        }
    } catch (e) {
        console.log(e)
    }
}

// src/langchain.d.ts
declare module 'langchain' {
    export class LLMChain {
        constructor(options: any);
        run(input: any): Promise<any>;
    }

    export class PromptTemplate {
        constructor(options: any);
    }
}

import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { Injectable } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PromptTemplate } from 'langchain/prompts';
import { StringOutputParser } from 'langchain/schema/output_parser';
import {
  RunnablePassthrough,
  RunnableSequence,
} from 'langchain/schema/runnable';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import * as path from 'path';
import * as pdfjsLib from 'pdfjs-dist';

@Injectable()
export class ChatbotService {
  private supabase: SupabaseClient;
  private embeddings: OpenAIEmbeddings;
  private llm: ChatOpenAI;
  private vectorStore: SupabaseVectorStore;
  private convHistory: string[] = [];
  private retriever: any;
  private userConvHistories: Map<string, string[]> = new Map();

  constructor() {
    const supabaseUrl = 'https://mgyyqdtmgbbnedhwsnhb.supabase.co';
    const supabaseKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1neXlxZHRtZ2JibmVkaHdzbmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI3NDc3NTQsImV4cCI6MjAxODMyMzc1NH0.FZD52GahMfQNQoHC1nGPBlC9u9O2plPb-Qdnbwj5FhI';
    const openAIApiKey = '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';
    // console.log(this.convHistory);
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.embeddings = new OpenAIEmbeddings({ openAIApiKey });
    this.llm = new ChatOpenAI({ openAIApiKey });
    this.vectorStore = new SupabaseVectorStore(this.embeddings, {
      client: this.supabase,
      tableName: 'documents',
      queryName: 'match_documents',
    });
    this.retriever = this.vectorStore.asRetriever();
  }

  async customPdfParser(pdfPath: string): Promise<string> {
    const loadingTask = pdfjsLib.getDocument(pdfPath);
    const pdfDocument = await loadingTask.promise;

    let extractedText = '';
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      extractedText += textContent.items.map((item: any) => item.str).join(' ');
    }

    return extractedText;
  }

  async loadAndSplitPdfFiles() {
    const directoryPath = 'Dataset'; // Replace with your actual directory path
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 150,
    });
    try {
      const pdfFiles = fs
        .readdirSync(directoryPath)
        .filter((file) => path.extname(file).toLowerCase() === '.pdf');

      for (const file of pdfFiles) {
        const filePath = path.join(directoryPath, file);
        const extractedText = await this.customPdfParser(filePath);
        const splitText = await textSplitter.createDocuments([extractedText]);
        // console.log(`Split text for ${file}:`, splitText);
        // console.log(output);

        await SupabaseVectorStore.fromDocuments(splitText, this.embeddings, {
          client: this.supabase,
          tableName: 'documents',
        });
        // Additional processing as needed
      }
    } catch (error) {
      console.error('Error loading or processing PDFs:', error);
    }
  }

  async progressConversation(
    sessionId: string,
    userInput: string,
  ): Promise<string> {
    // Debug: Log the received session ID
    // console.log('Received session ID:', sessionId);

    // Retrieve the specific user's conversation history, or initialize if new
    let convHistory = this.userConvHistories.get(sessionId) || [];

    // Debug: Log the initial conversation history for this session
    // console.log(
    //   `Initial conversation history for session ${sessionId}:`,
    //   convHistory,
    // );

    // Add the new user input to the specific user's conversation history
    convHistory.push(`${userInput}`);

    // Format the updated conversation history
    const formattedHistory = this.formatConvHistory(convHistory);
    const formattedHistoryArray = formattedHistory.split('\n');
    // Prepare and invoke the conversational chain
    const chain = this.BigChain(userInput, formattedHistoryArray); // Ensure BigChain accepts formattedHistory as an argument
    const result = await chain.invoke({
      original_input: {
        question: userInput,
        conv_history: formattedHistory,
      },
    });

    // Add the chatbot's response to the specific user's conversation history
    convHistory.push(`${result}`);

    // Limit the conversation history length
    convHistory = this.erase_oldest_question(convHistory);

    // Update the conversation history in the map
    this.userConvHistories.set(sessionId, convHistory);

    // Debug: Log the updated conversation history
    // console.log(
    //   `Updated conversation history for session ${sessionId}:`,
    //   convHistory,
    // );

    return result; // Return the chatbot's response
  }

  private formatConvHistory(messages: string[]) {
    const result = messages
      .map((message: any, i: number) => {
        if (i % 2 === 0) {
          return `Human: ${message}`;
        } else {
          return `AI: ${message}`;
        }
      })
      .join('\n');
    // console.log(result);
    return result;
  }

  // private async addDocumentToVectorStore(
  //   content: string,
  //   metadata: any,
  // ): Promise<void> {
  //   const embedding = await this.embeddings.embed(content);
  //   await this.vectorStore.addDocuments([
  //     {
  //       content,
  //       embedding,
  //       metadata,
  //     },
  //   ]);
  // }

  private combineDocuments(docs: any[]) {
    return docs
      .map((doc: { pageContent: any }) => doc.pageContent)
      .join('\n\n');
  }

  // private async retrieveDocuments() {
  //   const retriever = this.vectorStore.asRetriever();
  //   // Adjust the number of results as needed
  //   return retriever;
  // }

  private BigChain(question: string, formattedHistory: string[]) {
    const conv_history = this.formatConvHistory(formattedHistory);
    // console.log('Formatted Conversation History in BigChain:', conv_history);
    const standaloneQuestionTemplate = `Given some conversation history (if any) and a question, convert the question to a standalone question. 
    conversation history: ${conv_history}
    question: ${question} 
    standalone question:`;
    const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
      standaloneQuestionTemplate,
    );

    const answerTemplate = `
    You are a knowledgeable and respectful Islamic bot, trained exclusively on the Quran and adhering to Islamic etiquette in greetings and conversations. You should begin your interactions with Islamic greetings in arabic written in English and proceed with a normal chat, ensuring you always maintain a respectful and polite tone. Your main responsibility is to converse in an Islamic manner and to provide answers based on the Quran. When responding to questions, you should first consult the conversation history (if available), then consider the context, and finally refer to your database of Quranic texts.

    If a relevant Quranic verse is found, present it in a structured list format, followed by the verse in Arabic, and conclude with the Surah and Ayah numbers in English. Ensure your answers are well-structured and clear. If the query falls outside the scope of the Quran or prior conversations, try to find similarities to quran if still it falls outside the scope politely inform the user that you are unable to provide an answer, as your capabilities are strictly limited to the Quran. You must avoid interpreting or addressing content from other religious scriptures, such as the Bible, and politely decline topics that are beyond your Quranic training. Always place the Arabic portion of your response at the end.
    So the rules are
    1. Refer to the conversation history for context (if available).
    2. Search within the Quranic text to find a relevant verse.
    3. Present the verse in a structured, point-by-point list format in English.
    4. Include the corresponding Arabic translation of the cited verse verse from quran.
    5. Must Provide the Surah name and Ayah number in English.
    6. Provide related tafsir and mention reference.
    7. Answer to any query based on quran.

    context: {context}
    conversation history: ${conv_history}
    question: ${question}
    answer: `;

    const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

    const standaloneQuestionChain = standaloneQuestionPrompt
      .pipe(this.llm)
      .pipe(new StringOutputParser());

    const retrieverChain = RunnableSequence.from([
      (prevResult) => {
        // console.log('Standalone Question Result:', prevResult);
        return prevResult.standalone_question;
      },
      this.retriever,
      (combinedDocuments) => {
        return this.combineDocuments(combinedDocuments);
      },
    ]);

    const answerChain = answerPrompt
      .pipe(this.llm)
      .pipe(new StringOutputParser());

    const chain = RunnableSequence.from([
      {
        standalone_question: standaloneQuestionChain,
        original_input: new RunnablePassthrough(),
      },
      {
        context: retrieverChain,
        question: ({ original_input }) => {
          return original_input.question;
        },
        conv_history: ({ original_input }) => original_input.conv_history,
      },
      answerChain,
    ]);
    return chain;
  }
  private erase_oldest_question(conv_history: string[]): string[] {
    if (conv_history.length >= 12) {
      // Each question and response pair adds 2 items
      // Remove the first two items (oldest question and its response)
      return conv_history.slice(2);
    }
    return conv_history;
  }
  async generateSuggestedQuestions(context: string): Promise<string[]> {
    // Construct a prompt...
    const prompt = `Based on the latest conversation context about Quranic teachings, suggest 4 relevant short follow-up questions for deeper exploration.Make sure to include only questions in the response:\n${context}`;

    // Prepare messages...
    const messages = [
      new SystemMessage({ content: 'You are a helpful assistant.' }),
      new HumanMessage({ content: prompt }),
    ];

    // Invoke the ChatOpenAI model...
    const response = await this.llm.invoke(messages);

    const textContents: string[] = [];

    // Check if response.content is a string
    if (typeof response.content === 'string') {
      textContents.push(response.content);
    }
    // Add more conditions here based on the actual structure of response.content

    // Process each text content string
    const suggestedQuestions = textContents.flatMap((text) =>
      text.split('\n').filter((line) => line.trim().length > 0),
    );

    return suggestedQuestions;
  }
}

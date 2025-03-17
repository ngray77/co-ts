import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Runnable, RunnableSequence } from "@langchain/core/runnables";
import { END, StateGraph } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

import { RecordTypeDefinition } from './engine';
import { EventSequence, RecordChange, RecordSequence } from './event-manager';
import { HelperInterface } from './helper.interface';
import { Record } from './model';

/**
 * Helper implements HelperInterface using langgraph with OpenAI ChatGPT
 * for a simple hello world implementation.
 */
export class Helper implements HelperInterface {
  private recordDefinition: RecordTypeDefinition;
  private model: ChatOpenAI;
  private chain: Runnable;

  constructor(rd: RecordTypeDefinition) {
    this.recordDefinition = rd;
    
    // Initialize OpenAI model
    this.model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
    });

    // Create a simple prompt template
    const prompt = ChatPromptTemplate.fromTemplate(
      "You are a helpful assistant. Respond to the following input: {input}"
    );

    // Create a simple chain
    const chain = RunnableSequence.from([
      prompt,
      this.model,
      new StringOutputParser(),
    ]);

    // Create a simple chain that will be our graph
    this.chain = chain;
  }

  public async process(c: RecordChange): Promise<RecordChange[]> {
    // Extract input from the record change
    const input = c.changedRecord.Body;
    
    // Run the chain with the input
    const response = await this.chain.invoke({ input });
    
    // Create a new record with the response
    const newRec = new Record();
    newRec.Id = RecordSequence.next();
    newRec.ParentId = c.changedRecord.Id;
    newRec.Body = response;

    // Create a new record change
    const newChg = new RecordChange(
      c.eventId,
      EventSequence.next(),
      newRec,
      this.recordDefinition.recordType
    );
    
    return [newChg];
  }
}

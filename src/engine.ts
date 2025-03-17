import { FakeHelper } from './fake-helper';
import { Helper } from './Helper';
import { HelperInterface } from './helper.interface';
import { EventManager, RecordChange } from './event-manager';
import { IAdapter } from './fake-xl-io-adapter';
import { Model } from './model';

export class RecordTypeDefinition {
  public recordType: string = "";
  public readonly triggeredBy: RecordTypeDefinition[] = [];
}

export class EngineConfig {
  public readonly models: Model[] = [];
  public readonly registeredRecordTypes: RecordTypeDefinition[] = [];
  public readonly registeredAdapters: IAdapter[] = [];
}

export class Engine {
  private engineConfig: EngineConfig;
  private eventManager: EventManager = new EventManager();

  constructor(cfg: EngineConfig) {
    this.engineConfig = cfg;
  }

  public enqueueEvent(recordChange: RecordChange): void {
    this.engineConfig.registeredAdapters.forEach(ra => ra.pushEvent(recordChange));
    this.eventManager.events.enqueue(recordChange);
  }

  public async run(): Promise<void> {
    let rc: RecordChange | undefined;
    
    while (this.eventManager.events.count > 0) {
      // Emit to console
      rc = this.eventManager.events.dequeue();
      if (!rc) continue;
      
      // Find subscribing plugins to the event
      const subscribers = this.engineConfig.registeredRecordTypes.filter(
        rp => rp.triggeredBy.some(
          tb => tb.recordType === rc!.recordType
        )
      );

      for (const sub of subscribers) {
        // Create helper (either FakeHelper or real Helper)
        const helper: HelperInterface = //Math.random() > 0.5 ? 
          //new FakeHelper(sub) : 
          new Helper(sub);
        
        // Process the record change
        const newRCsPromise = helper.process(rc);
        
        // Handle both synchronous and asynchronous results
        const newRCs = await Promise.resolve(newRCsPromise);
        
        // Enqueue all new record changes
        for (const newRC of newRCs) {
          this.enqueueEvent(newRC);
        }
      }
    }
  }
}

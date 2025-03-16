import { Model } from './model';
import { EventManager, RecordChange } from './eventManager';
import { FakePlugin } from './fakePlugin';
import { IAdapter } from './fakeXLIOAdapter';

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

  public run(): void {
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
        // Run each plugin
        const fp = new FakePlugin(sub);
        const newRCs = fp.process(rc);

        while (newRCs.length > 0) {
          // Publish new returned events to the queue
          const newRC = newRCs[0];
          newRCs.splice(0, 1);
          this.enqueueEvent(newRC);
        }
      }
    }
  }
}

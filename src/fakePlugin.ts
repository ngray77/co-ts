import { Record } from './model';
import { RecordChange, RecordSequence, EventSequence } from './eventManager';
import { RecordTypeDefinition } from './engine';

/**
 * Plugins consume configured upstream sources, reflect on
 * their own record type, and yield added/changed/deleted
 * events of their record type.
 */
export class FakePlugin {
  private recordDefinition: RecordTypeDefinition;

  constructor(rd: RecordTypeDefinition) {
    this.recordDefinition = rd;
  }

  public process(c: RecordChange): RecordChange[] {
    // Create a random number of changes of this record type in response
    // to the upstream change, within reason
    const changes: RecordChange[] = [];
    let qty = Math.min(Math.max(1, (Math.floor(Math.random() * 3) + 1)), 3);
    
    while (qty-- > 0 && c.changedRecord.Body.length < 50) {
      const newRec = new Record();
      newRec.Id = RecordSequence.next();
      newRec.ParentId = c.changedRecord.Id;
      newRec.Body = ` ${c.changedRecord.Body}:${qty.toString()}`;

      const newChg = new RecordChange(
        c.eventId,
        EventSequence.next(),
        newRec,
        this.recordDefinition.recordType
      );
      changes.push(newChg);
    }
    
    return changes;
  }
}

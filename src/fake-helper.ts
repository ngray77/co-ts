import { RecordTypeDefinition } from './engine';
import { EventSequence, RecordChange, RecordSequence } from './event-manager';
import { HelperInterface } from './helper.interface';
import { Record } from './model';

/**
 * FakeHelper implements HelperInterface to consume configured upstream sources,
 * reflect on its own record type, and yield added/changed/deleted
 * events of its record type.
 */
export class FakeHelper implements HelperInterface {
  private recordDefinition: RecordTypeDefinition;

  constructor(rd: RecordTypeDefinition) {
    this.recordDefinition = rd;
  }

  public process(c: RecordChange): RecordChange[] {
    // Create a random number of changes of this record type in response
    // to the upstream change, within reason
    const changes: RecordChange[] = [];
    let qty = Math.min(Math.max(1, (Math.floor(Math.random() * 3) + 1)), 3);
    
    while (qty-- > 0 && c.changedRecord.body.length < 50) {
      const newRec = new Record();
      newRec.id = RecordSequence.next();
      newRec.parentId = c.changedRecord.id;
      newRec.body = ` ${c.changedRecord.body}:${qty.toString()}`;

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

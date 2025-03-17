import { Model, Record } from './model';
import { RecordChange, EventSequence } from './event-manager';

export interface IAdapter {
  getModel(recordType: string): Model;
  pushEvent(rc: RecordChange): void;
  clearDirty(): void;
}

export class FakeXLIOAdapter implements IAdapter {
  public readonly fakeFileData: Model[] = [];

  public getModel(recordType: string): Model {
    const model = this.fakeFileData.find(m => m.name === recordType);
    if (!model) {
      throw new Error(`Model with record type ${recordType} not found`);
    }
    return model;
  }

  public getDirtyRecords(recordType: string): Record[] {
    return this.getModel(recordType).Records.filter(r => r.IsDirty);
  }

  public getRecordChangeEvents(recordType: string): RecordChange[] {
    const result: RecordChange[] = [];
    const dirtyRecords = this.getDirtyRecords(recordType);
    
    for (const r of dirtyRecords) {
      result.push(new RecordChange(null, EventSequence.next(), r, recordType));
    }
    
    return result;
  }

  public clearDirty(): void {
    for (const file of this.fakeFileData) {
      for (const record of file.Records) {
        record.resetDirty();
      }
    }
  }

  public pushEvent(rc: RecordChange): void {
    const records = this.getModel(rc.recordType).Records;
    const matchingRec = records.find(r => r.Id === rc.changedRecord.Id);
    
    if (!matchingRec) {
      records.push(rc.changedRecord);
    }
  }
}

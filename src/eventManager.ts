import { Record } from './model';

export class RecordChange {
  constructor(
    public readonly parentEventId: number | null,
    public readonly eventId: number,
    public readonly changedRecord: Record,
    public readonly recordType: string = ""
  ) {}
}

export class EventManager {
  public readonly events: Queue<RecordChange> = new Queue<RecordChange>();
}

// Simple Queue implementation since TypeScript doesn't have a built-in Queue
export class Queue<T> {
  private items: T[] = [];
  
  enqueue(item: T): void {
    this.items.push(item);
  }
  
  dequeue(): T | undefined {
    return this.items.shift();
  }
  
  get count(): number {
    return this.items.length;
  }
}

// Static classes in C# become namespaces with static methods in TypeScript
export namespace RecordSequence {
  let seq = 1;
  
  export function next(): number {
    return seq++;
  }
}

export namespace EventSequence {
  let seq = 1000;
  
  export function next(): number {
    return seq++;
  }
}

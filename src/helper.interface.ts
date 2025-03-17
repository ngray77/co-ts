import { RecordTypeDefinition } from './engine';
import { RecordChange } from './event-manager';

/**
 * Interface for helpers that process record changes
 * and produce new record changes in response.
 */
export interface HelperInterface {
  /**
   * Process a record change and return new record changes
   * @param c The record change to process
   * @returns Array of new record changes or a Promise resolving to an array of record changes
   */
  process(c: RecordChange): RecordChange[] | Promise<RecordChange[]>;
}

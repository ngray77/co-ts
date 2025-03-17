import "dotenv/config";

import { Engine, EngineConfig, RecordTypeDefinition } from './engine';
import { RecordChange, RecordSequence } from './event-manager';
import { FakeXLIOAdapter } from './fake-xl-io-adapter';
import { Model, Record } from './model';

// Initialize the configuration
const cfg = new EngineConfig();

// Initialize the ontology
const goalRd = new RecordTypeDefinition();
goalRd.recordType = "Goal";
cfg.registeredRecordTypes.push(goalRd);

const personRd = new RecordTypeDefinition();
personRd.recordType = "Person";
personRd.triggeredBy.push(goalRd);
cfg.registeredRecordTypes.push(personRd);

const prefRd = new RecordTypeDefinition();
prefRd.recordType = "Preference";
prefRd.triggeredBy.push(personRd);
cfg.registeredRecordTypes.push(prefRd);

const needRd = new RecordTypeDefinition();
needRd.recordType = "Need";
needRd.triggeredBy.push(goalRd);
needRd.triggeredBy.push(personRd);
cfg.registeredRecordTypes.push(needRd);

const stuffRd = new RecordTypeDefinition();
stuffRd.recordType = "Item";
stuffRd.triggeredBy.push(needRd);
cfg.registeredRecordTypes.push(stuffRd);

// Initialize the adapters
const fakeXL = new FakeXLIOAdapter();
fakeXL.fakeFileData.push(new Model(goalRd.recordType));
fakeXL.fakeFileData.push(new Model(personRd.recordType));
fakeXL.fakeFileData.push(new Model(prefRd.recordType));
fakeXL.fakeFileData.push(new Model(needRd.recordType));
fakeXL.fakeFileData.push(new Model(stuffRd.recordType));

// Init the engine and adapter
const eng = new Engine(cfg);
cfg.registeredAdapters.push(fakeXL);

// Init a starting goal
const newGoal = new Record();
newGoal.Body = "Put a man on the moon";
newGoal.Id = RecordSequence.next();
fakeXL.getModel(goalRd.recordType).Records.push(newGoal);

console.log("\n" + "This is an Initial Starting 'Goal', the only data in the set".padEnd(100, '*'));
fakeXL.fakeFileData.forEach(m => m.prettyConsole());

// Run the engine for the starting goal
fakeXL.getRecordChangeEvents(goalRd.recordType).forEach(c => eng.enqueueEvent(c));
// Use an async IIFE to handle the async run method
(async () => {
  await eng.run();
  cfg.registeredAdapters.forEach(ra => ra.clearDirty());

  console.log("\n" + "And here is the Result after the engine runs, a fully populated model".padEnd(100, '*'));
  fakeXL.fakeFileData.forEach(m => m.prettyConsole());

  // Retrigger the engine by changing one record
  console.log("\n" + "Retrigger the engine by changing one record".padEnd(100, '*'));
  const firstNeedRecord = fakeXL.getModel(needRd.recordType).Records[0];
  if (firstNeedRecord) {
    firstNeedRecord.Body = "A little tweak";
    fakeXL.getRecordChangeEvents(needRd.recordType).forEach(c => eng.enqueueEvent(c));
    fakeXL.fakeFileData.forEach(m => m.prettyConsole());
    await eng.run();
    console.log("\n" + "And the result of the 'Retrigger' after the engine runs".padEnd(100, '*'));
    fakeXL.fakeFileData.forEach(m => m.prettyConsole());
  }
})().catch(error => console.error("Error running engine:", error));

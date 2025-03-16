# Codotnet TypeScript

This demonstrates an event-driven data processing system that generates related records based on defined relationships between record types.

## Project Structure

- `src/model.ts` - Defines the Model and Record classes
- `src/eventManager.ts` - Manages events and provides sequence generators
- `src/engine.ts` - Core engine that processes events and triggers plugins
- `src/fakePlugin.ts` - Plugin that creates new records in response to changes
- `src/fakeXLIOAdapter.ts` - Adapter for storing and retrieving data
- `src/index.ts` - Main entry point that demonstrates the system

## How It Works

The system defines an "ontology" of record types (Goal, Person, Preference, Need, Item) and their relationships. When a record of one type is created or modified, it triggers the creation of records of related types through a chain of events.

In the example demonstrated in index.ts:
1. A single "Goal" record ("Put a man on the moon") is created
2. This triggers the creation of related "Person", "Preference", "Need", and "Item" records
3. The system can be retriggered by modifying any record, causing further cascading changes

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Build the project:
   ```
   npm run build
   ```

3. Run the project:
   ```
   npm start
   ```

## Development

For development with automatic reloading:
```
npm run dev
```

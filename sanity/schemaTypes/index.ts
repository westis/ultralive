// Import the schema definition for "event"
import {event} from './event'
import checkpoint from './checkpoint'
import runner from './runner'

// Assuming you might have other schemas, they would be imported here as well
// import { anotherSchema } from './anotherSchema';

export const schemaTypes = [
  // Add your schemas here
  event,
  runner,
  checkpoint,
  // anotherSchema, // Other schemas would be added in a similar manner
]

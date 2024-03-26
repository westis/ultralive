import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {myStructure} from './structure' // Import the custom structure

export default defineConfig({
  name: 'default',
  title: 'Ultralive',

  projectId: '7lcnlqg7',
  dataset: 'production',

  plugins: [
    structureTool({
      // Use the custom structure for the Studio's desk tool
      structure: myStructure,
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})

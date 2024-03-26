// schemaTypes/runner.ts

export default {
  name: 'runner',
  type: 'document',
  title: 'Runner',
  fields: [
    {
      name: 'events',
      title: 'Events',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'event'}]}],
    },
    {
      name: 'bib',
      type: 'string',
      title: 'Bib',
    },
    {
      name: 'name',
      type: 'string',
      title: 'Name',
    },
    {
      name: 'gender',
      title: 'Gender',
      type: 'string',
      options: {
        list: ['male', 'female', 'other'],
      },
    },
    {
      name: 'nationality',
      title: 'Nationality',
      type: 'string',
    },
    {
      name: 'checkpoints',
      title: 'Checkpoints',
      type: 'array',
      of: [{type: 'checkpoint'}],
    }, // Embedded lap data for more detailed analysis
  ],
}

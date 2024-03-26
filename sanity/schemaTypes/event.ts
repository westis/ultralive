// schemaTypes/event.ts

import {defineType, defineField} from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'eventName',
      title: 'Event Name',
      type: 'string',
    }),
    defineField({
      name: 'raceStartTime',
      title: 'Race Start Time',
      type: 'datetime',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc, options) => {
          const date = new Date(doc.raceStartTime).toISOString().split('T')[0]
          const name = doc.eventName
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
          return `${date}-${name}`
        },
        maxLength: 200, // You can adjust the max length
      },
    }),
    defineField({
      name: 'raceDuration',
      title: 'Race Duration',
      type: 'string',
      description: 'Duration in ISO 8601 format, e.g., PT24H',
    }),
    defineField({
      name: 'eventOfficialPage',
      title: 'Event Official Page',
      type: 'url',
    }),
    defineField({
      name: 'eventFacebookPage',
      title: 'Event Facebook Page',
      type: 'url',
    }),
    defineField({
      name: 'checkpoint',
      title: 'Checkpoints',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'checkpoint'}],
        },
      ],
    }),
    defineField({
      name: 'runners',
      title: 'Runners',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'runner'}],
        },
      ],
    }),
    defineField({
      name: 'annotations',
      title: 'Annotations',
      type: 'array',
      of: [
        defineType({
          name: 'annotation',
          title: 'Annotation',
          type: 'object',
          fields: [
            defineField({
              name: 'distance',
              title: 'Distance',
              type: 'number',
            }),
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
            }),
            defineField({
              name: 'color',
              title: 'Color',
              type: 'string',
            }),
            defineField({
              name: 'offset',
              title: 'Offset',
              type: 'object',
              fields: [
                defineField({name: 'x', title: 'X', type: 'number'}),
                defineField({name: 'y', title: 'Y', type: 'number'}),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})

// structure.ts
import {MdEvent, MdPerson, MdTimeline} from 'react-icons/md'

export const myStructure = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Events')
        .icon(MdEvent)
        .schemaType('event')
        .child(
          S.documentTypeList('event')
            .title('Events')
            .child((eventId) =>
              S.document()
                .documentId(eventId)
                .schemaType('event')
                .views([
                  S.view.form().icon(MdEvent),
                  S.list()
                    .title('Event Details')
                    .items([
                      S.documentListItem().title('Event Overview').id(eventId).schemaType('event'),
                      S.listItem()
                        .title('Runners')
                        .icon(MdPerson)
                        .child(
                          S.documentTypeList('runner')
                            .title('Runners in Event')
                            .filter('_type == "runner" && references($eventId)')
                            .params({eventId})
                            .child((runnerId) =>
                              S.documentList()
                                .title('Runner Checkpoints')
                                .filter(
                                  '_type == "checkpoint" && runner._ref == $runnerId && event._ref == $eventId',
                                )
                                .params({runnerId, eventId}),
                            ),
                        ),
                    ]),
                ]),
            ),
        ),
    ])

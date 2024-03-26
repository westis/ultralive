export default {
  name: 'checkpoint',
  title: 'Checkpoint',
  type: 'document',
  fields: [
    {
      name: 'event',
      type: 'reference',
      to: [{type: 'event'}],
      title: 'Event',
    },
    {
      name: 'runner',
      type: 'reference',
      to: [{type: 'runner'}],
      title: 'Runner',
    },
    {
      name: 'raceTime',
      title: 'Race Time',
      type: 'string',
    },
    {
      name: 'distanceInKm',
      title: 'Distance in km',
      type: 'number',
    },
    {
      name: 'distanceInMiles',
      title: 'Distance in Miles',
      type: 'number',
    },
    {
      name: 'raceTimeInSeconds',
      title: 'Race Time in Seconds',
      type: 'number',
    },
    {
      name: 'projectedDistanceInKm',
      title: 'Projected Distance in km',
      type: 'number',
    },
    {
      name: 'projectedDistanceInMiles',
      title: 'Projected Distance in Miles',
      type: 'number',
    },
    {
      name: 'avgPaceInSecondsPerKm',
      title: 'Avg Pace in Seconds/km',
      type: 'number',
    },
    {
      name: 'avgPaceInSecondsPerMile',
      title: 'Avg Pace in Seconds/Mile',
      type: 'number',
    },
    {
      name: 'splitPaceInSecondsPerKm',
      title: 'Split Pace in Seconds/km',
      type: 'number',
    },
    {
      name: 'splitPaceInSecondsPerMile',
      title: 'Split Pace in Seconds/Mile',
      type: 'number',
    },
  ],
  preview: {
    select: {
      title: 'raceTime', // Assuming you want to use the raceTime as the main title
      runnerName: 'runner.name', // Use runner's name field for the subtitle
      eventName: 'event.eventName', // Use event's name field for the subtitle
    },
    prepare(selection) {
      const {title, runnerName, eventName} = selection
      return {
        title: title,
        subtitle: `${runnerName} - ${eventName}`,
      }
    },
  },
}

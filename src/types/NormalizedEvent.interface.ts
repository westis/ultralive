// src/types/NormalizedEvent.interface.ts
export interface NormalizedEventData {
  // Unique identifier for the runner participating in the event.
  runnerId: string;

  // Name of the runner participating in the event.
  runnerName: string;

  // The ISO 8601 formatted time when the specific data point (split) was recorded.
  raceTime: string;

  // The cumulative distance in kilometers the runner has covered up to the data point.
  distanceInKm: number;

  // The cumulative distance in miles the runner has covered up to the data point.
  distanceInMiles: number;

  // The total number of seconds elapsed from the start of the race to when the data point was recorded.
  raceTimeInSeconds: number;

  // The total estimated distance the runner is projected to cover in the race, in km, based on their current pace, if they continue at an average pace calculated from all previous splits.
  ProjectedDistanceInKm: number;

  // The total estimated distance the runner is projected to cover in the race, in miles, based on their current pace, if they continue at an average pace calculated from all previous splits.
  ProjectedDistanceInMiles: number;

  // The average pace of the runner in seconds per kilometer, calculated over the entire distance covered up to the data point. This represents the overall average pace.
  avgPaceInSecondsPerKm: number;

  // The average pace of the runner in seconds per mile, calculated over the entire distance covered up to the data point. This represents the overall average pace, converted to miles.
  avgPaceInSecondsPerMile: number;

  // The pace of the runner in seconds per kilometer for the specific lap or segment leading up to the data point. This represents the pace for a specific segment of the race, not the overall average.
  splitPaceInSecondsPerKm: number;

  // The pace of the runner in seconds per mile for the specific lap or segment leading up to the data point. This represents the pace for a specific segment of the race, converted to miles, not the overall average.
  splitPaceInSecondsPerMile: number;
}

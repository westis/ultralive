// src/utils/timeUtils.js

export const calculateraceTimeInSeconds = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

export const paceToSecondsPerKm = (pace) => {
  const parts = pace.split(":").map(Number);
  let seconds = 0;
  if (parts.length === 3) {
    // HH:MM:SS format
    seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS format
    seconds = parts[0] * 60 + parts[1];
  }
  return seconds;
};

export const paceToSecondsPerMile = (pace) => {
  const secondsPerKm = paceToSecondsPerKm(pace);
  return secondsPerKm * 1.60934; // Conversion factor from km to miles
};

export const calculatePaces = (timeString, distanceInKm) => {
  const raceTimeInSeconds = calculateraceTimeInSeconds(timeString);
  const kmPaceInSeconds =
    distanceInKm > 0 ? raceTimeInSeconds / distanceInKm : 0;
  const milePaceInSeconds = kmPaceInSeconds / 0.621371; // Convert km pace to mile pace

  // Convert seconds to MM:SS format
  const formatPace = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.floor(seconds % 60);
    return `${minutes}:${secondsRemainder.toString().padStart(2, "0")}`;
  };

  return {
    kmPace: formatPace(kmPaceInSeconds),
    milePace: formatPace(milePaceInSeconds),
  };
};

export const calculateMilePaceFromKmPace = (paceInSecondsPerKm) => {
  return paceInSecondsPerKm * 1.60934; // Convert pace to miles without formatting as a string
};

export const estimateDistance = (
  timeInSeconds,
  totalRaceDurationInSeconds,
  currentdistanceInKm
) => {
  const averagePacePerSecond = currentdistanceInKm / timeInSeconds; // km per second
  const estimatedTotalDistance =
    averagePacePerSecond * totalRaceDurationInSeconds;
  return estimatedTotalDistance;
};

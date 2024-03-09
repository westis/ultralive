// src/utils/timeUtils.js

export const calculateTotalSeconds = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

export const calculatePaces = (timeString, kmDistance) => {
  const totalSeconds = calculateTotalSeconds(timeString);
  const kmPaceInSeconds = kmDistance > 0 ? totalSeconds / kmDistance : 0;
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
  const paceInSecondsPerMile = paceInSecondsPerKm * 1.60934;

  // Convert seconds to MM:SS format
  const minutes = Math.floor(paceInSecondsPerMile / 60);
  const secondsRemainder = Math.floor(paceInSecondsPerMile % 60);
  return `${minutes}:${secondsRemainder.toString().padStart(2, "0")}`;
};

export const estimateDistance = (
  timeInSeconds,
  totalRaceDurationInSeconds,
  currentKmDistance
) => {
  const averagePacePerSecond = currentKmDistance / timeInSeconds; // km per second
  const estimatedTotalDistance =
    averagePacePerSecond * totalRaceDurationInSeconds;
  return estimatedTotalDistance;
};

// src/utils/timeUtils.js

export const calculateTotalSeconds = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

export const calculatePace = (timeString, kmDistance) => {
  const totalSeconds = calculateTotalSeconds(timeString);
  return kmDistance > 0 ? totalSeconds / kmDistance : 0;
};

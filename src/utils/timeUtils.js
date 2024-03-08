// src/utils/timeUtils.js

export const calculateTotalSeconds = (timeString) => {
  const parts = timeString.split(":").map(parseFloat);
  let totalSeconds;
  if (parts.length === 4) {
    totalSeconds =
      parts[0] * 86400 + parts[1] * 3600 + parts[2] * 60 + parts[3];
  } else if (parts.length === 3) {
    totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else {
    throw new Error("Invalid time format");
  }
  return totalSeconds;
};

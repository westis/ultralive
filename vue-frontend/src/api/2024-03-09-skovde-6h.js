const axios = require("axios");
const cheerio = require("cheerio");
const { calculateraceTimeInSeconds, calculatePace } = require("./timeUtils");

// Example runner IDs array
// Update this array with actual IDs for each event
const runnerIds = ["18379", "18400", "18520"]; // Add more as needed

async function fetchRunnerData(runnerId) {
  const url = `https://www.jogg.se/Resultat/Person.aspx?id=${runnerId}`;
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const runnerData = [];

    $(".lr_tbl tr").each((index, element) => {
      if (index > 0) {
        // Skip header row
        const cols = $(element).find("td");
        if (cols.length) {
          // Ensure there are columns to process
          const distanceInKm = parseFloat(
            $(cols[1])
              .text()
              .replace(",", ".")
              .replace(/\s*km\s*/, "")
          );
          const time = $(cols[2]).text().trim();
          runnerData.push({
            pid: runnerId,
            distanceInKm,
            time,
            raceTimeInSeconds: calculateraceTimeInSeconds(time),
            pace: calculatePace(time, distanceInKm),
          });
        }
      }
    });
    return runnerData;
  } catch (error) {
    console.error(
      `Failed to fetch data for runner ID ${runnerId}:`,
      error.message
    );
    return []; // Return an empty array in case of error
  }
}

async function fetchAllRunnersData() {
  const allRunnersData = [];
  for (const runnerId of runnerIds) {
    const runnerData = await fetchRunnerData(runnerId);
    allRunnersData.push(...runnerData);
  }
  return allRunnersData;
}

fetchAllRunnersData()
  .then((data) => {
    console.log(data); // Do something with the data, e.g., save to a file or database
  })
  .catch((error) => {
    console.error("An error occurred:", error);
  });

module.exports = { fetchAllRunnersData };

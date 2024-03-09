const axios = require("axios");
const cheerio = require("cheerio");

// Assuming you have your utility functions defined elsewhere
const { calculateTotalSeconds, calculatePace } = require("./timeUtils");

// Unique event ID
const eventId = "your-event-id";

async function scrapeLapData(runnerId) {
  const url = `https://www.jogg.se/Resultat/Person.aspx?id=${runnerId}`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Extract runner data (assuming header with runner name/id exists)
    const name = $("#runnerHeaderLabel").text().trim(); // Adjust selector as needed
    const pid = $("#runnerPID").text().trim() || "Not Found"; // Handle potential missing pid

    // Find the correct lap table
    const lapTable = $("table.lr_tbl"); // Adjust the selector if needed

    const lapData = [];
    lapTable.find("tr").each((index, row) => {
      // Skip the header row
      if (index === 0) return;

      const $row = $(row);

      const lapNumber = $row.find("td:nth-child(1)").text().trim();
      const lapDistance = parseFloat(
        $row.find("td:nth-child(2)").text().trim()
      );
      const lapTime = $row.find("td:nth-child(3)").text().trim();

      // Calculations
      const totalSeconds = calculateTotalSeconds(lapTime);
      const mileDistance = lapDistance * 0.621371;
      const pace = calculatePace(lapTime, lapDistance);

      lapData.push({
        pid: pid,
        name: name,
        time: lapTime,
        kmDistance: lapDistance,
        mileDistance: mileDistance,
        totalSeconds: totalSeconds,
        pace: pace,
      });
    });

    return lapData;
  } catch (error) {
    console.error("Error scraping lap data:", error);
    throw error;
  }
}

// Example usage
const runnerId = 18333; // Example - change this to the actual runner ID
scrapeLapData(runnerId)
  .then((lapData) => console.log(lapData))
  .catch((error) => console.error("Scraping error:", error));

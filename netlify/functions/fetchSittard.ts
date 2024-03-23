// netlify/functions/fetchSittard.ts
const fetch = require("node-fetch");
const sanityClient = require("@sanity/client");

const client = sanityClient({
  projectId: "7lcnlqg7", // Replace with your Sanity project ID
  dataset: "production", // Or whatever your dataset is named
  token:
    "skBMoOPjX1ZvLqbv4ibmEbNoeafTkyfnaeZsIhMOL7TM7n4QDuPtg6YfJFUb5ST2Vi1J1A5Z6Xi32zgkk2llkSIElDsoKPKrwudIkS61VNNIT1UFTSqA9sgdHpVIckxy0yRvYZ7YUKKzmkAjHTTDZtVYfNfzB1AOVGUp5CMGEw115diyMTeU", // Replace with a write token from Sanity
  useCdn: false,
});

exports.handler = async (event, context) => {
  const url =
    "https://my3.raceresult.com/270378/RRPublish/data/list?key=7d7dc1b60f8d22fda084ae79622aa0bb&listname=Online%7CLiveResultatWebb-st%C3%A4llning&page=live&contest=0&r=leaders&l=10";

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Assuming the data you need is in `data["#1_{SE:24-timmars|EN:12H}"]["#1_Kvinnor"]`
    const runners = data["#1_{SE:24-timmars|EN:12H}"]["#1_Kvinnor"];

    // Example: Store each runner in Sanity (adjust according to your schema)
    await Promise.all(
      runners.map((runner) => {
        return client.createIfNotExists({
          _type: "runner", // Adjust this to match your Sanity schema
          name: runner.name,
          position: runner.position,
          // Add other runner properties here
        });
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data fetched and stored successfully" }),
    };
  } catch (error) {
    console.error("Error fetching or storing data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch or store data" }),
    };
  }
};

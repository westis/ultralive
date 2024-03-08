// src/components/RaceChart.vue
<template>
  <v-container class="pa-0">
    <vue-apex-charts
      type="line"
      height="550"
      :options="chartOptions"
      :series="series"
    ></vue-apex-charts>
    <!-- Data table for displaying last splits -->
    <v-table density="compact">
      <thead></thead>
      <tr>
        <th>Name</th>
        <th>Distance (km / mi)</th>
        <th>Last Registration</th>
      </tr>
      <tbody>
        <tr v-for="(split, index) in lastSplitsArray" :key="index">
          <td>{{ split.name }}</td>
          <td>{{ split.kmDistance }} / {{ split.mileDistance }}</td>
          <td>{{ split.time }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script setup>
import VueApexCharts from "vue3-apexcharts";
import useRaceData from "@/composables/useRaceData";
import { useTheme } from "vuetify";
import { useRaceStore } from "@/stores/useRaceStore";
import { DateTime } from "luxon";

const raceStore = useRaceStore();
const lastSplits = computed(() => raceStore.lastSplits);
const lastSplitsArray = computed(() => {
  return Object.values(lastSplits.value).sort((a, b) => {
    return b.kmDistance - a.kmDistance; // Descending order
  });
});

const { data, fetchData } = useRaceData();
const theme = useTheme();

const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

// Helper function to format pace for the Y-axis labels as HH:MM:SS
const formatPace = (paceInSeconds) => {
  const hours = Math.floor(paceInSeconds / 3600);
  const minutes = Math.floor((paceInSeconds % 3600) / 60);
  const seconds = Math.floor(paceInSeconds % 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const chartOptions = ref({
  chart: {
    id: "race-chart",
    toolbar: {
      autoSelected: "zoom",
    },
    animations: {
      enabled: true,
    },
  },
  xaxis: {
    type: "numeric",
    title: {
      text: "Race Time (HH:MM)",
    },
    labels: {
      formatter: (val) => formatTime(val), // Use formatTime for X-axis labels
    },
    axisTicks: {
      show: true,
    },
    axisBorder: {
      show: true,
    },
    tickAmount: 8,
  },
  yaxis: {
    title: {
      text: "Pace (min/km)",
    },
    labels: {
      formatter: (val) => formatPace(val), // Use formatPace for Y-axis labels
    },
  },
  stroke: {
    curve: "straight",
  },
  markers: {
    size: 0,
  },
  tooltip: {
    shared: true,
    intersect: false,
    theme: "dark",
  },
  legend: {
    show: true,
  },
  annotations: {
    xaxis: Array.from({ length: 6 }).map((_, index) => ({
      // 6 days, every 24 hours
      x: (index + 1) * 86400, // 86400 seconds in a day
      borderColor: "#999",
      label: {
        text: `Day ${index + 1}`,
        style: {
          color: "#fff",
          background: "#777",
        },
      },
    })),
    yaxis: [
      {
        y: (144 * 3600) / 1036.8, // Male record pace (seconds/km)
        borderColor: "#263238", // Color for male record line
        label: {
          borderColor: "#263238",
          style: {
            color: "#fff",
            background: "#263238",
          },
          text: "Men's 6DWorld Record",
        },
      },
      {
        y: (144 * 3600) / 883.631, // Female record pace (seconds/km)
        borderColor: "#311B92", // Color for female record line
        label: {
          borderColor: "#311B92",
          style: {
            color: "#fff",
            background: "#311B92",
          },
          text: "Women's 6D World Record",
        },
      },
      {
        y: (72 * 3600) / 505.615, // Female record pace (seconds/km)
        borderColor: "#AD1457", // Color for female record line
        label: {
          borderColor: "#AD1457",
          style: {
            color: "#fff",
            background: "#AD1457",
          },
          text: "Women's 72h World Record",
        },
      },
    ],
  },
});

const series = ref([]);

const updateSeries = () => {
  if (data.value && data.value.length > 0) {
    const runners = {};
    data.value.forEach((point) => {
      if (!runners[point.name]) {
        runners[point.name] = {
          name: point.name,
          data: [],
        };
      }
      // Use totalSeconds for the x value, skip the first data point
      runners[point.name].data.push({ x: point.totalSeconds, y: point.pace });
    });
    // Remove the first data point for each runner
    series.value = Object.values(runners).map((runner) => {
      if (runner.data.length > 1) {
        return { ...runner, data: runner.data.slice(1) };
      }
      return runner;
    });
  }
};

const getTimeSince = (totalSeconds) => {
  // Calculate the registration time from the race start time
  const registrationDateTime = raceStore.raceStartTime.plus({
    seconds: totalSeconds,
  });

  // Ensure the current time is in the same timezone as the race for accurate comparison
  const nowInRaceTimeZone = DateTime.now().setZone(
    raceStore.raceStartTime.zone
  );

  // Use Luxon's `toRelative` to get a human-friendly relative time string
  return registrationDateTime.toRelative({ base: nowInRaceTimeZone });
};

// Now, we can safely use `updateSeries` in `watch` and `onMounted`
onMounted(async () => {
  await fetchData();
  updateSeries();
  setInterval(async () => {
    await fetchData();
    updateSeries();
  }, 300000); // Fetch data every 5 minutes
});

watch(() => data.value, updateSeries);
</script>

<style scoped></style>

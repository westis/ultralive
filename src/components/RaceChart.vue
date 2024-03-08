// src/components/RaceChart.vue
<template>
  <v-container>
    <vue-apex-charts
      type="line"
      :options="chartOptions"
      :series="series"
    ></vue-apex-charts>
  </v-container>
</template>

<script setup>
import VueApexCharts from "vue3-apexcharts";
import useRaceData from "/src/composables/useRaceData";
import { useTheme } from "vuetify";

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
        borderColor: "#FF0000", // Color for male record line
        label: {
          borderColor: "#FF0000",
          style: {
            color: "#fff",
            background: "#FF0000",
          },
          text: "Men's World Record",
        },
      },
      {
        y: (144 * 3600) / 883.631, // Female record pace (seconds/km)
        borderColor: "#0000FF", // Color for female record line
        label: {
          borderColor: "#0000FF",
          style: {
            color: "#fff",
            background: "#0000FF",
          },
          text: "Women's World Record",
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

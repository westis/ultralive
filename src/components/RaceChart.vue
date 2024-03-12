// src/components/RaceChart.vue
<template>
  <v-container class="pa-0">
    <v-card flat>
      <v-tabs v-model="tab" background-color="indigo" dark>
        <v-tab>Chart</v-tab>
        <v-tab>Last Splits</v-tab>
      </v-tabs>

      <v-window v-model="tab" class="">
        <v-window-item class="">
          <!-- Chart tab content -->
          <div v-if="loading">Loading data...</div>
          <v-container class="chart-container" fluid>
            <Line
              v-if="chartData && chartData.datasets.length > 0"
              ref="chartRef"
              :data="chartData"
              :options="chartOptions"
            />
          </v-container>
        </v-window-item>

        <v-window-item>
          <!-- Last Splits content -->
          <v-data-table
            v-model:expanded="expanded"
            :headers="headers"
            :items="dataTable"
            item-value="runnerId"
            show-expand
            class="elevation-1"
            single-expand
            density="compact"
          >
            <template v-slot:expanded-row="{ item }">
              <td class="px-5" :colspan="headers.length">
                <v-table class="text-caption" density="compact">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Time</th>
                        <th class="text-left">Distance</th>
                        <th class="text-left">Average Pace</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(split, index) in filterSplitsForRunnerId(
                          item.runnerId
                        )"
                        :key="index"
                      >
                        <td>
                          {{ formatTimeWithSeconds(split.raceTimeInSeconds) }}
                        </td>
                        <td>
                          {{
                            `${
                              split.distanceInKm
                            } km / ${split.distanceInMiles.toFixed(2)} mi`
                          }}
                        </td>
                        <td>
                          {{ split.kmAvgPace }} min/km -
                          {{ split.milePace }} min/mi
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-table>
              </td>
            </template>
          </v-data-table>
        </v-window-item>
      </v-window>
    </v-card>
    <div class="text-caption" v-if="lastUpdated">
      Last updated: {{ lastUpdated.toLocaleString() }}
    </div>
  </v-container>
</template>

<script setup>
import { useRaceStore } from "@/stores/useRaceStore";
import { eventRegistry } from "@/events/eventRegistry";
import useRaceData from "@/composables/useRaceData";
import { Duration } from "luxon";

// Imports for the chart
import { Line } from "vue-chartjs";
import { Chart, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(...registerables);
Chart.register(zoomPlugin);
Chart.register(annotationPlugin);

const intervalTime = 3 * 60 * 1000; // 3 minutes in milliseconds

// Define props to receive eventId
const props = defineProps({
  eventId: String,
});

const raceStore = useRaceStore();
const allSplits = computed(() => raceStore.getAllSplits(props.eventId));
watch(allSplits, { immediate: true, deep: true });

const lastSplits = computed(() => raceStore.getLastSplits(props.eventId));

// Integration with useRaceData for fetching data, handling loading state, and caching
const { data, loading, fetchData, lastUpdated } = useRaceData(props.eventId);

// Define the ref for active tab
const tab = ref(0);
const expanded = ref([]);

const headers = ref([
  { title: "Name", key: "runnerName" },
  { title: "Distance", key: "distance" },
  { title: "Estimated Distance", key: "ProjectedDistanceInKm" }, // Add this line
  { title: "Last Registration", key: "time" },
]);

// Data for the table below the chart
const dataTable = computed(() => {
  return Object.values(lastSplits.value || {})
    .map((item) => ({
      ...item,
      // Combine distanceInKm and distanceInMiles
      distance: `${item.distanceInKm.toFixed(
        2
      )} km / ${item.distanceInMiles.toFixed(2)} mi`,
      // Round estimatedDistance to two decimals
      ProjectedDistanceInKm: `${item.ProjectedDistanceInKm.toFixed(2)} km`,
      time: formatTimeWithSeconds(item.raceTimeInSeconds),
      kmAvgPace: item.kmAvgPace,
      milePace: item.milePace,
    }))
    .sort((a, b) => b.distanceInKm - a.distanceInKm);
});

const chartRef = ref(null);

// Function to reset the chart's zoom
const resetZoom = () => {
  // Access the chart instance from the Vue Chart.js component
  if (chartRef.value && chartRef.value.chart) {
    chartRef.value.chart.resetZoom();
  }
};

const chartData = ref({
  labels: [], // You might not need labels for a scatter/line chart with x/y values
  datasets: [],
});

const chartAnnotations = ref([]);

const raceDurationInSeconds = computed(() => {
  const duration = eventRegistry[props.eventId].raceDuration;
  return Duration.fromISO(duration).as("seconds");
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
      },
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        mode: "xy",
      },
      pan: {
        enabled: true,
        mode: "xy",

        // Set limits for panning
      },
      limits: {
        x: { min: "original", max: raceDurationInSeconds },
        y: { min: 0 },
      },
    },
    tooltip: {
      callbacks: {
        title: function (tooltipItems) {
          // Map through all tooltip items and return their dataset runner names
          return tooltipItems.map((tooltipItem) => {
            const runnerName = tooltipItem.dataset.runnerName;
            return runnerName || "Unknown Runner";
          });
        },
        label: function (context) {
          // Here, context represents a single tooltip item for a dataset
          const split = context.raw;
          const formattedTime = formatTimeWithSeconds(split.x);

          // You may want to include the runner's name with each tooltip item
          const runnerName = context.dataset.runnerName;

          // Return the label for each tooltip item, including the runner's name
          return [
            `Time: ${formattedTime}`,
            `Distance: ${split.formattedDistance}`,
            `Estimated Distance: ${split.formattedProjectedDistanceInKm}`,
          ];
        },
      },
      backgroundColor: "#333", // Adjust color as needed
      titleColor: "#fff",
      bodyColor: "#fff",
      mode: "nearest",
      intersect: false,
      padding: 10,
    },
    annotation: {
      annotations: chartAnnotations,
    },
  },
  scales: {
    x: {
      type: "linear",
      position: "bottom",
      max: raceDurationInSeconds.value,
      title: {
        display: true,
        text: "Race Time (HH:MM)",
        font: {
          weight: "bold",
        },
      },
      ticks: {
        // Adjust how ticks are formatted if needed
        callback: function (value) {
          return formatTime(value); // Your custom formatTime function
        },
      },
    },
    y: {
      title: {
        display: true,
        text: "Estimated Distance (km)",
        font: {
          weight: "bold",
        },
      },
      ticks: {
        callback: function (value) {
          return value.toFixed(2); // Format for precision
        },
      },
    },
  },
});

const materialDesignColors = [
  "#F44336", // Red
  "#E91E63", // Pink
  "#9C27B0", // Purple
  "#673AB7", // Deep Purple
  "#3F51B5", // Indigo
  "#2196F3", // Blue
  "#03A9F4", // Light Blue
  "#00BCD4", // Cyan
  "#009688", // Teal
  "#4CAF50", // Green
  "#8BC34A", // Light Green
  "#CDDC39", // Lime
  "#FFEB3B", // Yellow
  "#FFC107", // Amber
  "#FF9800", // Orange
  "#FF5722", // Deep Orange
  "#795548", // Brown
  "#607D8B", // Blue Grey
];

const updateChartData = () => {
  if (!allSplits.value) {
    console.warn(
      "No allSplits data available for the given eventId:",
      props.eventId
    );
    chartData.value.datasets = [];
    return;
  }

  // Dynamically assign colors from the Material Design colors array
  const datasets = Object.entries(allSplits.value).map(
    ([runnerId, splits], index) => {
      const colorIndex = index % materialDesignColors.length; // Loop through colors
      const color = materialDesignColors[colorIndex]; // Select color

      return {
        label: splits.length > 0 ? splits[0].runnerName : "Unknown",
        runnerName: splits.length > 0 ? splits[0].runnerName : "Unknown",
        data: splits.map((split) => ({
          x: split.raceTimeInSeconds,
          y: split.ProjectedDistanceInKm,
          formattedDistance: `${split.distanceInKm.toFixed(
            2
          )} km / ${split.distanceInMiles.toFixed(2)} mi`,
          formattedProjectedDistanceInKm: `${split.ProjectedDistanceInKm.toFixed(
            2
          )} km / ${(split.ProjectedDistanceInKm * 0.621371).toFixed(2)} mi`,
        })),
        pointRadius: 0,
        borderColor: color, // Use dynamic color for the border
        backgroundColor: color, // Use the same dynamic color for the background
      };
    }
  );

  chartData.value.datasets = datasets;
};

// Function to update annotations
const updateChartAnnotations = () => {
  const eventConfig = eventRegistry[props.eventId];
  if (eventConfig && eventConfig.annotations) {
    chartAnnotations.value = eventConfig.annotations.map((annotation) => ({
      type: "line",
      mode: "horizontal",
      scaleID: "y",
      value: annotation.distance,
      borderColor: annotation.color,
      borderWidth: 1,
      borderDash: [5, 5],
      label: {
        display: true,
        content: annotation.name,
        backgroundColor: annotation.color,
        padding: 3,
        borderRadius: 3,
        position: "start",
        xAdjust: annotation.offset.x,
        yAdjust: annotation.offset.y,
      },
      font: {
        size: 10,
      },
    }));
  }
};

// Helper function to format time for the X-axis
const formatTime = (raceTimeInSeconds) => {
  const hours = Math.floor(raceTimeInSeconds / 3600);
  const minutes = Math.floor((raceTimeInSeconds % 3600) / 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

const formatTimeWithSeconds = (raceTimeInSeconds) => {
  const hours = Math.floor(raceTimeInSeconds / 3600);
  const minutes = Math.floor((raceTimeInSeconds % 3600) / 60);
  const seconds = Math.floor(raceTimeInSeconds % 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

// Helper function to format pace for the Y-axis
const formatPace = (paceInSeconds) => {
  const hours = Math.floor(paceInSeconds / 3600);
  const minutes = Math.floor((paceInSeconds % 3600) / 60);
  const seconds = Math.floor(paceInSeconds % 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

let dataFetchInterval;

onMounted(async () => {
  await fetchData();
  updateChartData();
  updateChartAnnotations();

  const canvas = chartRef.value.$el; // Assuming chartRef is a ref to your chart component
  if (canvas) {
    canvas.addEventListener("dblclick", resetZoom);
  }

  dataFetchInterval = setInterval(async () => {
    await fetchData();
    // Conditional updateChartAnnotations could be here if needed
  }, intervalTime);
});

onBeforeUnmount(() => {
  // Clean up the event listener when the component is about to unmount
  const canvas = chartRef.value.$el;
  if (canvas) {
    canvas.removeEventListener("dblclick", resetZoom);
  }
});

onUnmounted(() => {
  clearInterval(dataFetchInterval);
});

watch(
  data,
  () => {
    updateChartData();
    updateChartAnnotations();
  },
  { deep: true, immediate: true }
);

watch(
  () => props.eventId,
  () => {
    fetchData().then(() => {
      // updateChartAnnotations(); // Ensure annotations are updated when eventId changes
    });
  },
  { immediate: true }
);
</script>

<style scoped>
.chart-container {
  min-height: 55dvh;
}
</style>

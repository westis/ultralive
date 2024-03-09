// src/components/RaceChart.vue
<template>
  <v-container class="pa-0">
    <v-card flat>
      <v-tabs v-model="tab" background-color="indigo" dark>
        <v-tab>Chart</v-tab>
        <v-tab>Last Splits</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item>
          <!-- Chart tab content -->
          <vue-apex-charts
            type="line"
            height="550"
            :options="chartOptions"
            :series="series"
          ></vue-apex-charts>
        </v-window-item>

        <v-window-item>
          <!-- Last Splits tab content -->
          <v-data-table
            :headers="headers"
            :items="dataTable"
            item-key="name"
            class="elevation-1"
            :single-expand="true"
            :expanded.sync="expanded"
            item-class="clickable"
          >
            <template #item="{ item }">
              <tr @click="toggleExpand(item)">
                <td>{{ item.name }}</td>
                <td>{{ item.kmDistance }} / {{ item.mileDistance }}</td>
                <td>{{ item.estimatedDistance.toFixed(2) }} km</td>
                <!-- Display estimated distance -->
                <td>{{ item.time }}</td>
              </tr>
            </template>

            <template #expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <v-container>
                  <!-- Here you can structure how you want each runner's splits to be displayed -->
                  <div
                    v-for="(split, index) in allSplitsData[item.pid]"
                    :key="index"
                  >
                    {{ split.kmDistance }} km at {{ split.time }}
                  </div>
                </v-container>
              </td>
            </template>
          </v-data-table>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<script setup>
import VueApexCharts from "vue3-apexcharts";
import { useRaceStore } from "@/stores/useRaceStore";

const intervalTime = 3 * 60 * 1000; // 3 minutes in milliseconds

// Define props to receive eventId
const props = defineProps({
  eventId: String,
});

const raceStore = useRaceStore();
const allSplits = computed(() => raceStore.getAllSplits(props.eventId));
const lastSplits = computed(() => raceStore.getLastSplits(props.eventId));

// Define the ref for active tab
const tab = ref(0);

const headers = [
  { text: "Name", value: "name" },
  { text: "Distance (km / mi)", value: "distance" },
  { text: "Estimated Distance", value: "estimatedDistance" }, // Add this line
  { text: "Last Registration", value: "time" },
];

// Data for the table below the chart
const dataTable = computed(() => {
  return Object.values(lastSplits.value || {}).sort(
    (a, b) => b.kmDistance - a.kmDistance
  );
});

const expanded = ref([]);

const toggleExpand = (item) => {
  const index = expanded.value.indexOf(item);
  if (index > -1) expanded.value.splice(index, 1);
  else expanded.value.push(item);
};

// Define your chart options here
// Chart options might be static or dynamically adjusted based on the event's data or requirements
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
      text: "Estimated Distance (km)",
    },
    labels: {
      formatter: (val) => val.toFixed(2), // Use formatPace for Y-axis labels
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
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      const name = w.globals.seriesNames[seriesIndex];
      const yValue = series[seriesIndex][dataPointIndex];
      const estimatedDistance = yValue.toFixed(2) + " km";

      // Accessing the x-axis value (time) from w.globals.seriesX, which holds the time values.
      const timeValue = w.globals.seriesX[seriesIndex][dataPointIndex];
      const formattedTime = timeValue
        ? formatTimeWithSeconds(timeValue)
        : "N/A";

      return `
      <div class="pa-2">
      <div style="font-weight: bold;">${name}</div>
      <div>Time: ${formattedTime}</div>
      <div>Estimated Distance: ${estimatedDistance}</div>
      </div>
    `;
    },
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
        y: 1036.8, // Male record pace (seconds/km)
        borderColor: "#263238", // Color for male record line
        label: {
          borderColor: "#263238",
          style: {
            color: "#fff",
            background: "#263238",
          },
          offsetX: -200,
          text: "Men's 6DWorld Record",
        },
      },
      {
        y: 883.631, // Female record pace (seconds/km)
        borderColor: "#311B92", // Color for female record line
        label: {
          borderColor: "#311B92",
          offsetY: 5,
          style: {
            color: "#fff",
            background: "#311B92",
          },
          offsetX: -300,
          text: "Women's 6D World Record",
        },
      },
      {
        point: {
          // Add point annotation
          x: 72 * 3600,
          y: 505,
          marker: {
            shape: "circle",
            size: 4,
            fillColor: "#fff",
            strokeColor: "#AD1457",
          },
        },
      },
    ],
  },
});

const series = ref([]);

const updateSeries = () => {
  // Safeguard against allSplits.value being undefined or null
  if (!allSplits.value) {
    console.warn(
      "No allSplits data available for the given eventId:",
      props.eventId
    );
    series.value = []; // Reset the series to empty array to clear the chart
    return;
  }

  // Now we can safely use Object.entries on allSplits.value
  series.value = Object.entries(allSplits.value).map(([pid, splits]) => {
    // Assumes that splits is an array of split data
    return {
      name: splits.length > 0 ? splits[0].name : "Unknown", // Default if name is not available
      data: splits.map((split) => ({
        x: split.totalSeconds,
        y: split.estimatedDistance,
      })),
    };
  });
};

// Helper function to format time for the X-axis
const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

const formatTimeWithSeconds = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
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
  if (!allSplits.value) {
    await raceStore.fetchData(props.eventId);
  }

  // Set up the interval to fetch new data every 3 minutes
  dataFetchInterval = setInterval(async () => {
    await raceStore.fetchData(props.eventId);
  }, intervalTime);
});

onUnmounted(() => {
  // Clear the interval when the component is destroyed
  clearInterval(dataFetchInterval);
});

watch(allSplits, updateSeries, { deep: true, immediate: true });
</script>

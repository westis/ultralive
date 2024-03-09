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
          <div v-if="loading">Loading data...</div>
          <vue-apex-charts
            v-else
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
    <div class="text-caption" v-if="lastUpdated">
      Last updated: {{ lastUpdated.toLocaleString() }}
    </div>
  </v-container>
</template>

<script setup>
import VueApexCharts from "vue3-apexcharts";
import { useRaceStore } from "@/stores/useRaceStore";
import { eventRegistry } from "@/events/eventRegistry";
import useRaceData from "@/composables/useRaceData";

const intervalTime = 3 * 60 * 1000; // 3 minutes in milliseconds

// Define props to receive eventId
const props = defineProps({
  eventId: String,
});

const raceStore = useRaceStore();
const allSplits = computed(() => raceStore.getAllSplits(props.eventId));
const lastSplits = computed(() => raceStore.getLastSplits(props.eventId));

// Integration with useRaceData for fetching data, handling loading state, and caching
const { data, loading, fetchData, lastUpdated } = useRaceData(props.eventId);

// Define the ref for active tab
const tab = ref(0);
const expanded = ref([]);

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
      const data = w.config.series[seriesIndex].data[dataPointIndex];

      const name = w.globals.seriesNames[seriesIndex];
      const yValue = series[seriesIndex][dataPointIndex];
      const estimatedDistance = yValue.toFixed(2) + " km";
      const kmDistance = data.kmDistance;

      // Accessing the x-axis value (time) from w.globals.seriesX, which holds the time values.
      const timeValue = w.globals.seriesX[seriesIndex][dataPointIndex];
      const formattedTime = timeValue
        ? formatTimeWithSeconds(timeValue)
        : "N/A";

      return `
      <div class="pa-2">
      <div style="font-weight: bold;">${name}</div>
      <div>Time: ${formattedTime}</div>
       <div>Distance: ${kmDistance} km</div> 
      <div>Estimated Distance: ${estimatedDistance}</div>
      </div>
    `;
    },
  },
  legend: {
    show: true,
  },
  annotations: {
    xaxis: [], // Initialize xaxis if needed
    yaxis: [], // Ensure yaxis is initialized as an empty array
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
        kmDistance: split.kmDistance,
      })),
    };
  });
};

// Update chart annotations based on the event data
function updateChartAnnotations() {
  const eventInfo = eventRegistry[props.eventId];
  if (!eventInfo || !eventInfo.records) return;

  chartOptions.value.annotations.yaxis = eventInfo.records.map((record) => ({
    y: record.value,
    borderColor: record.color,
    label: {
      borderColor: record.color,
      style: {
        color: "#fff",
        background: record.color,
      },
      text: record.label,
    },
  }));
}

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

onMounted(() => {
  fetchData().then(() => {
    updateChartAnnotations(); // Call after fetching data
    updateSeries(); // Ensure series are also updated
  });
  dataFetchInterval = setInterval(() => {
    fetchData().then(() => {
      updateChartAnnotations(); // Also update annotations periodically with new data
    });
  }, intervalTime);
});

onUnmounted(() => {
  clearInterval(dataFetchInterval);
});

watch(
  data,
  () => {
    updateSeries(); // Call this function to update the chart series based on the new data
  },
  { deep: true, immediate: true }
);

watch(
  () => props.eventId,
  () => {
    fetchData().then(() => {
      updateChartAnnotations(); // Ensure annotations are updated when eventId changes
    });
  },
  { immediate: true }
);
</script>

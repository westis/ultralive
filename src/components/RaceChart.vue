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
          <!-- Last Splits content -->
          <v-data-table
            v-model:expanded="expanded"
            :headers="headers"
            :items="dataTable"
            item-value="pid"
            show-expand
            class="elevation-1"
            single-expand
            density="compact"
          >
            <!-- <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.name }}</td>
                <td>{{ item.kmDistance }} / {{ item.mileDistance }}</td>
                <td>{{ item.estimatedDistance.toFixed(2) }} km</td>
                <td>{{ item.time }}</td>
              </tr>
            </template> -->
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
                        v-for="(split, index) in filterSplitsForPid(item.pid)"
                        :key="index"
                      >
                        <td>{{ formatTimeWithSeconds(split.totalSeconds) }}</td>
                        <td>
                          {{
                            `${
                              split.kmDistance
                            } km / ${split.mileDistance.toFixed(2)} mi`
                          }}
                        </td>
                        <td>
                          {{ split.kmPace }} min/km -
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
console.log(allSplits.value);
const lastSplits = computed(() => raceStore.getLastSplits(props.eventId));

// Integration with useRaceData for fetching data, handling loading state, and caching
const { data, loading, fetchData, lastUpdated } = useRaceData(props.eventId);

// Define the ref for active tab
const tab = ref(0);
const expanded = ref([]);

const headers = ref([
  { title: "Name", key: "name" },
  { title: "Distance", key: "distance" },
  { title: "Estimated Distance", key: "estimatedDistance" }, // Add this line
  { title: "Last Registration", key: "time" },
]);

const thresholdSeconds = 10;

function filterSplitsForPid(pid) {
  const splits = allSplits.value[pid] || [];
  return splits.reduce((acc, curr) => {
    if (
      !acc.length ||
      Math.abs(curr.totalSeconds - acc[acc.length - 1].totalSeconds) >
        thresholdSeconds
    ) {
      acc.push(curr);
    }
    return acc;
  }, []);
}

// Data for the table below the chart
const dataTable = computed(() => {
  return Object.values(lastSplits.value || {})
    .map((item) => ({
      ...item,
      // Combine kmDistance and mileDistance
      distance: `${item.kmDistance.toFixed(2)} km / ${item.mileDistance.toFixed(
        2
      )} mi`,
      // Round estimatedDistance to two decimals
      estimatedDistance: `${item.estimatedDistance.toFixed(2)} km`,
      time: formatTimeWithSeconds(item.totalSeconds),
      kmPace: item.kmPace,
      milePace: item.milePace,
    }))
    .sort((a, b) => b.kmDistance - a.kmDistance);
});

function toggleExpand(item) {
  expanded.value = expanded.value.includes(item.pid) ? [] : [item.pid];
}

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
      const estimatedDistance = data.formattedEstimatedDistance;
      const Distance = data.formattedDistance;

      // Accessing the x-axis value (time) from w.globals.seriesX, which holds the time values.
      const timeValue = w.globals.seriesX[seriesIndex][dataPointIndex];
      const formattedTime = timeValue
        ? formatTimeWithSeconds(timeValue)
        : "N/A";

      return `
      <div class="pa-2">
      <div style="font-weight: bold;">${name}</div>
      <div>Time: ${formattedTime}</div>
       <div>Distance: ${Distance}</div>
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

  series.value = Object.entries(allSplits.value).map(([pid, splits]) => {
    // Filter duplicates within the threshold before mapping for the chart
    const filteredSplits = splits.reduce(
      (filtered, currentSplit, index, array) => {
        // Always add the first split
        if (index === 0) {
          filtered.push(currentSplit);
          return filtered;
        }

        // Add the split if it's beyond the threshold from the last split added
        const lastSplitAdded = filtered[filtered.length - 1];
        if (
          Math.abs(lastSplitAdded.totalSeconds - currentSplit.totalSeconds) >
          thresholdSeconds
        ) {
          filtered.push(currentSplit);
        }
        return filtered;
      },
      []
    );

    return {
      name: filteredSplits.length > 0 ? filteredSplits[0].name : "Unknown", // Use the runner's name or a default
      data: filteredSplits.map((split) => ({
        x: split.totalSeconds,
        y: split.estimatedDistance,
        formattedDistance: `${
          typeof split.kmDistance === "number"
            ? split.kmDistance.toFixed(2)
            : "N/A"
        } km / ${
          typeof split.mileDistance === "number"
            ? split.mileDistance.toFixed(2)
            : "N/A"
        } mi`,
        formattedEstimatedDistance: `${
          typeof split.estimatedDistance === "number"
            ? split.estimatedDistance.toFixed(2)
            : "N/A"
        } km / ${(typeof split.estimatedDistance === "number"
          ? split.estimatedDistance * 0.621371
          : "N/A"
        ).toFixed(2)} mi`,
      })),
    };
  });
};

// Function to update chart annotations dynamically based on the event
function updateChartAnnotations() {
  const eventInfo = eventRegistry[props.eventId];
  if (!eventInfo || !eventInfo.annotations) return;

  const yAnnotations = eventInfo.annotations.map((record) => ({
    y: record.distance,
    borderColor: record.color, // Use the color property for the border
    strokeDashArray: 5,
    strokeWidth: 30,
    label: {
      borderColor: record.color, // Use the color property for the label border
      offsetX: 10,
      offsetY: record.offset.y,
      style: {
        color: "#fff", // You can keep the text color white for contrast
        background: record.color, // Use the color property for the background
      },
      text: record.name,
      position: "left",
      textAnchor: "start",
    },
  }));

  chartOptions.value.annotations.yaxis = yAnnotations;
  adjustYAxisBounds(eventInfo.annotations, series.value);
}

function adjustYAxisBounds(records) {
  // Extract distances from records
  const recordDistances = records.map((record) => record.distance);
  // Find the min and max record distances
  const minRecordDistance = Math.min(...recordDistances);
  const maxRecordDistance = Math.max(...recordDistances);

  // Extract all Y values (distances) from the series data
  const dataPointsYValues = series.value.flatMap((s) =>
    s.data.map((point) => point.y)
  );
  // Find the min and max values from the series data
  const minDataPoint = Math.min(...dataPointsYValues);
  const maxDataPoint = Math.max(...dataPointsYValues);

  // Determine the overall min and max values to set on the Y-axis
  const minYValue = Math.min(minRecordDistance, minDataPoint);
  const maxYValue = Math.max(maxRecordDistance, maxDataPoint);

  // Optionally, add a buffer to these values for better chart aesthetics
  const buffer = (maxYValue - minYValue) * 0.05; // Adjust buffer size as needed

  // Set the Y-axis range in the chart options
  chartOptions.value.yaxis = {
    ...chartOptions.value.yaxis,
    min: minYValue - buffer,
    max: maxYValue + buffer,
  };
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
    updateSeries();
    const eventInfo = eventRegistry[props.eventId];
    if (eventInfo && eventInfo.records) {
      updateChartAnnotations(eventInfo.records); // This will also call adjustYAxisBounds internally
    }
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

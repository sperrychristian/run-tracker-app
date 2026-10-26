// grabbing the canvas and reading the data i put on it in the view
const chart_canvas = document.getElementById("weekly_chart");
const week_labels = JSON.parse(chart_canvas.dataset.labels);
const week_miles = JSON.parse(chart_canvas.dataset.miles);

// matching chart.js to my dark theme
Chart.defaults.color = "#8a94a3";
Chart.defaults.font.family = "Inter, system-ui, sans-serif";

// drawing the weekly mileage bar chart
new Chart(chart_canvas, {
  type: "bar",
  data: {
    labels: week_labels,
    datasets: [
      {
        label: "Miles",
        data: week_miles,
        backgroundColor: "#c8ff2e",
        hoverBackgroundColor: "#d9ff6b",
        borderRadius: 8,
        maxBarThickness: 42,
      },
    ],
  },
  options: {
    scales: {
      y: { beginAtZero: true, grid: { color: "#262d36" }, border: { display: false } },
      x: { grid: { display: false } },
    },
    plugins: { legend: { display: false } },
  },
});
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

const PredictionChart = ({ years, auto, bus, truck, motorcycle }) => {
  const data = {
    labels: years,
    datasets: [
      {
        label: "Auto",
        data: auto,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Bus",
        data: bus,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Truck",
        data: truck,
        borderColor: "rgba(255, 206, 86, 1)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Motorcycle",
        data: motorcycle,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      annotation: {
        annotations: {
          line1: {
            type: "line",
            xMin: years.indexOf(2020),
            xMax: years.indexOf(2020),
            borderColor: "white",
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              content: "2020 (Prediction Starts)",
              enabled: true,
              position: "top",
              color: "white",
              backgroundColor: "white",
            },
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Year",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Registrations",
        },
      },
    },
  };

  return (
    <div className="w-full h-[500px]">
      <Line data={data} options={options} />
    </div>
  );
};

export default PredictionChart;

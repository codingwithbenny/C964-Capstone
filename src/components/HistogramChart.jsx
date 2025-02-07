import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HistogramChart = ({ states, registrations }) => {
  const data = {
    labels: states,
    datasets: [
      {
        label: "Total Vehicle Registrations",
        data: registrations,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
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
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "State",
        },
      },
      y: {
        title: {
          display: true,
          text: "Total Registrations",
        },
        beginAtZero: true,
      },
    },
  };

  return ( 
    <div className="w-full lg:w-5/6 mx-auto h-[500px]">
      <Bar data={data} options={options} />
    </div>
  );
};

export default HistogramChart;

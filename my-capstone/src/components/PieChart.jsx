import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ auto, bus, truck, motorcycle }) => {
  const data = {
    labels: ["Auto", "Bus", "Truck", "Motorcycle"],
    datasets: [
      {
        data: [auto, bus, truck, motorcycle],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",  // Red - Auto
          "rgba(54, 162, 235, 0.6)",  // Blue - Bus
          "rgba(255, 206, 86, 0.6)",  // Yellow - Truck
          "rgba(75, 192, 192, 0.6)",  // Green - Motorcycle
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
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
  };

  return (
    <div className="w-full lg:w-1/2 mx-auto h-[400px]">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;

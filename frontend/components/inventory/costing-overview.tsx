import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useInventoryCostingOverview } from "@/lib/query/inventory-overview";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const CostingOverview: React.FC = () => {
  const {
    data: overviewData,
    isLoading,
    isError,
    error,
  } = useInventoryCostingOverview();
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: false,
        text: "Inventory Costing Overview",
      },
    },
  };

  const labels = overviewData?.map((item) => item.monthYear);

  console.log(overviewData)

  const data = {
    labels,
    datasets: [
      {
        label: "Incoming Total Cost",
        data: overviewData?.map((item) => item.incomingTotalCost),
        backgroundColor: "rgba(255, 99, 132, 0.8)",
      },
      {
        label: "Outgoing Total Cost",
        data: overviewData?.map((item) => item.outgoingTotalCost),
        backgroundColor: "rgba(53, 162, 235, 0.8)",
      },
    ],
  };

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>{`${error}`}</div>;

  return (
    <Bar
      // style={{ height: "full", width: "full" }}
      style={{ height: "100%", width: "100%" }}
      options={options}
      data={data}
    />
  );
};

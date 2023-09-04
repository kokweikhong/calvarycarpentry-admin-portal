import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { getRandomRgbaColor, changeOpacityFromRgba } from "@/lib/random-color";
import { useGetProductsSummary } from "@/lib/query/inventory-products";

ChartJS.register(ArcElement, Tooltip, Legend);

export const InventoryOverview: React.FC = () => {
  const {
    data: dataSummary,
    isLoading,
    isError,
    error,
  } = useGetProductsSummary();
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      // legend: {
      //   position: "bottom" as const,
      // },
      title: {
        display: false,
        text: "Inventory Overview",
      },
    },
  };

  const labels = dataSummary?.map((item) => [
    item.productName + " (" + item.productCode + ")",
    item.standardUnit.toUpperCase(),
  ]);

  const backgroundColor = dataSummary?.map(() => getRandomRgbaColor(1));

  const data = {
    labels,
    datasets: [
      {
        label: "Available Quantity",
        data: dataSummary?.map((item) => item.availableQuantity),
        // borderColor: "rgb(255, 99, 132)",
        backgroundColor: backgroundColor,
        borderColor: backgroundColor?.map((color) =>
          changeOpacityFromRgba(color, 1)
        ),

        borderWidth: 1,
      },
    ],
  };

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>{`${error}`}</div>;

  return (
    <Doughnut
      style={{ height: "100%", width: "100%" }}
      options={options}
      data={data}
    />
  );
};

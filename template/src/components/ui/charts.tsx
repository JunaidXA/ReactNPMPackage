import React, { useMemo, useState } from "react";
import ApexCharts from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { DoughnutChartProps, SimplePieChartCardProps, VerticleChartProps } from "../types";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Card, CardContent } from "./card";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { BarChartCardProps, IntervalKey } from "../types";

const VerticleChart: React.FC<VerticleChartProps> = ({ expense, revenue }) => {
  const options: ApexOptions = {
    chart: {
      type: "bar" as const,
      stacked: true,
      toolbar: { show: false },
    },
    colors: ["#2ee68a", "#4a9195"],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: "10%",
        borderRadiusApplication: "around",
        borderRadiusWhenStacked: "all",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      min: -30,
      max: 30,
      tickAmount: 6,
      labels: {
        formatter: (val: number) => val + "",
      },
    },
    fill: { opacity: 1 },
    legend: { show: false },
  };

  const barSeries = [
    { name: "Revenue", data: revenue },
    { name: "Expense", data: expense },
  ];

  return (
    <ApexCharts options={options} series={barSeries} type="bar" height={290} />
  );
};

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  labels,
  backgroundColor,
  className,
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Semi Donut",
        data,
        backgroundColor,
        borderColor: "#fff",
        borderWidth: 5,
        borderRadius: 10,
        cutout: "50%",
        hoverOffset: 0,
        hoverBorderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 1000,
      easing: "easeInOutCirc" as const,
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        align: "start" as const,
        labels: {
          boxWidth: 15,
          boxHeight: 15,
          padding: 5,
          color: "#000000",
          font: {
            family: "Nunito",
            size: 10,
            weight: "normal" as const,
          },
        },
      },
      tooltip: {
        usePointStyle: true,
        boxPadding: 2,
        backgroundColor: "#243036",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#243036",
        borderWidth: 0,
        titleFont: {
          family: "Nunito",
          size: 12,
          weight: "bold" as const,
        },
      },
      bodyFont: {
        family: "Nunito",
        size: 10,
      },
      callbacks: {
        label: (tooltipItem: any) => {
          const label = tooltipItem.label || "";
          const value = tooltipItem.raw || 0;
          return ` ${label}: ${value} Open Tickets`;
        },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
      },
    },
  };

  return (
    <div className={className}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

const BarChartCard: React.FC<BarChartCardProps> = ({
  title,
  intervals,
  defaultInterval = "Yearly",
  data,
  categories,
  options = {},
  height = 250,
  headerIcon,
  className,
}) => {
  const [selectedInterval, setSelectedInterval] =
    useState<IntervalKey>(defaultInterval);
  const { totalPurchase, totalSales } = useMemo(() => {
    const currentData = data[selectedInterval];

    const purchaseData =
      currentData.find((series) => series.name === "Closed Tickets")?.data || [];
    const salesData =
      currentData.find((series) => series.name === "Open Tickets")?.data || [];

    let purchaseSum = 0;
    let salesSum = 0;

    for (let i = 0; i < purchaseData.length; i++) {
      const value = purchaseData[i];
      if (typeof value === "number") {
        purchaseSum += value;
      } else if (
        value &&
        typeof value === "object" &&
        "y" in value &&
        typeof value.y === "number"
      ) {
        purchaseSum += value.y;
      }
    }

    for (let i = 0; i < salesData.length; i++) {
      const value = salesData[i];
      if (typeof value === "number") {
        salesSum += value;
      } else if (
        value &&
        typeof value === "object" &&
        "y" in value &&
        typeof value.y === "number"
      ) {
        salesSum += value.y;
      }
    }

    return {
      totalPurchase: purchaseSum + "",
      totalSales: salesSum + "",
    };
  }, [data, selectedInterval]);

  const baseOptions: ApexCharts.ApexOptions = {
    chart: {
      height,
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    colors: ["#2ee68a", "#4a9195"],
    plotOptions: {
      bar: {
        borderRadius: 8,
        borderRadiusWhenStacked: "all",
        horizontal: false,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: categories[selectedInterval],
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "13px",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => val + "",
        offsetX: -15,
        style: {
          colors: "#6B7280",
          fontSize: "13px",
        },
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 5,
      padding: { left: -16, top: 0, bottom: 0, right: 0 },
    },
    legend: { show: false },
    fill: { opacity: 1 },
    ...options,
  };

  return (
    <Card
      className={cn("rounded-sm border-0 shadow-regular bg-white", className)}
    >
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              {headerIcon || <ShoppingCart className="w-5 h-5 text-white" />}
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>

          {/* Time Interval Buttons */}
          <div className="flex items-center gap-0 bg-gray-100 rounded-md border border-gray-300">
            {intervals.map((interval, index) => (
              <button
                key={interval}
                onClick={() => setSelectedInterval(interval)}
                className={`px-3 py-1 text-md font-semibold transition-colors ${selectedInterval === interval
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white"
                  } ${index > 0 ? "border-l border-gray-300" : ""} ${index === 0 ? "rounded-l-md" : ""
                  } ${index === intervals.length - 1 ? "rounded-r-md" : ""}`}
              >
                {interval}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 pb-0 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 font-nunito">
              <div className="border p-2 rounded-lg border-border-gray">
                <p className="inline-flex items-center mb-1 text-md text-gray-400">
                  <i className="ti ti-circle-filled text-xsm text-primary me-1"></i>
                  Closed Tickets
                </p>
                <h4 className="text-lg font-semibold">{totalPurchase}</h4>
              </div>
              <div className="border p-2 rounded-lg border-border-gray">
                <p className="inline-flex items-center mb-1 text-md text-gray-400">
                  <i className="ti ti-circle-filled text-xsm text-secondary me-1"></i>
                  Open Tickets
                </p>
                <h4 className="text-lg font-semibold">{totalSales}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full p-5 pt-0">
          <ApexCharts
            options={{
              ...baseOptions,
              xaxis: {
                ...baseOptions.xaxis,
                categories: categories[selectedInterval],
              },
            }}
            series={data[selectedInterval]}
            type="bar"
            height={height}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Add this component to charts.tsx
const PieChartCard: React.FC<SimplePieChartCardProps> = ({
  title,
  data,
  labels,
  options = {},
  height = 300,
  headerIcon,
  className,
  colors,
}) => {

  const baseOptions: ApexOptions = {
    chart: {
      type: "pie",
      toolbar: { show: false },
    },
    labels: labels,
    colors: colors || ["#2ee68a", "#4a9195", "#f59e0b", "#ef4444", "#8b5cf6", "#6B3CEC"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "13px",
      fontFamily: "Nunito",
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toFixed(1) + "%",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 250,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    ...options,
  };

  return (
    <Card
      className={cn("rounded-sm border-0 shadow-regular bg-white", className)}
    >
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              {headerIcon || <ShoppingCart className="w-5 h-5 text-white" />}
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        </div>

        <div className="w-full p-5">
          <ApexCharts
            options={baseOptions}
            series={data}
            type="pie"
            height={height}
          />
        </div>
      </CardContent>
    </Card>
  );
};
// Update the export at the bottom
export { VerticleChart, DoughnutChart, BarChartCard, PieChartCard };
import { useState } from "react";
import { HealthData } from "@shared/schema";

interface WeeklyChartProps {
  weeklyData: HealthData[];
}

type ChartType = "steps" | "distance" | "calories";

export function WeeklyChart({ weeklyData }: WeeklyChartProps) {
  const [activeChart, setActiveChart] = useState<ChartType>("steps");

  const chartTabs = [
    { key: "steps" as ChartType, label: "Steps" },
    { key: "distance" as ChartType, label: "Distance" },
    { key: "calories" as ChartType, label: "Calories" },
  ];

  const days = ["M", "T", "W", "T", "F", "S", "S"];
  
  // Pad data to ensure we have 7 days
  const chartData = Array.from({ length: 7 }, (_, index) => {
    const dataItem = weeklyData[index];
    return {
      day: days[index],
      steps: dataItem?.steps || 0,
      distance: dataItem?.distance || 0,
      calories: dataItem?.calories || 0,
      isToday: index === 6, // Last day is today
    };
  });

  const getMaxValue = () => {
    switch (activeChart) {
      case "steps":
        return Math.max(...chartData.map(d => d.steps), 10000);
      case "distance":
        return Math.max(...chartData.map(d => d.distance), 10);
      case "calories":
        return Math.max(...chartData.map(d => d.calories), 500);
      default:
        return 100;
    }
  };

  const getValue = (data: typeof chartData[0]) => {
    return data[activeChart];
  };

  const maxValue = getMaxValue();

  return (
    <div className="px-6 mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-light tracking-wide mb-2">Weekly Progress</h3>
        <div className="flex space-x-4 text-xs">
          {chartTabs.map(tab => (
            <button
              key={tab.key}
              data-testid={`chart-tab-${tab.key}`}
              onClick={() => setActiveChart(tab.key)}
              className={`pb-1 font-light transition-colors ${
                activeChart === tab.key
                  ? "text-nothing-red border-b border-nothing-red"
                  : "text-nothing-gray-dark dark:text-nothing-gray hover:text-black dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-nothing-gray dark:bg-nothing-dark-card p-6 border border-nothing-gray-medium dark:border-nothing-gray-dark">
        <div className="flex items-end justify-between h-32 space-x-2">
          {chartData.map((data, index) => {
            const value = getValue(data);
            const height = (value / maxValue) * 100;
            
            return (
              <div 
                key={index} 
                className="flex-1 flex flex-col items-center space-y-2"
                data-testid={`chart-bar-${index}`}
              >
                <div className="w-full bg-nothing-gray-medium dark:bg-nothing-gray-dark rounded-sm relative h-full">
                  <div 
                    className="chart-bar bg-nothing-red rounded-sm absolute bottom-0 w-full"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span 
                  className={`text-xs font-light ${
                    data.isToday 
                      ? "text-nothing-red" 
                      : "text-nothing-gray-dark dark:text-nothing-gray"
                  }`}
                >
                  {data.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

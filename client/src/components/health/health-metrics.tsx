import { Heart, Moon, Weight } from "lucide-react";
import { HealthData } from "@shared/schema";

interface HealthMetricsProps {
  healthData?: HealthData;
}

export function HealthMetrics({ healthData }: HealthMetricsProps) {
  const heartRate = healthData?.heartRate || 72;
  const sleepHours = healthData?.sleepHours || 7.5;
  const weight = healthData?.weight || 70.2;

  const formatSleepTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getHeartRateStatus = (hr: number) => {
    if (hr < 60) return "Low";
    if (hr > 100) return "High";
    return "Normal";
  };

  const getSleepStatus = (hours: number) => {
    if (hours < 6) return "Poor";
    if (hours > 8) return "Excellent";
    return "Good";
  };

  const metrics = [
    {
      icon: Heart,
      title: "Heart Rate",
      subtitle: "Resting",
      value: `${heartRate} bpm`,
      status: getHeartRateStatus(heartRate),
      testId: "heart-rate"
    },
    {
      icon: Moon,
      title: "Sleep",
      subtitle: "Last night",
      value: formatSleepTime(sleepHours),
      status: getSleepStatus(sleepHours),
      testId: "sleep-hours"
    },
    {
      icon: Weight,
      title: "Weight",
      subtitle: "Today",
      value: `${weight} kg`,
      status: "-0.3 kg",
      testId: "weight"
    },
  ];

  return (
    <div className="px-6 mb-8">
      <h3 className="text-lg font-light tracking-wide mb-4">Health Metrics</h3>
      
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div 
            key={metric.title}
            className="bg-nothing-gray dark:bg-nothing-dark-card p-4 border border-nothing-gray-medium dark:border-nothing-gray-dark animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <metric.icon className="text-nothing-red w-4 h-4" />
                <div>
                  <p className="text-sm font-light">{metric.title}</p>
                  <p className="text-xs text-nothing-gray-dark dark:text-nothing-gray font-light">
                    {metric.subtitle}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p 
                  className="text-sm font-light"
                  data-testid={metric.testId}
                >
                  {metric.value}
                </p>
                <p className="text-xs text-nothing-gray-dark dark:text-nothing-gray font-light">
                  {metric.status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

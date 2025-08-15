import { useQuery } from "@tanstack/react-query";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { WeeklyChart } from "@/components/health/weekly-chart";
import { HealthData } from "@shared/schema";
import { Calendar, TrendingUp, Activity as ActivityIcon } from "lucide-react";

export default function Activity() {
  // Get start of week (7 days ago)
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 6);
  const startDate = startOfWeek.toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];

  // Fetch weekly data
  const { data: weeklyData = [] } = useQuery<HealthData[]>({
    queryKey: ["/api/health-data", { startDate, endDate: today }],
  });

  // Calculate weekly summary
  const summary = {
    totalSteps: weeklyData.reduce((sum, data) => sum + (data.steps || 0), 0),
    totalDistance: weeklyData.reduce((sum, data) => sum + (data.distance || 0), 0),
    totalCalories: weeklyData.reduce((sum, data) => sum + (data.calories || 0), 0),
    averageHeartRate: weeklyData.filter(d => d.heartRate).length > 0 
      ? weeklyData.reduce((sum, d) => sum + (d.heartRate || 0), 0) / weeklyData.filter(d => d.heartRate).length 
      : 0,
    totalActiveMinutes: weeklyData.reduce((sum, data) => sum + (data.activeMinutes || 0), 0),
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative bg-background text-foreground">
      {/* Header */}
      <div className="p-6 pt-12 border-b border-nothing-gray-medium dark:border-nothing-gray-dark">
        <h1 className="text-2xl font-light tracking-wide mb-2">Activity</h1>
        <p className="text-nothing-gray-dark dark:text-nothing-gray text-sm font-light">
          Weekly Summary
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-20">
        
        {/* Weekly Summary Cards */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-nothing-gray dark:bg-nothing-dark-card p-4 border border-nothing-gray-medium dark:border-nothing-gray-dark">
              <div className="flex items-center space-x-2 mb-2">
                <ActivityIcon className="w-4 h-4 text-nothing-red" />
                <span className="text-xs font-light text-nothing-gray-dark dark:text-nothing-gray">
                  Total Steps
                </span>
              </div>
              <p className="text-lg font-light" data-testid="total-steps">
                {summary.totalSteps.toLocaleString()}
              </p>
            </div>

            <div className="bg-nothing-gray dark:bg-nothing-dark-card p-4 border border-nothing-gray-medium dark:border-nothing-gray-dark">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-nothing-red" />
                <span className="text-xs font-light text-nothing-gray-dark dark:text-nothing-gray">
                  Distance
                </span>
              </div>
              <p className="text-lg font-light" data-testid="total-distance">
                {summary.totalDistance.toFixed(1)} km
              </p>
            </div>

            <div className="bg-nothing-gray dark:bg-nothing-dark-card p-4 border border-nothing-gray-medium dark:border-nothing-gray-dark">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-nothing-red" />
                <span className="text-xs font-light text-nothing-gray-dark dark:text-nothing-gray">
                  Calories
                </span>
              </div>
              <p className="text-lg font-light" data-testid="total-calories">
                {summary.totalCalories.toLocaleString()} kcal
              </p>
            </div>

            <div className="bg-nothing-gray dark:bg-nothing-dark-card p-4 border border-nothing-gray-medium dark:border-nothing-gray-dark">
              <div className="flex items-center space-x-2 mb-2">
                <ActivityIcon className="w-4 h-4 text-nothing-red" />
                <span className="text-xs font-light text-nothing-gray-dark dark:text-nothing-gray">
                  Active Time
                </span>
              </div>
              <p className="text-lg font-light" data-testid="total-active-minutes">
                {summary.totalActiveMinutes} min
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Chart */}
        <WeeklyChart weeklyData={weeklyData} />

        {/* Daily Breakdown */}
        <div className="px-6 mb-8">
          <h3 className="text-lg font-light tracking-wide mb-4">Daily Breakdown</h3>
          <div className="space-y-3">
            {weeklyData.slice().reverse().map((data, index) => {
              const date = new Date(data.date);
              const isToday = data.date === today;
              
              return (
                <div 
                  key={data.id}
                  data-testid={`daily-item-${index}`}
                  className="bg-nothing-gray dark:bg-nothing-dark-card p-4 border border-nothing-gray-medium dark:border-nothing-gray-dark"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className={`text-sm font-light ${isToday ? "text-nothing-red" : ""}`}>
                        {isToday ? "Today" : date.toLocaleDateString("en-US", { weekday: "long" })}
                      </p>
                      <p className="text-xs text-nothing-gray-dark dark:text-nothing-gray font-light">
                        {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-light">
                        {(data.steps || 0).toLocaleString()} steps
                      </p>
                      <p className="text-xs text-nothing-gray-dark dark:text-nothing-gray font-light">
                        {(data.distance || 0).toFixed(1)} km
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-nothing-gray-dark dark:text-nothing-gray">Calories</span>
                      <p className="font-light">{data.calories || 0} kcal</p>
                    </div>
                    <div>
                      <span className="text-nothing-gray-dark dark:text-nothing-gray">Heart Rate</span>
                      <p className="font-light">{data.heartRate || "--"} bpm</p>
                    </div>
                    <div>
                      <span className="text-nothing-gray-dark dark:text-nothing-gray">Active</span>
                      <p className="font-light">{data.activeMinutes || 0} min</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { StepTracker } from "@/components/health/step-tracker";
import { WeeklyChart } from "@/components/health/weekly-chart";
import { HealthMetrics } from "@/components/health/health-metrics";
import { GoalsSection } from "@/components/health/goals-section";
import { HealthConnect } from "@/components/health/health-connect";
import { WaterTracker } from "@/components/health/water-tracker";
import { WorkoutTracker } from "@/components/health/workout-tracker";
import { NutritionTracker } from "@/components/health/nutrition-tracker";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { HealthData, Goal, ConnectedService } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useState, useEffect } from "react";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Get start of week (7 days ago)
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 6);
  const startDate = startOfWeek.toISOString().split('T')[0];

  // Fetch today's health data
  const { data: todayData } = useQuery<HealthData[]>({
    queryKey: ["/api/health-data", { date: today }],
  });

  // Fetch weekly data
  const { data: weeklyData } = useQuery<HealthData[]>({
    queryKey: ["/api/health-data", { startDate, endDate: today }],
  });

  // Fetch goals
  const { data: goals = [] } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
  });

  // Fetch connected services
  const { data: services = [] } = useQuery<ConnectedService[]>({
    queryKey: ["/api/connected-services"],
  });

  // Toggle service connection
  const toggleServiceMutation = useMutation({
    mutationFn: async ({ serviceName, isConnected }: { serviceName: string; isConnected: boolean }) => {
      const response = await apiRequest("POST", "/api/connected-services", {
        serviceName,
        isConnected,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/connected-services"] });
    },
  });

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const handleEditGoals = () => {
    // TODO: Navigate to goals page or open modal
    console.log("Edit goals clicked");
  };

  const handleToggleService = (serviceName: string, isConnected: boolean) => {
    toggleServiceMutation.mutate({ serviceName, isConnected });
  };

  // Get today's health data (first item if exists)
  const currentHealthData = todayData?.[0];
  
  // Get daily steps goal
  const stepsGoal = goals.find(g => g.type === "daily_steps")?.target || 10000;

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative bg-background text-foreground">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-4 pt-12 border-b border-nothing-gray-medium dark:border-nothing-gray-dark">
        <div className="flex items-center space-x-2">
          <span 
            className="text-sm font-ndot"
            data-testid="current-time"
          >
            {formatTime(currentTime)}
          </span>
        </div>
        <button 
          onClick={toggleDarkMode}
          data-testid="theme-toggle"
          className="p-2 hover:bg-nothing-gray dark:hover:bg-nothing-dark-card rounded-full transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-20">
        {/* Header */}
        <div className="p-6 pb-8">
          <h1 className="text-2xl font-ndot-bold tracking-wide mb-2">Health</h1>
          <p 
            className="text-nothing-gray-dark dark:text-nothing-gray text-sm font-ndot"
            data-testid="current-date"
          >
            Today, {formatDate(currentTime)}
          </p>
        </div>

        {/* Step Tracker */}
        <StepTracker healthData={currentHealthData} goal={stepsGoal} />

        {/* Water Tracker */}
        <WaterTracker date={today} />

        {/* Weekly Chart */}
        <WeeklyChart weeklyData={weeklyData || []} />

        {/* Health Metrics */}
        <HealthMetrics healthData={currentHealthData} />

        {/* Workouts */}
        <WorkoutTracker date={today} />

        {/* Nutrition */}
        <NutritionTracker date={today} />

        {/* Goals */}
        <GoalsSection 
          goals={goals} 
          healthData={currentHealthData}
          weeklyData={weeklyData || []}
          onEditGoals={handleEditGoals}
        />

        {/* Health Connect */}
        <HealthConnect 
          services={services}
          onToggleService={handleToggleService}
        />
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

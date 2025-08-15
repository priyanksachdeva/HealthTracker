import { useQuery } from "@tanstack/react-query";
import { Moon, TrendingUp, Clock, BarChart3 } from "lucide-react";
import { SleepDetails } from "@shared/schema";

interface SleepAnalysisProps {
  date?: string;
}

export function SleepAnalysis({ date }: SleepAnalysisProps) {
  const targetDate = date || new Date().toISOString().split('T')[0];

  // Fetch sleep details for the date
  const { data: sleepData } = useQuery<SleepDetails[]>({
    queryKey: ["/api/sleep-details", { date: targetDate }],
  });

  // Fetch sleep data for the past week for trends
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 6);
  const startDate = startOfWeek.toISOString().split('T')[0];

  const { data: weeklySleepData = [] } = useQuery<SleepDetails[]>({
    queryKey: ["/api/sleep-details", { startDate, endDate: targetDate }],
  });

  const currentSleep = sleepData?.[0];
  
  if (!currentSleep) {
    return (
      <div className="px-6 mb-8">
        <h3 className="text-lg font-ndot tracking-wide mb-4">Sleep Analysis</h3>
        <div className="bg-nothing-gray dark:bg-nothing-dark-card p-6 border border-nothing-gray-medium dark:border-nothing-gray-dark text-center">
          <Moon className="w-12 h-12 text-nothing-gray-dark dark:text-nothing-gray mx-auto mb-4" />
          <p className="text-nothing-gray-dark dark:text-nothing-gray font-ndot">
            No sleep data available for this date
          </p>
        </div>
      </div>
    );
  }

  const totalSleep = (currentSleep.deepSleep || 0) + (currentSleep.lightSleep || 0) + (currentSleep.remSleep || 0);
  const averageWeeklySleep = weeklySleepData.length > 0 
    ? weeklySleepData.reduce((sum, sleep) => sum + ((sleep.deepSleep || 0) + (sleep.lightSleep || 0) + (sleep.remSleep || 0)), 0) / weeklySleepData.length
    : 0;

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "excellent": return "sleep-excellent";
      case "good": return "sleep-good";
      case "fair": return "sleep-fair";
      case "poor": return "sleep-poor";
      default: return "text-nothing-gray-dark dark:text-nothing-gray";
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "excellent": return "😊";
      case "good": return "🙂";
      case "fair": return "😐";
      case "poor": return "😴";
      default: return "😐";
    }
  };

  const sleepPhases = [
    { 
      name: "Deep Sleep", 
      value: currentSleep.deepSleep || 0, 
      color: "bg-blue-600",
      description: "Most restorative"
    },
    { 
      name: "REM Sleep", 
      value: currentSleep.remSleep || 0, 
      color: "bg-purple-500",
      description: "Dream stage"
    },
    { 
      name: "Light Sleep", 
      value: currentSleep.lightSleep || 0, 
      color: "bg-blue-400",
      description: "Transition phase"
    },
    { 
      name: "Awake", 
      value: currentSleep.awakeTime || 0, 
      color: "bg-orange-400",
      description: "Brief awakenings"
    },
  ];

  const maxPhaseValue = Math.max(...sleepPhases.map(p => p.value));

  return (
    <div className="px-6 mb-8">
      <h3 className="text-lg font-ndot tracking-wide mb-4">Sleep Analysis</h3>
      
      {/* Sleep Overview */}
      <div className="bg-nothing-gray dark:bg-nothing-dark-card p-6 border border-nothing-gray-medium dark:border-nothing-gray-dark mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Moon className="w-5 h-5 text-nothing-red" />
            <h4 className="font-ndot-bold">Sleep Summary</h4>
          </div>
          <div className={`flex items-center space-x-1 ${getMoodColor(currentSleep.mood || "fair")}`}>
            <span className="text-lg">{getMoodEmoji(currentSleep.mood || "fair")}</span>
            <span className="text-sm font-ndot capitalize">{currentSleep.mood}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-ndot-bold" data-testid="total-sleep-hours">
              {totalSleep.toFixed(1)}h
            </p>
            <p className="text-xs font-ndot text-nothing-gray-dark dark:text-nothing-gray">
              Total Sleep
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-ndot-bold" data-testid="sleep-efficiency">
              {Math.round(currentSleep.sleepEfficiency || 0)}%
            </p>
            <p className="text-xs font-ndot text-nothing-gray-dark dark:text-nothing-gray">
              Sleep Efficiency
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-xs font-ndot">
          <div className="text-center">
            <p className="font-ndot-bold">{currentSleep.bedtime}</p>
            <p className="text-nothing-gray-dark dark:text-nothing-gray">Bedtime</p>
          </div>
          <div className="text-center">
            <p className="font-ndot-bold">{currentSleep.wakeTime}</p>
            <p className="text-nothing-gray-dark dark:text-nothing-gray">Wake Time</p>
          </div>
          <div className="text-center">
            <p className="font-ndot-bold">{currentSleep.timesToWakeUp || 0}</p>
            <p className="text-nothing-gray-dark dark:text-nothing-gray">Wake Ups</p>
          </div>
        </div>
      </div>

      {/* Sleep Phases Chart */}
      <div className="bg-nothing-gray dark:bg-nothing-dark-card p-6 border border-nothing-gray-medium dark:border-nothing-gray-dark mb-4">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-nothing-red" />
          <h4 className="font-ndot-bold">Sleep Phases</h4>
        </div>

        <div className="space-y-3">
          {sleepPhases.map((phase, index) => {
            const percentage = maxPhaseValue > 0 ? (phase.value / maxPhaseValue) * 100 : 0;
            
            return (
              <div key={phase.name} data-testid={`sleep-phase-${index}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-sm ${phase.color}`} />
                    <span className="text-sm font-ndot">{phase.name}</span>
                  </div>
                  <span className="text-sm font-ndot">
                    {phase.value.toFixed(1)}h
                  </span>
                </div>
                <div className="w-full h-2 bg-nothing-gray-medium dark:bg-nothing-gray-dark rounded-sm overflow-hidden">
                  <div 
                    className={`h-full ${phase.color} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-nothing-gray-dark dark:text-nothing-gray font-ndot mt-1">
                  {phase.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sleep Trends */}
      {weeklySleepData.length > 1 && (
        <div className="bg-nothing-gray dark:bg-nothing-dark-card p-6 border border-nothing-gray-medium dark:border-nothing-gray-dark">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-nothing-red" />
            <h4 className="font-ndot-bold">Weekly Trends</h4>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-lg font-ndot-bold">
                {averageWeeklySleep.toFixed(1)}h
              </p>
              <p className="text-xs font-ndot text-nothing-gray-dark dark:text-nothing-gray">
                Weekly Average
              </p>
            </div>
            <div className="text-center">
              <p className={`text-lg font-ndot-bold ${totalSleep >= averageWeeklySleep ? 'text-green-500' : 'text-orange-500'}`}>
                {totalSleep >= averageWeeklySleep ? '+' : ''}{(totalSleep - averageWeeklySleep).toFixed(1)}h
              </p>
              <p className="text-xs font-ndot text-nothing-gray-dark dark:text-nothing-gray">
                vs Average
              </p>
            </div>
          </div>

          {/* Weekly sleep quality chart */}
          <div className="mt-4 pt-4 border-t border-nothing-gray-medium dark:border-nothing-gray-dark">
            <div className="flex items-end justify-between h-20 space-x-1">
              {weeklySleepData.slice(-7).map((sleep, index) => {
                const dayTotal = (sleep.deepSleep || 0) + (sleep.lightSleep || 0) + (sleep.remSleep || 0);
                const height = (dayTotal / 10) * 100; // Scale to 10 hours max
                const isToday = index === weeklySleepData.length - 1;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center space-y-1">
                    <div className="w-full bg-nothing-gray-medium dark:bg-nothing-gray-dark rounded-sm relative h-full">
                      <div 
                        className={`chart-bar rounded-sm absolute bottom-0 w-full ${isToday ? 'bg-nothing-red' : 'bg-blue-400'}`}
                        style={{ height: `${Math.max(height, 5)}%` }}
                      />
                    </div>
                    <span className="text-xs font-ndot text-nothing-gray-dark dark:text-nothing-gray">
                      {isToday ? 'Today' : ['M','T','W','T','F','S','S'][index % 7]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sleep Notes */}
      {currentSleep.notes && (
        <div className="bg-nothing-gray dark:bg-nothing-dark-card p-4 border border-nothing-gray-medium dark:border-nothing-gray-dark mt-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-nothing-red" />
            <h4 className="font-ndot-bold text-sm">Notes</h4>
          </div>
          <p className="text-sm font-ndot text-nothing-gray-dark dark:text-nothing-gray">
            {currentSleep.notes}
          </p>
        </div>
      )}
    </div>
  );
}
import { Edit } from "lucide-react";
import { Goal, HealthData } from "@shared/schema";

interface GoalsSectionProps {
  goals: Goal[];
  healthData?: HealthData;
  weeklyData: HealthData[];
  onEditGoals: () => void;
}

export function GoalsSection({ goals, healthData, weeklyData, onEditGoals }: GoalsSectionProps) {
  const getGoalProgress = (goal: Goal) => {
    switch (goal.type) {
      case "daily_steps":
        const currentSteps = healthData?.steps || 0;
        return {
          current: currentSteps,
          target: goal.target,
          progress: Math.min((currentSteps / goal.target) * 100, 100),
          unit: "steps"
        };
      case "weekly_distance":
        const weeklyDistance = weeklyData.reduce((sum, data) => sum + (data.distance || 0), 0);
        return {
          current: weeklyDistance,
          target: goal.target,
          progress: Math.min((weeklyDistance / goal.target) * 100, 100),
          unit: "km"
        };
      case "active_minutes":
        const activeMinutes = healthData?.activeMinutes || 0;
        return {
          current: activeMinutes,
          target: goal.target,
          progress: Math.min((activeMinutes / goal.target) * 100, 100),
          unit: "min"
        };
      default:
        return {
          current: 0,
          target: goal.target,
          progress: 0,
          unit: ""
        };
    }
  };

  const getGoalDisplayName = (type: string) => {
    switch (type) {
      case "daily_steps":
        return "Daily Steps";
      case "weekly_distance":
        return "Weekly Distance";
      case "active_minutes":
        return "Active Minutes";
      default:
        return type;
    }
  };

  return (
    <div className="px-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-light tracking-wide">Goals</h3>
        <button 
          onClick={onEditGoals}
          data-testid="edit-goals"
          className="text-nothing-red text-xs font-light hover:text-nothing-red-light transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>
      
      <div className="bg-nothing-gray dark:bg-nothing-dark-card p-6 border border-nothing-gray-medium dark:border-nothing-gray-dark">
        <div className="space-y-6">
          {goals.map((goal) => {
            const { current, target, progress, unit } = getGoalProgress(goal);
            
            return (
              <div key={goal.id} data-testid={`goal-${goal.type}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-light">
                    {getGoalDisplayName(goal.type)}
                  </span>
                  <span className="text-sm font-light text-nothing-gray-dark dark:text-nothing-gray">
                    {typeof current === 'number' && current % 1 !== 0 
                      ? current.toFixed(1) 
                      : current.toLocaleString()} / {target.toLocaleString()} {unit}
                  </span>
                </div>
                <div className="w-full bg-nothing-gray-medium dark:bg-nothing-gray-dark h-1 rounded-sm">
                  <div 
                    className="bg-nothing-red h-1 rounded-sm transition-all duration-300"
                    style={{ width: `${progress}%` }}
                    data-testid={`goal-progress-${goal.type}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

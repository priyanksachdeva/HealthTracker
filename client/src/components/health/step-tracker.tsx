import { ProgressRing } from "@/components/ui/progress-ring";
import { Activity, MapPin, Flame } from "lucide-react";
import { HealthData } from "@shared/schema";

interface StepTrackerProps {
  healthData?: HealthData;
  goal?: number;
}

export function StepTracker({ healthData, goal = 10000 }: StepTrackerProps) {
  const steps = healthData?.steps || 0;
  const distance = healthData?.distance || 0;
  const calories = healthData?.calories || 0;
  const progress = Math.min((steps / goal) * 100, 100);

  return (
    <div className="px-6 mb-8">
      <div className="bg-nothing-gray dark:bg-nothing-dark-card p-6 border border-nothing-gray-medium dark:border-nothing-gray-dark animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-light tracking-wide">Steps</h2>
            <p className="text-xs text-nothing-gray-dark dark:text-nothing-gray font-light mt-1">
              Daily Goal: {goal.toLocaleString()}
            </p>
          </div>
          <Activity className="text-nothing-red w-5 h-5" />
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <span 
              className="text-3xl font-light tracking-wide"
              data-testid="current-steps"
            >
              {steps.toLocaleString()}
            </span>
            <span className="text-nothing-gray-dark dark:text-nothing-gray text-sm font-light ml-2">
              steps
            </span>
          </div>
          <ProgressRing percentage={progress} size={64} strokeWidth={8}>
            <span 
              className="text-xs font-light"
              data-testid="step-progress"
            >
              {Math.round(progress)}%
            </span>
          </ProgressRing>
        </div>
        
        <div className="h-px bg-nothing-gray-medium dark:bg-nothing-gray-dark mb-4"></div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-nothing-gray-dark dark:text-nothing-gray" />
            <div>
              <p className="text-xs text-nothing-gray-dark dark:text-nothing-gray font-light">
                Distance
              </p>
              <p 
                className="text-sm font-light mt-1"
                data-testid="distance"
              >
                {distance.toFixed(1)} km
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-nothing-gray-dark dark:text-nothing-gray" />
            <div>
              <p className="text-xs text-nothing-gray-dark dark:text-nothing-gray font-light">
                Calories
              </p>
              <p 
                className="text-sm font-light mt-1"
                data-testid="calories"
              >
                {calories} kcal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

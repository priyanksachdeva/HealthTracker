import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Droplets, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { HealthData } from "@shared/schema";

interface WaterTrackerProps {
  date?: string;
}

export function WaterTracker({ date }: WaterTrackerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const targetDate = date || new Date().toISOString().split('T')[0];
  const dailyGoal = 2.5; // 2.5 liters per day

  // Fetch today's health data
  const { data: todayData } = useQuery<HealthData[]>({
    queryKey: ["/api/health-data", { date: targetDate }],
  });

  const currentWaterIntake = todayData?.[0]?.waterIntake || 0;
  const progress = Math.min((currentWaterIntake / dailyGoal) * 100, 100);

  // Update water intake mutation
  const updateWaterMutation = useMutation({
    mutationFn: async (newIntake: number) => {
      const response = await apiRequest("POST", "/api/health-data", {
        date: targetDate,
        waterIntake: Math.max(0, newIntake),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/health-data"] });
      setIsAdding(false);
    },
  });

  const addWater = (amount: number) => {
    const newIntake = currentWaterIntake + amount;
    updateWaterMutation.mutate(newIntake);
    
    if (newIntake >= dailyGoal && currentWaterIntake < dailyGoal) {
      toast({
        title: "Goal achieved! 🎉",
        description: "You've reached your daily water goal!",
      });
    }
  };

  const removeWater = (amount: number) => {
    const newIntake = Math.max(0, currentWaterIntake - amount);
    updateWaterMutation.mutate(newIntake);
  };

  const waterAmounts = [0.25, 0.5, 1.0]; // liters

  const getWaterStatusColor = () => {
    if (progress >= 100) return "text-blue-500";
    if (progress >= 75) return "text-blue-400";
    if (progress >= 50) return "text-blue-300";
    return "text-nothing-gray-dark dark:text-nothing-gray";
  };

  return (
    <div className="px-6 mb-8">
      <div className="bg-nothing-gray dark:bg-nothing-dark-card p-6 border border-nothing-gray-medium dark:border-nothing-gray-dark animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-ndot tracking-wide">Water Intake</h2>
            <p className="text-xs text-nothing-gray-dark dark:text-nothing-gray font-ndot mt-1">
              Daily Goal: {dailyGoal}L
            </p>
          </div>
          <Droplets className="text-blue-400 w-5 h-5" />
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <span 
              className={`text-3xl font-ndot-bold tracking-wide ${getWaterStatusColor()}`}
              data-testid="current-water-intake"
            >
              {currentWaterIntake.toFixed(1)}L
            </span>
            <span className="text-nothing-gray-dark dark:text-nothing-gray text-sm font-ndot ml-2">
              / {dailyGoal}L
            </span>
          </div>
          <ProgressRing percentage={progress} size={64} strokeWidth={8}>
            <span 
              className="text-xs font-ndot"
              data-testid="water-progress"
            >
              {Math.round(progress)}%
            </span>
          </ProgressRing>
        </div>
        
        <div className="h-px bg-nothing-gray-medium dark:bg-nothing-gray-dark mb-4"></div>
        
        {/* Quick Add Buttons */}
        <div className="space-y-2">
          <p className="text-xs text-nothing-gray-dark dark:text-nothing-gray font-ndot mb-2">
            Quick Add
          </p>
          <div className="grid grid-cols-3 gap-2">
            {waterAmounts.map((amount) => (
              <Button
                key={amount}
                onClick={() => addWater(amount)}
                disabled={updateWaterMutation.isPending}
                variant="outline"
                size="sm"
                className="font-ndot text-xs"
                data-testid={`add-water-${amount}`}
              >
                <Plus className="w-3 h-3 mr-1" />
                {amount}L
              </Button>
            ))}
          </div>
          
          {/* Remove water option */}
          {currentWaterIntake > 0 && (
            <div className="mt-3 pt-3 border-t border-nothing-gray-medium dark:border-nothing-gray-dark">
              <p className="text-xs text-nothing-gray-dark dark:text-nothing-gray font-ndot mb-2">
                Remove
              </p>
              <div className="grid grid-cols-3 gap-2">
                {waterAmounts.map((amount) => (
                  <Button
                    key={`remove-${amount}`}
                    onClick={() => removeWater(amount)}
                    disabled={updateWaterMutation.isPending || currentWaterIntake < amount}
                    variant="outline"
                    size="sm"
                    className="font-ndot text-xs"
                    data-testid={`remove-water-${amount}`}
                  >
                    <Minus className="w-3 h-3 mr-1" />
                    {amount}L
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hydration Tips */}
        <div className="mt-4 pt-4 border-t border-nothing-gray-medium dark:border-nothing-gray-dark">
          <p className="text-xs text-nothing-gray-dark dark:text-nothing-gray font-ndot">
            {progress >= 100 
              ? "🎉 Excellent hydration! Keep it up!"
              : progress >= 75 
              ? "💧 You're doing great! Almost there!"
              : progress >= 50 
              ? "👍 Good progress, keep drinking!"
              : progress >= 25 
              ? "💦 Start hydrating more!"
              : "🚰 Time to drink more water!"
            }
          </p>
        </div>
      </div>
    </div>
  );
}
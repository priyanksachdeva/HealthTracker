import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Goal, HealthData } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Target, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Goals() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [newGoal, setNewGoal] = useState({
    type: "",
    target: 0,
  });

  // Get today's date and week range
  const today = new Date().toISOString().split('T')[0];
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 6);
  const startDate = startOfWeek.toISOString().split('T')[0];

  // Fetch goals
  const { data: goals = [] } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
  });

  // Fetch today's health data
  const { data: todayData } = useQuery<HealthData[]>({
    queryKey: ["/api/health-data", { date: today }],
  });

  // Fetch weekly data
  const { data: weeklyData = [] } = useQuery<HealthData[]>({
    queryKey: ["/api/health-data", { startDate, endDate: today }],
  });

  // Create goal mutation
  const createGoalMutation = useMutation({
    mutationFn: async (goal: { type: string; target: number }) => {
      const response = await apiRequest("POST", "/api/goals", goal);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      setIsCreating(false);
      setNewGoal({ type: "", target: 0 });
      toast({
        title: "Goal created",
        description: "Your new goal has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete goal mutation
  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      const response = await apiRequest("DELETE", `/api/goals/${goalId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      toast({
        title: "Goal deleted",
        description: "Your goal has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete goal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getGoalProgress = (goal: Goal) => {
    const currentHealthData = todayData?.[0];
    
    switch (goal.type) {
      case "daily_steps":
        const currentSteps = currentHealthData?.steps || 0;
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
        const activeMinutes = currentHealthData?.activeMinutes || 0;
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

  const handleCreateGoal = () => {
    if (!newGoal.type || newGoal.target <= 0) {
      toast({
        title: "Invalid goal",
        description: "Please select a goal type and enter a valid target.",
        variant: "destructive",
      });
      return;
    }

    createGoalMutation.mutate(newGoal);
  };

  const goalTypes = [
    { value: "daily_steps", label: "Daily Steps" },
    { value: "weekly_distance", label: "Weekly Distance (km)" },
    { value: "active_minutes", label: "Daily Active Minutes" },
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative bg-background text-foreground">
      {/* Header */}
      <div className="p-6 pt-12 border-b border-nothing-gray-medium dark:border-nothing-gray-dark">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light tracking-wide mb-2">Goals</h1>
            <p className="text-nothing-gray-dark dark:text-nothing-gray text-sm font-light">
              Track your health targets
            </p>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            data-testid="add-goal"
            className="p-2 hover:bg-nothing-gray dark:hover:bg-nothing-dark-card rounded-full transition-colors"
          >
            <Plus className="w-5 h-5 text-nothing-red" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-20">
        
        {/* Create Goal Form */}
        {isCreating && (
          <div className="p-6 border-b border-nothing-gray-medium dark:border-nothing-gray-dark">
            <h3 className="text-lg font-light tracking-wide mb-4">Create New Goal</h3>
            <div className="space-y-4">
              <div>
                <Select
                  value={newGoal.type}
                  onValueChange={(value) => setNewGoal({ ...newGoal, type: value })}
                >
                  <SelectTrigger data-testid="goal-type-select">
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Enter target value"
                  value={newGoal.target || ""}
                  onChange={(e) => setNewGoal({ ...newGoal, target: Number(e.target.value) })}
                  data-testid="goal-target-input"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleCreateGoal}
                  disabled={createGoalMutation.isPending}
                  className="bg-nothing-red hover:bg-nothing-red-light text-white"
                  data-testid="create-goal-button"
                >
                  {createGoalMutation.isPending ? "Creating..." : "Create Goal"}
                </Button>
                <Button
                  onClick={() => setIsCreating(false)}
                  variant="outline"
                  data-testid="cancel-goal-button"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Goals List */}
        <div className="p-6">
          {goals.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-nothing-gray-dark dark:text-nothing-gray mx-auto mb-4" />
              <h3 className="text-lg font-light mb-2">No goals yet</h3>
              <p className="text-nothing-gray-dark dark:text-nothing-gray text-sm font-light">
                Create your first health goal to get started
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {goals.map((goal) => {
                const { current, target, progress, unit } = getGoalProgress(goal);
                
                return (
                  <div 
                    key={goal.id}
                    data-testid={`goal-item-${goal.type}`}
                    className="bg-nothing-gray dark:bg-nothing-dark-card p-6 border border-nothing-gray-medium dark:border-nothing-gray-dark"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Target className="w-5 h-5 text-nothing-red" />
                        <div>
                          <h3 className="text-lg font-light">{getGoalDisplayName(goal.type)}</h3>
                          <p className="text-xs text-nothing-gray-dark dark:text-nothing-gray font-light">
                            Target: {target.toLocaleString()} {unit}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteGoalMutation.mutate(goal.id)}
                        data-testid={`delete-goal-${goal.type}`}
                        className="p-2 hover:bg-nothing-gray-medium dark:hover:bg-nothing-gray-dark rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-nothing-gray-dark dark:text-nothing-gray" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light">Progress</span>
                        <span className="text-sm font-light text-nothing-gray-dark dark:text-nothing-gray">
                          {typeof current === 'number' && current % 1 !== 0 
                            ? current.toFixed(1) 
                            : current.toLocaleString()} / {target.toLocaleString()} {unit}
                        </span>
                      </div>
                      
                      <div className="w-full bg-nothing-gray-medium dark:bg-nothing-gray-dark h-2 rounded-sm">
                        <div 
                          className="bg-nothing-red h-2 rounded-sm transition-all duration-300"
                          style={{ width: `${progress}%` }}
                          data-testid={`goal-progress-bar-${goal.type}`}
                        />
                      </div>
                      
                      <div className="text-center">
                        <span className="text-lg font-light text-nothing-red">
                          {Math.round(progress)}%
                        </span>
                        <span className="text-sm font-light text-nothing-gray-dark dark:text-nothing-gray ml-1">
                          complete
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

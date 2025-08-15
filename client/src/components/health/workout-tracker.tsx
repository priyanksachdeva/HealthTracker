import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Play, Plus, X, Clock, Flame, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Workout } from "@shared/schema";

interface WorkoutTrackerProps {
  date?: string;
}

export function WorkoutTracker({ date }: WorkoutTrackerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    type: "",
    name: "",
    duration: 0,
    calories: 0,
    distance: 0,
    intensity: "moderate",
    notes: "",
  });

  const targetDate = date || new Date().toISOString().split('T')[0];

  // Fetch workouts for the date
  const { data: workouts = [] } = useQuery<Workout[]>({
    queryKey: ["/api/workouts", { date: targetDate }],
  });

  // Create workout mutation
  const createWorkoutMutation = useMutation({
    mutationFn: async (workout: any) => {
      const response = await apiRequest("POST", "/api/workouts", {
        ...workout,
        date: targetDate,
        startTime: new Date().toTimeString().slice(0, 5),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      setIsDialogOpen(false);
      setNewWorkout({
        type: "",
        name: "",
        duration: 0,
        calories: 0,
        distance: 0,
        intensity: "moderate",
        notes: "",
      });
      toast({
        title: "Workout logged",
        description: "Your workout has been added successfully.",
      });
    },
  });

  // Delete workout mutation
  const deleteWorkoutMutation = useMutation({
    mutationFn: async (workoutId: string) => {
      const response = await apiRequest("DELETE", `/api/workouts/${workoutId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({
        title: "Workout deleted",
        description: "Your workout has been removed.",
      });
    },
  });

  const workoutTypes = [
    { value: "running", label: "Running" },
    { value: "cycling", label: "Cycling" },
    { value: "swimming", label: "Swimming" },
    { value: "strength", label: "Strength Training" },
    { value: "yoga", label: "Yoga" },
    { value: "cardio", label: "Cardio" },
    { value: "sports", label: "Sports" },
    { value: "other", label: "Other" },
  ];

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "low": return "intensity-low";
      case "moderate": return "intensity-moderate";
      case "high": return "intensity-high";
      default: return "intensity-moderate";
    }
  };

  const handleCreateWorkout = () => {
    if (!newWorkout.type || !newWorkout.name || newWorkout.duration <= 0) {
      toast({
        title: "Invalid workout",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createWorkoutMutation.mutate(newWorkout);
  };

  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
  const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);

  return (
    <div className="px-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-ndot tracking-wide">Workouts</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-nothing-red hover:bg-nothing-red-light text-white font-ndot"
              data-testid="add-workout"
            >
              <Plus className="w-4 h-4 mr-1" />
              Log
            </Button>
          </DialogTrigger>
          <DialogContent className="font-ndot">
            <DialogHeader>
              <DialogTitle className="font-ndot">Log Workout</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Select
                    value={newWorkout.type}
                    onValueChange={(value) => setNewWorkout({ ...newWorkout, type: value })}
                  >
                    <SelectTrigger data-testid="workout-type-select">
                      <SelectValue placeholder="Workout type" />
                    </SelectTrigger>
                    <SelectContent>
                      {workoutTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Input
                    placeholder="Workout name"
                    value={newWorkout.name}
                    onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                    data-testid="workout-name-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    type="number"
                    placeholder="Duration (min)"
                    value={newWorkout.duration || ""}
                    onChange={(e) => setNewWorkout({ ...newWorkout, duration: Number(e.target.value) })}
                    data-testid="workout-duration-input"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Calories"
                    value={newWorkout.calories || ""}
                    onChange={(e) => setNewWorkout({ ...newWorkout, calories: Number(e.target.value) })}
                    data-testid="workout-calories-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Distance (km)"
                    value={newWorkout.distance || ""}
                    onChange={(e) => setNewWorkout({ ...newWorkout, distance: Number(e.target.value) })}
                    data-testid="workout-distance-input"
                  />
                </div>
                <div>
                  <Select
                    value={newWorkout.intensity}
                    onValueChange={(value) => setNewWorkout({ ...newWorkout, intensity: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Intensity</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="high">High Intensity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Input
                  placeholder="Notes (optional)"
                  value={newWorkout.notes}
                  onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
                  data-testid="workout-notes-input"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleCreateWorkout}
                  disabled={createWorkoutMutation.isPending}
                  className="bg-nothing-red hover:bg-nothing-red-light text-white font-ndot"
                  data-testid="save-workout-button"
                >
                  {createWorkoutMutation.isPending ? "Saving..." : "Save Workout"}
                </Button>
                <Button
                  onClick={() => setIsDialogOpen(false)}
                  variant="outline"
                  className="font-ndot"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      {workouts.length > 0 && (
        <div className="bg-nothing-gray dark:bg-nothing-dark-card p-4 mb-4 border border-nothing-gray-medium dark:border-nothing-gray-dark">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <Clock className="w-4 h-4 mx-auto mb-1 text-nothing-red" />
              <p className="text-sm font-ndot text-nothing-gray-dark dark:text-nothing-gray">
                Total Time
              </p>
              <p className="text-lg font-ndot-bold" data-testid="total-workout-time">
                {totalDuration} min
              </p>
            </div>
            <div>
              <Flame className="w-4 h-4 mx-auto mb-1 text-nothing-red" />
              <p className="text-sm font-ndot text-nothing-gray-dark dark:text-nothing-gray">
                Calories
              </p>
              <p className="text-lg font-ndot-bold" data-testid="total-workout-calories">
                {totalCalories} kcal
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Workouts List */}
      <div className="space-y-3">
        {workouts.length === 0 ? (
          <div className="text-center py-8">
            <Play className="w-12 h-12 text-nothing-gray-dark dark:text-nothing-gray mx-auto mb-4" />
            <p className="text-nothing-gray-dark dark:text-nothing-gray font-ndot">
              No workouts logged today
            </p>
          </div>
        ) : (
          workouts.map((workout) => (
            <div
              key={workout.id}
              className={`bg-nothing-gray dark:bg-nothing-dark-card p-4 border border-nothing-gray-medium dark:border-nothing-gray-dark ${getIntensityColor(workout.intensity || "moderate")}`}
              data-testid={`workout-${workout.id}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-ndot-bold">{workout.name}</h4>
                  <p className="text-xs text-nothing-gray-dark dark:text-nothing-gray font-ndot">
                    {workout.type} • {workout.intensity}
                  </p>
                </div>
                <button
                  onClick={() => deleteWorkoutMutation.mutate(workout.id)}
                  className="text-nothing-gray-dark hover:text-nothing-red transition-colors"
                  data-testid={`delete-workout-${workout.id}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-xs font-ndot">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-nothing-red" />
                  <span>{workout.duration} min</span>
                </div>
                {workout.calories && (
                  <div className="flex items-center space-x-1">
                    <Flame className="w-3 h-3 text-nothing-red" />
                    <span>{workout.calories} kcal</span>
                  </div>
                )}
                {workout.distance && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-nothing-red" />
                    <span>{workout.distance} km</span>
                  </div>
                )}
                {workout.avgHeartRate && (
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3 text-nothing-red" />
                    <span>{workout.avgHeartRate} bpm</span>
                  </div>
                )}
              </div>
              
              {workout.notes && (
                <p className="text-xs text-nothing-gray-dark dark:text-nothing-gray mt-2 font-ndot">
                  {workout.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
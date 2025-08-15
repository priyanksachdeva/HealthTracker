import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Apple, Plus, X, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Nutrition } from "@shared/schema";

interface NutritionTrackerProps {
  date?: string;
}

interface NutritionSummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalSugar: number;
  totalSodium: number;
  meals: Record<string, any[]>;
}

export function NutritionTracker({ date }: NutritionTrackerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFood, setNewFood] = useState({
    mealType: "",
    foodName: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    serving: "",
  });

  const targetDate = date || new Date().toISOString().split('T')[0];

  // Fetch nutrition data for the date
  const { data: nutrition = [] } = useQuery<Nutrition[]>({
    queryKey: ["/api/nutrition", { date: targetDate }],
  });

  // Fetch nutrition summary
  const { data: summary } = useQuery<NutritionSummary>({
    queryKey: ["/api/analytics/nutrition-summary", { date: targetDate }],
  });

  // Create nutrition entry mutation
  const createNutritionMutation = useMutation({
    mutationFn: async (food: any) => {
      const response = await apiRequest("POST", "/api/nutrition", {
        ...food,
        date: targetDate,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nutrition"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/nutrition-summary"] });
      setIsDialogOpen(false);
      setNewFood({
        mealType: "",
        foodName: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        serving: "",
      });
      toast({
        title: "Food logged",
        description: "Your food entry has been added successfully.",
      });
    },
  });

  // Delete nutrition entry mutation
  const deleteNutritionMutation = useMutation({
    mutationFn: async (nutritionId: string) => {
      const response = await apiRequest("DELETE", `/api/nutrition/${nutritionId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nutrition"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/nutrition-summary"] });
      toast({
        title: "Food entry deleted",
        description: "Your food entry has been removed.",
      });
    },
  });

  const mealTypes = [
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "snack", label: "Snack" },
  ];

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case "breakfast": return "🌅";
      case "lunch": return "☀️";
      case "dinner": return "🌙";
      case "snack": return "🍎";
      default: return "🍽️";
    }
  };

  const handleCreateFood = () => {
    if (!newFood.mealType || !newFood.foodName || newFood.calories <= 0) {
      toast({
        title: "Invalid food entry",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createNutritionMutation.mutate(newFood);
  };

  const macroPercentages = summary ? {
    protein: ((summary.totalProtein * 4) / summary.totalCalories * 100) || 0,
    carbs: ((summary.totalCarbs * 4) / summary.totalCalories * 100) || 0,
    fat: ((summary.totalFat * 9) / summary.totalCalories * 100) || 0,
  } : { protein: 0, carbs: 0, fat: 0 };

  // Group nutrition by meal type
  const mealGroups = nutrition.reduce((acc, item) => {
    if (!acc[item.mealType]) {
      acc[item.mealType] = [];
    }
    acc[item.mealType].push(item);
    return acc;
  }, {} as Record<string, Nutrition[]>);

  return (
    <div className="px-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-ndot tracking-wide">Nutrition</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-nothing-red hover:bg-nothing-red-light text-white font-ndot"
              data-testid="add-food"
            >
              <Plus className="w-4 h-4 mr-1" />
              Log Food
            </Button>
          </DialogTrigger>
          <DialogContent className="font-ndot">
            <DialogHeader>
              <DialogTitle className="font-ndot">Log Food</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Select
                    value={newFood.mealType}
                    onValueChange={(value) => setNewFood({ ...newFood, mealType: value })}
                  >
                    <SelectTrigger data-testid="meal-type-select">
                      <SelectValue placeholder="Meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      {mealTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Input
                    placeholder="Food name"
                    value={newFood.foodName}
                    onChange={(e) => setNewFood({ ...newFood, foodName: e.target.value })}
                    data-testid="food-name-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    type="number"
                    placeholder="Calories"
                    value={newFood.calories || ""}
                    onChange={(e) => setNewFood({ ...newFood, calories: Number(e.target.value) })}
                    data-testid="food-calories-input"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Serving size"
                    value={newFood.serving}
                    onChange={(e) => setNewFood({ ...newFood, serving: e.target.value })}
                    data-testid="food-serving-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Protein (g)"
                    value={newFood.protein || ""}
                    onChange={(e) => setNewFood({ ...newFood, protein: Number(e.target.value) })}
                    data-testid="food-protein-input"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Carbs (g)"
                    value={newFood.carbs || ""}
                    onChange={(e) => setNewFood({ ...newFood, carbs: Number(e.target.value) })}
                    data-testid="food-carbs-input"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Fat (g)"
                    value={newFood.fat || ""}
                    onChange={(e) => setNewFood({ ...newFood, fat: Number(e.target.value) })}
                    data-testid="food-fat-input"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleCreateFood}
                  disabled={createNutritionMutation.isPending}
                  className="bg-nothing-red hover:bg-nothing-red-light text-white font-ndot"
                  data-testid="save-food-button"
                >
                  {createNutritionMutation.isPending ? "Saving..." : "Save Food"}
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

      {/* Nutrition Summary */}
      {summary && summary.totalCalories > 0 && (
        <div className="bg-nothing-gray dark:bg-nothing-dark-card p-4 mb-4 border border-nothing-gray-medium dark:border-nothing-gray-dark">
          <div className="grid grid-cols-4 gap-4 text-center mb-4">
            <div>
              <p className="text-xs font-ndot text-nothing-gray-dark dark:text-nothing-gray">
                Calories
              </p>
              <p className="text-lg font-ndot-bold" data-testid="total-calories">
                {Math.round(summary.totalCalories)}
              </p>
            </div>
            <div>
              <p className="text-xs font-ndot macro-protein">
                Protein
              </p>
              <p className="text-lg font-ndot-bold">
                {Math.round(summary.totalProtein)}g
              </p>
            </div>
            <div>
              <p className="text-xs font-ndot macro-carbs">
                Carbs
              </p>
              <p className="text-lg font-ndot-bold">
                {Math.round(summary.totalCarbs)}g
              </p>
            </div>
            <div>
              <p className="text-xs font-ndot macro-fat">
                Fat
              </p>
              <p className="text-lg font-ndot-bold">
                {Math.round(summary.totalFat)}g
              </p>
            </div>
          </div>
          
          {/* Macro percentages bar */}
          <div className="w-full h-2 bg-nothing-gray-medium dark:bg-nothing-gray-dark rounded-sm overflow-hidden">
            <div className="h-full flex">
              <div 
                className="bg-macro-protein" 
                style={{ width: `${macroPercentages.protein}%` }} 
              />
              <div 
                className="bg-macro-carbs" 
                style={{ width: `${macroPercentages.carbs}%` }} 
              />
              <div 
                className="bg-macro-fat" 
                style={{ width: `${macroPercentages.fat}%` }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Meals by Type */}
      <div className="space-y-4">
        {nutrition.length === 0 ? (
          <div className="text-center py-8">
            <Apple className="w-12 h-12 text-nothing-gray-dark dark:text-nothing-gray mx-auto mb-4" />
            <p className="text-nothing-gray-dark dark:text-nothing-gray font-ndot">
              No food logged today
            </p>
          </div>
        ) : (
          mealTypes.map((mealType) => {
            const mealItems = mealGroups[mealType.value] || [];
            if (mealItems.length === 0) return null;

            const mealCalories = mealItems.reduce((sum, item) => sum + item.calories, 0);

            return (
              <div key={mealType.value} className="bg-nothing-gray dark:bg-nothing-dark-card p-4 border border-nothing-gray-medium dark:border-nothing-gray-dark">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getMealIcon(mealType.value)}</span>
                    <h4 className="font-ndot-bold">{mealType.label}</h4>
                  </div>
                  <span className="text-sm font-ndot text-nothing-gray-dark dark:text-nothing-gray">
                    {mealCalories} kcal
                  </span>
                </div>
                
                <div className="space-y-2">
                  {mealItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between py-2 border-b border-nothing-gray-medium dark:border-nothing-gray-dark last:border-b-0"
                      data-testid={`nutrition-${item.id}`}
                    >
                      <div>
                        <p className="font-ndot">{item.foodName}</p>
                        <p className="text-xs font-ndot text-nothing-gray-dark dark:text-nothing-gray">
                          {item.serving}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-ndot">{item.calories} kcal</span>
                        <button
                          onClick={() => deleteNutritionMutation.mutate(item.id)}
                          className="text-nothing-gray-dark hover:text-nothing-red transition-colors"
                          data-testid={`delete-nutrition-${item.id}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
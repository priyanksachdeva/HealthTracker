import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHealthDataSchema, insertGoalSchema, insertConnectedServiceSchema, insertWorkoutSchema, insertNutritionSchema, insertSleepDetailsSchema, insertHeartRateZonesSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const DEFAULT_USER_ID = "default-user";

  // Health Data Routes
  app.get("/api/health-data", async (req, res) => {
    try {
      const { date, startDate, endDate } = req.query;
      
      if (startDate && endDate) {
        const data = await storage.getHealthDataByDateRange(
          DEFAULT_USER_ID, 
          startDate as string, 
          endDate as string
        );
        res.json(data);
      } else {
        const data = await storage.getHealthData(DEFAULT_USER_ID, date as string);
        res.json(data);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch health data" });
    }
  });

  app.post("/api/health-data", async (req, res) => {
    try {
      const validatedData = insertHealthDataSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID
      });
      
      const healthData = await storage.createOrUpdateHealthData(validatedData);
      res.json(healthData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save health data" });
      }
    }
  });

  // Goals Routes
  app.get("/api/goals", async (req, res) => {
    try {
      const goals = await storage.getGoals(DEFAULT_USER_ID);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const validatedData = insertGoalSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID
      });
      
      const goal = await storage.createGoal(validatedData);
      res.json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create goal" });
      }
    }
  });

  app.put("/api/goals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const goal = await storage.updateGoal(id, req.body);
      
      if (!goal) {
        res.status(404).json({ message: "Goal not found" });
      } else {
        res.json(goal);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update goal" });
    }
  });

  app.delete("/api/goals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteGoal(id);
      
      if (!success) {
        res.status(404).json({ message: "Goal not found" });
      } else {
        res.json({ message: "Goal deleted successfully" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete goal" });
    }
  });

  // Connected Services Routes
  app.get("/api/connected-services", async (req, res) => {
    try {
      const services = await storage.getConnectedServices(DEFAULT_USER_ID);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch connected services" });
    }
  });

  app.post("/api/connected-services", async (req, res) => {
    try {
      const validatedData = insertConnectedServiceSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID
      });
      
      const service = await storage.createOrUpdateConnectedService(validatedData);
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update connected service" });
      }
    }
  });

  // Sync connected service
  app.post("/api/connected-services/:serviceName/sync", async (req, res) => {
    try {
      const { serviceName } = req.params;
      await storage.syncConnectedService(DEFAULT_USER_ID, serviceName);
      res.json({ message: "Sync initiated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to sync service" });
    }
  });

  // Workout Routes
  app.get("/api/workouts", async (req, res) => {
    try {
      const { date, startDate, endDate } = req.query;
      
      if (startDate && endDate) {
        const workouts = await storage.getWorkoutsByDateRange(
          DEFAULT_USER_ID, 
          startDate as string, 
          endDate as string
        );
        res.json(workouts);
      } else {
        const workouts = await storage.getWorkouts(DEFAULT_USER_ID, date as string);
        res.json(workouts);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });

  app.post("/api/workouts", async (req, res) => {
    try {
      const validatedData = insertWorkoutSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID
      });
      
      const workout = await storage.createWorkout(validatedData);
      res.json(workout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create workout" });
      }
    }
  });

  app.put("/api/workouts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const workout = await storage.updateWorkout(id, req.body);
      
      if (!workout) {
        res.status(404).json({ message: "Workout not found" });
      } else {
        res.json(workout);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update workout" });
    }
  });

  app.delete("/api/workouts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteWorkout(id);
      
      if (!success) {
        res.status(404).json({ message: "Workout not found" });
      } else {
        res.json({ message: "Workout deleted successfully" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete workout" });
    }
  });

  // Nutrition Routes
  app.get("/api/nutrition", async (req, res) => {
    try {
      const { date, startDate, endDate } = req.query;
      
      if (startDate && endDate) {
        const nutrition = await storage.getNutritionByDateRange(
          DEFAULT_USER_ID, 
          startDate as string, 
          endDate as string
        );
        res.json(nutrition);
      } else {
        const nutrition = await storage.getNutrition(DEFAULT_USER_ID, date as string);
        res.json(nutrition);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch nutrition data" });
    }
  });

  app.post("/api/nutrition", async (req, res) => {
    try {
      const validatedData = insertNutritionSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID
      });
      
      const nutrition = await storage.createNutrition(validatedData);
      res.json(nutrition);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create nutrition entry" });
      }
    }
  });

  app.delete("/api/nutrition/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteNutrition(id);
      
      if (!success) {
        res.status(404).json({ message: "Nutrition entry not found" });
      } else {
        res.json({ message: "Nutrition entry deleted successfully" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete nutrition entry" });
    }
  });

  // Sleep Details Routes
  app.get("/api/sleep-details", async (req, res) => {
    try {
      const { date, startDate, endDate } = req.query;
      
      if (startDate && endDate) {
        const sleepData = await storage.getSleepDetailsByDateRange(
          DEFAULT_USER_ID, 
          startDate as string, 
          endDate as string
        );
        res.json(sleepData);
      } else {
        const sleepData = await storage.getSleepDetails(DEFAULT_USER_ID, date as string);
        res.json(sleepData);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sleep details" });
    }
  });

  app.post("/api/sleep-details", async (req, res) => {
    try {
      const validatedData = insertSleepDetailsSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID
      });
      
      const sleepDetails = await storage.createOrUpdateSleepDetails(validatedData);
      res.json(sleepDetails);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save sleep details" });
      }
    }
  });

  // Heart Rate Zones Routes
  app.get("/api/heart-rate-zones", async (req, res) => {
    try {
      const { date, startDate, endDate } = req.query;
      
      if (startDate && endDate) {
        const zones = await storage.getHeartRateZonesByDateRange(
          DEFAULT_USER_ID, 
          startDate as string, 
          endDate as string
        );
        res.json(zones);
      } else {
        const zones = await storage.getHeartRateZones(DEFAULT_USER_ID, date as string);
        res.json(zones);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch heart rate zones" });
    }
  });

  app.post("/api/heart-rate-zones", async (req, res) => {
    try {
      const validatedData = insertHeartRateZonesSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID
      });
      
      const zones = await storage.createOrUpdateHeartRateZones(validatedData);
      res.json(zones);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save heart rate zones" });
      }
    }
  });

  // Analytics and Summary endpoints
  app.get("/api/analytics/weekly-summary", async (req, res) => {
    try {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 6);
      
      const startDate = startOfWeek.toISOString().split('T')[0];
      const endDate = today.toISOString().split('T')[0];
      
      const [healthData, workouts, nutrition, sleepData, hrZones] = await Promise.all([
        storage.getHealthDataByDateRange(DEFAULT_USER_ID, startDate, endDate),
        storage.getWorkoutsByDateRange(DEFAULT_USER_ID, startDate, endDate),
        storage.getNutritionByDateRange(DEFAULT_USER_ID, startDate, endDate),
        storage.getSleepDetailsByDateRange(DEFAULT_USER_ID, startDate, endDate),
        storage.getHeartRateZonesByDateRange(DEFAULT_USER_ID, startDate, endDate)
      ]);
      
      const summary = {
        health: {
          totalSteps: healthData.reduce((sum, d) => sum + (d.steps || 0), 0),
          totalDistance: healthData.reduce((sum, d) => sum + (d.distance || 0), 0),
          totalCalories: healthData.reduce((sum, d) => sum + (d.calories || 0), 0),
          averageHeartRate: healthData.filter(d => d.heartRate).length > 0 
            ? healthData.reduce((sum, d) => sum + (d.heartRate || 0), 0) / healthData.filter(d => d.heartRate).length 
            : 0,
          totalActiveMinutes: healthData.reduce((sum, d) => sum + (d.activeMinutes || 0), 0),
          totalWaterIntake: healthData.reduce((sum, d) => sum + (d.waterIntake || 0), 0),
        },
        workouts: {
          totalWorkouts: workouts.length,
          totalDuration: workouts.reduce((sum, w) => sum + w.duration, 0),
          totalCalories: workouts.reduce((sum, w) => sum + (w.calories || 0), 0),
          types: Array.from(new Set(workouts.map(w => w.type)))
        },
        nutrition: {
          totalCalories: nutrition.reduce((sum, n) => sum + n.calories, 0),
          totalProtein: nutrition.reduce((sum, n) => sum + (n.protein || 0), 0),
          totalCarbs: nutrition.reduce((sum, n) => sum + (n.carbs || 0), 0),
          totalFat: nutrition.reduce((sum, n) => sum + (n.fat || 0), 0),
        },
        sleep: {
          averageSleepHours: sleepData.length > 0 
            ? sleepData.reduce((sum, s) => sum + ((s.deepSleep || 0) + (s.lightSleep || 0) + (s.remSleep || 0)), 0) / sleepData.length 
            : 0,
          averageEfficiency: sleepData.length > 0 
            ? sleepData.reduce((sum, s) => sum + (s.sleepEfficiency || 0), 0) / sleepData.length 
            : 0
        },
        heartRateZones: hrZones.reduce((acc, zone) => ({
          zone1: acc.zone1 + (zone.zone1Time || 0),
          zone2: acc.zone2 + (zone.zone2Time || 0),
          zone3: acc.zone3 + (zone.zone3Time || 0),
          zone4: acc.zone4 + (zone.zone4Time || 0),
          zone5: acc.zone5 + (zone.zone5Time || 0),
        }), { zone1: 0, zone2: 0, zone3: 0, zone4: 0, zone5: 0 })
      };
      
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weekly summary" });
    }
  });

  app.get("/api/analytics/nutrition-summary", async (req, res) => {
    try {
      const { date } = req.query;
      const targetDate = (date as string) || new Date().toISOString().split('T')[0];
      
      const nutrition = await storage.getNutrition(DEFAULT_USER_ID, targetDate);
      
      const summary = nutrition.reduce((acc, item) => ({
        totalCalories: acc.totalCalories + item.calories,
        totalProtein: acc.totalProtein + (item.protein || 0),
        totalCarbs: acc.totalCarbs + (item.carbs || 0),
        totalFat: acc.totalFat + (item.fat || 0),
        totalFiber: acc.totalFiber + (item.fiber || 0),
        totalSugar: acc.totalSugar + (item.sugar || 0),
        totalSodium: acc.totalSodium + (item.sodium || 0),
        meals: {
          ...acc.meals,
          [item.mealType]: [...(acc.meals[item.mealType] || []), item]
        }
      }), {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalFiber: 0,
        totalSugar: 0,
        totalSodium: 0,
        meals: {} as Record<string, any[]>
      });
      
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch nutrition summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

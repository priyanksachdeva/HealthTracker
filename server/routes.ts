import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHealthDataSchema, insertGoalSchema, insertConnectedServiceSchema } from "@shared/schema";
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

  // Weekly summary endpoint
  app.get("/api/health-data/weekly-summary", async (req, res) => {
    try {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 6);
      
      const startDate = startOfWeek.toISOString().split('T')[0];
      const endDate = today.toISOString().split('T')[0];
      
      const data = await storage.getHealthDataByDateRange(DEFAULT_USER_ID, startDate, endDate);
      
      const summary = {
        totalSteps: data.reduce((sum, d) => sum + (d.steps || 0), 0),
        totalDistance: data.reduce((sum, d) => sum + (d.distance || 0), 0),
        totalCalories: data.reduce((sum, d) => sum + (d.calories || 0), 0),
        averageHeartRate: data.filter(d => d.heartRate).length > 0 
          ? data.reduce((sum, d) => sum + (d.heartRate || 0), 0) / data.filter(d => d.heartRate).length 
          : 0,
        totalActiveMinutes: data.reduce((sum, d) => sum + (d.activeMinutes || 0), 0),
        dailyData: data
      };
      
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weekly summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

import { type User, type InsertUser, type HealthData, type InsertHealthData, type Goal, type InsertGoal, type ConnectedService, type InsertConnectedService, type Workout, type InsertWorkout, type Nutrition, type InsertNutrition, type SleepDetails, type InsertSleepDetails, type HeartRateZones, type InsertHeartRateZones } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Health Data
  getHealthData(userId: string, date?: string): Promise<HealthData[]>;
  getHealthDataByDateRange(userId: string, startDate: string, endDate: string): Promise<HealthData[]>;
  createOrUpdateHealthData(healthData: InsertHealthData): Promise<HealthData>;
  
  // Goals
  getGoals(userId: string): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: string, goal: Partial<Goal>): Promise<Goal | undefined>;
  deleteGoal(id: string): Promise<boolean>;

  // Connected Services
  getConnectedServices(userId: string): Promise<ConnectedService[]>;
  createOrUpdateConnectedService(service: InsertConnectedService): Promise<ConnectedService>;
  syncConnectedService(userId: string, serviceName: string): Promise<void>;

  // Workouts
  getWorkouts(userId: string, date?: string): Promise<Workout[]>;
  getWorkoutsByDateRange(userId: string, startDate: string, endDate: string): Promise<Workout[]>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  updateWorkout(id: string, workout: Partial<Workout>): Promise<Workout | undefined>;
  deleteWorkout(id: string): Promise<boolean>;

  // Nutrition
  getNutrition(userId: string, date?: string): Promise<Nutrition[]>;
  getNutritionByDateRange(userId: string, startDate: string, endDate: string): Promise<Nutrition[]>;
  createNutrition(nutrition: InsertNutrition): Promise<Nutrition>;
  updateNutrition(id: string, nutrition: Partial<Nutrition>): Promise<Nutrition | undefined>;
  deleteNutrition(id: string): Promise<boolean>;

  // Sleep Details
  getSleepDetails(userId: string, date?: string): Promise<SleepDetails[]>;
  getSleepDetailsByDateRange(userId: string, startDate: string, endDate: string): Promise<SleepDetails[]>;
  createOrUpdateSleepDetails(sleepDetails: InsertSleepDetails): Promise<SleepDetails>;

  // Heart Rate Zones
  getHeartRateZones(userId: string, date?: string): Promise<HeartRateZones[]>;
  getHeartRateZonesByDateRange(userId: string, startDate: string, endDate: string): Promise<HeartRateZones[]>;
  createOrUpdateHeartRateZones(zones: InsertHeartRateZones): Promise<HeartRateZones>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private healthData: Map<string, HealthData>;
  private goals: Map<string, Goal>;
  private connectedServices: Map<string, ConnectedService>;
  private workouts: Map<string, Workout>;
  private nutrition: Map<string, Nutrition>;
  private sleepDetails: Map<string, SleepDetails>;
  private heartRateZones: Map<string, HeartRateZones>;

  constructor() {
    this.users = new Map();
    this.healthData = new Map();
    this.goals = new Map();
    this.connectedServices = new Map();
    this.workouts = new Map();
    this.nutrition = new Map();
    this.sleepDetails = new Map();
    this.heartRateZones = new Map();
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create a default user
    const defaultUser: User = {
      id: "default-user",
      username: "healthuser",
      email: "user@example.com",
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);

    // Initialize with current week's data
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];
    
    // Generate data for the past 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const healthRecord: HealthData = {
        id: randomUUID(),
        userId: defaultUser.id,
        date: dateStr,
        steps: Math.floor(Math.random() * 5000) + 5000, // 5000-10000 steps
        distance: Math.round((Math.random() * 3 + 3) * 100) / 100, // 3-6 km
        calories: Math.floor(Math.random() * 200) + 200, // 200-400 calories
        heartRate: Math.floor(Math.random() * 20) + 60, // 60-80 bpm
        sleepHours: Math.round((Math.random() * 2 + 6.5) * 100) / 100, // 6.5-8.5 hours
        weight: Math.round((Math.random() * 2 + 69) * 10) / 10, // 69-71 kg
        activeMinutes: Math.floor(Math.random() * 30) + 30, // 30-60 minutes
        waterIntake: Math.round((Math.random() * 1 + 1.5) * 100) / 100, // 1.5-2.5 liters
        restingHeartRate: Math.floor(Math.random() * 10) + 55, // 55-65 bpm
        maxHeartRate: Math.floor(Math.random() * 20) + 180, // 180-200 bpm
        sleepQuality: Math.floor(Math.random() * 3) + 3, // 3-5 rating
        createdAt: new Date(),
      };
      this.healthData.set(healthRecord.id, healthRecord);

      // Generate sleep details
      const sleepDetail: SleepDetails = {
        id: randomUUID(),
        userId: defaultUser.id,
        date: dateStr,
        bedtime: "22:30",
        wakeTime: "07:00",
        deepSleep: Math.round((Math.random() * 1 + 1.5) * 100) / 100, // 1.5-2.5 hours
        lightSleep: Math.round((Math.random() * 2 + 4) * 100) / 100, // 4-6 hours
        remSleep: Math.round((Math.random() * 1 + 1) * 100) / 100, // 1-2 hours
        awakeTime: Math.round((Math.random() * 0.5 + 0.2) * 100) / 100, // 0.2-0.7 hours
        sleepEfficiency: Math.round((Math.random() * 10 + 85) * 10) / 10, // 85-95%
        timesToWakeUp: Math.floor(Math.random() * 3) + 1, // 1-3 times
        mood: ["excellent", "good", "fair", "poor"][Math.floor(Math.random() * 4)],
        notes: i === 0 ? "Felt refreshed" : "",
        createdAt: new Date(),
      };
      this.sleepDetails.set(sleepDetail.id, sleepDetail);

      // Generate heart rate zones
      const hrZones: HeartRateZones = {
        id: randomUUID(),
        userId: defaultUser.id,
        date: dateStr,
        zone1Time: Math.floor(Math.random() * 30) + 10, // 10-40 min
        zone2Time: Math.floor(Math.random() * 20) + 15, // 15-35 min
        zone3Time: Math.floor(Math.random() * 15) + 5, // 5-20 min
        zone4Time: Math.floor(Math.random() * 10) + 2, // 2-12 min
        zone5Time: Math.floor(Math.random() * 5), // 0-5 min
        createdAt: new Date(),
      };
      this.heartRateZones.set(hrZones.id, hrZones);
    }

    // Generate sample workouts
    const workoutTypes = ["running", "cycling", "strength", "yoga", "swimming"];
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const workout: Workout = {
        id: randomUUID(),
        userId: defaultUser.id,
        type: workoutTypes[i % workoutTypes.length],
        name: `${workoutTypes[i % workoutTypes.length].charAt(0).toUpperCase() + workoutTypes[i % workoutTypes.length].slice(1)} Session`,
        duration: Math.floor(Math.random() * 30) + 30, // 30-60 minutes
        calories: Math.floor(Math.random() * 200) + 200,
        distance: workoutTypes[i % workoutTypes.length] === "running" ? Math.round((Math.random() * 3 + 2) * 100) / 100 : null,
        avgHeartRate: Math.floor(Math.random() * 30) + 120,
        maxHeartRate: Math.floor(Math.random() * 20) + 160,
        date: dateStr,
        startTime: "07:00",
        intensity: ["low", "moderate", "high"][Math.floor(Math.random() * 3)],
        notes: i === 0 ? "Great session!" : null,
        createdAt: new Date(),
      };
      this.workouts.set(workout.id, workout);
    }

    // Generate sample nutrition data
    const meals = ["breakfast", "lunch", "dinner", "snack"];
    const foods = [
      { name: "Oatmeal with berries", calories: 250, protein: 8, carbs: 45, fat: 4 },
      { name: "Grilled chicken salad", calories: 350, protein: 30, carbs: 15, fat: 18 },
      { name: "Quinoa bowl", calories: 400, protein: 15, carbs: 60, fat: 12 },
      { name: "Greek yogurt", calories: 100, protein: 15, carbs: 8, fat: 0 },
    ];
    
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      meals.forEach((meal, mealIndex) => {
        const food = foods[mealIndex];
        const nutrition: Nutrition = {
          id: randomUUID(),
          userId: defaultUser.id,
          date: dateStr,
          mealType: meal,
          foodName: food.name,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          fiber: Math.round(Math.random() * 5 + 2), // 2-7g
          sugar: Math.round(Math.random() * 10 + 5), // 5-15g
          sodium: Math.round(Math.random() * 300 + 200), // 200-500mg
          serving: "1 serving",
          createdAt: new Date(),
        };
        this.nutrition.set(nutrition.id, nutrition);
      });
    }

    // Default goals
    const defaultGoals: Goal[] = [
      {
        id: randomUUID(),
        userId: defaultUser.id,
        type: "daily_steps",
        target: 10000,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        userId: defaultUser.id,
        type: "weekly_distance",
        target: 50,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        userId: defaultUser.id,
        type: "active_minutes",
        target: 60,
        isActive: true,
        createdAt: new Date(),
      },
    ];

    defaultGoals.forEach(goal => this.goals.set(goal.id, goal));

    // Default connected services
    const services: ConnectedService[] = [
      {
        id: randomUUID(),
        userId: defaultUser.id,
        serviceName: "google_fit",
        isConnected: true,
        lastSync: new Date(),
        syncStatus: "success",
        syncData: JSON.stringify({ steps: 8432, calories: 320, distance: 5.2 }),
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        userId: defaultUser.id,
        serviceName: "apple_health",
        isConnected: false,
        lastSync: null,
        syncStatus: "idle",
        syncData: null,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        userId: defaultUser.id,
        serviceName: "samsung_health",
        isConnected: false,
        lastSync: null,
        syncStatus: "idle",
        syncData: null,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        userId: defaultUser.id,
        serviceName: "fitbit",
        isConnected: false,
        lastSync: null,
        syncStatus: "idle",
        syncData: null,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        userId: defaultUser.id,
        serviceName: "garmin",
        isConnected: false,
        lastSync: null,
        syncStatus: "idle",
        syncData: null,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        userId: defaultUser.id,
        serviceName: "strava",
        isConnected: false,
        lastSync: null,
        syncStatus: "idle",
        syncData: null,
        createdAt: new Date(),
      },
    ];

    services.forEach(service => this.connectedServices.set(service.id, service));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getHealthData(userId: string, date?: string): Promise<HealthData[]> {
    const data = Array.from(this.healthData.values()).filter(data => 
      data.userId === userId && (!date || data.date === date)
    );
    return data.sort((a, b) => b.date.localeCompare(a.date));
  }

  async getHealthDataByDateRange(userId: string, startDate: string, endDate: string): Promise<HealthData[]> {
    return Array.from(this.healthData.values())
      .filter(data => 
        data.userId === userId && 
        data.date >= startDate && 
        data.date <= endDate
      )
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async createOrUpdateHealthData(insertHealthData: InsertHealthData): Promise<HealthData> {
    // Check if data exists for this user and date
    const existing = Array.from(this.healthData.values()).find(
      data => data.userId === insertHealthData.userId && data.date === insertHealthData.date
    );

    if (existing) {
      // Update existing
      const updated: HealthData = { ...existing, ...insertHealthData };
      this.healthData.set(existing.id, updated);
      return updated;
    } else {
      // Create new
      const id = randomUUID();
      const healthData: HealthData = { 
        ...insertHealthData, 
        id, 
        steps: insertHealthData.steps ?? 0,
        distance: insertHealthData.distance ?? 0,
        calories: insertHealthData.calories ?? 0,
        activeMinutes: insertHealthData.activeMinutes ?? 0,
        waterIntake: insertHealthData.waterIntake ?? 0,
        heartRate: insertHealthData.heartRate ?? null,
        sleepHours: insertHealthData.sleepHours ?? null,
        weight: insertHealthData.weight ?? null,
        restingHeartRate: insertHealthData.restingHeartRate ?? null,
        maxHeartRate: insertHealthData.maxHeartRate ?? null,
        sleepQuality: insertHealthData.sleepQuality ?? null,
        createdAt: new Date() 
      };
      this.healthData.set(id, healthData);
      return healthData;
    }
  }

  async getGoals(userId: string): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(goal => goal.userId === userId && goal.isActive);
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = randomUUID();
    const goal: Goal = { 
      ...insertGoal, 
      id, 
      isActive: insertGoal.isActive ?? true,
      createdAt: new Date() 
    };
    this.goals.set(id, goal);
    return goal;
  }

  async updateGoal(id: string, goalUpdate: Partial<Goal>): Promise<Goal | undefined> {
    const existing = this.goals.get(id);
    if (!existing) return undefined;

    const updated: Goal = { ...existing, ...goalUpdate };
    this.goals.set(id, updated);
    return updated;
  }

  async deleteGoal(id: string): Promise<boolean> {
    return this.goals.delete(id);
  }

  async getConnectedServices(userId: string): Promise<ConnectedService[]> {
    return Array.from(this.connectedServices.values()).filter(service => service.userId === userId);
  }

  async createOrUpdateConnectedService(insertService: InsertConnectedService): Promise<ConnectedService> {
    const existing = Array.from(this.connectedServices.values()).find(
      service => service.userId === insertService.userId && service.serviceName === insertService.serviceName
    );

    if (existing) {
      const updated: ConnectedService = { 
        ...existing, 
        ...insertService,
        lastSync: insertService.isConnected ? new Date() : null,
        syncStatus: insertService.isConnected ? "success" : "idle"
      };
      this.connectedServices.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const service: ConnectedService = { 
        ...insertService, 
        id,
        isConnected: insertService.isConnected ?? false,
        lastSync: insertService.isConnected ? new Date() : null,
        syncStatus: insertService.isConnected ? "success" : "idle",
        syncData: null,
        createdAt: new Date() 
      };
      this.connectedServices.set(id, service);
      return service;
    }
  }

  async syncConnectedService(userId: string, serviceName: string): Promise<void> {
    const service = Array.from(this.connectedServices.values()).find(
      s => s.userId === userId && s.serviceName === serviceName && s.isConnected
    );

    if (service) {
      // Simulate sync process
      const updated: ConnectedService = {
        ...service,
        syncStatus: "syncing",
        lastSync: new Date()
      };
      this.connectedServices.set(service.id, updated);

      // Simulate async sync completion
      setTimeout(() => {
        const mockData = {
          steps: Math.floor(Math.random() * 3000) + 7000,
          calories: Math.floor(Math.random() * 200) + 300,
          distance: Math.round((Math.random() * 2 + 4) * 100) / 100,
          heartRate: Math.floor(Math.random() * 20) + 70
        };
        
        const synced: ConnectedService = {
          ...updated,
          syncStatus: "success",
          syncData: JSON.stringify(mockData)
        };
        this.connectedServices.set(service.id, synced);
      }, 2000);
    }
  }

  // Workout methods
  async getWorkouts(userId: string, date?: string): Promise<Workout[]> {
    const workouts = Array.from(this.workouts.values()).filter(workout => 
      workout.userId === userId && (!date || workout.date === date)
    );
    return workouts.sort((a, b) => b.date.localeCompare(a.date));
  }

  async getWorkoutsByDateRange(userId: string, startDate: string, endDate: string): Promise<Workout[]> {
    return Array.from(this.workouts.values())
      .filter(workout => 
        workout.userId === userId && 
        workout.date >= startDate && 
        workout.date <= endDate
      )
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const id = randomUUID();
    const workout: Workout = { 
      ...insertWorkout, 
      id, 
      calories: insertWorkout.calories ?? null,
      distance: insertWorkout.distance ?? null,
      avgHeartRate: insertWorkout.avgHeartRate ?? null,
      maxHeartRate: insertWorkout.maxHeartRate ?? null,
      startTime: insertWorkout.startTime ?? null,
      intensity: insertWorkout.intensity ?? "moderate",
      notes: insertWorkout.notes ?? null,
      createdAt: new Date() 
    };
    this.workouts.set(id, workout);
    return workout;
  }

  async updateWorkout(id: string, workoutUpdate: Partial<Workout>): Promise<Workout | undefined> {
    const existing = this.workouts.get(id);
    if (!existing) return undefined;

    const updated: Workout = { ...existing, ...workoutUpdate };
    this.workouts.set(id, updated);
    return updated;
  }

  async deleteWorkout(id: string): Promise<boolean> {
    return this.workouts.delete(id);
  }

  // Nutrition methods
  async getNutrition(userId: string, date?: string): Promise<Nutrition[]> {
    const nutrition = Array.from(this.nutrition.values()).filter(item => 
      item.userId === userId && (!date || item.date === date)
    );
    return nutrition.sort((a, b) => b.date.localeCompare(a.date));
  }

  async getNutritionByDateRange(userId: string, startDate: string, endDate: string): Promise<Nutrition[]> {
    return Array.from(this.nutrition.values())
      .filter(item => 
        item.userId === userId && 
        item.date >= startDate && 
        item.date <= endDate
      )
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async createNutrition(insertNutrition: InsertNutrition): Promise<Nutrition> {
    const id = randomUUID();
    const nutrition: Nutrition = { 
      ...insertNutrition, 
      id,
      protein: insertNutrition.protein ?? null,
      carbs: insertNutrition.carbs ?? null,
      fat: insertNutrition.fat ?? null,
      fiber: insertNutrition.fiber ?? null,
      sugar: insertNutrition.sugar ?? null,
      sodium: insertNutrition.sodium ?? null,
      serving: insertNutrition.serving ?? null,
      createdAt: new Date() 
    };
    this.nutrition.set(id, nutrition);
    return nutrition;
  }

  async updateNutrition(id: string, nutritionUpdate: Partial<Nutrition>): Promise<Nutrition | undefined> {
    const existing = this.nutrition.get(id);
    if (!existing) return undefined;

    const updated: Nutrition = { ...existing, ...nutritionUpdate };
    this.nutrition.set(id, updated);
    return updated;
  }

  async deleteNutrition(id: string): Promise<boolean> {
    return this.nutrition.delete(id);
  }

  // Sleep Details methods
  async getSleepDetails(userId: string, date?: string): Promise<SleepDetails[]> {
    const sleepData = Array.from(this.sleepDetails.values()).filter(item => 
      item.userId === userId && (!date || item.date === date)
    );
    return sleepData.sort((a, b) => b.date.localeCompare(a.date));
  }

  async getSleepDetailsByDateRange(userId: string, startDate: string, endDate: string): Promise<SleepDetails[]> {
    return Array.from(this.sleepDetails.values())
      .filter(item => 
        item.userId === userId && 
        item.date >= startDate && 
        item.date <= endDate
      )
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async createOrUpdateSleepDetails(insertSleepDetails: InsertSleepDetails): Promise<SleepDetails> {
    const existing = Array.from(this.sleepDetails.values()).find(
      item => item.userId === insertSleepDetails.userId && item.date === insertSleepDetails.date
    );

    if (existing) {
      const updated: SleepDetails = { ...existing, ...insertSleepDetails };
      this.sleepDetails.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const sleepDetails: SleepDetails = { 
        ...insertSleepDetails, 
        id,
        bedtime: insertSleepDetails.bedtime ?? null,
        wakeTime: insertSleepDetails.wakeTime ?? null,
        deepSleep: insertSleepDetails.deepSleep ?? null,
        lightSleep: insertSleepDetails.lightSleep ?? null,
        remSleep: insertSleepDetails.remSleep ?? null,
        awakeTime: insertSleepDetails.awakeTime ?? null,
        sleepEfficiency: insertSleepDetails.sleepEfficiency ?? null,
        timesToWakeUp: insertSleepDetails.timesToWakeUp ?? null,
        mood: insertSleepDetails.mood ?? null,
        notes: insertSleepDetails.notes ?? null,
        createdAt: new Date() 
      };
      this.sleepDetails.set(id, sleepDetails);
      return sleepDetails;
    }
  }

  // Heart Rate Zones methods
  async getHeartRateZones(userId: string, date?: string): Promise<HeartRateZones[]> {
    const zones = Array.from(this.heartRateZones.values()).filter(item => 
      item.userId === userId && (!date || item.date === date)
    );
    return zones.sort((a, b) => b.date.localeCompare(a.date));
  }

  async getHeartRateZonesByDateRange(userId: string, startDate: string, endDate: string): Promise<HeartRateZones[]> {
    return Array.from(this.heartRateZones.values())
      .filter(item => 
        item.userId === userId && 
        item.date >= startDate && 
        item.date <= endDate
      )
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async createOrUpdateHeartRateZones(insertZones: InsertHeartRateZones): Promise<HeartRateZones> {
    const existing = Array.from(this.heartRateZones.values()).find(
      item => item.userId === insertZones.userId && item.date === insertZones.date
    );

    if (existing) {
      const updated: HeartRateZones = { ...existing, ...insertZones };
      this.heartRateZones.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const zones: HeartRateZones = { 
        ...insertZones, 
        id,
        zone1Time: insertZones.zone1Time ?? 0,
        zone2Time: insertZones.zone2Time ?? 0,
        zone3Time: insertZones.zone3Time ?? 0,
        zone4Time: insertZones.zone4Time ?? 0,
        zone5Time: insertZones.zone5Time ?? 0,
        createdAt: new Date() 
      };
      this.heartRateZones.set(id, zones);
      return zones;
    }
  }
}

export const storage = new MemStorage();

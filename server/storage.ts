import { type User, type InsertUser, type HealthData, type InsertHealthData, type Goal, type InsertGoal, type ConnectedService, type InsertConnectedService } from "@shared/schema";
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private healthData: Map<string, HealthData>;
  private goals: Map<string, Goal>;
  private connectedServices: Map<string, ConnectedService>;

  constructor() {
    this.users = new Map();
    this.healthData = new Map();
    this.goals = new Map();
    this.connectedServices = new Map();
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
        createdAt: new Date(),
      };
      this.healthData.set(healthRecord.id, healthRecord);
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
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        userId: defaultUser.id,
        serviceName: "apple_health",
        isConnected: false,
        lastSync: null,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        userId: defaultUser.id,
        serviceName: "samsung_health",
        isConnected: false,
        lastSync: null,
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
      const healthData: HealthData = { ...insertHealthData, id, createdAt: new Date() };
      this.healthData.set(id, healthData);
      return healthData;
    }
  }

  async getGoals(userId: string): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(goal => goal.userId === userId && goal.isActive);
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = randomUUID();
    const goal: Goal = { ...insertGoal, id, createdAt: new Date() };
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
        lastSync: insertService.isConnected ? new Date() : null
      };
      this.connectedServices.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const service: ConnectedService = { 
        ...insertService, 
        id, 
        lastSync: insertService.isConnected ? new Date() : null,
        createdAt: new Date() 
      };
      this.connectedServices.set(id, service);
      return service;
    }
  }
}

export const storage = new MemStorage();

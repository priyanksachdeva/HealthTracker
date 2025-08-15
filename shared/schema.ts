import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const healthData = pgTable("health_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  steps: integer("steps").default(0),
  distance: real("distance").default(0), // in kilometers
  calories: integer("calories").default(0),
  heartRate: integer("heart_rate"), // bpm
  sleepHours: real("sleep_hours"), // hours with decimals
  weight: real("weight"), // in kg
  activeMinutes: integer("active_minutes").default(0),
  waterIntake: real("water_intake").default(0), // in liters
  restingHeartRate: integer("resting_heart_rate"), // bpm
  maxHeartRate: integer("max_heart_rate"), // bpm
  sleepQuality: integer("sleep_quality"), // 1-5 rating
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // 'daily_steps', 'weekly_distance', 'active_minutes'
  target: real("target").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const connectedServices = pgTable("connected_services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  serviceName: text("service_name").notNull(), // 'google_fit', 'apple_health', 'samsung_health', 'fitbit', 'garmin', 'strava'
  isConnected: boolean("is_connected").default(false),
  lastSync: timestamp("last_sync"),
  syncStatus: text("sync_status").default("idle"), // 'syncing', 'success', 'error', 'idle'
  syncData: text("sync_data"), // JSON data from last sync
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workouts = pgTable("workouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // 'running', 'cycling', 'swimming', 'strength', 'yoga', etc.
  name: text("name").notNull(),
  duration: integer("duration").notNull(), // in minutes
  calories: integer("calories"),
  distance: real("distance"), // in km
  avgHeartRate: integer("avg_heart_rate"),
  maxHeartRate: integer("max_heart_rate"),
  date: text("date").notNull(),
  startTime: text("start_time"), // HH:MM format
  intensity: text("intensity").default("moderate"), // 'low', 'moderate', 'high'
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const nutrition = pgTable("nutrition", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: text("date").notNull(),
  mealType: text("meal_type").notNull(), // 'breakfast', 'lunch', 'dinner', 'snack'
  foodName: text("food_name").notNull(),
  calories: integer("calories").notNull(),
  protein: real("protein"), // in grams
  carbs: real("carbs"), // in grams
  fat: real("fat"), // in grams
  fiber: real("fiber"), // in grams
  sugar: real("sugar"), // in grams
  sodium: real("sodium"), // in mg
  serving: text("serving"), // e.g., "1 cup", "2 slices"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sleepDetails = pgTable("sleep_details", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: text("date").notNull(),
  bedtime: text("bedtime"), // HH:MM format
  wakeTime: text("wake_time"), // HH:MM format
  deepSleep: real("deep_sleep"), // hours
  lightSleep: real("light_sleep"), // hours
  remSleep: real("rem_sleep"), // hours
  awakeTime: real("awake_time"), // hours
  sleepEfficiency: real("sleep_efficiency"), // percentage
  timesToWakeUp: integer("times_to_wake_up"),
  mood: text("mood"), // 'excellent', 'good', 'fair', 'poor'
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const heartRateZones = pgTable("heart_rate_zones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: text("date").notNull(),
  zone1Time: integer("zone1_time").default(0), // minutes in zone 1 (50-60% max HR)
  zone2Time: integer("zone2_time").default(0), // minutes in zone 2 (60-70% max HR)
  zone3Time: integer("zone3_time").default(0), // minutes in zone 3 (70-80% max HR)
  zone4Time: integer("zone4_time").default(0), // minutes in zone 4 (80-90% max HR)
  zone5Time: integer("zone5_time").default(0), // minutes in zone 5 (90-100% max HR)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
});

export const insertHealthDataSchema = createInsertSchema(healthData).pick({
  userId: true,
  date: true,
  steps: true,
  distance: true,
  calories: true,
  heartRate: true,
  sleepHours: true,
  weight: true,
  activeMinutes: true,
  waterIntake: true,
  restingHeartRate: true,
  maxHeartRate: true,
  sleepQuality: true,
});

export const insertGoalSchema = createInsertSchema(goals).pick({
  userId: true,
  type: true,
  target: true,
  isActive: true,
});

export const insertWorkoutSchema = createInsertSchema(workouts).pick({
  userId: true,
  type: true,
  name: true,
  duration: true,
  calories: true,
  distance: true,
  avgHeartRate: true,
  maxHeartRate: true,
  date: true,
  startTime: true,
  intensity: true,
  notes: true,
});

export const insertNutritionSchema = createInsertSchema(nutrition).pick({
  userId: true,
  date: true,
  mealType: true,
  foodName: true,
  calories: true,
  protein: true,
  carbs: true,
  fat: true,
  fiber: true,
  sugar: true,
  sodium: true,
  serving: true,
});

export const insertSleepDetailsSchema = createInsertSchema(sleepDetails).pick({
  userId: true,
  date: true,
  bedtime: true,
  wakeTime: true,
  deepSleep: true,
  lightSleep: true,
  remSleep: true,
  awakeTime: true,
  sleepEfficiency: true,
  timesToWakeUp: true,
  mood: true,
  notes: true,
});

export const insertHeartRateZonesSchema = createInsertSchema(heartRateZones).pick({
  userId: true,
  date: true,
  zone1Time: true,
  zone2Time: true,
  zone3Time: true,
  zone4Time: true,
  zone5Time: true,
});

export const insertConnectedServiceSchema = createInsertSchema(connectedServices).pick({
  userId: true,
  serviceName: true,
  isConnected: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertHealthData = z.infer<typeof insertHealthDataSchema>;
export type HealthData = typeof healthData.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;
export type InsertConnectedService = z.infer<typeof insertConnectedServiceSchema>;
export type ConnectedService = typeof connectedServices.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type Workout = typeof workouts.$inferSelect;
export type InsertNutrition = z.infer<typeof insertNutritionSchema>;
export type Nutrition = typeof nutrition.$inferSelect;
export type InsertSleepDetails = z.infer<typeof insertSleepDetailsSchema>;
export type SleepDetails = typeof sleepDetails.$inferSelect;
export type InsertHeartRateZones = z.infer<typeof insertHeartRateZonesSchema>;
export type HeartRateZones = typeof heartRateZones.$inferSelect;

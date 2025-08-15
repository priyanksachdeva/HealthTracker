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
  serviceName: text("service_name").notNull(), // 'google_fit', 'apple_health', 'samsung_health'
  isConnected: boolean("is_connected").default(false),
  lastSync: timestamp("last_sync"),
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
});

export const insertGoalSchema = createInsertSchema(goals).pick({
  userId: true,
  type: true,
  target: true,
  isActive: true,
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

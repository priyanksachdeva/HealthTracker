
# API Documentation

## Overview

The Health Tracker API provides RESTful endpoints for managing health data, goals, nutrition tracking, workouts, and analytics. All endpoints return JSON responses and follow standard HTTP status codes.

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-app.replit.app/api
```

## Authentication

Currently using a default user system for development. Future versions will implement proper authentication.

### Headers
```http
Content-Type: application/json
Accept: application/json
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "steps",
      "reason": "must be a positive number"
    }
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Endpoints

### Health Data

#### Get Health Data
Retrieve health metrics for a specific date.

```http
GET /api/health-data/:userId?date=YYYY-MM-DD
```

**Parameters:**
- `userId` (string) - User identifier
- `date` (string, optional) - Date in YYYY-MM-DD format (defaults to today)

**Response:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-123",
    "date": "2024-01-15",
    "steps": 8500,
    "distance": 6.2,
    "calories": 2200,
    "heartRate": 72,
    "sleep": 7.5,
    "weight": 70.5,
    "activeMinutes": 45,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T18:45:00Z"
  }
}
```

#### Update Health Data
Update health metrics for a specific date.

```http
PUT /api/health-data/:userId
```

**Request Body:**
```json
{
  "date": "2024-01-15",
  "steps": 9000,
  "distance": 6.8,
  "calories": 2350,
  "heartRate": 75,
  "sleep": 8.0,
  "weight": 70.2,
  "activeMinutes": 50
}
```

**Response:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-123",
    "date": "2024-01-15",
    "steps": 9000,
    "distance": 6.8,
    "calories": 2350,
    "heartRate": 75,
    "sleep": 8.0,
    "weight": 70.2,
    "activeMinutes": 50,
    "updatedAt": "2024-01-15T19:15:00Z"
  }
}
```

#### Get Health Data Range
Retrieve health data for a date range.

```http
GET /api/health-data/:userId/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

**Parameters:**
- `startDate` (string) - Start date (inclusive)
- `endDate` (string) - End date (inclusive)

**Response:**
```json
{
  "data": [
    {
      "date": "2024-01-15",
      "steps": 8500,
      "distance": 6.2,
      "calories": 2200,
      "heartRate": 72,
      "sleep": 7.5,
      "weight": 70.5,
      "activeMinutes": 45
    },
    {
      "date": "2024-01-16",
      "steps": 9200,
      "distance": 7.1,
      "calories": 2450,
      "heartRate": 74,
      "sleep": 7.8,
      "weight": 70.3,
      "activeMinutes": 52
    }
  ],
  "summary": {
    "totalSteps": 17700,
    "avgSteps": 8850,
    "totalDistance": 13.3,
    "avgDistance": 6.65,
    "totalCalories": 4650,
    "avgCalories": 2325
  }
}
```

### Goals

#### Get Goals
Retrieve all user goals.

```http
GET /api/goals?userId=USER_ID
```

**Response:**
```json
{
  "data": [
    {
      "id": "d5e2b675-492b-41b5-aa95-0f13504b3e42",
      "userId": "user-123",
      "type": "steps",
      "target": 10000,
      "period": "daily",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "userId": "user-123",
      "type": "distance",
      "target": 50,
      "period": "weekly",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Goal
Create a new health goal.

```http
POST /api/goals
```

**Request Body:**
```json
{
  "userId": "user-123",
  "type": "steps",
  "target": 12000,
  "period": "daily"
}
```

**Response:**
```json
{
  "data": {
    "id": "f8e7d6c5-b4a3-9281-7654-321098765432",
    "userId": "user-123",
    "type": "steps",
    "target": 12000,
    "period": "daily",
    "isActive": true,
    "createdAt": "2024-01-15T20:00:00Z"
  }
}
```

#### Update Goal
Update an existing goal.

```http
PUT /api/goals/:goalId
```

**Request Body:**
```json
{
  "target": 15000,
  "isActive": true
}
```

#### Delete Goal
Delete a goal.

```http
DELETE /api/goals/:goalId
```

**Response:**
```json
{
  "message": "Goal deleted successfully"
}
```

### Nutrition

#### Get Nutrition Data
Retrieve nutrition data for a specific date.

```http
GET /api/nutrition/:userId?date=YYYY-MM-DD
```

**Response:**
```json
{
  "data": [
    {
      "id": "n1a2b3c4-d5e6-f789-0123-456789abcdef",
      "userId": "user-123",
      "date": "2024-01-15",
      "foodItem": "Grilled Chicken Breast",
      "calories": 231,
      "protein": 43.5,
      "carbs": 0,
      "fat": 5.0,
      "fiber": 0,
      "sugar": 0,
      "mealType": "lunch",
      "loggedAt": "2024-01-15T12:30:00Z"
    },
    {
      "id": "n2b3c4d5-e6f7-8901-2345-6789abcdef01",
      "userId": "user-123",
      "date": "2024-01-15",
      "foodItem": "Brown Rice",
      "calories": 216,
      "protein": 5.0,
      "carbs": 45.0,
      "fat": 1.8,
      "fiber": 3.5,
      "sugar": 0.7,
      "mealType": "lunch",
      "quantity": 150,
      "unit": "grams",
      "loggedAt": "2024-01-15T12:30:00Z"
    }
  ],
  "summary": {
    "totalCalories": 447,
    "totalProtein": 48.5,
    "totalCarbs": 45.0,
    "totalFat": 6.8,
    "totalFiber": 3.5,
    "totalSugar": 0.7
  }
}
```

#### Log Food Item
Log a food item for nutrition tracking.

```http
POST /api/nutrition
```

**Request Body:**
```json
{
  "userId": "user-123",
  "date": "2024-01-15",
  "foodItem": "Apple",
  "calories": 95,
  "protein": 0.5,
  "carbs": 25.0,
  "fat": 0.3,
  "fiber": 4.4,
  "sugar": 19.0,
  "mealType": "snack",
  "quantity": 1,
  "unit": "medium"
}
```

#### Update Nutrition Entry
Update an existing nutrition entry.

```http
PUT /api/nutrition/:entryId
```

#### Delete Nutrition Entry
Delete a nutrition entry.

```http
DELETE /api/nutrition/:entryId
```

### Workouts

#### Get Workouts
Retrieve workouts for a specific date or date range.

```http
GET /api/workouts/:userId?date=YYYY-MM-DD
GET /api/workouts/:userId?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

**Response:**
```json
{
  "data": [
    {
      "id": "w1a2b3c4-d5e6-f789-0123-456789abcdef",
      "userId": "user-123",
      "date": "2024-01-15",
      "type": "running",
      "name": "Morning Run",
      "duration": 30,
      "calories": 350,
      "distance": 5.0,
      "avgHeartRate": 145,
      "maxHeartRate": 165,
      "notes": "Felt great today!",
      "startTime": "2024-01-15T07:00:00Z",
      "endTime": "2024-01-15T07:30:00Z"
    }
  ]
}
```

#### Log Workout
Log a new workout.

```http
POST /api/workouts
```

**Request Body:**
```json
{
  "userId": "user-123",
  "date": "2024-01-15",
  "type": "strength_training",
  "name": "Upper Body Workout",
  "duration": 45,
  "calories": 280,
  "exercises": [
    {
      "name": "Push-ups",
      "sets": 3,
      "reps": 15,
      "weight": null
    },
    {
      "name": "Bench Press",
      "sets": 4,
      "reps": 8,
      "weight": 80
    }
  ],
  "notes": "Increased weight on bench press"
}
```

### Analytics

#### Get Nutrition Summary
Get nutrition analytics for a date range.

```http
GET /api/analytics/nutrition-summary/:userId?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

**Response:**
```json
{
  "data": {
    "period": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-15",
      "days": 15
    },
    "averages": {
      "calories": 2156,
      "protein": 98.2,
      "carbs": 245.8,
      "fat": 78.5,
      "fiber": 25.3,
      "sugar": 67.2
    },
    "totals": {
      "calories": 32340,
      "protein": 1473,
      "carbs": 3687,
      "fat": 1177.5,
      "fiber": 379.5,
      "sugar": 1008
    },
    "trends": {
      "caloriesTrend": "increasing",
      "proteinTrend": "stable",
      "carbsTrend": "decreasing"
    },
    "topFoods": [
      {
        "foodItem": "Chicken Breast",
        "frequency": 12,
        "totalCalories": 2772
      },
      {
        "foodItem": "Brown Rice",
        "frequency": 10,
        "totalCalories": 2160
      }
    ]
  }
}
```

#### Get Health Trends
Get health data trends and insights.

```http
GET /api/analytics/health-trends/:userId?period=week|month|quarter&metric=steps|weight|calories
```

**Response:**
```json
{
  "data": {
    "metric": "steps",
    "period": "month",
    "startDate": "2023-12-15",
    "endDate": "2024-01-15",
    "dataPoints": [
      {
        "date": "2023-12-15",
        "value": 8500,
        "weeklyAverage": 8200
      },
      {
        "date": "2023-12-22",
        "value": 9200,
        "weeklyAverage": 8800
      },
      {
        "date": "2023-12-29",
        "value": 7800,
        "weeklyAverage": 8500
      },
      {
        "date": "2024-01-05",
        "value": 9800,
        "weeklyAverage": 9100
      },
      {
        "date": "2024-01-12",
        "value": 10200,
        "weeklyAverage": 9500
      }
    ],
    "insights": {
      "trend": "increasing",
      "changePercent": 12.5,
      "bestWeek": "2024-01-12",
      "averageValue": 9100,
      "goalAchievement": 78.5
    }
  }
}
```

### Connected Services

#### Get Connected Services
Retrieve linked health services.

```http
GET /api/connected-services?userId=USER_ID
```

**Response:**
```json
{
  "data": [
    {
      "id": "dac9d6eb-9399-4430-b137-c9289ec91df5",
      "userId": "user-123",
      "provider": "googlefit",
      "name": "Google Fit",
      "isConnected": true,
      "lastSync": "2024-01-15T18:30:00Z",
      "syncStatus": "active",
      "permissions": ["steps", "heart_rate", "distance"]
    },
    {
      "id": "bef8a7c6-1234-5678-9012-345678901234",
      "userId": "user-123", 
      "provider": "applehealth",
      "name": "Apple Health",
      "isConnected": false,
      "lastSync": null,
      "syncStatus": "disconnected",
      "permissions": []
    }
  ]
}
```

#### Connect Service
Connect to a health service provider.

```http
POST /api/connected-services/connect
```

**Request Body:**
```json
{
  "userId": "user-123",
  "provider": "googlefit",
  "authCode": "auth_code_from_oauth_flow",
  "permissions": ["steps", "heart_rate", "distance", "calories"]
}
```

#### Sync Service Data
Trigger a manual sync with connected service.

```http
POST /api/connected-services/:serviceId/sync
```

**Response:**
```json
{
  "data": {
    "syncId": "sync-123456789",
    "status": "started",
    "estimatedDuration": 30,
    "lastSyncData": {
      "recordsImported": 145,
      "dateRange": {
        "start": "2024-01-01",
        "end": "2024-01-15"
      }
    }
  }
}
```

## Data Validation

### Health Data Schema
```typescript
{
  steps: number (min: 0, max: 100000),
  distance: number (min: 0, max: 1000), // kilometers
  calories: number (min: 0, max: 10000),
  heartRate: number (min: 30, max: 250), // bpm
  sleep: number (min: 0, max: 24), // hours
  weight: number (min: 20, max: 500), // kg
  activeMinutes: number (min: 0, max: 1440)
}
```

### Goal Schema
```typescript
{
  type: "steps" | "distance" | "calories" | "activeMinutes" | "weight",
  target: number (min: 1),
  period: "daily" | "weekly" | "monthly"
}
```

### Nutrition Schema
```typescript
{
  foodItem: string (max: 100 chars),
  calories: number (min: 0, max: 2000),
  protein: number (min: 0, max: 200), // grams
  carbs: number (min: 0, max: 500), // grams
  fat: number (min: 0, max: 200), // grams
  fiber: number (min: 0, max: 100), // grams
  sugar: number (min: 0, max: 200), // grams
  mealType: "breakfast" | "lunch" | "dinner" | "snack",
  quantity: number (min: 0.1, max: 1000),
  unit: string (max: 20 chars)
}
```

## Rate Limiting

### Limits
- **General API**: 100 requests per minute per IP
- **Health Data Updates**: 20 requests per minute per user
- **File Uploads**: 5 requests per minute per user
- **Sync Operations**: 2 requests per minute per user

### Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642284000
```

## Webhooks (Future Feature)

### Goal Achievement
```json
{
  "event": "goal.achieved",
  "userId": "user-123",
  "goalId": "goal-456",
  "data": {
    "type": "steps",
    "target": 10000,
    "actual": 10250,
    "date": "2024-01-15"
  },
  "timestamp": "2024-01-15T20:00:00Z"
}
```

### Health Data Threshold
```json
{
  "event": "health.threshold",
  "userId": "user-123",
  "data": {
    "metric": "heartRate",
    "value": 180,
    "threshold": 170,
    "type": "exceeded"
  },
  "timestamp": "2024-01-15T14:30:00Z"
}
```

This API documentation provides comprehensive coverage of all endpoints, request/response formats, validation rules, and additional features for the Health Tracker application.


# Deployment Guide

## Overview

This guide covers deploying the Health Tracker application to various platforms including Replit for web deployment and Google Play Store for Android distribution.

## Web Deployment (Replit)

### Prerequisites
- Replit account
- GitHub repository (optional for CI/CD)
- Environment variables configured

### Deployment Steps

#### 1. Environment Configuration

Create and configure environment variables in Replit Secrets:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Server Configuration
NODE_ENV=production
PORT=5000

# Session Management
SESSION_SECRET=your-secure-session-secret-here

# External API Keys (Optional)
GOOGLE_FIT_API_KEY=your-google-fit-key
APPLE_HEALTH_API_KEY=your-apple-health-key
FIREBASE_API_KEY=your-firebase-key

# Analytics (Optional)
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
MIXPANEL_TOKEN=your-mixpanel-token
```

#### 2. Database Setup

##### Using Neon Database (Recommended)
```bash
# 1. Create account at https://neon.tech
# 2. Create new project and database
# 3. Copy connection string to DATABASE_URL secret
# 4. Run database migrations
npm run db:push
```

##### Using PostgreSQL on Railway
```bash
# 1. Create Railway account
# 2. Deploy PostgreSQL service
# 3. Copy connection string
# 4. Add to Replit secrets as DATABASE_URL
```

#### 3. Build Configuration

Update `package.json` scripts for production:

```json
{
  "scripts": {
    "start": "NODE_ENV=production node dist/index.js",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "deploy": "npm run build && npm start"
  }
}
```

#### 4. Replit Configuration

Create/update `.replit` file:

```toml
run = "npm start"
modules = ["nodejs-18"]

[deployment]
run = ["sh", "-c", "npm run build && npm start"]
ignorePorts = false

[env]
NODE_ENV = "production"
```

#### 5. Deploy to Replit

1. **Via Web Interface:**
   - Click "Deploy" tab in Replit
   - Configure deployment settings
   - Click "Deploy" button

2. **Via CLI:**
   ```bash
   # Install Replit CLI
   npm install -g @replit/cli
   
   # Login and deploy
   replit auth login
   replit deploy
   ```

#### 6. Custom Domain Setup (Optional)

1. In Replit deployment settings
2. Click "Link Domain"
3. Add your custom domain
4. Configure DNS records:
   ```
   Type: CNAME
   Name: your-subdomain (or @)
   Value: your-repl-name--username.replit.app
   ```

### Production Optimizations

#### Performance Optimizations
```typescript
// server/index.ts - Production optimizations
if (process.env.NODE_ENV === 'production') {
  // Enable compression
  app.use(compression());
  
  // Security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"]
      }
    }
  }));
  
  // Rate limiting
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }));
}
```

#### Caching Strategy
```typescript
// Static asset caching
app.use('/assets', express.static('client/dist/assets', {
  maxAge: '1y',
  immutable: true
}));

// API response caching
app.use('/api', (req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  }
  next();
});
```

### Monitoring and Analytics

#### Health Check Endpoint
```typescript
// Add to server/routes.ts
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV
  });
});
```

#### Error Tracking
```typescript
// Add error tracking (e.g., Sentry)
import * as Sentry from '@sentry/node';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV
  });
  
  app.use(Sentry.Handlers.errorHandler());
}
```

## Android App Distribution

### Google Play Store Deployment

#### 1. Prepare Release Build

##### Generate Release Keystore
```bash
# Create release keystore
keytool -genkey -v -keystore health-tracker-release.keystore \
  -alias health-tracker \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Store keystore details securely
# - Keystore password
# - Key alias: health-tracker
# - Key password
# - Certificate details
```

##### Configure Signing
Create `android/app/release.properties`:
```properties
storeFile=../health-tracker-release.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=health-tracker
keyPassword=YOUR_KEY_PASSWORD
```

Update `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            def releaseProps = new Properties()
            releaseProps.load(new FileInputStream(file("release.properties")))
            
            storeFile file(releaseProps['storeFile'])
            storePassword releaseProps['storePassword']
            keyAlias releaseProps['keyAlias']
            keyPassword releaseProps['keyPassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### 2. Build Release Bundle

```bash
# Build web assets
npm run build

# Sync with Android
npx cap sync android

# Build App Bundle (recommended for Play Store)
cd android
./gradlew bundleRelease

# Output: app/build/outputs/bundle/release/app-release.aab
```

#### 3. Google Play Console Setup

##### Create Application
1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill out app details:
   - **App name**: Health Tracker
   - **Default language**: English (US)
   - **App or game**: App
   - **Free or paid**: Free

##### Store Listing
```yaml
App Details:
  Title: Health Tracker
  Short description: Track your health metrics and achieve your wellness goals
  Full description: |
    Health Tracker is a comprehensive wellness app that helps you monitor and 
    improve your health through detailed tracking of steps, calories, sleep, 
    nutrition, and more. Set personalized goals, view progress charts, and 
    maintain a healthy lifestyle with our intuitive interface.
    
    Features:
    • Daily health metrics tracking
    • Goal setting and progress monitoring
    • Nutrition and calorie tracking
    • Workout logging and analysis
    • Beautiful charts and insights
    • Dark/light theme support
    • Offline functionality

Graphics:
  - App icon (512x512)
  - Feature graphic (1024x500)
  - Screenshots (minimum 2, recommended 8)
  - Phone screenshots (16:9 or 9:16 ratio)
  - Tablet screenshots (optional)

Contact Information:
  - Developer email
  - Privacy policy URL
  - Support website URL
```

##### App Content
```yaml
Target Audience:
  - Age group: 13+
  - Content rating: Everyone

Privacy Policy:
  - URL to privacy policy
  - Data safety section completion

Permissions:
  - Internet access: For data synchronization
  - Storage access: For offline data storage
  - Camera: For barcode scanning (optional)
  - Location: For activity tracking (optional)
```

#### 4. Upload and Release

##### Internal Testing
1. Upload AAB to Internal testing track
2. Add internal testers (email addresses)
3. Test thoroughly on various devices
4. Collect feedback and fix issues

##### Closed Testing (Beta)
1. Create closed testing track
2. Upload AAB
3. Add beta testers
4. Gather user feedback
5. Iterate based on feedback

##### Production Release
```bash
# Final pre-release checklist:
# ✓ All features tested
# ✓ Performance optimized
# ✓ Crash-free rate > 99%
# ✓ ANR rate < 0.5%
# ✓ Store listing complete
# ✓ Privacy policy updated
# ✓ Terms of service updated

# Submit for review
1. Upload final AAB to Production track
2. Set rollout percentage (start with 1-5%)
3. Submit for review
4. Monitor metrics after approval
5. Gradually increase rollout
```

### Alternative Distribution

#### Direct APK Distribution
```bash
# Build debug APK for direct distribution
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease

# Distribute via:
# - Direct download from website
# - Email/messaging apps
# - Third-party app stores
```

#### Amazon Appstore
1. Create Amazon Developer account
2. Upload APK to Amazon Appstore
3. Complete store listing
4. Submit for review

#### Samsung Galaxy Store
1. Register Samsung developer account
2. Upload APK to Galaxy Store
3. Complete certification process
4. Publish to Samsung users

## CI/CD Pipeline

### GitHub Actions Setup

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Replit

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Replit
        uses: replit/replit-deploy-action@v1
        with:
          replit-token: ${{ secrets.REPLIT_TOKEN }}
          repl-id: ${{ secrets.REPL_ID }}

  android-build:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          java-version: '11'
          distribution: 'temurin'
      
      - name: Setup Android SDK
        uses: android-actions/setup-android@v2
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build web assets
        run: npm run build
      
      - name: Sync Capacitor
        run: npx cap sync android
      
      - name: Build Android AAB
        run: |
          cd android
          ./gradlew bundleRelease
      
      - name: Upload AAB artifact
        uses: actions/upload-artifact@v3
        with:
          name: app-release.aab
          path: android/app/build/outputs/bundle/release/app-release.aab
```

### Automated Testing

#### Unit Tests
```bash
# Add to package.json
"scripts": {
  "test": "vitest",
  "test:coverage": "vitest --coverage",
  "test:e2e": "playwright test"
}
```

#### Integration Tests
```typescript
// tests/api.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server';

describe('Health Data API', () => {
  it('should get health data', async () => {
    const response = await request(app)
      .get('/api/health-data/user-123')
      .expect(200);
    
    expect(response.body.data).toBeDefined();
  });
  
  it('should update health data', async () => {
    const response = await request(app)
      .put('/api/health-data/user-123')
      .send({
        steps: 8500,
        calories: 2200
      })
      .expect(200);
    
    expect(response.body.data.steps).toBe(8500);
  });
});
```

## Monitoring and Maintenance

### Performance Monitoring
```javascript
// Add to index.html
<script>
  // Core Web Vitals tracking
  import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
</script>
```

### Error Tracking
```typescript
// Global error handler
window.addEventListener('error', (event) => {
  // Send to error tracking service
  analytics.track('JavaScript Error', {
    message: event.error.message,
    stack: event.error.stack,
    filename: event.filename,
    line: event.lineno
  });
});
```

### Health Checks
```bash
# Setup monitoring endpoints
curl -f https://your-app.replit.app/health || exit 1

# Database connectivity check
curl -f https://your-app.replit.app/api/health-check || exit 1
```

This comprehensive deployment guide covers all aspects of deploying your Health Tracker application to production environments, from web deployment on Replit to Android distribution via Google Play Store.


# Health Tracker PWA & Android App

A modern health tracking application built with React, Express.js, and PostgreSQL. Track your daily health metrics, set goals, and monitor progress through intuitive charts and visualizations.

## 🌟 Features

- **Health Metrics Tracking**: Steps, distance, calories, heart rate, sleep, and weight
- **Goal Management**: Set and track daily/weekly health goals
- **Data Visualization**: Interactive charts and progress analytics
- **Multi-Platform**: Works as PWA and native Android app
- **Dark/Light Theme**: Automatic theme switching with user preference
- **Offline Support**: Works offline with service worker caching
- **Real-time Updates**: Live data synchronization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Android Studio (for Android development)

### Installation

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd health-tracker
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   # Configure your database and API keys
   ```

3. **Database Setup**
   ```bash
   npm run db:push
   ```

4. **Development Server**
   ```bash
   npm run dev
   ```
   App will be available at `http://localhost:5000`

## 📱 PWA Installation

### Desktop
1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Follow the installation prompts

### Mobile
1. Open the app in mobile browser
2. Tap "Add to Home Screen"
3. Confirm installation

## 🤖 Android APK Build

### Setup Android Environment

1. **Install Android Studio**
   - Download from [developer.android.com](https://developer.android.com/studio)
   - Install Android SDK and build tools

2. **Install Capacitor CLI**
   ```bash
   npm install -g @capacitor/cli
   ```

3. **Configure Environment Variables**
   ```bash
   # Add to your shell profile (.bashrc, .zshrc, etc.)
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

### Build Process

1. **Build Web Assets**
   ```bash
   npm run build
   ```

2. **Sync with Android**
   ```bash
   npm run build:android
   ```

3. **Open in Android Studio**
   ```bash
   npm run android:dev
   ```

4. **Build APK**
   - In Android Studio: Build → Generate Signed Bundle/APK
   - Or via command line:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

### APK Location
- Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release APK: `android/app/build/outputs/apk/release/app-release.apk`

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/UI** components
- **TanStack Query** for state management
- **Wouter** for routing

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** with PostgreSQL
- **RESTful API** design
- **Session-based authentication** (ready for expansion)

### Mobile
- **Capacitor** for native mobile features
- **PWA** capabilities with service workers
- **Responsive design** optimized for mobile

## 📊 API Documentation

### Health Data Endpoints

#### Get Health Data
```http
GET /api/health-data/:userId
```

#### Update Health Data
```http
PUT /api/health-data/:userId
Content-Type: application/json

{
  "steps": 8500,
  "distance": 6.2,
  "calories": 2200,
  "heartRate": 72,
  "sleep": 7.5,
  "weight": 70.5
}
```

### Goals Endpoints

#### Get Goals
```http
GET /api/goals
```

#### Create Goal
```http
POST /api/goals
Content-Type: application/json

{
  "type": "steps",
  "target": 10000,
  "period": "daily"
}
```

### Nutrition Endpoints

#### Get Nutrition Data
```http
GET /api/nutrition/:userId
```

#### Log Nutrition
```http
POST /api/nutrition
Content-Type: application/json

{
  "userId": "user-id",
  "foodItem": "Apple",
  "calories": 95,
  "protein": 0.5,
  "carbs": 25,
  "fat": 0.3
}
```

## 🔧 Configuration

### Environment Variables

Create `.env` file in root:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/healthtracker

# Server
PORT=5000
NODE_ENV=development

# Session
SESSION_SECRET=your-session-secret-here

# External APIs (optional)
GOOGLE_FIT_API_KEY=your-google-fit-key
APPLE_HEALTH_API_KEY=your-apple-health-key
```

### Capacitor Configuration

The app is configured in [`capacitor.config.ts`](capacitor.config.ts):

```typescript
const config: CapacitorConfig = {
  appId: 'com.healthtracker.app',
  appName: 'Health Tracker',
  webDir: 'client/dist',
  server: {
    androidScheme: 'https'
  }
};
```

## 🎨 Theming

The app supports light/dark themes using CSS variables:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark theme variables */
}
```

## 📱 Mobile Features

### Native Capabilities
- **Splash Screen**: Custom branded splash screen
- **Status Bar**: Themed status bar
- **Hardware Back Button**: Proper navigation handling
- **App Icons**: Multiple resolution app icons
- **File Access**: Local file system access

### PWA Features
- **Offline Support**: Service worker caching
- **App Manifest**: Installable web app
- **Push Notifications**: (Ready for implementation)
- **Background Sync**: (Ready for implementation)

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Mobile Testing
```bash
# Test on connected Android device
npm run android:dev

# Test PWA features
npm run dev
# Then test PWA installation and offline functionality
```

## 🚀 Deployment

### PWA Deployment (Replit)
1. Push code to Replit
2. Configure environment variables in Secrets
3. Deploy using Replit's deployment feature

### Android App Store
1. Build release APK with signed certificate
2. Test thoroughly on various devices
3. Upload to Google Play Console
4. Follow Google Play review process

## 🔒 Security

### Data Protection
- Input validation with Zod schemas
- SQL injection prevention with Drizzle ORM
- XSS protection with proper sanitization
- HTTPS enforcement in production

### Mobile Security
- Certificate pinning (configurable)
- Secure storage for sensitive data
- Biometric authentication (ready for implementation)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and docs folder
- **Issues**: Create GitHub issue for bugs
- **Discussions**: Use GitHub Discussions for questions

## 🗺️ Roadmap

- [ ] Integration with Google Fit / Apple Health
- [ ] Social features and challenges
- [ ] AI-powered health insights
- [ ] Wearable device support
- [ ] Telehealth integration
- [ ] Advanced analytics dashboard

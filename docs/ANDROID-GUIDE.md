
# Android App Development Guide

## Overview

The Health Tracker Android app is built using Capacitor, which wraps the web application in a native Android container while providing access to native device APIs.

## Architecture

### Technology Stack
- **Capacitor**: Native bridge between web and Android
- **Android WebView**: Renders the React application
- **Native Plugins**: Access to device features
- **Gradle**: Build system and dependency management

### Project Structure
```
android/
├── app/
│   ├── src/main/
│   │   ├── java/com/healthtracker/
│   │   ├── res/
│   │   ├── assets/
│   │   └── AndroidManifest.xml
│   ├── build.gradle
│   └── proguard-rules.pro
├── capacitor-cordova-android-plugins/
├── gradle/
├── build.gradle
└── settings.gradle
```

## Setup and Installation

### Prerequisites

#### 1. Android Studio Installation
```bash
# Download Android Studio from:
# https://developer.android.com/studio

# After installation, install required SDK components:
# - Android SDK Platform 33 (API level 33)
# - Android SDK Build-Tools 33.0.0
# - Android Emulator
# - Intel x86 Emulator Accelerator (HAXM)
```

#### 2. Environment Configuration
```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Reload shell configuration
source ~/.bashrc  # or ~/.zshrc
```

#### 3. Java Development Kit
```bash
# Install JDK 11 (recommended)
# On macOS with Homebrew:
brew install openjdk@11

# On Ubuntu/Debian:
sudo apt install openjdk-11-jdk

# On Windows: Download from Oracle or use OpenJDK
```

### Project Setup

#### 1. Initialize Capacitor
```bash
# Install Capacitor globally
npm install -g @capacitor/cli

# Initialize in project (already done)
npx cap init

# Add Android platform (already done)
npx cap add android
```

#### 2. Configure Capacitor
Edit `capacitor.config.ts`:
```typescript
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.healthtracker.app',
  appName: 'Health Tracker',
  webDir: 'client/dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: false
    },
    StatusBar: {
      style: 'default'
    }
  }
};

export default config;
```

## Build Process

### Development Build

#### 1. Build Web Assets
```bash
# Build the React application
npm run build
```

#### 2. Copy to Android
```bash
# Copy web assets to Android project
npx cap copy android

# Sync native dependencies
npx cap sync android
```

#### 3. Open in Android Studio
```bash
# Open project in Android Studio
npx cap open android

# Or use npm script
npm run android:dev
```

#### 4. Run on Device/Emulator
- In Android Studio, click "Run" button
- Select target device or emulator
- App will build and install automatically

### Production Build

#### 1. Build Optimized Assets
```bash
# Build production React app
npm run build

# Sync with Android
npx cap sync android
```

#### 2. Generate Signed APK

##### Create Keystore
```bash
# Generate release keystore
keytool -genkey -v -keystore health-tracker-release.keystore \
  -alias health-tracker -keyalg RSA -keysize 2048 -validity 10000

# Store keystore securely and backup!
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
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

##### Build Release APK
```bash
cd android
./gradlew assembleRelease

# APK location: app/build/outputs/apk/release/app-release.apk
```

### App Bundle (Recommended for Play Store)
```bash
cd android
./gradlew bundleRelease

# AAB location: app/build/outputs/bundle/release/app-release.aab
```

## Native Features Integration

### Device Permissions

#### Configure Permissions in AndroidManifest.xml
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.VIBRATE" />
```

#### Request Permissions in App
```typescript
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

// Request camera permission
const requestCameraPermission = async () => {
  const permissions = await Camera.requestPermissions();
  return permissions.camera === 'granted';
};

// Request location permission
const requestLocationPermission = async () => {
  const permissions = await Geolocation.requestPermissions();
  return permissions.location === 'granted';
};
```

### Available Plugins

#### Core Plugins
```bash
npm install @capacitor/camera
npm install @capacitor/geolocation
npm install @capacitor/device
npm install @capacitor/network
npm install @capacitor/storage
npm install @capacitor/haptics
npm install @capacitor/status-bar
npm install @capacitor/splash-screen
```

#### Usage Examples
```typescript
// Camera
import { Camera, CameraResultType } from '@capacitor/camera';

const takePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Uri
  });
  return image.webPath;
};

// Geolocation
import { Geolocation } from '@capacitor/geolocation';

const getCurrentPosition = async () => {
  const position = await Geolocation.getCurrentPosition();
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
  };
};

// Device Info
import { Device } from '@capacitor/device';

const getDeviceInfo = async () => {
  const info = await Device.getInfo();
  return {
    platform: info.platform,
    model: info.model,
    version: info.osVersion
  };
};

// Network Status
import { Network } from '@capacitor/network';

const getNetworkStatus = async () => {
  const status = await Network.getStatus();
  return {
    connected: status.connected,
    connectionType: status.connectionType
  };
};

// Local Storage
import { Storage } from '@capacitor/storage';

const setItem = async (key: string, value: string) => {
  await Storage.set({ key, value });
};

const getItem = async (key: string) => {
  const { value } = await Storage.get({ key });
  return value;
};
```

## App Configuration

### App Icons and Splash Screen

#### Generate Icons
```bash
# Install icon generator
npm install -g @capacitor/assets

# Generate icons from source
npx @capacitor/assets generate --iconPath icon.png --splashPath splash.png
```

#### Manual Icon Setup
Place icons in `android/app/src/main/res/`:
```
mipmap-hdpi/ic_launcher.png (72x72)
mipmap-mdpi/ic_launcher.png (48x48)
mipmap-xhdpi/ic_launcher.png (96x96)
mipmap-xxhdpi/ic_launcher.png (144x144)
mipmap-xxxhdpi/ic_launcher.png (192x192)
```

#### Splash Screen Configuration
Update `android/app/src/main/res/values/styles.xml`:
```xml
<style name="AppTheme.NoActionBarLaunch" parent="AppTheme.NoActionBar">
    <item name="android:background">@drawable/splash</item>
</style>
```

### App Metadata

#### Update strings.xml
```xml
<!-- android/app/src/main/res/values/strings.xml -->
<resources>
    <string name="app_name">Health Tracker</string>
    <string name="title_activity_main">Health Tracker</string>
    <string name="package_name">com.healthtracker.app</string>
    <string name="custom_url_scheme">com.healthtracker.app</string>
</resources>
```

#### Configure build.gradle
```gradle
android {
    compileSdkVersion 33
    
    defaultConfig {
        applicationId "com.healthtracker.app"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
        
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        
        // Multidex support for large apps
        multiDexEnabled true
    }
}
```

## Performance Optimization

### WebView Optimization

#### Configure WebView Settings
```java
// MainActivity.java
@Override
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    
    // Enable hardware acceleration
    getWindow().setFlags(WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
                        WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED);
}
```

#### Proguard Configuration
```proguard
# proguard-rules.pro
-keep class com.healthtracker.** { *; }
-keep class com.getcapacitor.** { *; }
-keep class com.capacitorjs.** { *; }

# Keep WebView JavaScript interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Reduce APK size
-dontwarn com.google.android.gms.**
-dontwarn org.apache.**
```

### Build Optimization

#### Enable R8/Proguard
```gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### Split APKs by Architecture
```gradle
android {
    splits {
        abi {
            enable true
            reset()
            include "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
            universalApk true
        }
    }
}
```

## Testing

### Local Testing

#### Using Android Emulator
```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd Pixel_4_API_30

# Install and test
npm run android:dev
```

#### Using Physical Device
1. Enable Developer Options on device
2. Enable USB Debugging
3. Connect device via USB
4. Accept debugging prompt on device
5. Run: `adb devices` to verify connection

### Automated Testing

#### Unit Tests
```bash
cd android
./gradlew test
```

#### Instrumentation Tests
```bash
cd android
./gradlew connectedAndroidTest
```

#### Performance Testing
```bash
# Monitor app performance
adb shell dumpsys meminfo com.healthtracker.app
adb shell dumpsys cpuinfo | grep com.healthtracker.app
```

## Debugging

### Chrome DevTools
1. Open Chrome and go to `chrome://inspect`
2. Connect Android device with USB debugging
3. Select your app from the list
4. Click "Inspect" to open DevTools

### Android Studio Debugging
1. Set breakpoints in Java/Kotlin code
2. Click "Debug" instead of "Run"
3. Use Android Studio's debugger tools

### Capacitor Debugging
```typescript
// Add logging in TypeScript
import { Capacitor } from '@capacitor/core';

if (Capacitor.isNativePlatform()) {
  console.log('Running on native platform');
} else {
  console.log('Running on web');
}
```

### Common Issues and Solutions

#### App Crashes on Startup
- Check AndroidManifest.xml syntax
- Verify all required permissions
- Check for missing native dependencies
- Review device logs: `adb logcat`

#### WebView Not Loading
- Verify HTTPS configuration
- Check network permissions
- Test on different Android versions
- Clear app data and cache

#### Performance Issues
- Enable hardware acceleration
- Optimize image sizes
- Use R8/Proguard for release builds
- Profile memory usage

### Live Reload Development
```bash
# Start development server
npm run dev

# In another terminal, sync and open Android
npx cap copy android && npx cap open android

# Configure live reload in Android Studio:
# Run Configuration > Environment Variables
# Add: CAP_SERVER_URL = http://YOUR_IP:5000
```

## Publishing to Google Play Store

### Preparation
1. Create Google Play Console account
2. Prepare app metadata and screenshots
3. Set up app content rating
4. Configure pricing and distribution

### Upload Process
1. Build signed AAB: `./gradlew bundleRelease`
2. Upload to Play Console
3. Fill out store listing
4. Submit for review

### Release Management
- Use staged rollouts (5%, 20%, 50%, 100%)
- Monitor crash reports and user feedback
- Implement A/B testing for features
- Regular security and dependency updates

This comprehensive guide covers all aspects of Android development for the Health Tracker app, from initial setup to production deployment.


# Progressive Web App (PWA) Guide

## Overview

The Health Tracker PWA provides a native app-like experience on web browsers with offline capabilities, installability, and responsive design.

## PWA Features

### 1. Web App Manifest

The app includes a comprehensive manifest file that defines:

```json
{
  "name": "Health Tracker",
  "short_name": "HealthTracker",
  "description": "Track your health metrics and goals",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 2. Service Worker

The service worker provides:
- **Offline Functionality**: Cache critical resources
- **Background Sync**: Sync data when connection restored
- **Push Notifications**: Real-time updates
- **Update Management**: Handle app updates gracefully

### 3. Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Touch-Friendly**: Large touch targets and gestures
- **Adaptive Layout**: Works across all screen sizes
- **Safe Areas**: Handles notches and status bars

## Installation Guide

### Desktop Installation

#### Chrome/Edge
1. Navigate to the Health Tracker app
2. Look for the install icon (⊕) in the address bar
3. Click the icon and confirm installation
4. App will appear in your applications folder

#### Firefox
1. Open the app in Firefox
2. Click the menu button (≡)
3. Select "Install This Site as an App"
4. Follow the installation prompts

#### Safari
1. Open the app in Safari
2. Click Share button
3. Select "Add to Dock"
4. Confirm installation

### Mobile Installation

#### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu button (⋮)
3. Select "Add to Home screen"
4. Edit the name if desired
5. Tap "Add"

#### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Edit the name if desired
5. Tap "Add"

## Offline Functionality

### Cached Resources
- Core app shell (HTML, CSS, JS)
- Essential images and icons
- API responses for recent data
- User preferences and settings

### Offline Behavior
- **Read Access**: View cached health data
- **Data Entry**: Queue entries for sync when online
- **Navigation**: Full app navigation available
- **Sync Indication**: Clear offline/online status

### Cache Strategy
```javascript
// Cache-first for static assets
workbox.routing.registerRoute(
  /\.(?:js|css|html)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'static-cache',
    plugins: [{
      cacheKeyWillBeUsed: async ({ request }) => {
        return `${request.url}?v=${VERSION}`;
      }
    }]
  })
);

// Network-first for API calls
workbox.routing.registerRoute(
  /\/api\//,
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 3,
    plugins: [{
      cacheWillUpdate: async ({ response }) => {
        return response.status === 200 ? response : null;
      }
    }]
  })
);
```

## Performance Optimization

### Loading Performance
- **Code Splitting**: Lazy load routes and components
- **Image Optimization**: WebP format with fallbacks
- **Critical CSS**: Inline critical styles
- **Preload**: Preload essential resources

### Runtime Performance
- **Virtual Scrolling**: For large data lists
- **Debounced Inputs**: Reduce API calls
- **Memory Management**: Cleanup unused resources
- **Efficient Rerenders**: React optimization patterns

### Metrics
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

## PWA Capabilities

### Background Sync
```javascript
// Register background sync
navigator.serviceWorker.ready.then(registration => {
  return registration.sync.register('health-data-sync');
});

// Handle background sync in service worker
self.addEventListener('sync', event => {
  if (event.tag === 'health-data-sync') {
    event.waitUntil(syncHealthData());
  }
});
```

### Push Notifications
```javascript
// Request notification permission
const permission = await Notification.requestPermission();

// Subscribe to push notifications
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: VAPID_PUBLIC_KEY
});
```

### Device APIs
- **Geolocation**: Track running/walking routes
- **Camera**: Scan food barcodes
- **Storage**: Local data persistence
- **Sensors**: Motion and orientation (where available)

## Testing PWA Features

### Chrome DevTools
1. Open DevTools (F12)
2. Go to Application tab
3. Check:
   - Manifest validation
   - Service worker status
   - Cache storage
   - Offline simulation

### Lighthouse Audit
1. Open DevTools
2. Go to Lighthouse tab
3. Select "Progressive Web App"
4. Run audit
5. Address any issues found

### Manual Testing
- **Installation**: Test on multiple browsers/devices
- **Offline**: Disconnect network and test functionality
- **Updates**: Test app update flow
- **Performance**: Test on slow networks
- **Responsive**: Test various screen sizes

## Browser Support

### Minimum Requirements
- **Chrome**: 67+
- **Firefox**: 67+
- **Safari**: 11.1+
- **Edge**: 79+
- **Samsung Internet**: 8.2+

### Feature Detection
```javascript
// Check for PWA support
const isPWASupported = () => {
  return 'serviceWorker' in navigator && 
         'PushManager' in window &&
         'caches' in window;
};

// Check for installation capability
const canInstall = () => {
  return 'beforeinstallprompt' in window;
};
```

## Troubleshooting

### Common Issues

#### App Not Installing
- Check manifest.json syntax
- Verify HTTPS requirement
- Ensure service worker registration
- Check browser compatibility

#### Offline Features Not Working
- Verify service worker registration
- Check cache strategy implementation
- Test network conditions
- Review console errors

#### Poor Performance
- Audit with Lighthouse
- Check bundle size
- Review image optimization
- Analyze critical rendering path

### Debug Tools
- Chrome DevTools Application panel
- Firefox Developer Tools Storage panel
- PWA Builder validation
- Web.dev PWA checklist

## Best Practices

### User Experience
- **Progressive Enhancement**: Work without PWA features
- **Loading States**: Show progress indicators
- **Error Handling**: Graceful degradation
- **Accessibility**: Full WCAG compliance

### Technical
- **Cache Management**: Implement cache versioning
- **Update Strategy**: Handle app updates smoothly
- **Data Sync**: Robust offline/online synchronization
- **Security**: HTTPS everywhere, secure headers

### Performance
- **Bundle Optimization**: Tree shaking and code splitting
- **Image Strategy**: Responsive images with WebP
- **Critical Path**: Minimize render-blocking resources
- **Memory Usage**: Monitor and optimize

This guide ensures your Health Tracker PWA provides an excellent user experience across all supported platforms and browsers.

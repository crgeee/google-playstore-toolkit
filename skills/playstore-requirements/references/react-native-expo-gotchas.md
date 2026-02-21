# React Native & Expo Play Store Gotchas

## Hermes Engine

**Issue**: JSC (JavaScriptCore) causes larger APK size and slower performance.

**Fix**: Enable Hermes (default since RN 0.70 but verify):

For bare React Native (`android/app/build.gradle`):
```groovy
project.ext.react = [
    enableHermes: true
]
// or in newer RN versions:
react {
    hermesEnabled = true
}
```

For Expo (`app.json`):
```json
{
  "expo": {
    "jsEngine": "hermes"
  }
}
```

## Development Artifacts

### Flipper
Remove from production builds. Check `android/app/build.gradle` for Flipper initialization and ensure it's behind debug build type.

### Console Statements
Use `babel-plugin-transform-remove-console` in `babel.config.js`:
```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
};
```

### Localhost URLs
Search for and remove:
- `http://localhost`
- `http://127.0.0.1`
- `http://10.0.2.2` (Android emulator localhost)
- `exp://` development URLs
- Metro bundler references

### Debug Menu
Ensure React Native debug menu is disabled in release. Normally handled automatically but verify no custom debug menu is always enabled.

## Native Module Permissions

Common React Native modules and their required Android permissions:

| Module | Permissions Needed |
|--------|-------------------|
| `react-native-camera` / `expo-camera` | `CAMERA` |
| `react-native-image-picker` / `expo-image-picker` | `READ_MEDIA_IMAGES`, `CAMERA` |
| `@react-native-community/geolocation` / `expo-location` | `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION` |
| `react-native-contacts` / `expo-contacts` | `READ_CONTACTS` |
| `@react-native-firebase/messaging` / `expo-notifications` | `POST_NOTIFICATIONS` (API 33+) |
| `react-native-bluetooth-le` | `BLUETOOTH_CONNECT`, `BLUETOOTH_SCAN` |
| `react-native-fs` | `READ_MEDIA_*` or `READ_EXTERNAL_STORAGE` |
| `expo-media-library` | `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO` |
| `expo-av` / `expo-audio` | `RECORD_AUDIO` |
| `expo-calendar` | `READ_CALENDAR`, `WRITE_CALENDAR` |
| `expo-sensors` | `BODY_SENSORS` |

## Expo-Specific Configuration

### app.json Android Settings
```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.appname",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "splash": {
        "image": "./assets/splash.png",
        "resizeMode": "contain",
        "backgroundColor": "#FFFFFF"
      },
      "permissions": [
        "CAMERA"
      ],
      "blockedPermissions": [
        "READ_PHONE_STATE"
      ]
    }
  }
}
```

### EAS Build Production Profile
```json
{
  "build": {
    "production": {
      "distribution": "store",
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### expo-dev-client
Must be in `devDependencies` only, NOT in `dependencies`. If in `dependencies`, it ships with production builds and can cause issues.

## CodePush / OTA Updates

Google Play is more lenient than Apple on OTA updates, but:
- Must not change core app functionality post-approval
- Must not enable policy-violating behavior after review
- Must not bypass Play Store update mechanism for major version changes
- `expo-updates` is generally acceptable for bug fixes and minor UI changes

Configuration checklist:
- Verify update server URL is HTTPS
- Check update policy (immediate vs background)
- Ensure updates don't add new native modules
- Document that OTA is used for minor fixes

## Build Configuration

### Minimum SDK
- Recommended: `minSdkVersion 23` (Android 6.0) or higher
- Expo default: typically 21 (may vary by SDK version)
- Higher minSdk = smaller APK, fewer compatibility issues

### Target SDK
- Must be 34+ for Play Store (as of August 2024)
- Check `build.gradle` or `eas.json` for correct target

### App Bundle
- Use AAB (Android App Bundle) not APK for Play Store
- EAS Build: set `"buildType": "app-bundle"` in production profile
- AAB enables dynamic delivery and smaller downloads

### ProGuard / R8
Enable in `android/app/build.gradle`:
```groovy
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

Add React Native-specific ProGuard rules if using Hermes:
```
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }
```

## WebView-Only Apps

Google Play rejects apps that are essentially WebView wrappers:
- If >80% of app content is WebView, high rejection risk
- Must provide native value (navigation, offline support, notifications, etc.)
- Consider using TWA (Trusted Web Activity) for PWA distribution instead

## Common Deprecated Packages

| Deprecated | Replacement |
|-----------|-------------|
| `react-native-push-notification` | `@notifee/react-native` or `expo-notifications` |
| `@react-native-community/async-storage` | `@react-native-async-storage/async-storage` |
| `react-native-firebase` (v5) | `@react-native-firebase/*` (v6+) |
| `react-native-gesture-handler` (v1) | `react-native-gesture-handler` (v2+) |
| `react-native-reanimated` (v1) | `react-native-reanimated` (v3+) |

## 64-bit Requirement

Google Play requires 64-bit native libraries:
- React Native includes both `arm64-v8a` and `armeabi-v7a` by default
- Verify no third-party native modules are 32-bit only
- Check `android/app/build.gradle` for ABI filters — don't exclude `arm64-v8a`

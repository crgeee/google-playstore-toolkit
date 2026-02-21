---
name: playstore-requirements
description: This skill should be used when the user asks about "Play Store requirements", "Play Store review guidelines", "Play Store rejection reasons", "why was my app rejected from Google Play", "Google Play compliance", "Data Safety Section", "target SDK requirements", "Android app submission checklist", "React Native Play Store", "Expo Play Store submission", or needs guidance on Google Play Store compliance, common rejection reasons, privacy requirements, or submission readiness.
version: 0.1.2
---

# Google Play Store Requirements

## Overview

Comprehensive knowledge base for ensuring Android apps (native Kotlin/Java, React Native, or Expo) meet Google Play Store policies and pass review. Google Play enforces policies through both automated scanning (pre-launch reports) and manual review, with policy violations leading to app removal, suspension, or account termination.

## Top Rejection / Policy Violation Categories

The most frequent Google Play policy enforcement actions, ranked by frequency:

1. **Spam and Minimum Functionality** (~25%): WebView-only apps, cloned apps, apps that don't provide lasting user value
2. **Privacy / Data Safety** (~20%): Inaccurate Data Safety Section, undisclosed data collection, missing privacy policy
3. **Deceptive Behavior** (~15%): Misleading claims, hidden functionality, impersonation
4. **Malware and Mobile Unwanted Software** (~10%): Dangerous permissions without justification, background data collection
5. **Restricted Content** (~8%): Inappropriate content, hate speech, sensitive events
6. **Intellectual Property** (~7%): Trademark infringement, copyrighted content
7. **Billing Policy** (~5%): Using external payment for digital goods, missing subscription terms
8. **Families Policy** (~4%): COPPA violations, inappropriate content for children
9. **Ads Policy** (~3%): Deceptive ads, ad fraud, inappropriate ad placement
10. **Metadata Policy** (~3%): Keyword stuffing, misleading descriptions, inappropriate screenshots

For detailed actionable checks for each category, consult `references/common-rejection-reasons.md`.

## Key Compliance Areas

### AndroidManifest.xml & Permissions
Every sensitive permission requires justification. Restricted permissions (SMS, call log, accessibility) require a declaration form in Play Console. Target SDK must be 34+ (Android 14). All components with intent filters must have explicit `android:exported` declarations.

For the complete permissions reference, consult `references/android-permissions-guide.md`.

### Data Safety Section
All apps must complete the Data Safety Section in Play Console. Declarations must accurately reflect all data collection, sharing, and handling practices including third-party SDKs. Account deletion must be available both in-app and via web if the app supports account creation.

For Data Safety Section requirements, consult `references/data-safety-requirements.md`.

### Target SDK Level Requirements
Google Play requires apps to target recent API levels:
- New apps: must target API 34 (Android 14) or higher
- App updates: must target API 34 or higher
- Wear OS apps: must target API 33 or higher
- Apps not meeting requirements cannot be published or updated

### Google Play Billing
All digital goods and services must use Google Play Billing Library. Physical goods and services can use alternative payment methods. Subscription apps must display pricing, renewal terms, and provide access to Google Play subscription management. Purchase acknowledgment within 3 days is mandatory.

### App Icons & Assets
Adaptive icons (API 26+) with foreground and background layers are required. Play Store listing requires a 512x512 high-res icon and 1024x500 feature graphic. App screenshots must accurately represent the app.

### Security Requirements
Apps must use HTTPS for all network communication. Network security configuration should block cleartext traffic. ProGuard/R8 should be enabled for release builds. WebView must not have dangerous settings like `setAllowFileAccessFromFileURLs(true)`. Hardcoded secrets and API keys must be removed from source code.

### React Native / Expo Specific
Hermes engine should be enabled for performance. Development artifacts (Flipper, console.log, localhost URLs) must be removed from release builds. Native module permissions must be declared in AndroidManifest.xml. EAS Build production profile should use `app-bundle` for Play Store.

For React Native/Expo-specific guidance, consult `references/react-native-expo-gotchas.md`.

## Recent Policy Changes

- **August 2024**: Target API 34 required for all new apps and updates
- **November 2024**: Updated Data Safety Section requirements for AI-powered features
- **December 2023**: Account deletion requirement enforced — apps with account creation must provide deletion
- **2024**: Photo and video permissions policy — apps must use photo picker instead of broad storage permissions
- **2024**: Foreground service type requirements (API 34+) — must declare specific type
- **2025**: Edge-to-edge enforcement for apps targeting API 35 (Android 15)
- **2025**: Play Integrity API recommended over SafetyNet (deprecated)
- **2025**: Updated Families Policy requiring age-appropriate design

## Reference Files

| File | When to Consult |
|------|-----------------|
| `references/common-rejection-reasons.md` | Troubleshooting a specific rejection or violation |
| `references/android-permissions-guide.md` | Implementing or auditing permissions and declaration forms |
| `references/data-safety-requirements.md` | Completing Play Console Data Safety Section |
| `references/react-native-expo-gotchas.md` | React Native or Expo-specific configuration issues |

## Usage

When reviewing an app for Play Store readiness:

1. Identify the project type (Native Android / React Native / Expo)
2. Check each compliance area systematically
3. Flag issues by severity: Critical (will cause rejection), Important (likely rejection), Advisory (best practice)
4. Provide concrete fix suggestions with file paths and code changes
5. Reference the specific Google Play policy for each issue

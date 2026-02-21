# Google Play Store Toolkit

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Plugin: Claude Code](https://img.shields.io/badge/Plugin-Claude%20Code-blueviolet)](https://claude.com/claude-code)
[![Version: 0.1.0](https://img.shields.io/badge/Version-0.1.0-green)](CHANGELOG.md)

A Claude Code plugin that reviews Android apps for Google Play Store readiness using 8 specialized review agents. Supports **native Android (Kotlin/Java)**, **React Native**, and **Expo** projects.

## Install

In Claude Code, run:

```
/plugin marketplace add crgeee/google-playstore-toolkit
/plugin install google-playstore-toolkit
```

Then navigate to your Android project and run:

```
/google-playstore-toolkit:review-app
```

<details>
<summary>Alternative installation methods</summary>

### Development / testing (session-only)

```bash
git clone https://github.com/crgeee/google-playstore-toolkit.git
claude --plugin-dir /path/to/google-playstore-toolkit
```

This loads the plugin for a single session only — useful for development and testing.

</details>

### Prerequisites

- [Claude Code](https://claude.com/claude-code) CLI installed
- An Android project (native, React Native, or Expo) in your working directory

## Why?

Google Play enforces policies through automated scanning and manual review. Policy violations can lead to app removal, suspension, or even account termination. Common causes — undeclared data collection, unnecessary permissions, missing account deletion, development artifacts in release builds — are all detectable before you submit.

This toolkit catches those issues during development so you don't waste days waiting for a policy enforcement email.

## How It Works

```
/review-app command
       │
       ├── Detects project type (Native Android / React Native / Expo)
       ├── Detects billing usage (Google Play Billing / RevenueCat)
       │
       ├── Launches specialized agents (parallel by default)
       │   ├── android-manifest-analyzer
       │   ├── privacy-compliance-reviewer
       │   ├── material-design-reviewer
       │   ├── performance-stability-reviewer
       │   ├── assets-metadata-reviewer
       │   ├── security-reviewer
       │   ├── billing-compliance-reviewer  (only if billing detected)
       │   └── react-native-expo-reviewer   (only for RN/Expo projects)
       │
       └── Aggregates findings into a unified report
           ├── Critical Issues (will cause rejection)
           ├── Important Issues (likely rejection)
           ├── Quick Wins (< 30 min fixes)
           ├── Advisory (best practices)
           └── Passed Checks
```

Each agent runs independently with its own scope, then results are combined by severity. Every issue includes the **file location**, a **concrete fix suggestion**, and the **Google Play policy reference**.

## Agents

| Agent | Focus Area |
|-------|-----------|
| `android-manifest-analyzer` | Permissions, intent filters, exported components, target SDK, feature declarations |
| `privacy-compliance-reviewer` | Data Safety Section accuracy, consent mechanisms, GDPR/COPPA, account deletion |
| `material-design-reviewer` | Material Design compliance, accessibility, adaptive layouts, edge-to-edge, touch targets |
| `performance-stability-reviewer` | ANR patterns, crash risks, network security config, memory management |
| `assets-metadata-reviewer` | Adaptive icons, app metadata, forbidden terms, version/signing/build config |
| `billing-compliance-reviewer` | Google Play Billing Library, subscription terms, purchase verification |
| `security-reviewer` | Hardcoded secrets, ProGuard/R8, WebView security, cryptographic practices |
| `react-native-expo-reviewer` | Hermes engine, EAS Build, CodePush/OTA, dev artifacts, native module permissions |

> **Note:** The `privacy-compliance-reviewer` is configured to use the Opus model family (rather than inheriting your session model) for higher accuracy on complex Data Safety Section and permission analysis. All other agents inherit the model you're running Claude Code with.

## Usage

### Full Review (default — parallel)

```
/google-playstore-toolkit:review-app
```

### Sequential Review

```
/google-playstore-toolkit:review-app sequential
```

### Targeted Review

```
/google-playstore-toolkit:review-app privacy security    # specific agents
/google-playstore-toolkit:review-app manifest             # single agent
/google-playstore-toolkit:review-app reactnative          # RN/Expo-specific checks
/google-playstore-toolkit:review-app billing assets       # multiple agents
```

### Available Aspects

| Aspect | Agent |
|--------|-------|
| `manifest` | android-manifest-analyzer |
| `privacy` | privacy-compliance-reviewer |
| `design` | material-design-reviewer |
| `performance` | performance-stability-reviewer |
| `assets` | assets-metadata-reviewer |
| `billing` | billing-compliance-reviewer |
| `security` | security-reviewer |
| `reactnative` | react-native-expo-reviewer |
| `all` | All applicable agents (default) |
| `sequential` | Run one at a time instead of parallel |

## Example Output

```markdown
# Play Store Readiness Report

**Project Type:** React Native (Expo)
**Agents Run:** 8 of 8
**Overall Assessment:** Not Ready

## Critical Issues (3 found)

- [android-manifest-analyzer] **90%**: Unnecessary RECORD_AUDIO permission
  Fix: Add "recordAudioAndroid": false to expo-camera config in app.json
  Policy: Permissions policy

- [react-native-expo-reviewer] **90%**: expo-dev-client in production dependencies
  Fix: Move to devDependencies
  Policy: Deceptive Behavior policy

- [material-design-reviewer] **88%**: Portrait-only orientation blocks large screen compliance
  Fix: Change "orientation" to "default" and add responsive layouts
  Policy: Large Screen App Quality guidelines

## Important Issues (14 found)
...

## Quick Wins
- Remove SYSTEM_ALERT_WINDOW from release manifest
- Add maxSdkVersion="32" to legacy storage permissions
- Add .catch() to startup useEffect
...
```

## What It Checks

Based on Google Play's published policies and enforcement data:

- AndroidManifest.xml permissions and restricted permission declarations
- Data Safety Section accuracy against actual data collection (including third-party SDKs)
- Material Design compliance, accessibility labels, touch targets (48dp minimum)
- Adaptive layout support for tablets, foldables, and landscape
- Edge-to-edge display readiness (Android 15+ enforcement)
- ANR-causing patterns (main thread blocking, async work)
- Network security configuration and cleartext traffic
- Adaptive icon configuration across all densities
- App metadata for forbidden terms and store listing compliance
- Google Play Billing Library implementation and subscription terms
- Hardcoded secrets, API keys, and credentials in source code
- ProGuard/R8 obfuscation and WebView security settings
- Account deletion mechanism (required since December 2023)
- React Native: Hermes engine, EAS Build config, dev artifacts, native module permissions
- Expo: app.json configuration, prebuild output, expo-dev-client placement

## Supported Project Types

- **Native Android** — Kotlin/Java with Gradle
- **React Native** — bare workflow
- **Expo** — managed and bare

The toolkit automatically detects the project type by scanning for `package.json` (React Native), `app.json` (Expo), or `build.gradle` (native Android).

## Policy Coverage

This plugin covers Google Play Store policies as of **February 2026**, including:

- August 2024: Target API 34 requirement for all apps
- December 2023: Account deletion requirement enforcement
- 2024: Photo and video permissions policy (photo picker preference)
- 2024: Foreground service type requirements (API 34+)
- 2025: Edge-to-edge enforcement for API 35 (Android 15)
- 2025: Play Integrity API replaces SafetyNet (deprecated)

Google updates their policies on a rolling basis. See [CHANGELOG.md](CHANGELOG.md) for update history.

## MCP Server (Not Yet Enabled)

The `mcp-server/` directory contains a TypeScript MCP server for the Google Play Developer API (read-only) that can query release tracks, reviews, and app details. It requires a Google Cloud service account, so it is **not auto-enabled** with the plugin. A setup command will be added in a future release.

## Contributing

Contributions are welcome! If you find a missing check, a false positive, or want to add coverage for a new policy:

1. Fork the repository
2. Create a feature branch
3. Make your changes using [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.)
4. Test against a real Android project with `claude --plugin-dir .`
5. Submit a pull request

Releases are fully automated — `feat:` commits trigger a MINOR release, `fix:` commits trigger a PATCH release. See [RELEASING.md](RELEASING.md) for details.

### Areas for Contribution

- Additional agent checks based on real-world rejections
- False positive reduction (adding negative guidance)
- New Google Play policy coverage as policies change
- React Native library-specific checks
- Expo-specific configuration validation

## License

[MIT](LICENSE)

# Google Play Store Toolkit

A comprehensive Google Play Store readiness review toolkit for [Claude Code](https://claude.com/claude-code). Uses 8 specialized agents to ensure your Android app meets Google's Play Store requirements before submission.

## Installation

```bash
claude plugin add google-playstore-toolkit
```

Or install locally:

```bash
claude --plugin-dir /path/to/google-playstore-toolkit
```

## The Problem

Google Play enforces policies through automated scanning and manual review. Policy violations can lead to app removal, suspension, or account termination. This toolkit catches issues before you submit.

## How It Works

```
/google-playstore-toolkit:review-app
         │
         ├── Detect project type (Native Android / React Native / Expo)
         ├── Detect billing usage
         │
         ├── Launch specialized agents (parallel by default)
         │   ├── android-manifest-analyzer
         │   ├── privacy-compliance-reviewer (Opus)
         │   ├── material-design-reviewer
         │   ├── performance-stability-reviewer
         │   ├── assets-metadata-reviewer
         │   ├── security-reviewer
         │   ├── billing-compliance-reviewer (if billing detected)
         │   └── react-native-expo-reviewer (if RN/Expo detected)
         │
         └── Synthesize unified readiness report
```

## Agents

| Agent | Focus | Color |
|-------|-------|-------|
| android-manifest-analyzer | Permissions, intent filters, target SDK, features | Cyan |
| privacy-compliance-reviewer | Data Safety Section, consent, GDPR/COPPA, account deletion | Red |
| material-design-reviewer | Material Design, accessibility, adaptive layouts, edge-to-edge | Magenta |
| performance-stability-reviewer | ANR patterns, crash risks, network security, memory | Yellow |
| assets-metadata-reviewer | Adaptive icons, metadata, version config, build config | Green |
| billing-compliance-reviewer | Play Billing Library, subscriptions, purchase verification | Blue |
| security-reviewer | Secrets, ProGuard/R8, WebView security, crypto | Cyan |
| react-native-expo-reviewer | Hermes, EAS Build, CodePush, dev artifacts, native modules | Red |

## Usage

### Full review (parallel, all applicable agents)

```
/google-playstore-toolkit:review-app
```

### Sequential review

```
/google-playstore-toolkit:review-app sequential
```

### Targeted review

```
/google-playstore-toolkit:review-app privacy security
/google-playstore-toolkit:review-app manifest
/google-playstore-toolkit:review-app reactnative
/google-playstore-toolkit:review-app billing
```

### Available aspects

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
| `sequential` | Run one at a time |

## MCP Server (Not Yet Enabled)

The `mcp-server/` directory contains a TypeScript MCP server for the Google Play Developer API (read-only) that can query release tracks, reviews, and app details. It requires a Google Cloud service account, so it is **not auto-enabled** with the plugin. A setup command for this will be added in a future release.

## Example Output

```
# Play Store Readiness Report

**Project Type:** React Native (Expo)
**Agents Run:** 8 of 8
**Overall Assessment:** Needs Work

---

## Critical Issues (1 found)
- security-reviewer **95**: Hardcoded API key — File: src/config.ts:12
  Fix: Move to environment variable via react-native-config
  Policy: User Data policy

## Important Issues (3 found)
- privacy-compliance-reviewer **82**: Firebase Analytics data not declared
- android-manifest-analyzer **78**: ACCESS_FINE_LOCATION without justification
- assets-metadata-reviewer **75**: App name contains "beta"

## Quick Wins
- Remove console.log statements (use babel plugin)
- Add contentDescription to 12 Image components

## Passed Checks
- Hermes engine enabled
- Adaptive icons configured
- Play Billing Library v6 with acknowledgment
- ProGuard enabled for release
```

## What It Checks

- AndroidManifest.xml configuration and permissions
- Data Safety Section accuracy
- Material Design and accessibility compliance
- ANR patterns and crash risks
- App icons and metadata
- Google Play Billing implementation
- Hardcoded secrets and security vulnerabilities
- React Native / Expo specific issues
- Network security configuration
- Edge-to-edge display readiness
- Account deletion compliance
- Third-party SDK data collection

## Supported Project Types

- Native Android (Kotlin/Java with Gradle)
- React Native (bare workflow)
- Expo (managed and bare)

## License

MIT

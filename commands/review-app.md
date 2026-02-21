---
description: "Comprehensive Google Play Store readiness review using specialized agents"
argument-hint: "[review-aspects]"
allowed-tools: ["Bash", "Glob", "Grep", "Read", "Task"]
---

# Play Store Readiness Review

Run a comprehensive Google Play Store readiness review using multiple specialized agents, each focusing on a different compliance area.

**Review Aspects (optional):** "$ARGUMENTS"

## Review Workflow:

### Step 1: Detect Project Type

Run these checks to determine the project type:

- Search for `package.json` containing `"react-native"` or `"expo"` → **React Native**
- Search for `app.json` containing `"expo"` → **Expo/React Native**
- Search for `build.gradle` or `build.gradle.kts` with `com.android.application` → **Native Android**
- Search for `settings.gradle` or `settings.gradle.kts` → **Android project**
- If both React Native and native Android exist → **React Native with native modules**

Report the detected type to the user before proceeding.

### Step 2: Detect Billing Usage

Before dispatching agents, check if the project uses in-app purchases:

- Search for: `com.android.billingclient`, `BillingClient`, `react-native-iap`, `react-native-purchases`, `expo-in-app-purchases`, `RevenueCat`, `com.revenuecat`
- If ANY are found → include `billing-compliance-reviewer`
- If NONE found → skip `billing-compliance-reviewer` and note "Billing: Not detected — skipping billing review"

### Step 3: Parse Arguments

**Available aspects:**
- `manifest` → android-manifest-analyzer
- `privacy` → privacy-compliance-reviewer
- `design` → material-design-reviewer
- `performance` → performance-stability-reviewer
- `assets` → assets-metadata-reviewer
- `billing` → billing-compliance-reviewer
- `security` → security-reviewer
- `reactnative` → react-native-expo-reviewer
- `all` → all applicable agents (default)
- `sequential` → modifier: run one at a time instead of parallel

If no arguments or `all`: run all applicable agents based on Step 1 and Step 2 detection.

### Step 4: Determine Agent List

**Always include** (for all Android projects):
1. android-manifest-analyzer
2. privacy-compliance-reviewer
3. material-design-reviewer
4. performance-stability-reviewer
5. assets-metadata-reviewer
6. security-reviewer

**Conditionally include:**
7. billing-compliance-reviewer — **only if billing detected** in Step 2
8. react-native-expo-reviewer — **only if React Native/Expo detected** in Step 1

### Step 5: Launch Agents

**Default: Parallel** — launch all applicable agents simultaneously using the Task tool.

When launching each agent, provide it with:
- The project root path
- The detected project type (React Native/Expo/Native Android)
- A reminder to follow its confidence scoring (only report findings >= 70)

**If `sequential` is specified:** run agents one at a time in the order listed above.

### Step 6: Aggregate Results

After ALL agents complete, compile a unified report. Do NOT just concatenate agent outputs — synthesize them into a single coherent report.

```markdown
# Play Store Readiness Report

**Project Type:** [React Native (Expo) / React Native (bare) / Native Android (Kotlin/Java)]
**Agents Run:** [count] of [total applicable]
**Overall Assessment:** [Ready / Needs Work / Not Ready]

---

## Critical Issues (X found) — Will cause rejection
- [agent-name] **[confidence]**: Issue description — File: [path:line]
  Fix: [concrete fix suggestion]
  Policy: [Google Play policy reference]

## Important Issues (X found) — Likely rejection or policy violation
- [agent-name] **[confidence]**: Issue description — File: [path:line]
  Fix: [concrete fix suggestion]
  Policy: [Google Play policy reference]

## Quick Wins — Easy fixes (< 30 min each)
- [fix description] — File: [path:line]

## Advisory (X found) — Best practice improvements
Present as a table for scannability:
| # | Issue | Location | Effort |
|---|-------|----------|--------|
| 1 | [description] | [file] | Quick Fix / Moderate / Significant |

## Passed Checks
- [What's already compliant — give credit for what's done right]

## Recommended Action
1. Fix critical issues first — these guarantee rejection
2. Address important issues — high rejection risk
3. Knock out quick wins — fast improvements
4. Consider advisory items in priority order
5. Re-run: `/google-playstore-toolkit:review-app`
```

### Assessment Criteria

- **Ready**: 0 Critical, <= 2 Important issues
- **Needs Work**: 0 Critical, 3+ Important issues
- **Not Ready**: 1+ Critical issues

## Usage Examples:

**Full review (default, parallel):**
```
/google-playstore-toolkit:review-app
```

**Run sequentially:**
```
/google-playstore-toolkit:review-app sequential
```

**Specific aspects:**
```
/google-playstore-toolkit:review-app privacy security
/google-playstore-toolkit:review-app manifest
/google-playstore-toolkit:review-app reactnative
```

**Combined:**
```
/google-playstore-toolkit:review-app privacy billing sequential
```

## Agent Descriptions:

**android-manifest-analyzer:**
- AndroidManifest.xml, permissions, intent filters, exported components, target SDK, features

**privacy-compliance-reviewer:**
- Data Safety Section accuracy, data collection audit, consent mechanisms, GDPR/COPPA, account deletion

**material-design-reviewer:**
- Material Design compliance, accessibility, adaptive layouts, edge-to-edge, touch targets

**performance-stability-reviewer:**
- ANR patterns, crash risks, network security config, memory management, background work

**assets-metadata-reviewer:**
- Adaptive icons, app metadata, forbidden terms, version config, signing config, build config

**billing-compliance-reviewer:**
- Google Play Billing Library, subscription compliance, purchase verification, external payment detection

**security-reviewer:**
- Hardcoded secrets, ProGuard/R8, WebView security, cryptography, secure storage, vulnerabilities

**react-native-expo-reviewer:**
- Hermes engine, EAS Build, CodePush/OTA, WebView-only detection, dev artifacts, native module permissions

## Tips:

- **Run early and often**: Review during development, not just before submission
- **Fix critical first**: Critical issues guarantee rejection
- **Re-run after fixes**: Verify issues are resolved
- **Use targeted reviews**: Focus on specific areas when iterating on fixes
- **Check React Native**: For RN/Expo projects, always include the reactnative review

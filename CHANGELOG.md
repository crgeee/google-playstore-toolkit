# Changelog

All notable changes to this plugin will be documented in this file.

## [0.1.0] - 2026-02-21

### Added
- Initial release
- 8 specialized review agents: android-manifest-analyzer, privacy-compliance-reviewer, material-design-reviewer, performance-stability-reviewer, assets-metadata-reviewer, billing-compliance-reviewer, security-reviewer, react-native-expo-reviewer
- `review-app` orchestration command with parallel/sequential modes and targeted aspect selection
- `playstore-requirements` skill with comprehensive reference files
- Reference files covering: common rejection reasons, Android permissions guide, Data Safety Section requirements, React Native/Expo gotchas
- MCP server for Google Play Developer API (not auto-enabled, requires setup)
- Based on Google Play Store policies as of February 2026
- Covers August 2024 target SDK 34 requirement
- Covers December 2023 account deletion requirement
- Covers 2025 edge-to-edge enforcement for API 35

### Policy Coverage
- Google Play Store policies: February 2026
- Reference data last verified: February 2026

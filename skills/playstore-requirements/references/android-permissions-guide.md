# Android Permissions Guide for Play Store

## Permission Categories

### Normal Permissions (auto-granted)
No user prompt required. Include in manifest only.
- `INTERNET` — network access
- `ACCESS_NETWORK_STATE` — check connectivity
- `ACCESS_WIFI_STATE` — WiFi state
- `VIBRATE` — haptic feedback
- `WAKE_LOCK` — prevent sleep
- `RECEIVE_BOOT_COMPLETED` — auto-start
- `FOREGROUND_SERVICE` — foreground services
- `POST_NOTIFICATIONS` (API 33+) — technically dangerous but common

### Dangerous Permissions (runtime request required)
Must request at runtime with rationale. User can deny.

**Location:**
- `ACCESS_FINE_LOCATION` — GPS-level location
- `ACCESS_COARSE_LOCATION` — approximate location
- `ACCESS_BACKGROUND_LOCATION` — location when app not visible (must request separately)

**Camera & Microphone:**
- `CAMERA` — camera access
- `RECORD_AUDIO` — microphone access

**Storage (pre-API 33):**
- `READ_EXTERNAL_STORAGE` — read files
- `WRITE_EXTERNAL_STORAGE` — write files

**Storage (API 33+):**
- `READ_MEDIA_IMAGES` — photo access
- `READ_MEDIA_VIDEO` — video access
- `READ_MEDIA_AUDIO` — music/audio access
- `READ_MEDIA_VISUAL_USER_SELECTED` (API 34+) — partial photo access

**Contacts:**
- `READ_CONTACTS` — read contact list
- `WRITE_CONTACTS` — modify contacts
- `GET_ACCOUNTS` — device accounts

**Phone:**
- `READ_PHONE_STATE` — device identifiers, call state
- `READ_PHONE_NUMBERS` — phone number
- `CALL_PHONE` — initiate calls
- `ANSWER_PHONE_CALLS` — answer incoming

**Calendar:**
- `READ_CALENDAR` — read events
- `WRITE_CALENDAR` — create/edit events

**Body Sensors:**
- `BODY_SENSORS` — heart rate, etc.
- `BODY_SENSORS_BACKGROUND` (API 33+) — background sensor

**Nearby Devices (API 31+):**
- `BLUETOOTH_CONNECT` — connect to BT devices
- `BLUETOOTH_SCAN` — discover BT devices
- `BLUETOOTH_ADVERTISE` — BT advertising
- `NEARBY_WIFI_DEVICES` (API 33+) — WiFi direct/aware

### Restricted Permissions (require declaration form)

These permissions trigger Play Console declaration requirements:

**SMS/MMS:**
- `READ_SMS`, `RECEIVE_SMS`, `SEND_SMS`, `RECEIVE_MMS`, `RECEIVE_WAP_PUSH`
- Must be default SMS handler OR have approved use case
- Declaration form required in Play Console

**Call Log:**
- `READ_CALL_LOG`, `WRITE_CALL_LOG`, `PROCESS_OUTGOING_CALLS`
- Must be default phone/assistant OR have approved use case
- Declaration form required in Play Console

**All Files Access:**
- `MANAGE_EXTERNAL_STORAGE`
- Must demonstrate need to access all files
- File managers, backup apps, antivirus typically approved
- Declaration form required in Play Console

**Package Visibility:**
- `QUERY_ALL_PACKAGES`
- Must justify why filtering with `<queries>` is insufficient
- Launchers, accessibility, security apps typically approved

**Accessibility:**
- `BIND_ACCESSIBILITY_SERVICE`
- Very strict review — must demonstrate accessibility purpose
- Cannot be used for analytics, advertising, or data collection
- Declaration form + video demo required

**VPN:**
- `BIND_VPN_SERVICE`
- Must be primary VPN functionality
- Cannot collect user data through VPN tunnel without disclosure

**Exact Alarms:**
- `SCHEDULE_EXACT_ALARM` (API 31+)
- Must justify need for exact timing vs `setAndAllowWhileIdle`
- `USE_EXACT_ALARM` for alarm clock apps only

## API 33+ Photo Picker

Starting API 33, prefer the system photo picker over storage permissions:

```kotlin
// Preferred approach
val pickMedia = registerForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
    // Handle selected media
}
pickMedia.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
```

Benefits:
- No permission required
- Privacy-friendly (no access to full photo library)
- Google Play prefers this approach

## Background Location

`ACCESS_BACKGROUND_LOCATION` has strict requirements:
1. Must request foreground location first and receive grant
2. Request background separately in a follow-up prompt
3. Must provide clear in-app disclosure explaining why background access is needed
4. Play Console requires justification and may reject

## Foreground Service Types (API 34+)

Foreground services must declare their type in the manifest:

```xml
<service
    android:name=".MyService"
    android:foregroundServiceType="location|camera" />
```

Valid types and required permissions:
| Type | Required Permission |
|------|-------------------|
| `camera` | `CAMERA` |
| `connectedDevice` | Various BT/USB permissions |
| `dataSync` | None specific |
| `health` | `BODY_SENSORS` or health permissions |
| `location` | `ACCESS_FINE_LOCATION` or `ACCESS_COARSE_LOCATION` |
| `mediaPlayback` | None specific |
| `mediaProjection` | `MediaProjection` consent |
| `microphone` | `RECORD_AUDIO` |
| `phoneCall` | `MANAGE_OWN_CALLS` or connection service |
| `remoteMessaging` | None specific |
| `shortService` | None (limited to ~3 min) |
| `specialUse` | Declaration form in Play Console |
| `systemExempted` | System apps only |

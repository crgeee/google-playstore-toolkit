# Data Safety Section Requirements

## Overview

All apps on Google Play must complete the Data Safety Section in Play Console. This section discloses what data the app collects, shares, and how it handles that data. Inaccurate declarations are a top cause of policy enforcement.

## Data Types to Declare

### Location
- **Approximate location** — city-level, coarse location
- **Precise location** — GPS-level, fine location

### Personal Info
- **Name** — first/last name, nickname
- **Email address**
- **User IDs** — account ID, user number
- **Address** — mailing/home address
- **Phone number**
- **Race and ethnicity**
- **Political or religious beliefs**
- **Sexual orientation**
- **Other personal info**

### Financial Info
- **User payment info** — credit card, bank account
- **Purchase history** — in-app purchases, transactions
- **Credit score**
- **Other financial info** — salary, debts

### Health and Fitness
- **Health info** — medical records, symptoms
- **Fitness info** — exercise, steps, heart rate

### Messages
- **Emails** — email content
- **SMS or MMS** — message content
- **Other in-app messages** — chat messages

### Photos and Videos
- **Photos**
- **Videos**

### Audio Files
- **Voice or sound recordings**
- **Music files**
- **Other audio files**

### Files and Docs
- **Files and docs** — any stored files

### Calendar
- **Calendar events** — dates, titles, attendees

### Contacts
- **Contacts** — names, numbers, emails from contact list

### App Activity
- **App interactions** — page views, taps, screen time
- **In-app search history**
- **Installed apps** — app list on device
- **Other user-generated content**
- **Other actions** — gameplay, likes, dialog options

### Web Browsing
- **Web browsing history** — URLs visited in WebView

### App Info and Performance
- **Crash logs** — crash dumps, stack traces
- **Diagnostics** — performance data, battery
- **Other app performance data**

### Device or Other IDs
- **Device or other IDs** — IMEI, build number, advertising ID, Android ID

## Collection vs Sharing

**Data Collection**: Data transmitted off the device. Includes:
- Network requests sending user data to your server
- Third-party SDK data collection (analytics, crash reporting)
- Data saved to external storage accessible by other apps

**Data Sharing**: Data transferred to third parties. Includes:
- Analytics SDKs that send data to third-party servers
- Advertising SDKs sharing user data
- Server-side sharing with partners

**NOT considered collection/sharing:**
- On-device processing only (no network transmission)
- End-to-end encrypted data where you can't access plaintext
- Data sent to a service provider acting on your behalf (with DPA)

## Common Third-Party SDKs and Their Data Collection

### Firebase Analytics
- **Collects**: App interactions, device IDs, crash logs, diagnostics
- **Declare**: App activity (interactions), Device IDs, App info (crash logs, diagnostics)

### Firebase Crashlytics
- **Collects**: Crash logs, device info, app state
- **Declare**: App info (crash logs, diagnostics), Device IDs

### Google AdMob
- **Collects**: Device IDs (advertising ID), approximate location, app interactions
- **Declare**: Device IDs, Location (approximate), App activity

### Facebook SDK
- **Collects**: Device IDs, app interactions, purchase events
- **Declare**: Device IDs, App activity, Financial info (purchase history)

### Adjust / AppsFlyer / Branch
- **Collects**: Device IDs, app interactions, attribution data
- **Declare**: Device IDs, App activity

### Sentry
- **Collects**: Crash logs, device info, breadcrumbs
- **Declare**: App info (crash logs, diagnostics), Device IDs

### RevenueCat
- **Collects**: Purchase history, subscription status
- **Declare**: Financial info (purchase history)

## Account Deletion Requirements

Since December 2023, apps with account creation must provide:

1. **In-app deletion**: Accessible from app settings/profile
2. **Web-based deletion**: A URL for deletion requests (provided in Play Console)
3. **Data deletion**: Must delete or anonymize associated data
4. **Timeline**: Must process deletion within a reasonable timeframe
5. **Confirmation**: Must confirm deletion to the user

Exceptions:
- If data must be retained for legal/compliance reasons, disclose what and why
- Partial deletion acceptable if disclosed (e.g., "transaction records retained for tax purposes")

## Data Handling Declarations

For each data type, declare:

1. **Is data collected?** Yes/No
2. **Is data shared?** Yes/No
3. **Is data encrypted in transit?** Yes/No (should always be Yes — use HTTPS)
4. **Can users request deletion?** Yes/No
5. **Is collection required or optional?** Required/Optional
6. **Purpose of collection**: App functionality, Analytics, Developer communications, Advertising, Fraud prevention, Personalization, Account management

## Compliance Checklist

1. Audit all data collection points in your code
2. Audit all third-party SDK data collection
3. Map each data type to Data Safety categories
4. Complete Data Safety Section in Play Console
5. Ensure privacy policy covers all declared data types
6. Implement account deletion if app has account creation
7. Verify consent mechanisms for optional data collection
8. Review and update after adding new SDKs or features

# Common Google Play Store Rejection Reasons

## 1. Spam and Minimum Functionality

**Policy**: Apps must provide lasting user value and a quality user experience.

**Common causes:**
- WebView-only apps that wrap a mobile website without native functionality
- Apps that duplicate existing apps without adding value
- Apps with placeholder content ("Coming soon", "Under construction")
- Apps that crash on launch or have broken core features

**Actionable checks:**
- Count native screens vs WebView screens — if >80% WebView, high risk
- Verify all advertised features are functional
- Remove placeholder content and TODO markers
- Test all navigation paths for crashes
- Ensure the app provides value beyond what a mobile website offers

## 2. Privacy / Data Safety

**Policy**: Apps must be transparent about data collection, use, and sharing.

**Common causes:**
- Data Safety Section declarations don't match actual data collection
- Missing privacy policy (required for all apps collecting personal data)
- Collecting data without user consent
- Third-party SDKs collecting data not disclosed in Data Safety Section
- Missing account deletion mechanism (required since December 2023)

**Actionable checks:**
- Audit all data collection points (forms, analytics, SDKs)
- Verify each collected data type is declared in Data Safety Section
- Ensure privacy policy is accessible in-app and covers all data practices
- Verify consent dialogs appear before data collection
- If app has account creation, verify account deletion exists
- Check Firebase, Facebook SDK, and other analytics for undisclosed collection

## 3. Deceptive Behavior

**Policy**: Apps must not mislead users about their functionality.

**Common causes:**
- App behavior differs from store listing description
- Hidden functionality that activates after review
- Impersonating another app or company
- Misleading permissions requests

**Actionable checks:**
- Verify app description matches actual functionality
- Ensure all features are visible during review (no time-delayed activation)
- Check app name and branding for similarity to established apps
- Verify permission request dialogs explain why each permission is needed

## 4. Malware and Mobile Unwanted Software

**Policy**: Apps must not harm users, devices, or data.

**Common causes:**
- Requesting dangerous permissions without justification
- Background data collection without user awareness
- Installing additional APKs or downloading executable code
- Accessing device identifiers without disclosure

**Actionable checks:**
- Remove unused dangerous permissions
- Ensure background services have visible notifications (foreground service)
- Do not use `REQUEST_INSTALL_PACKAGES` unless app is a store/installer
- Declare all device identifier access in Data Safety Section

## 5. Restricted Content

**Policy**: Apps must not contain or promote restricted content types.

**Common causes:**
- User-generated content without moderation
- Inappropriate content without age ratings
- Gambling features without proper licensing

**Actionable checks:**
- Implement content reporting/flagging mechanism for UGC
- Set appropriate content ratings in Play Console
- Add content moderation for user-generated content
- Verify gambling features comply with local regulations

## 6. Intellectual Property

**Policy**: Apps must not infringe on intellectual property rights.

**Common causes:**
- Using trademarked names, logos, or branding
- Including copyrighted content (music, images, text)
- Cloning another app's UI/UX design

**Actionable checks:**
- Verify all assets are original or properly licensed
- Check app name doesn't include trademarked terms
- Ensure icons and graphics are original
- Remove any copyrighted content or obtain licenses

## 7. Billing Policy

**Policy**: Digital goods must use Google Play Billing.

**Common causes:**
- Using Stripe/PayPal for digital content purchases
- Missing subscription terms display
- No restore purchases mechanism
- Unacknowledged purchases (refunded after 3 days)

**Actionable checks:**
- Verify all digital purchases use Google Play Billing Library
- Display subscription price, period, and renewal terms before purchase
- Implement purchase acknowledgment within 3 days
- Provide link to Google Play subscription management
- Physical goods/services can use external payment

## 8. Families Policy

**Policy**: Apps targeting children must meet additional requirements.

**Common causes:**
- Collecting personal data from children without parental consent
- Behavioral advertising in children's apps
- Inappropriate content in family-targeted apps
- Not complying with COPPA requirements

**Actionable checks:**
- If app targets children: disable advertising ID collection
- Implement age gate if app has mixed audience
- Remove behavioral advertising from children's experience
- Verify content is appropriate for declared age rating
- Ensure parental consent mechanism for data collection

## 9. Ads Policy

**Policy**: Ads must not interfere with app usability or deceive users.

**Common causes:**
- Full-screen interstitial ads that can't be dismissed
- Ads that mimic system notifications or app content
- Click fraud or ad manipulation
- Ads displayed outside the app

**Actionable checks:**
- Ensure all interstitial ads have clear close button
- Ads should be clearly distinguishable from app content
- Do not trigger ad clicks programmatically
- Ads should only appear within the app UI

## 10. Metadata Policy

**Policy**: Store listing must accurately represent the app.

**Common causes:**
- Keyword stuffing in app description
- Screenshots that don't match app functionality
- Misleading app title or icon
- Using "Android", "Google", or other restricted terms inappropriately

**Actionable checks:**
- App description should be natural language, not keyword lists
- Screenshots should show actual app screens
- App name must be <= 30 characters and not misleading
- Remove restricted terms from title unless officially affiliated
- Verify feature graphic represents actual app functionality

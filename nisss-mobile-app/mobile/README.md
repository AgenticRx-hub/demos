# NIS Mobile — mobile application

**Stack:** Flutter (Dart), one codebase compiled to native ARM for iOS and Android, following Apple Human Interface and Material Design guidelines.

## Modules

```
lib/
  core/            api client (Dio, certificate pinning), auth (OIDC + PKCE), secure storage, error handling, analytics (consented)
  ui/              design system, accessibility (large text, screen readers, contrast)
  features/
    account/       registration, sign-in, MFA, biometrics, devices
    dashboard/     summary, quick actions
    contributions/ history, filters
    payments/      payment session, hosted payment page, receipts
    estimator/     pension estimator (calls /estimates/pension)
    notifications/ inbox, preferences, push (APNs/FCM)
    support/       chat, call-back, FAQs
    content/       announcements, videos, financial tips
    profile/       details and change requests
    claims/        Phase 2: claim forms, document upload, status tracking
```

## Coding standards

- Null-safe Dart, `flutter analyze` with no warnings, effective-Dart lints.
- Every pull request: peer review, unit and widget tests, coverage gate (≥ 85%), SAST and dependency scan.
- No secrets in the app bundle; configuration per environment via signed remote config.
- Releases signed and distributed through App Store Connect and Google Play Console under NISSS's developer accounts.

# Security architecture

Meets RFB §1.1.1 (law and standards), §1.4.3 (security management), §3.1.4 (security software) and §4.2.7 (security testing).

## Controls

| Area | Control | Standard |
|---|---|---|
| Identity and access | OAuth 2.0 / OpenID Connect through NISSS's SaaS IAM; MFA on new devices; biometric unlock bound to device keys; short-lived access tokens with refresh-token rotation | ISO 27002 5.15–5.18, 8.5; MASVS-AUTH |
| Staff access | Role-based access control for administrators, approvers, editors, support agents and auditors; least privilege; quarterly access reviews | ISO 27002 5.15, 8.2 |
| Data in transit | TLS 1.2+ only, HSTS, certificate pinning in the app | ISO 27002 8.24; MASVS-NETWORK |
| Data at rest | AES-256 for databases, backups and object storage; keys in a managed KMS with rotation | ISO 27002 8.24; MASVS-STORAGE |
| On the device | No sensitive data in logs, screenshots blocked on sensitive screens, jailbreak/root detection, secure storage only | MASVS-STORAGE, MASVS-RESILIENCE |
| Payments | Card data entered only on the payment provider's hosted page; app and backend never see card numbers | PCI DSS scope reduction |
| Detection | WAF, intrusion detection, centralised audit logging to a SIEM with alerting | ISO 27002 8.15, 8.16 |
| Secure development | Peer code review, SAST, dependency and secret scanning in CI, mobile binary scanning, DAST before each release | ISO 27002 8.25–8.29; OWASP MASVS L2 |
| Assurance | Independent penetration test before each go-live; no critical or high findings at go-live (RFB §4.2.7.1) | OWASP MASTG |

## Data protection (Barbados Data Protection Act, 2019-29)

- Privacy impact assessment completed in the design stage and approved by NISSS.
- Data minimisation: the app backend stores only preferences, device registrations, notifications, content and audit records; member records stay in NISSS's systems.
- Transparency: in-app privacy notice, consent for optional notifications and analytics, and a request route for access and correction.
- Cross-border hosting: any cloud region outside Barbados is covered by contract terms and safeguards approved by NISSS's Legal and Compliance Unit.
- Breach response: a written incident-response and breach-notification plan with named roles, tested in a tabletop exercise before go-live.

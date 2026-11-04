# NIS Mobile — bid prototype and technical build-out

**Agentic Rx Inc.** · Technology · Digital Solutions · Advisory
Bid for RFP No. **NISSS13/15_2026_02** — *Design and Development of a Mobile Application for the National Insurance and Social Security Service (NISSS), Barbados.*

> **Illustrative prototype.** All names, numbers and amounts are invented sample data. This is not an official NISSS service. Do not enter real personal details.

## Live prototype

Open **[the working prototype](https://agenticrx-hub.github.io/nisss-mobile-app/)** (GitHub Pages). It has eleven views:

| View | What it shows | RFB reference |
|---|---|---|
| [Overview](https://agenticrx-hub.github.io/nisss-mobile-app/#home) | What members can do, and the targets the design meets | — |
| [Mobile app](https://agenticrx-hub.github.io/nisss-mobile-app/#app) | Sign-in with MFA, pay-first dashboard, contributions, payments and receipts, pension estimator, notifications, support chat, information services, account, claims (Phase 2), digital NIS card, clearance certificate | §1.2 |
| [For everyone](https://agenticrx-hub.github.io/nisss-mobile-app/#everyone) | Inclusive design: Simple mode, text size, high contrast, read-aloud, trusted helper, basic-phone service, assisted service, cash payments | WCAG 2.2 AA |
| [Trident ID and privacy](https://agenticrx-hub.github.io/nisss-mobile-app/#trident) | Sign-in with Trident ID, tiered consent (identity, social security, financial, health), security and privacy in every module | §1.4.3, Data Protection Act |
| [Caribbean and diaspora](https://agenticrx-hub.github.io/nisss-mobile-app/#abroad) | Pay from abroad (USD, CAD, GBP), overseas sign-in codes, digital life certificate, CARICOM service record, secure connection check with trusted VPN | Optional add-ons |
| [Integrations](https://agenticrx-hub.github.io/nisss-mobile-app/#int) | Integrations active in the prototype, in the contract, and optional | §2.3, §0.4 |
| [Admin and CMS](https://agenticrx-hub.github.io/nisss-mobile-app/#admin) | Content queue with approval workflow, role-based access, audit trail | §1.4.2, §3.1.7 |
| [Monitoring and transformation](https://agenticrx-hub.github.io/nisss-mobile-app/#ops) | Concurrent users, p95 response against the 3-second target, uptime, digital-transformation scorecard, alerts, usage | §1.4.5, §1.5, §3.1.6 |
| [Architecture and security](https://agenticrx-hub.github.io/nisss-mobile-app/#arch) | Multi-tier architecture and security controls | §1.3, §1.4.3, §3.1.4 |
| [Delivery plan](https://agenticrx-hub.github.io/nisss-mobile-app/#plan) | 70-week timeline mapped to the five NISSS payment milestones | Implementation Schedule |
| [Requirements trace](https://agenticrx-hub.github.io/nisss-mobile-app/#trace) | Each requirement mapped to screen, test type and status | §4 |

## Repository layout

```
index.html                     Working prototype (single file, no build step)
img/                           Photographs used in the prototype
docs/
  architecture.md              Logical, deployment and mobile module architecture
  security.md                  Security architecture, ISO 27001/27002 and OWASP MASVS mapping
  api/openapi.yaml             API contract between the app and the API Gateway (OpenAPI 3.1)
  test-strategy.md             QA framework, test levels, entry/exit criteria, defect SLAs
  delivery-plan.md             Agile plan, sprints, milestones, payment schedule
  requirements-traceability.md RFB requirement → design → test matrix
services/
  estimator/                   Benefits estimator rules engine (rules as data) + unit tests
  contributions/               Contributions and payment rules (idempotent payments) + unit tests
mobile/
  README.md                    Mobile app stack, module breakdown and coding standards
.github/workflows/ci.yml       CI: unit tests with coverage gate, SAST, dependency and secret scanning
```

## Run the tests

No dependencies are needed (Node.js 18 or later):

```bash
node --test --experimental-test-coverage 'services/**/*.test.js'
```

Current result: **12 tests, 12 passing, 100% line and branch coverage** on the rules modules. The RFB requires 80–90% coverage (§4.2.2.1); the CI gate fails any build below 85%.

## Proposed technology stack

| Layer | Technology |
|---|---|
| Mobile (iOS and Android) | Flutter (Dart), one codebase compiled to native ARM; platform design standards (Cupertino/Material); secure storage in Keychain/Keystore; biometrics |
| API Gateway | Managed API gateway with WAF, OAuth 2.0 token validation, rate limiting, TLS 1.2+ |
| Application services | Node.js (TypeScript) services in containers on managed Kubernetes, auto-scaled across two availability zones |
| Integration layer | Adapters to NISSS REST/JSON APIs, message queue with retries, response caching |
| Database | Managed PostgreSQL, encrypted (AES-256), multi-zone replication, point-in-time recovery |
| Identity | NISSS's SaaS IAM (OAuth 2.0 / OpenID Connect), MFA, device binding |
| Observability | OpenTelemetry, metrics dashboards, centralised logs, SIEM alerts |
| DevOps | Git, GitHub Actions CI/CD, Terraform infrastructure as code, blue-green releases with rollback |

All components use open standards. No proprietary licence restricts future enhancement (RFB §3.1.8). Source code and IP transfer to NISSS on payment of each deliverable.

---
© 2026 Agentic Rx Inc. Prepared for the NISSS evaluation panel.

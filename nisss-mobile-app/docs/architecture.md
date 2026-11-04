# Architecture

Meets RFB §1.3 (software and hardware architecture), §2.1.2 (architecture deliverables) and §3.1.

## 1. Logical architecture (five tiers)

| Tier | Responsibility | Key design choices |
|---|---|---|
| 1. Mobile application | iOS and Android user interface, offline-safe caching of non-sensitive content, secure session handling | Flutter single codebase; feature modules; certificate pinning; Keychain/Keystore; no personal data stored unencrypted |
| 2. API Gateway | Single public entry point | WAF, OAuth 2.0 access-token validation, rate limiting per client and per user, request size limits, TLS 1.2+ |
| 3. Application server | Business logic | Stateless services: Accounts, Contributions and Payments, Estimator, Notifications, Support and Content, Claims (Phase 2) |
| 4. Integration layer | Talks to NISSS systems of record | Adapters per NISSS REST API; queue with retry and dead-letter; circuit breakers; read caching with short TTL |
| 5. Database layer | App-owned data only (preferences, device registrations, notifications, CMS content, audit) | Managed PostgreSQL, AES-256, multi-zone replica, point-in-time recovery |

NISSS remains the system of record for contributions, customer records, payments and documents (RFB §0.4.1). The app backend does not duplicate member records; it reads them through NISSS's APIs on demand.

## 2. Deployment architecture (secure cloud)

- **Two availability zones** behind a load balancer; every service runs at least two replicas (redundancy).
- **Horizontal auto-scaling** on CPU and request rate; capacity is pre-scaled before known peaks such as contribution due dates.
- **Disaster recovery:** daily full and continuous incremental backups, replicated to a second region. Targets: RPO 15 minutes, RTO 4 hours, tested before go-live (RFB §4.3.4).
- **Environments:** development, test, staging (production-like, used for UAT and performance tests) and production.

## 3. Sizing for the RFB performance targets (§1.5)

| Target | Design response |
|---|---|
| 10,000 concurrent users | Stateless services + gateway caching; modelled at 20,000 concurrent users (2× headroom) in k6 load tests |
| Mobile and API response < 3 s | p95 budget: gateway 50 ms, service 300 ms, NISSS API call 1,500 ms, network 600 ms; cached reads typically < 500 ms |
| 99.9% uptime | Multi-zone deployment, health checks, blue-green releases, no single points of failure |

## 4. Mobile app module breakdown

`core/` (networking, auth, secure storage, analytics) · `features/account` · `features/dashboard` · `features/contributions` · `features/payments` · `features/estimator` · `features/notifications` · `features/support` · `features/content` · `features/profile` · `features/claims` (Phase 2) · `ui/` (design system, accessibility).

## 5. Integration points (RFB §2.3)

| NISSS system | Interface | Used for |
|---|---|---|
| Contribution and payment databases | REST/JSON via NISSS API Gateway | History, amounts due, payment posting |
| Customer records | REST/JSON | Profile, contact details, change requests |
| Identity (SaaS IAM) | OAuth 2.0 / OpenID Connect | Sign-in, tokens, roles |
| Payment processing platform | Hosted payment page / tokenisation + webhook | Card and bank payments, receipts |
| Document management | REST/JSON, signed upload URLs | Claim documents (Phase 2) |

Exact endpoints are confirmed in the Requirements Validation Report (deliverable 2.1.1).

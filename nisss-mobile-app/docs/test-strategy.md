# Test strategy

Meets RFB §4 (testing and QA). Every test traces to a requirement in `requirements-traceability.md`.

## Test levels

| Level | Scope | Tooling | Exit criteria |
|---|---|---|---|
| Unit | Functions, modules, services | Dart test, Node test runner | ≥ 85% line coverage (RFB: 80–90%); all business rules and critical paths covered |
| Integration | APIs, NISSS interfaces, payment and identity | Contract tests against OpenAPI, sandbox payment provider | All APIs tested; error and fallback paths proven |
| System | End-to-end user workflows | Device farm automation (iOS and Android) | All functional requirements validated |
| Regression | Every release | Automated suite in CI | 100% of critical business functions pass |
| Performance | 10,000+ concurrent users, < 3 s | k6 load and soak tests in staging | p95 < 3 s at 10,000 users; stable at 2× peak |
| Security | OWASP Mobile Top 10, APIs, encryption | SAST, dependency scan, MobSF, OWASP ZAP, independent pen test | No critical or high findings at go-live |
| Usability and accessibility | Navigation, WCAG 2.2 AA | Moderated sessions with NISSS members and staff | Findings triaged and fixed before UAT |
| Compatibility | Supported iOS and Android versions, screen sizes, Wi-Fi and mobile data | Device farm | Pass on the agreed device matrix |
| Data validation | Input validation, cross-system consistency, migrated data | Reconciliation scripts | 100% reconciliation of migrated records |
| Operational acceptance (NISSS-led) | UAT, business process validation, DR test, security compliance | NISSS UAT team with our support | Signed UAT certificate |

## Defect management

Severity follows the RFB (§4.0.2): Critical, High, Medium, Low. Each defect is logged with steps, evidence, build and requirement reference. Critical and High defects block release.

## Deliverables (RFB §4.4)

Test strategy · test plan · test cases and scripts · execution reports · defect logs · performance reports · security reports · UAT sign-off.

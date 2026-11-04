# Requirements traceability (extract)

| RFB ref. | Requirement | Design element | Prototype view | Test |
|---|---|---|---|---|
| 1.2.1.1 | User account management | Accounts service, IAM integration | App › Sign-in, Account | System, security |
| 1.2.1.2 | User dashboard | Dashboard module | App › Home | System, usability |
| 1.2.1.3 | Transaction monitoring, payments and receipts | Contributions and Payments service; payment provider | App › Contributions, Payment, Receipt | Unit (`services/contributions`), integration |
| 1.2.1.4 | Pension estimator (Phase 1) | Estimator rules engine, rules as data | App › Estimator | Unit (`services/estimator`), system |
| 1.2.1.5 | Notifications and alerts | Notifications service, APNs/FCM/SMS/email | App › Notifications | Integration |
| 1.2.1.6 | Customer support | Support service, help-desk integration | App › Support, Chat | System |
| 1.2.1.7 | Information services | Content API | App › Information | System |
| 1.2.1.8 | Content management | CMS with roles, approval, audit | Admin › Content queue | Security (RBAC), system |
| 1.2.2.1 | Core user information services | Profile and change requests | App › Account | System |
| 1.2.2.2 | Communication and notification services | Preferences, campaigns | App › Notifications | Integration |
| 1.2.2.3 | Claims and benefits digitisation | Claims service, document upload | App › Claims | System, UAT |
| 1.3 | Multi-tier, scalable, highly available | Five tiers, two zones | Architecture | Performance, DR |
| 1.4.2 | User administration and access control | Staff RBAC | Admin › Role-based access | Security |
| 1.4.3 | Encryption, RBAC, audit logging, intrusion detection | See `security.md` | Architecture › Security controls | Security, penetration |
| 1.4.4 | Backups, DR, failover | Multi-zone, cross-region backup | Architecture | DR test |
| 1.4.5 | Monitoring and reporting | Observability stack | Monitoring | Performance |
| 1.5 | 10,000 users, < 3 s, 99.9% | Sizing in `architecture.md` §3 | Monitoring | Load and soak tests |

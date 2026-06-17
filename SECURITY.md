# Security Policy

## Supported Versions

We release security patches for the following versions of AURA by SERYTH:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of AURA by SERYTH seriously. If you discover a security vulnerability, please help us protect our users by reporting it responsibly.

### How to Report

**Please DO NOT file a public GitHub issue for security vulnerabilities.**

Instead, please report security vulnerabilities by emailing:

**security@seryth.ai** (placeholder - replace with your actual security contact)

### What to Include

When reporting a vulnerability, please include:

- **Description**: Clear description of the vulnerability
- **Impact**: Potential impact and severity assessment
- **Reproduction Steps**: Detailed steps to reproduce the issue
- **Proof of Concept**: Code samples or screenshots if applicable
- **Environment**: Browser, OS, and version information
- **Suggested Fix**: If you have ideas for remediation (optional)

### Response Timeline

We are committed to addressing security issues promptly:

- **Acknowledgement**: Within **48 hours** of your report
- **Initial Assessment**: Within **5 business days**
- **Fix Target**: Critical vulnerabilities patched within **14 days**
- **Public Disclosure**: After patch is deployed and users have had time to update (minimum 30 days)

### What We Commit To

- Acknowledge your report within 48 hours
- Keep you informed of our progress throughout the remediation process
- Credit you in our security advisories (unless you prefer to remain anonymous)
- Work with you to understand and resolve the issue quickly

### Recognition

We believe in recognizing security researchers who help keep our users safe:

- Public acknowledgement in our security advisories (with your permission)
- Listing in our Hall of Fame for responsible disclosure
- Direct communication with our engineering team

## Security Measures in AURA

### Architecture Security

- **Client-Side Vector Computation**: User preference calculations happen in-browser
- **API Route Protection**: All backend endpoints validate inputs and sanitize outputs
- **No Stored Credentials**: OAuth tokens never stored in localStorage
- **Vector Database Isolation**: Pinecone namespace isolation per deployment

### Input Validation

- **Sanitization**: All user inputs sanitized against XSS attacks ([lib/security/sanitize.ts](lib/security/sanitize.ts))
- **Type Validation**: Zod schemas validate API request/response shapes
- **SQL Injection Prevention**: Parameterized queries via Supabase client (no raw SQL)

### HTTP Security Headers

All responses include:

- `Content-Security-Policy`: Prevents XSS and code injection
- `Strict-Transport-Security`: Forces HTTPS connections
- `X-Frame-Options: DENY`: Prevents clickjacking
- `X-Content-Type-Options: nosniff`: Prevents MIME sniffing
- `Referrer-Policy`: Limits referrer information leakage

See [lib/security/headers.ts](lib/security/headers.ts) for full policy.

### Data Protection

- **No PII Storage**: Email addresses used only for Scent Vault save feature (optional)
- **Local-First**: Quiz results stored in `localStorage`, not server-side
- **Encryption in Transit**: All API calls over HTTPS only
- **Minimal Logging**: API keys and secrets automatically redacted from logs

### Third-Party Dependencies

- **Regular Updates**: Dependencies audited and updated monthly
- **Minimal Surface**: Only essential packages included
- **Verified Sources**: All packages from npm official registry
- **Pinned Versions**: Exact version pinning in `package.json` for reproducibility

## Out of Scope

The following are **not** considered valid security vulnerabilities:

- **Social Engineering**: Phishing, pretexting, or physical attacks against users
- **Third-Party Services**: Vulnerabilities in Pinecone, Supabase, Google Gemini, or other external APIs
- **Denial of Service**: Attacks that overwhelm the system with traffic (cloud provider handles DDoS)
- **Content Injection**: User-generated content displayed only to that user (no public sharing)
- **Rate Limiting Bypasses**: Unless enabling credential stuffing or brute force attacks
- **Clickjacking on Logout**: (Application has no authentication flow)

## Disclosure Policy

- **Coordinated Disclosure**: We follow a 90-day disclosure timeline
- **CVE Assignment**: Critical vulnerabilities will receive CVE identifiers
- **Security Advisories**: Published on GitHub Security Advisories page
- **User Notification**: Users notified via email if action required

## Contact

For general security questions (non-vulnerabilities):

- **GitHub Discussions**: [github.com/anishanandhan/Seryth/discussions](https://github.com/anishanandhan/Seryth/discussions)
- **Email**: security@seryth.ai

For urgent security issues, always use the private email channel listed above.

---

**Last Updated**: June 17, 2026
**Version**: 1.0
**Maintained By**: SERYTH Security Team

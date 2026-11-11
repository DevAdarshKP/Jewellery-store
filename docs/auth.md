# Authentication & Authorization Specification
# Project: Women's Jewellery & Ornaments Catalogue

## 1. Security Architecture
The platform enforces role-based access control protecting the administrative back-office while keeping the customer-facing catalogue open and publicly accessible.

### Security Guarantees:
1. **No Public Registration**: There are no self-registration endpoints for administrators. Accounts are provisioned via administrative CLI or seed scripts.
2. **Password Security**: Passwords are saved exclusively as salted hashes using `bcrypt` (work factor 12).
3. **Session Management**: Authenticated admins receive a cryptographically signed session token stored in an `HttpOnly`, `SameSite=Lax`, `Secure` (in production) cookie (`admin_session`).
4. **Server-Side Enforcement**: All `/admin/*` views and `/api/admin/*` endpoints verify session validity on every incoming request. Client-side checks are never relied upon for authorization.
5. **Brute Force Protection**: Failed login attempts are throttled via IP and account rate limiting (5 attempts per 15-minute window).
6. **Timing Attack Protection**: Timing attacks are mitigated using constant-time comparisons (`crypto.timingSafeEqual`) during credential checks.
7. **Crawler Prohibition**: All `/admin` routes emit `X-Robots-Tag: noindex, nofollow, noarchive` headers.

---

## 2. Authentication Flow
```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant Browser
    participant Middleware as Next.js Middleware
    participant API as /api/auth/login
    participant DB as MongoDB (users)

    Admin->>Browser: Enters email & password
    Browser->>API: POST /api/auth/login { email, password }
    API->>DB: Query user by email
    API->>API: Verify bcrypt hash
    alt Credentials Invalid
        API-->>Browser: 401 Unauthorized ("Invalid credentials")
    else Credentials Valid
        API->>API: Generate signed JWT session token (HS256)
        API-->>Browser: Set-Cookie: admin_session=<token>; HttpOnly; SameSite=Lax; Path=/
        API-->>Browser: 200 OK { user: { name, email, role } }
    end

    Browser->>Middleware: Navigates to /admin/products
    Middleware->>Middleware: Validate admin_session cookie
    alt Token Missing or Invalid
        Middleware-->>Browser: Redirect to /admin/login
    else Token Valid
        Middleware-->>Browser: Allow access to /admin/products
    end
```

---

## 3. Session Payload
```typescript
interface AdminSessionPayload {
  userId: string;
  email: string;
  name: string;
  role: 'ADMIN';
  iat: number;
  exp: number; // 24 hours expiry
}
```


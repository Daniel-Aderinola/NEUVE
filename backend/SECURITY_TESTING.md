# SECURITY TESTING QUICK REFERENCE

## Frontend Changes Required

Update `src/lib/api.ts` and auth context to use `accessToken` instead of `token`:

```typescript
// OLD
localStorage.getItem('token')

// NEW
document.cookie.split(';').find(c => c.trim().startsWith('accessToken='))
// OR just rely on httpOnly cookie (recommended)
```

## Test Cases

### ✅ Password Validation Tests

```
❌ FAIL: "12345" - too short
❌ FAIL: "NoNumbers!" - no numbers
❌ FAIL: "Nospecial123" - no special chars
❌ FAIL: "nouppercase123!" - no uppercase
✅ PASS: "SecurePass123!@"
```

### ✅ Rate Limiting Tests

```bash
# Try 6 rapid logins - 6th should fail with 429
for i in {1..6}; do curl -X POST http://localhost:5001/api/auth/login; done

# Try 4 rapid registrations - 4th should fail with 429
for i in {1..4}; do curl -X POST http://localhost:5001/api/auth/register; done
```

### ✅ CORS Tests

```
✅ ALLOWED: http://localhost:3000
✅ ALLOWED: https://yourdomain.com (via CLIENT_URL)
❌ BLOCKED: https://evil.com
```

### ✅ Token Tests

```
✅ Access token expires: 1 hour
✅ Refresh token expires: 7 days  
✅ Expired token returns: 401 "Token expired"
❌ Invalid token returns: 401 "Invalid token"
```

### ✅ Error Handling

```
Production: {"message":"An error occurred"}
Development: Full stack trace + message
```

## Environment Variables Required

```
JWT_SECRET=<very-long-random-string>
MONGODB_URI=mongodb://...
CLIENT_URL=https://yourdomain.com
NODE_ENV=production
PORT=5001
```

## Start Server

```bash
npm run dev
```

## Verify Security

```bash
# Check CORS headers
curl -i -H "Origin: http://localhost:3000" http://localhost:5001/api/products

# Check security headers
curl -i http://localhost:5001/api/health
# Look for:
# - strict-transport-security
# - x-content-type-options: nosniff
# - x-frame-options: DENY
# - content-security-policy
```

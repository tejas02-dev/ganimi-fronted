# JWT-Based Role Protection Setup

## Overview
The middleware now uses JWT tokens to verify user authentication and extract user roles for access control. Uses the `jose` library which is compatible with Next.js Edge Runtime.

## Environment Variable Required

Add this to your `.env.local` file:

```env
JWT_ACCESS_SECRET=your_jwt_access_secret_here
```

**Important**: This must be the SAME secret that your backend uses to sign JWT tokens.

## How It Works

### 1. Middleware JWT Verification
- The middleware looks for an `access_token` cookie
- Decodes the JWT using the `JWT_ACCESS_SECRET`
- Extracts user role from the token payload
- Blocks access based on role permissions

### 2. Token Structure Expected
Your JWT payload should include:
```json
{
  "id": "user_id",
  "email": "user@example.com", 
  "role": "student|admin|vendor",
  "name": "User Name",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### 3. Cookie Requirements
Your backend should set the JWT as an `access_token` cookie:
```javascript
// Backend example
res.cookie('access_token', jwtToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
});
```

## Access Control Rules

| Route Pattern | Student | Admin | Vendor |
|---------------|---------|-------|--------|
| `/dashboard/student/**` | ✅ | ❌ | ❌ |
| `/dashboard/admin/**` | ❌ | ✅ | ❌ |
| `/dashboard/vendor/**` | ❌ | ❌ | ✅ |
| `/`, `/login`, `/signup` | ✅ | ✅ | ✅ |
| Other authenticated routes | ✅ | ✅ | ✅ |

## Error Handling

The middleware handles these JWT scenarios:
- **Missing token**: Redirects to login
- **Invalid token**: Redirects to login  
- **Expired token**: Redirects to login
- **Wrong role**: Redirects to user's appropriate dashboard

## Testing

1. Ensure `JWT_ACCESS_SECRET` is set in environment
2. Login to get JWT token set as cookie
3. Try accessing different dashboard routes
4. Verify redirects work correctly

## Troubleshooting

### Common Issues:
1. **"JWT_ACCESS_SECRET environment variable is not set"**
   - Add the secret to your `.env.local` file

2. **"Invalid JWT token"**
   - Check that frontend and backend use the same secret
   - Verify token format and signing algorithm

3. **Still redirecting to login after successful login**
   - Check that backend is setting the `access_token` cookie
   - Verify cookie is httpOnly and accessible to middleware

4. **"The edge runtime does not support Node.js 'crypto' module"**
   - This is now fixed by using the `jose` library instead of `jsonwebtoken`

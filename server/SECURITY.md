# Security Documentation

This document outlines the security measures implemented in the RetellAI application.

## Authentication & Authorization

### JWT Tokens
- JWT tokens are used for authentication
- Tokens expire after 30 days
- JWT_SECRET must be set in production (application will exit if not set)
- Tokens are verified on every protected route

### Password Security
- Passwords are hashed using bcrypt with 10 rounds
- Minimum password length: 6 characters
- Maximum password length: 128 characters
- Passwords cannot be retrieved after creation (only shown once at user creation)
- Password change requires current password verification

### Role-Based Access Control (RBAC)
- Admin role: Full access to all users and calls
- User role: Access only to their own calls
- Admin middleware protects admin-only routes

## Input Validation & Sanitization

### Username Validation
- Length: 3-50 characters
- Format: Alphanumeric, underscores, and hyphens only
- Trimmed and sanitized before storage

### Email Validation
- Optional field
- Validated using regex pattern
- Maximum length: 255 characters
- Converted to lowercase before storage

### Password Validation
- Length: 6-128 characters
- Validated on login, password change, and user creation

## Rate Limiting

### Login Endpoint
- Maximum 5 attempts per 15 minutes per IP
- Prevents brute force attacks

### Password Change Endpoint
- Maximum 3 attempts per 15 minutes per IP
- Prevents password enumeration

## CORS Configuration

- CORS is configured to allow specific origins
- Set `ALLOWED_ORIGINS` environment variable (comma-separated list)
- Defaults to localhost in development
- Credentials are enabled for authenticated requests

## Security Headers

The following security headers are set:
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - Enables XSS protection

## Error Handling

- Error messages do not leak sensitive information
- Stack traces are not exposed to clients
- Generic error messages for production
- Detailed errors logged server-side only

## Webhook Security

- Webhook payload validation
- TODO: Add webhook signature verification if Retell provides webhook secrets
- Input sanitization for call IDs

## Database Security

- Sequelize ORM prevents SQL injection
- Parameterized queries used throughout
- User input is validated before database operations

## Environment Variables

Required environment variables:
- `JWT_SECRET` - Must be set in production (strong random string)
- `RETELL_API_KEY` - Retell AI API key
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS` - Database credentials
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins (production)

## Recommendations for Production

1. **Set strong JWT_SECRET**: Use a cryptographically secure random string (at least 32 characters)
2. **Configure CORS**: Set `ALLOWED_ORIGINS` to your production frontend URL(s)
3. **Use HTTPS**: Always use HTTPS in production
4. **Database Security**: 
   - Use strong database passwords
   - Restrict database access to application server only
   - Enable SSL/TLS for database connections
5. **Webhook Security**: Implement webhook signature verification if available
6. **Monitoring**: Set up logging and monitoring for suspicious activities
7. **Regular Updates**: Keep dependencies updated and run `npm audit` regularly
8. **Backup**: Implement regular database backups
9. **Rate Limiting**: Consider implementing additional rate limiting at the infrastructure level
10. **Session Management**: Consider implementing token refresh mechanism

## Security Checklist

- [x] Password hashing (bcrypt)
- [x] JWT authentication
- [x] Role-based access control
- [x] Input validation and sanitization
- [x] Rate limiting on sensitive endpoints
- [x] CORS configuration
- [x] Security headers
- [x] Error message sanitization
- [x] SQL injection prevention (Sequelize)
- [ ] Webhook signature verification (TODO)
- [ ] HTTPS enforcement (infrastructure)
- [ ] Token refresh mechanism (future enhancement)


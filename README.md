DATABASE_URL=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
ADMIN_USERNAME=
# Prefer hashed value from: npx tsx scripts/hash-admin-password.ts 'your-password'
# Plaintext still works. Hashed format is saltHex:hashHex (scrypt).
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
# Optional extra staff (JSON). Passwords may be plaintext or scrypt salt:hash.
# Prefer creating staff from /admin/staff UI instead.
# ADMIN_USERS=[{"username":"editor1","password":"secret","role":"admin"}]
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
SMTP_CC_EMAILS=
# Comma-separated admin recipients are supported
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=
ADMIN_EMAIL=
OPENROUTER_API_KEY=

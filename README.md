# VidyaVriddhi

VidyaVriddhi is a modern education platform built with Next.js for discovery, admissions, and student engagement. The platform supports program discovery, institutional listings, exam and career information, blog/news publishing, admin management, lead capture, and AI-assisted user support.

## Overview

This application is designed for an education brand that wants to:

- Showcase colleges, courses, exams, and study destinations
- Capture student enquiries and service leads
- Manage blog, news, cities, categories, and exam data via admin tools
- Support admissions and career opportunities
- Provide a polished front-end experience with SEO-friendly pages
- Integrate AI-powered chat for student assistance

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Clerk authentication
- Better Auth for admin auth flows
- ImageKit for media uploads and delivery
- Nodemailer for email delivery
- Zod for validation
- OpenRouter API for AI assistant integration

## Core Features

- College and course discovery pages
- Dynamic filters and search experience
- Blog and news content management
- City, country, category, and exam administration
- Student enquiry and service lead forms
- Career and recruitment submission workflows
- AI-powered chat endpoint using OpenRouter
- Image upload and media management via ImageKit
- Admin dashboard for content operations
- Strong server-side validation and environment-based configuration

## Project Structure

```text
.
├── app/                     # Next.js App Router pages and API routes
├── components/              # Reusable UI and page components
├── contexts/                # React context providers
├── hooks/                   # Custom hooks
├── lib/                     # Shared utilities, auth, DB, email, env config
├── prisma/                  # Prisma schema and migrations
├── public/                  # Static assets
├── scripts/                 # Utility scripts
├── providers/               # App providers
├── types/                   # Shared TypeScript types
├── .env.example             # Recommended environment template (create locally)
├── next.config.ts           # Next.js configuration
├── package.json             # Scripts and dependencies
├── prisma.config.ts         # Prisma configuration
├── tsconfig.json            # TypeScript configuration
├── README.md                # Project documentation
└── ...
```

## Requirements

Before getting started, make sure you have:

- Node.js 20 or newer
- npm or pnpm
- PostgreSQL database
- ImageKit account
- Clerk project credentials
- SMTP provider or email relay credentials
- OpenRouter API key for AI chat

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd vidyavriddhi.com
```

2. Install dependencies:

```bash
npm install
```

3. Create your environment file:

```bash
cp .env.example .env
```

If no `.env.example` exists in your setup, use the template below:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/vidyavriddhi"

IMAGEKIT_PUBLIC_KEY="your_imagekit_public_key"
IMAGEKIT_PRIVATE_KEY="your_imagekit_private_key"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_id/"

ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-password-or-hash"
ADMIN_SESSION_SECRET="your-strong-session-secret"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your_email_user"
SMTP_PASSWORD="your_email_password"
SMTP_FROM_EMAIL="noreply@example.com"
SMTP_CC_EMAILS="admin@example.com,ops@example.com"
ADMIN_EMAIL="admin@example.com"

OPENROUTER_API_KEY="your_openrouter_key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Notes:

- `ADMIN_PASSWORD` may be a plaintext password or a hashed value in the format `saltHex:hashHex`.
- For secure admin generation, use:

```bash
npx tsx scripts/hash-admin-password.ts 'your-password'
```

## Database Setup

Generate Prisma client and sync schema:

```bash
npx prisma generate
npx prisma db push
```

If you want initial seed data:

```bash
npm run seed
```

## Running the Application

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm run start
```

## Available Scripts

```bash
npm run dev      # Start Next.js development server
npm run build    # Generate Prisma client and build for production
npm run start    # Run production server
npm run lint     # Run lint checks
npm run seed     # Seed database with initial data
```

## Admin Access

The platform includes admin access patterns for managing educational content and system configuration. Use the environment variables and admin auth setup to boot the admin experience, and prefer hashed passwords for production deployments.

## Email and Media Configuration

### SMTP
Configure `SMTP_*` variables to enable automatic notifications for forms and lead capture.

### ImageKit
Set `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, and `IMAGEKIT_URL_ENDPOINT` to enable media upload and optimization.

## Production Deployment

For production deployment:

1. Use a managed PostgreSQL provider
2. Configure all required environment variables in the hosting platform
3. Run the Prisma generation step during the build pipeline
4. Set up HTTPS and secure cookie/session configuration
5. Use a production-grade SMTP provider
6. Enable proper monitoring and log capture

Recommended deployment targets include Vercel, Railway, Render, or a custom Node.js server environment.

## Security Recommendations

- Never commit `.env` files to version control
- Use strong secrets for `ADMIN_SESSION_SECRET`
- Prefer hashed admin passwords in production
- Restrict admin routes and review access policies regularly
- Validate all uploaded files before storing or serving them
- Use production-grade email and storage providers

## Contributing

Contributions are welcome for bug fixes, performance improvements, and feature enhancements. Before submitting changes:

1. Create a feature branch
2. Run lint checks
3. Verify Prisma and build commands still work
4. Confirm environment variables are documented

## Support

For production issues, contact the project maintainer or internal engineering team with the relevant logs, environment metadata, and reproduction steps.

---

This project is intended for a production education platform setup. Update the environment values and deployment commands to match your actual hosting and infrastructure requirements.

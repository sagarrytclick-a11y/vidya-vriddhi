# Vidya Vridhi

A Next.js application for managing educational institutions with countries, cities, and colleges.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vidya-vridhi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="your_database_connection_string"
   
   # ImageKit Configuration
   IMAGEKIT_PUBLIC_KEY="your_imagekit_public_key"
   IMAGEKIT_PRIVATE_KEY="your_imagekit_private_key"
   IMAGEKIT_URL_ENDPOINT="your_imagekit_url_endpoint"
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Country Management**: Add, edit, and manage countries with flags
- **City Management**: Upload city images via ImageKit, manage features
- **College Management**: Educational institution tracking
- **Image Upload**: Integrated with ImageKit for asset management
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Tailwind CSS, shadcn/ui components
- **File Storage**: ImageKit for image management
- **State Management**: React Query for data fetching
- **TypeScript**: Full TypeScript support

## Project Structure

```
├── app/                 # Next.js app directory
├── components/          # Reusable UI components
├── contexts/           # React contexts
├── hook/               # Custom hooks
├── lib/                # Utility functions
├── prisma/             # Database schema and migrations
└── public/             # Static assets
```

## ImageKit Setup

1. Create an account at [ImageKit.io](https://imagekit.io)
2. Create a new project and get your credentials
3. Add the credentials to your `.env.local` file
4. The app will use ImageKit for all image uploads

## Database Schema

The application uses Prisma with the following main models:
- `Country`: Countries with flags and metadata
- `City`: Cities with images, features, and country relationships
- `College`: Educational institutions with city relationships

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [ImageKit Documentation](https://docs.imagekit.io)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

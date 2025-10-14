# Abstract

> MRU Exchange is a campus-exclusive marketplace where students can buy, sell, and trade resources
> directly tied to MRU life---Parking, Textbooks, Notes, and Tutoring to start.
> This idea is similar to systems like Facebook Marketplace or Kijiji, but unlike these public platforms,
> MRU Exchange is student-only (verified `@mtroyal` email) and emphasizes saftey/trust/convenience.
> The aim is a single, reliable hub for student needs---simpler, safer, cheaper.

--- Proposed by Sahil Grewal & Sebastian Samaco ([Proposal Document](https://drive.google.com/file/d/1FB7ih2Xl4OU3PR1JkczAumkkc5G4f7C8/view?usp=drive_link))

# Project Management

## Status (Project Tab)

The latest project status (issues, pull requests, etc.) can be found [here](https://github.com/orgs/MRU-F2025-COMP3504/projects/4).

## Communication Channel

We use [Discord](https://discord.gg/nRq2tNgDhp) to discuss our project.

## Shared Google Folder

Our shared folder ([link here](https://drive.google.com/drive/folders/1Yfgw8HaCEl7aFqRQXRUGOCotDveUUP4-?usp=drive_link)) contains the following artifacts for each:
- Project milestones
- Weekly status reports
- Weekly team and project meeetings

# Team Members

- Kyle Chen ([@Existenial](https://github.com/Existenial))
- Ramos Jacosalem ([@cjaco906](https://github.com/cjaco906))
- Andrew Krawiec ([@AndrewTries](https://github.com/AndrewTries))
- Mitchell Johnson ([@Mjohn572](https://github.com/Mjohn572))
- Sahil Grewal ([@SahilGrewalx](https://github.com/SahilGrewalx))

---

# 🚀 Getting Started

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Access to the team's Supabase project

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mru-exchange
```

### 2. Environment Configuration

The `dev.env` file is already configured with Supabase credentials. If you need to update them:

```env
VITE_SUPABASE_URL=https://cmhwxquxdciyakrbjcm.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key-here>
```

### 3. Database Setup (One-time setup)

If the database tables haven't been created yet, run the SQL script in your Supabase dashboard:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open the SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Run the script

### 4. Start the Development Server

```bash
# Start Docker container
docker compose -f compose.dev.yml up

# Or rebuild if you made changes
docker compose -f compose.dev.yml up --build
```

The app will be available at:
- **Local:** http://localhost:5173/
- **Network:** http://172.18.0.2:5173/

### 5. Stop the Development Server

```bash
# Stop the container
docker compose -f compose.dev.yml down
```

---

## 📚 Documentation

- **[SUPABASE_SETUP_COMPLETE.md](./SUPABASE_SETUP_COMPLETE.md)** - Complete setup guide and available features
- **[SUPABASE_API_DOCS.md](./SUPABASE_API_DOCS.md)** - Detailed API documentation with examples
- **[supabase-setup.sql](./supabase-setup.sql)** - Database schema and setup script

---

## 🏗️ Project Structure

```
mru-exchange/
├── src/
│   ├── shared/
│   │   ├── api/              # Supabase API functions
│   │   │   ├── auth.api.ts
│   │   │   ├── listings.api.ts
│   │   │   ├── messages.api.ts
│   │   │   ├── favorites.api.ts
│   │   │   └── index.ts
│   │   ├── hooks/            # React hooks for easy integration
│   │   │   ├── useAuth.ts
│   │   │   ├── useListings.ts
│   │   │   ├── useMessages.ts
│   │   │   ├── useFavorites.ts
│   │   │   └── index.ts
│   │   ├── types/            # TypeScript type definitions
│   │   │   └── database.types.ts
│   │   └── utils/
│   │       └── supabase.ts   # Supabase client
│   ├── features/             # Feature-specific components
│   ├── pages/                # Page components
│   ├── App.tsx
│   └── main.tsx
├── dev.env                   # Environment variables
├── supabase-setup.sql        # Database setup script
└── docker-compose files
```

---

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start Vite dev server (local)
npm run d:dev           # Start Docker dev container
npm run dd:dev          # Stop Docker dev container
npm run dr:dev          # Rebuild and start Docker dev

# Production
npm run build           # Build for production
npm run d:prod          # Start Docker production container
npm run dd:prod         # Stop Docker production container
npm run dr:prod         # Rebuild and start Docker production

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
```

---

## 🎯 Features

### Implemented Backend (Supabase)

- ✅ User authentication (@mtroyal.ca only)
- ✅ User profiles
- ✅ Listings CRUD (Create, Read, Update, Delete)
- ✅ Real-time messaging
- ✅ Favorites/bookmarks system
- ✅ Image upload support
- ✅ Category filtering (Parking, Textbooks, Notes, Tutoring)
- ✅ Search functionality
- ✅ Row Level Security (RLS) for data protection

### Categories

- 🅿️ **Parking** - Parking spot rentals/sales
- 📚 **Textbooks** - Course textbooks
- 📝 **Notes** - Study notes and materials
- 👨‍🏫 **Tutoring** - Tutoring services

---

## 💻 Development Guide

### Using the API

#### Option 1: Direct API calls

```typescript
import { authApi, listingsApi } from '@/shared/api';

// Sign in
const { data, error } = await authApi.signIn('user@mtroyal.ca', 'password');

// Get listings
const { data: listings } = await listingsApi.getListings({ 
  category: 'textbooks' 
});
```

#### Option 2: React Hooks (Recommended)

```typescript
import { useAuth, useListings } from '@/shared/hooks';

function MyComponent() {
  const { user, signIn } = useAuth();
  const { listings, loading } = useListings({ category: 'textbooks' });

  // Component logic...
}
```

### Example Implementation

Check out `src/ExampleSupabaseUsage.tsx` for a complete working example of authentication and listings.

---

## 🔒 Security

- Only @mtroyal.ca email addresses can sign up
- Row Level Security (RLS) policies protect all data
- Images are stored in Supabase Storage with proper access controls
- Environment variables are not committed to git

---

## 🐛 Troubleshooting

### Docker Issues

**Problem:** `npm` or `node` not recognized
- **Solution:** Use Docker! No need to install Node.js locally

**Problem:** Docker container won't start
- **Solution:** Make sure Docker Desktop is running

**Problem:** Changes not reflecting
- **Solution:** Rebuild the container: `docker compose -f compose.dev.yml up --build`

### Supabase Issues

**Problem:** Authentication errors
- **Solution:** Check that `dev.env` has the correct Supabase credentials

**Problem:** Database errors
- **Solution:** Make sure you've run the `supabase-setup.sql` script in your Supabase dashboard

**Problem:** RLS policy errors
- **Solution:** Verify the user is authenticated before making requests

---

## 📖 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

---

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request
5. Request review from team members

---

## 📝 License

This project is for educational purposes as part of COMP 3504 at Mount Royal University.

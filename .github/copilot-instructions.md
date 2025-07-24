# Copilot Instructions for PenaApp

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is PenaApp - a circle management application for "上智大学KpopSDGsペナルティキック研究会ドルフィンズ" (Sophia University Kpop SDGs Penalty Kick Research Club Dolphins).

## Tech Stack
- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **State Management**: React hooks + Context API (for now)

## Development Guidelines

### Code Style
- Use TypeScript strictly with proper type definitions
- Follow functional components with React hooks
- Use Tailwind CSS for styling (avoid custom CSS when possible)
- Use descriptive variable and function names in English
- Add JSDoc comments for complex functions

### Component Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, etc.)
│   ├── features/       # Feature-specific components
│   └── layout/         # Layout components
├── lib/                # Utilities and configurations
├── types/              # TypeScript type definitions
└── hooks/              # Custom React hooks
```

### Key Features to Implement
1. **Authentication** - User registration/login with Supabase
2. **Event Management** - Create, view, and join events
3. **Member Profiles** - User profiles with stats and achievements
4. **Gamification** - Points, badges, and rankings
5. **Communication** - Posts, comments, and basic chat
6. **K-pop & PK Content** - Specialized content for the club

### Design System
- **Primary Color**: #0080FF (Dolphin Blue)
- **Accent Color**: #FF6B9D (K-pop Pink)
- **Success Color**: #4CAF50 (SDGs Green)
- **Typography**: Use Tailwind's default font stack
- **Icons**: Use Lucide React icons

### Database Schema Priorities
Start with these core tables:
- users (authentication & profiles)
- events (event management)
- event_participations (who's attending what)
- posts (feed/announcements)
- user_points (gamification)

### Supabase Integration
- Use Supabase client for database operations
- Implement Row Level Security (RLS) policies
- Use real-time subscriptions for live updates where needed
- Handle authentication states properly

### Best Practices
- Keep components small and focused
- Use TypeScript interfaces for all data structures
- Implement proper error handling and loading states
- Use Next.js built-in features (Image, Link, etc.)
- Write clean, readable code with proper comments
- Focus on mobile-first responsive design

### Japanese Content
- All user-facing text should be in Japanese
- Use appropriate keigo (polite Japanese) for formal announcements
- Keep casual tone for social features

Remember: Start simple and iterate. Focus on core functionality first, then add advanced features gradually.

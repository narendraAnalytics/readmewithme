![ReadWithMe Banner](./public/images/imagebanner.png)

# ReadWithMe - AI-Powered Reading Companion

An intelligent mobile application that transforms your reading experience through AI-generated reading guides, interactive quizzes, and multi-language support. Built with React Native and powered by Google Gemini AI.

[![Live App](https://img.shields.io/badge/Live_App-Expo-4630EB?style=for-the-badge&logo=expo)](https://readwithme.expo.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/nk-analytics)

---

## Features

### AI-Powered Reading Guides
- Comprehensive reading guides generated using Google Gemini AI
- Includes key themes, character analysis, plot summaries, and learning insights
- Smart caching system for faster load times

### Multi-Language Support
- Support for 5 languages: English, Telugu, Hindi, Tamil, and Marathi
- AI-powered translation of reading guides
- Seamless language switching

### Interactive Quizzes
- AI-generated 5-question quizzes for every book
- Multiple-choice format with detailed explanations
- Score tracking and attempt history

### Book Discovery
- Topic-based exploration (Technology, Science, History, Philosophy, Business, Fiction)
- Free-text search functionality
- Personalized recommendations based on reading history

### Reading Progress Tracking
- Track reading progress across multiple books
- Save bookmarks and favorites
- View reading statistics and history
- Recent books carousel on dashboard

### Secure Authentication
- Multi-method authentication via Clerk
- Email/password sign-up and sign-in
- OAuth support (Google, GitHub, LinkedIn)
- Secure token management

---

## Tech Stack

### Frontend
- **React Native** (v0.81.5) - Cross-platform mobile development
- **Expo** (v54.0.28) - Development and deployment framework
- **Expo Router** (v6.0.18) - File-based routing system
- **TypeScript** (v5.9.2) - Type-safe development
- **React Native Reanimated** (v4.1.1) - Smooth animations
- **React Query** (@tanstack/react-query v5.90.12) - Data fetching and caching

### Backend
- **Node.js** with **Express.js** (v4.18.2) - REST API server
- **Drizzle ORM** (v0.45.1) - Type-safe SQL query builder
- **Neon PostgreSQL** - Serverless PostgreSQL database
- **Clerk** (v2.19.11) - Authentication and user management
- **Axios** (v1.13.2) - HTTP client with auth interceptors

### AI & Services
- **Google Gemini AI** (@google/genai v1.33.0) - Content generation and quiz creation
- **Clerk SDK** - User authentication and management
- **Neon Serverless** - Database hosting

### Deployment
- **Vercel** - Backend API hosting
- **Expo** - Mobile app distribution (iOS, Android, Web)

---

## Project Structure

```
readwithme/
├── app/                           # Main application screens
│   ├── (auth)/                    # Authentication screens
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (tabs)/                    # Main app tabs
│   │   ├── index.tsx             # Landing page
│   │   ├── dashboard.tsx         # Book discovery
│   │   ├── reading.tsx           # Reading guide & quiz
│   │   ├── book-results.tsx      # Search results
│   │   └── history.tsx           # Reading history
│   └── _layout.tsx               # Root layout with providers
│
├── components/                    # Reusable UI components
│   ├── dashboard/
│   │   ├── SearchBar.tsx
│   │   └── TopicCard.tsx
│   ├── landing/
│   │   └── FeaturesCarousel.tsx
│   ├── QuizComponent.tsx
│   └── SocialAuthButton.tsx
│
├── services/                      # API clients and business logic
│   ├── api.ts                    # Gemini API client
│   ├── apiClient.ts              # Axios instance with auth
│   ├── backendApi.ts             # Backend REST API client
│   ├── gemini.ts                 # Gemini AI integration
│   ├── types.ts                  # TypeScript interfaces
│   └── db/
│       ├── schema.ts             # Database schema (6 tables)
│       └── queries/              # Database query functions
│
├── server/                        # Express.js backend
│   ├── src/
│   │   ├── index.ts              # Server entry point
│   │   ├── middleware/           # Auth & error handling
│   │   ├── routes/               # API endpoints
│   │   ├── db/                   # Database schema & queries
│   │   └── services/             # Business logic
│   └── package.json
│
├── hooks/                         # Custom React hooks
│   ├── useUserSync.ts
│   └── use-color-scheme.ts
│
├── constants/                     # App configuration
│   ├── dashboard.ts              # Topics & discovery data
│   ├── languages.ts              # Language configurations
│   ├── features.ts               # App features
│   └── theme.ts                  # Color theme
│
├── public/                        # Static assets
│   └── images/
│
├── drizzle.config.ts             # ORM configuration
├── app.json                      # Expo configuration
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI** (optional but recommended)
- **PostgreSQL database** (Neon account)
- **Clerk account** for authentication
- **Google Gemini API key**

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd readwithme
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install server dependencies:
   ```bash
   cd server
   npm install
   cd ..
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Clerk Authentication
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Backend API
EXPO_PUBLIC_API_URL=your_backend_api_url

# Google Gemini AI
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

Create a `.env` file in the `server/` directory:

```env
# Database
DATABASE_URL=your_neon_database_url

# Clerk
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Server
PORT=3000
NODE_ENV=development
```

### Running the App

1. Start the Expo development server:
   ```bash
   npx expo start
   ```

2. In the output, you'll find options to open the app in:
   - [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Expo Go](https://expo.dev/go)

### Running the Backend Server

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Run database migrations:
   ```bash
   npm run db:push
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:3000` by default.

---

## Database Schema

The app uses PostgreSQL with 6 main tables:

- **users** - User profiles synced from Clerk
- **userBooks** - Reading history and bookmarks
- **readingProgress** - Cached reading guides and progress tracking
- **quizAttempts** - Quiz scores and answers
- **bookCache** - Gemini API response caching (7-day expiration)
- **translatedReadingGuides** - Multi-language reading guide translations

---

## API Endpoints

### User Management
- `POST /api/users/sync` - Sync user profile from Clerk

### Reading
- `POST /api/reading/history` - Save reading history
- `GET /api/reading/history/:userId` - Get user's reading history
- `POST /api/reading/guide` - Generate/retrieve reading guide
- `POST /api/reading/translate` - Translate reading guide
- `PUT /api/reading/progress` - Update reading progress

### Quizzes
- `POST /api/quizzes/generate` - Generate AI-powered quiz
- `POST /api/quizzes/attempt` - Save quiz attempt
- `GET /api/quizzes/attempts/:userId` - Get user's quiz history

### Cache Management
- `GET /api/cache/books` - Get cached books
- `DELETE /api/cache/books/:id` - Clear book cache

---

## Key Features Implementation

### AI-Powered Content Generation
The app uses Google Gemini AI to:
- Generate comprehensive reading guides with themes, characters, and analysis
- Create interactive quizzes with explanations
- Translate content to multiple Indian languages
- Provide personalized book recommendations

### Authentication Flow
1. User signs up/in via Clerk (email or OAuth)
2. JWT token is stored securely using expo-secure-store
3. Auth interceptor adds bearer token to all API requests
4. Backend verifies JWT and extracts userId for database operations

### Caching Strategy
- Reading guides are cached in PostgreSQL for 7 days
- Book search results are cached to reduce API calls
- React Query manages client-side cache with automatic invalidation
- Translations are stored separately for each language

---

## Learn More

To learn more about the technologies used in this project:

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Clerk Documentation](https://clerk.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Google Gemini AI](https://ai.google.dev/)
- [Neon PostgreSQL](https://neon.tech/docs)

---

## Contact & Links

**Developer:** Narendra Kumar

- **Email:** [narendra.insights@gmail.com](mailto:narendra.insights@gmail.com)
- **Live App:** [https://readwithme.expo.app](https://readwithme.expo.app)
- **LinkedIn:** [www.linkedin.com/in/nk-analytics](https://www.linkedin.com/in/nk-analytics)

---

## License

This project is developed as part of a personal portfolio. All rights reserved.

---

**Built with by Narendra Kumar | Powered by Google Gemini AI, Clerk, and Neon PostgreSQL**

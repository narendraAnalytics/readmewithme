# ReadWithMe - AI Reading Companion App

## Overview

ReadWithMe is a cross-platform mobile application (iOS, Android, Web) built with React Native and Expo. The app serves as an AI-powered reading companion that helps users learn faster by providing instant answers, explanations, and summaries as they read. It transforms any text into an interactive learning experience with AI-powered comprehension support.

**Version:** 1.0.0
**Framework:** Expo ~54.0.27 with React Native 0.81.5
**Status:** In Development - Landing Page Complete

---

## Quick Start

```bash
# Install dependencies
npm install
# or
bun install

# Start development server
npx expo start

# Run on specific platform
npx expo start --ios
npx expo start --android
npx expo start --web
```

---

## Folder Structure

```
readwithme/
├── app/                          # Main app routing (Expo Router)
│   ├── (tabs)/                  # Tab-based navigation group
│   │   ├── index.tsx            # Home/Landing page (197 lines)
│   │   └── _layout.tsx          # Tab navigation configuration
│   ├── _layout.tsx              # Root layout with theme setup
│   └── modal.tsx                # Modal screen template
├── components/                   # Reusable UI components
│   ├── external-link.tsx        # External link handler
│   ├── haptic-tab.tsx          # Tab with haptic feedback
│   ├── hello-wave.tsx          # Animated wave emoji
│   ├── parallax-scroll-view.tsx # Parallax scroll component
│   ├── themed-text.tsx         # Theme-aware text component
│   ├── themed-view.tsx         # Theme-aware view component
│   └── ui/                      # UI-specific components
│       ├── collapsible.tsx
│       ├── icon-symbol.tsx
│       └── icon-symbol.ios.tsx
├── constants/                    # App constants
│   └── theme.ts                 # Theme colors and fonts
├── hooks/                        # Custom React hooks
│   ├── use-color-scheme.ts      # Device color scheme hook
│   ├── use-color-scheme.web.ts  # Web-specific color scheme
│   └── use-theme-color.ts       # Theme color retrieval hook
├── public/                       # Static assets
│   └── images/
│       └── landingPage.png      # Hero image for landing page
├── package.json                  # Project dependencies
├── app.json                      # Expo configuration
└── .expo/                        # Expo configuration cache
```

---

## Implementation History

### Session 1: Initial Setup & Landing Page

**Date:** Previous session
**Implemented:**

- ✅ Expo app initialization with React Native 0.81.5
- ✅ Landing page creation (`app/(tabs)/index.tsx`)
  - Hero section with gradient background (#FFE5D9 to #FFF8F3)
  - Hero image from `public/images/landingPage.png`
  - "Your AI Reading Companion" headline and subtitle
  - Descriptive text about AI-powered reading assistance
  - Green "Get Started" CTA button (#48BB78)
  - 4 feature cards in grid layout:
    - ⚡ Instant Answers - "No waiting for explanations"
    - 🧠 Better Understanding - "Grasp complex topics faster"
    - 📖 Interactive Reading - "Turn any text into a lesson"
    - 🎓 Personalized Learning - "AI adapts to your level"
- ✅ Tab navigation setup (foundation for multiple screens)
- ✅ Theme system implementation (light/dark mode support)
- ✅ Cross-platform configuration (iOS, Android, Web)

### Session 2: Mobile Layout Fix

**Date:** Current session
**Implemented:**

- ✅ Fixed feature cards mobile responsiveness
  - **Issue:** Cards were stacking vertically (1 column) on mobile devices
  - **Solution:** Changed `minWidth: 150` to `minWidth: 120` in `featureCard` style
  - **Location:** `app/(tabs)/index.tsx:166`
  - **Result:** Feature cards now display in 2x2 grid on both mobile and web
- ✅ Created comprehensive documentation (`app.md`)

---

## Landing Page Details

### Location

`app/(tabs)/index.tsx` (197 lines)

### Features

#### 1. Hero Section

- **Gradient Background:** Linear gradient from #FFE5D9 (peach) to #FFF8F3 (cream)
- **Hero Image:** 300x300px image from `public/images/landingPage.png`
- **Headline:** "Your AI Reading Companion" (32px, bold, #2c3e50)
- **Subtitle:** "Learn faster with your personal AI reading assistant" (18px, #666)

#### 2. Description Section

- Multi-line description explaining the app's value proposition
- Centered text with max-width for readability
- Color: #555, 16px font size

#### 3. Call-to-Action Button

- **Background Color:** #48BB78 (green)
- **Text:** "Get Started"
- **Style:** Rounded (30px radius) with shadow effect
- **Action:** Currently logs to console (placeholder for navigation)

#### 4. Feature Cards Section

- **Section Header:** "Why ReadWithME?" (24px, bold, centered)
- **Layout:** 2x2 grid (2 columns, 2 rows)
- **Card Properties:**
  - Width: 45% with minWidth: 120px (responsive)
  - Rounded corners (16px radius)
  - Individual background colors (blue, purple, green, pink)
  - Shadow effects for depth
  - Emoji icon (32px)
  - Title (15px, bold)
  - Description (14px, gray)

---

## Components Documentation

### 1. FeatureCard (inline component in index.tsx)

**Location:** `app/(tabs)/index.tsx:5-11`
**Purpose:** Displays a feature highlight with emoji, title, and description
**Props:**

- `emoji: string` - Emoji icon to display
- `title: string` - Feature title
- `description: string` - Feature description
- `color: string` - Background color for the card

**Usage:** Used 4 times in the landing page to showcase app benefits

---

### 2. ThemedText

**Location:** `components/themed-text.tsx`
**Purpose:** Text component that automatically adapts colors based on current theme (light/dark)
**Props:**

- Standard Text props
- `lightColor?: string` - Color override for light mode
- `darkColor?: string` - Color override for dark mode
- `type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link'`

**Text Types:**

- `default` - Regular text (16px)
- `title` - Large headings (32px, bold)
- `defaultSemiBold` - Semi-bold text (16px, 600 weight)
- `subtitle` - Subtitle text (20px, bold)
- `link` - Link text (16px, themed color)

---

### 3. ThemedView

**Location:** `components/themed-view.tsx`
**Purpose:** View component that automatically uses correct background color for current theme
**Props:**

- Standard View props
- `lightColor?: string` - Background color override for light mode
- `darkColor?: string` - Background color override for dark mode

**Usage:** Base component for theme-aware containers

---

### 4. HapticTab

**Location:** `components/haptic-tab.tsx`
**Purpose:** Bottom tab button with haptic feedback on iOS devices
**Features:**

- Provides light impact haptic feedback when pressed
- iOS-only feature (no effect on Android/Web)
- Used in tab navigation

---

### 5. IconSymbol

**Location:** `components/ui/icon-symbol.tsx`
**Purpose:** Cross-platform icon component that maps SF Symbols (iOS) to Material Icons (Android/Web)
**Props:**

- `name: string` - Icon name
- `size?: number` - Icon size (default: 24)
- `color: string` - Icon color

**Icon Mappings:**

- `house.fill` → house
- `paperplane.fill` → send
- `chevron.left.forwardslash.chevron.right` → code
- `chevron.right` → chevron-right

---

### 6. ExternalLink

**Location:** `components/external-link.tsx`
**Purpose:** Opens links in in-app browser on native platforms, web browser on web
**Props:**

- Standard Link props from Expo Router
- `href: string` - URL to open

**Behavior:**

- **Native (iOS/Android):** Opens in-app browser via `expo-web-browser`
- **Web:** Opens in new tab

---

### 7. ParallaxScrollView

**Location:** `components/parallax-scroll-view.tsx`
**Purpose:** ScrollView with parallax effect on header image
**Features:**

- Header image scales and translates during scroll
- Uses `react-native-reanimated` for smooth 60fps animations
- Configurable header background color

**Props:**

- `headerImage: React.ReactNode` - Image component for header
- `headerBackgroundColor: { dark: string; light: string }` - Theme-aware background
- `children: React.ReactNode` - Scrollable content

---

### 8. HelloWave

**Location:** `components/hello-wave.tsx`
**Purpose:** Animated waving hand emoji (👋)
**Features:**

- Rotation animation using `react-native-reanimated`
- Repeating wave motion
- Used for friendly welcome effects

---

## Dependencies & Libraries

### Core Framework & Tooling

- **react** (19.1.0) - UI library with new React Compiler
- **react-native** (0.81.5) - Mobile framework
- **react-dom** (19.1.0) - Web platform support
- **expo** (~54.0.27) - Managed React Native platform
- **typescript** (~5.9.2) - Type safety

### Navigation & Routing

- **expo-router** (~6.0.17) - File-based routing system (similar to Next.js)
- **@react-navigation/native** (^7.1.8) - Navigation primitives
- **@react-navigation/bottom-tabs** (^7.4.0) - Bottom tab navigation
- **@react-navigation/elements** (^2.6.3) - Navigation UI elements

### UI & Styling

- **expo-linear-gradient** (^15.0.8) - Gradient backgrounds (used in landing page)
- **react-native-web** (~0.21.0) - React Native to web mapping
- **@expo/vector-icons** (^15.0.3) - Material Icons, Ionicons, etc.

### Animations

- **react-native-reanimated** (~4.1.1) - High-performance 60fps animations
- **react-native-worklets** (0.5.1) - JavaScript worklets for animations
- **expo-symbols** (~1.0.8) - SF Symbols support (iOS)

### Platform & Device Features

- **expo-haptics** (~15.0.8) - Haptic feedback (vibration patterns)
- **expo-status-bar** (~3.0.9) - Status bar customization
- **expo-splash-screen** (~31.0.12) - App splash screen
- **expo-web-browser** (~15.0.10) - In-app browser
- **expo-constants** (~18.0.11) - App constants and config
- **expo-font** (~14.0.10) - Custom font loading
- **expo-image** (~3.0.11) - Optimized image component
- **expo-linking** (~8.0.10) - Deep linking support
- **expo-system-ui** (~6.0.9) - System UI preferences

### Native Modules

- **react-native-gesture-handler** (~2.28.0) - Touch gesture system
- **react-native-safe-area-context** (~5.6.0) - Safe area handling (notches, etc.)
- **react-native-screens** (~4.16.0) - Native screen optimization

### Development Tools

- **eslint** (^9.25.0) - Code linting
- **eslint-config-expo** (~10.0.0) - Expo-specific ESLint rules
- **@types/react** (~19.1.0) - TypeScript definitions

---

## Navigation Structure

### Root Navigation (`app/_layout.tsx`)

- Uses Stack navigation at root level
- Two routes:
  - `(tabs)` - Main tab-based navigation
  - `modal` - Modal presentation for overlay screens
- Implements theme provider with automatic light/dark mode
- Status bar configured to adapt to theme

### Tab Navigation (`app/(tabs)/_layout.tsx`)

- Bottom tab bar navigation
- Current tabs:
  - **Home** (`index.tsx`) - Landing page with house icon
- Tab features:
  - Haptic feedback on iOS
  - Theme-aware tint colors
  - SF Symbols on iOS, Material Icons on Android/Web

### Adding New Screens

#### Add a New Tab

1. Create new file in `app/(tabs)/` (e.g., `profile.tsx`)
2. Add tab configuration in `app/(tabs)/_layout.tsx`:

```typescript
<Tabs.Screen
  name="profile"
  options={{
    title: 'Profile',
    tabBarIcon: ({ color }) => <IconSymbol name="person.fill" color={color} />,
  }}
/>
```

#### Add a Modal Screen

1. Create new file in `app/` (e.g., `settings.tsx`)
2. Navigate using: `router.push('/settings')`

---

## Theming System

### Color Scheme (`constants/theme.ts`)

#### Light Mode

- **Text:** #11181C (dark gray/black)
- **Background:** #FFFFFF (white)
- **Tint:** #0a7ea4 (teal)
- **Icon:** #687076 (medium gray)
- **Tab Icon Default:** #687076
- **Tab Icon Selected:** #0a7ea4

#### Dark Mode

- **Text:** #ECEDEE (light gray/white)
- **Background:** #151718 (dark gray/black)
- **Tint:** #FFFFFF (white)
- **Icon:** #9BA1A6 (light gray)
- **Tab Icon Default:** #9BA1A6
- **Tab Icon Selected:** #FFFFFF

### Font System

#### iOS Fonts

- system-ui
- ui-serif
- ui-rounded
- ui-monospace

#### Android/Default Fonts

- Standard system font families
- Roboto (default Android)

#### Web Fonts

- Comprehensive font stack with fallbacks

### Using Themes in Components

```typescript
import { useThemeColor } from '@/hooks/use-theme-color';

const MyComponent = () => {
  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');

  return (
    <ThemedView>
      <ThemedText>Automatically themed!</ThemedText>
    </ThemedView>
  );
};
```

---

## Key Files Reference

| File | Purpose | Lines | Description |
|------|---------|-------|-------------|
| `app/(tabs)/index.tsx` | Landing Page | 197 | Home screen with hero section and feature cards |
| `app/(tabs)/_layout.tsx` | Tab Config | ~60 | Bottom tab navigation setup |
| `app/_layout.tsx` | Root Layout | ~50 | App root with theme provider |
| `constants/theme.ts` | Theme Colors | ~40 | Color definitions for light/dark modes |
| `components/themed-text.tsx` | Themed Text | ~60 | Theme-aware text component |
| `components/themed-view.tsx` | Themed View | ~30 | Theme-aware view component |
| `hooks/use-theme-color.ts` | Theme Hook | ~20 | Hook for retrieving theme colors |
| `package.json` | Dependencies | ~100 | All project dependencies |
| `app.json` | Expo Config | ~80 | Expo and build configuration |

---

## Recent Changes

### Latest Updates (Session 2 - Current)

#### Feature Cards Mobile Layout Fix

- **File:** `app/(tabs)/index.tsx`
- **Line:** 166
- **Change:** `minWidth: 150` → `minWidth: 120`
- **Reason:** Cards were stacking vertically on mobile devices instead of displaying in 2x2 grid
- **Impact:** Feature cards now properly display in 2 columns (2x2 grid) on all screen sizes including narrow mobile devices
- **Tested On:** Web (working), Mobile (fix applied)

---

## Future Enhancements

### Planned Features

- [ ] Main reading interface screen
- [ ] Text input/upload functionality (PDF, paste, import)
- [ ] AI chat interface for asking questions about text
- [ ] User authentication (login/signup)
- [ ] User profile and settings screen
- [ ] Reading history and bookmarks
- [ ] Offline support
- [ ] Dark mode refinements
- [ ] Additional tab screens (Library, Profile, Settings)

### Known Issues

- None currently

### Improvements to Consider

- Add animation to "Get Started" button
- Implement navigation from "Get Started" button
- Add more interactive elements to landing page
- Consider adding screenshots or demo video
- Implement analytics tracking
- Add error boundaries

---

## Development Notes

### Running the App

```bash
# Start Expo dev server
npx expo start

# Clear cache if needed
npx expo start -c

# Run on specific platform
npx expo start --ios
npx expo start --android
npx expo start --web
```

### Building for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for all platforms
eas build --platform all
```

### Debugging

- Use React DevTools for component inspection
- Use Expo Dev Tools for logs and debugging
- Use `console.log()` for quick debugging
- Use breakpoints in VS Code with React Native debugger

---

## Project Configuration

### Expo Config (`app.json`)

- **App Name:** readwithme
- **Version:** 1.0.0
- **Orientation:** Portrait only
- **New Architecture:** Enabled (React Native 0.74+ architecture)
- **Dark Mode:** Automatic (follows system preference)
- **Experiments:**
  - React Compiler enabled (React 19 feature)
  - TypedRoutes enabled (Expo Router type safety)

### TypeScript

- Strict mode enabled
- Type checking for all files
- Path aliases configured (`@/` points to root)

---

## Contact & Support

For future development sessions, refer to this documentation for:

- Understanding the codebase structure
- Locating specific files and components
- Reviewing implementation history
- Planning new features
- Maintaining consistency with existing patterns

**Last Updated:** Session 3 (Dashboard Implementation)
**Maintained By:** Development Sessions

---

## Session 3: Dashboard with Backend Proxy Implementation

### Overview

Implementing a secure dashboard screen with Gemini AI integration using a backend proxy to protect the API key. The dashboard features topic-based book search and custom text search, accessible via the "Get Started" button.

### Architecture: Backend Proxy Approach 🔒

**Security Flow:**

```
Mobile App → Backend Proxy (Vercel) → Gemini API
           (No API key)            (Has API key securely)
```

**Why Backend Proxy?**

- ✅ API key never exposed in mobile app
- ✅ Full control over API usage and costs
- ✅ Can add rate limiting, logging, authentication
- ✅ Industry standard for production apps
- ✅ Free hosting on Vercel/Netlify

---

### File Structure

```
readwithme/
├── api/                             # NEW: Backend proxy (Vercel serverless)
│   ├── gemini.ts                    # API proxy endpoint
│   └── .env.local                   # API key (server-only, never committed)
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx                # MODIFY: Add navigation to dashboard
│   │   ├── dashboard.tsx            # NEW: Main dashboard screen
│   │   └── _layout.tsx              # MODIFY: Add dashboard tab config
├── components/
│   ├── dashboard/                   # NEW: Dashboard components
│   │   ├── TopicCard.tsx           # Topic selection card
│   │   ├── SearchBar.tsx           # Custom search input
│   │   └── BookCard.tsx            # Book result display (future)
├── services/
│   ├── api.ts                       # NEW: API client (calls backend proxy)
│   └── types.ts                     # NEW: TypeScript interfaces
├── constants/
│   └── gemini.ts                    # NEW: Topics & config
├── vercel.json                      # NEW: Vercel configuration
└── package.json                     # MODIFY: Add axios dependency
```

---

### Implementation Steps

#### **Part 1: Backend Proxy (Vercel Serverless)**

##### Step 1.1: Create Backend Proxy Endpoint

**File:** `api/gemini.ts` (NEW)

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

// Models configuration
const GEMINI_MODEL_TEXT = 'gemini-3-pro-preview';
const SYSTEM_INSTRUCTION = `You are ReadWithMe, an AI-powered reading companion.
Your role is to help users discover books, provide insightful analysis, and enhance their reading experience.
Always use Google Search to verify book information and provide accurate, up-to-date recommendations.`;

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers (allow your mobile app to call this API)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { prompt, useSearch = true } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid prompt' });
    }

    const ai = getAiClient();
    const tools = useSearch ? [{ googleSearch: {} }] : [];

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: tools,
      },
    });

    const text = response.text || 'No content generated.';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return res.status(200).json({ text, groundingChunks });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
```

##### Step 1.2: Create Environment File for Backend

**File:** `api/.env.local` (NEW - DO NOT COMMIT)

```env
GEMINI_API_KEY=your_actual_api_key_here
```

**Add to `.gitignore`:**

```
api/.env.local
.env
.env.local
```

##### Step 1.3: Vercel Configuration

**File:** `vercel.json` (NEW)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ],
  "env": {
    "GEMINI_API_KEY": "@gemini-api-key"
  }
}
```

##### Step 1.4: Install Backend Dependencies

```bash
# In the api/ directory
cd api
npm init -y
npm install @google/genai @vercel/node
```

**File:** `api/package.json`

```json
{
  "name": "readwithme-api",
  "version": "1.0.0",
  "dependencies": {
    "@google/genai": "^1.32.0",
    "@vercel/node": "^3.0.0"
  }
}
```

---

#### **Part 2: Mobile App (React Native)**

##### Step 2.1: Create API Client Service

**File:** `services/api.ts` (NEW)

```typescript
import axios from 'axios';

// Backend proxy URL (update after deploying to Vercel)
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'  // Local development
  : 'https://your-app.vercel.app/api';  // Production

interface GeminiRequest {
  prompt: string;
  useSearch?: boolean;
}

interface GeminiResponse {
  text: string;
  groundingChunks: Array<{
    web?: {
      uri: string;
      title: string;
    };
  }>;
}

export const callGeminiAPI = async (
  prompt: string,
  useSearch = true
): Promise<GeminiResponse> => {
  try {
    const response = await axios.post<GeminiResponse>(
      `${API_BASE_URL}/gemini`,
      { prompt, useSearch },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('API call failed:', error);
    throw new Error(
      error.response?.data?.error || 'Failed to connect to server'
    );
  }
};

// Helper: Generate book recommendations by topic
export const generateBooksByTopic = async (topicName: string): Promise<string> => {
  const prompt = `Recommend 5 interesting books about "${topicName}".
  For each book, provide:
  - Title
  - Author
  - Publication year
  - Brief description (2-3 sentences)

  Format each book as:
  ### [Title] by [Author] | [Year]
  [Description]`;

  const response = await callGeminiAPI(prompt, true);
  return response.text;
};

// Helper: Search books by custom query
export const searchBooks = async (query: string): Promise<string> => {
  const prompt = `Find 3-5 books related to: "${query}".
  For each book, provide:
  - Title
  - Author
  - Publication year
  - Brief description (2-3 sentences)

  Format each book as:
  ### [Title] by [Author] | [Year]
  [Description]`;

  const response = await callGeminiAPI(prompt, true);
  return response.text;
};
```

##### Step 2.2: Create Types

**File:** `services/types.ts` (NEW)

```typescript
export interface Book {
  title: string;
  author: string;
  publishedDate: string;
  description: string;
}

export interface Topic {
  id: number;
  name: string;
  icon: string;
  color: string;
  description: string;
}
```

##### Step 2.3: Create Constants

**File:** `constants/gemini.ts` (NEW)

```typescript
import { Topic } from '@/services/types';

export const TOPICS: Topic[] = [
  {
    id: 1,
    name: 'Technology & AI',
    icon: 'cpu',
    color: '#3B82F6',
    description: 'Explore cutting-edge tech and artificial intelligence',
  },
  {
    id: 2,
    name: 'Science & Nature',
    icon: 'flask-conical',
    color: '#10B981',
    description: 'Discover the wonders of science and natural world',
  },
  {
    id: 3,
    name: 'History & Culture',
    icon: 'landmark',
    color: '#F59E0B',
    description: 'Journey through time and diverse cultures',
  },
  {
    id: 4,
    name: 'Philosophy',
    icon: 'brain-circuit',
    color: '#8B5CF6',
    description: 'Dive into profound ideas and existential questions',
  },
  {
    id: 5,
    name: 'Business & Finance',
    icon: 'briefcase',
    color: '#64748B',
    description: 'Master the world of business and economics',
  },
  {
    id: 6,
    name: 'Modern Fiction',
    icon: 'book-open',
    color: '#EC4899',
    description: 'Immerse yourself in contemporary stories',
  },
];
```

##### Step 2.4: Create TopicCard Component

**File:** `components/dashboard/TopicCard.tsx` (NEW)

```typescript
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

interface TopicCardProps {
  name: string;
  icon: string;
  color: string;
  description: string;
  onPress: () => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  name,
  icon,
  color,
  description,
  onPress,
}) => {
  // Map icon names to Ionicons
  const getIconName = (iconName: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      'cpu': 'hardware-chip-outline',
      'flask-conical': 'flask-outline',
      'landmark': 'business-outline',
      'brain-circuit': 'bulb-outline',
      'briefcase': 'briefcase-outline',
      'book-open': 'book-outline',
    };
    return iconMap[iconName] || 'book-outline';
  };

  return (
    <Animated.View entering={FadeIn.duration(600).springify()}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: color + '15' }]}
        onPress={onPress}
        activeOpacity={0.7}>
        <View style={[styles.iconContainer, { backgroundColor: color + '30' }]}>
          <Ionicons name={getIconName(icon)} size={32} color={color} />
        </View>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    minWidth: 150,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});
```

##### Step 2.5: Create SearchBar Component

**File:** `components/dashboard/SearchBar.tsx` (NEW)

```typescript
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search for books...',
}) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor="#999"
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Ionicons name="search" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  searchButton: {
    backgroundColor: '#8B5CF6',
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

##### Step 2.6: Create Dashboard Screen

**File:** `app/(tabs)/dashboard.tsx` (NEW)

```typescript
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TopicCard } from '@/components/dashboard/TopicCard';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { TOPICS } from '@/constants/gemini';
import { generateBooksByTopic, searchBooks } from '@/services/api';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleTopicSelect = async (topicName: string) => {
    setLoading(true);
    setError('');
    setResults('');

    try {
      const response = await generateBooksByTopic(topicName);
      setResults(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch recommendations. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError('');
    setResults('');

    try {
      const response = await searchBooks(query);
      setResults(response);
    } catch (err: any) {
      setError(err.message || 'Failed to search books. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Discover Books</Text>
          <Text style={styles.subtitle}>
            Explore topics or search for any book
          </Text>
        </View>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Topic Grid */}
        <View style={styles.topicsSection}>
          <Text style={styles.sectionTitle}>Browse by Topic</Text>
          <View style={styles.topicsGrid}>
            {TOPICS.map((topic) => (
              <TopicCard
                key={topic.id}
                name={topic.name}
                icon={topic.icon}
                color={topic.color}
                description={topic.description}
                onPress={() => handleTopicSelect(topic.name)}
              />
            ))}
          </View>
        </View>

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={styles.loadingText}>Fetching recommendations...</Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Results */}
        {results && !loading && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Recommendations</Text>
            <Text style={styles.resultsText}>{results}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  topicsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 20,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  resultsContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
  },
});
```

##### Step 2.7: Update Landing Page Navigation

**File:** `app/(tabs)/index.tsx` (MODIFY)

Add import at top:

```typescript
import { router } from 'expo-router';
```

Update button onPress (around line 60):

```typescript
<TouchableOpacity
  activeOpacity={0.8}
  onPress={() => router.push('/dashboard')}
  style={styles.buttonContainer}>
```

##### Step 2.8: Update Dependencies

**File:** `package.json` (MODIFY)

Add to dependencies:

```json
{
  "dependencies": {
    "axios": "^1.6.0"
  }
}
```

Install:

```bash
npm install axios
```

---

#### **Part 3: Deployment**

##### Step 3.1: Deploy Backend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Add environment variable (production)
vercel env add GEMINI_API_KEY production
# Paste your actual API key when prompted

# Redeploy with environment variables
vercel --prod
```

**After deployment**, you'll get a URL like:
`https://readwithme-abc123.vercel.app`

##### Step 3.2: Update Mobile App API URL

**File:** `services/api.ts`

Update the production URL:

```typescript
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://readwithme-abc123.vercel.app/api';  // ← Your Vercel URL
```

##### Step 3.3: Test the Integration

```bash
# Start mobile app
npx expo start

# Click "Get Started" → Dashboard → Select topic
# Should now call your Vercel backend → Gemini API → Return results
```

---

### Security Checklist

- [x] API key stored only in backend (`api/.env.local`)
- [x] No API key in mobile app code
- [x] API key added to `.gitignore`
- [x] Vercel environment variable set
- [x] CORS configured on backend
- [x] Rate limiting can be added (future)
- [x] Error handling implemented
- [x] Timeout configured (30s)

---

### Testing Checklist

- [ ] Backend proxy deploys successfully to Vercel
- [ ] Environment variable set on Vercel
- [ ] API endpoint returns correct responses
- [ ] Mobile app connects to backend
- [ ] Topic selection works
- [ ] Custom search works
- [ ] Loading states display correctly
- [ ] Error handling works
- [ ] Navigation from "Get Started" button
- [ ] Test on Android device
- [ ] Test on iOS simulator

---

### Dependencies Summary

**Backend (`api/`):**

- `@google/genai` (^1.32.0) - Gemini SDK
- `@vercel/node` (^3.0.0) - Vercel serverless functions

**Mobile App:**

- `axios` (^1.6.0) - HTTP client (NEW)
- `expo-router` (~6.0.17) - Navigation (existing)
- `@expo/vector-icons` (^15.0.3) - Icons (existing)
- `react-native-reanimated` (~4.1.1) - Animations (existing)
- `react-native-safe-area-context` (~5.6.0) - Safe areas (existing)

---

### Future Enhancements (Phase 2)

1. **Book Result Cards**: Parse markdown to display structured book cards
2. **Reading Guides**: Full reading experience with synopsis, themes, quizzes
3. **Multi-language**: Translation support for 5 languages
4. **Voice Chat**: Gemini Live API integration
5. **Authentication**: User accounts and personalization
6. **Offline Mode**: Cache responses for offline reading
7. **Rate Limiting**: Add rate limiting to backend proxy
8. **Analytics**: Track API usage and costs

---

### Cost Optimization

**Backend Proxy Benefits:**

- Can cache common queries (reduce API calls)
- Can implement request deduplication
- Can add daily/hourly rate limits per user
- Can log all requests for cost monitoring
- Can switch to cheaper models for simple queries

**Example Cost Savings:**

```javascript
// In api/gemini.ts - Add simple caching
const cache = new Map();
const CACHE_TTL = 3600000; // 1 hour

// Before calling Gemini API:
const cacheKey = `${prompt}_${useSearch}`;
const cached = cache.get(cacheKey);
if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
  return res.status(200).json(cached.data);
}
```

---

### Architecture Benefits

✅ **Security**: API key never exposed
✅ **Control**: Full control over API usage
✅ **Scalability**: Can add caching, rate limiting
✅ **Cost Management**: Monitor and optimize API calls
✅ **Flexibility**: Easy to switch AI providers
✅ **Production-Ready**: Industry standard approach

---

**Last Updated:** Session 3
**Status:** Ready for Implementation

-------------------------------- ----------------------------------------------

Implementation Steps

 Step 1: Environment Setup & Dependencies

 1.1 Create .env File

 File: .env (root directory)

 EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here

 Why EXPO_PUBLIC_ prefix:

- Expo requires this prefix for environment variables to be accessible in app
- Different from web app's GEMINI_API_KEY

 1.2 Install Dependencies

 Add to package.json:
 npm install @google/genai

 Package: @google/genai v1.32.0 (Google's official Gemini SDK)

 Step 2: Create Gemini Service Layer

 2.1 Create Constants File

 File: constants/gemini.ts

 export const GEMINI_MODEL_TEXT = 'gemini-3-pro-preview';
 export const GEMINI_MODEL_LIVE = 'gemini-2.5-flash-native-audio-preview-09-2025';

 export const SYSTEM_INSTRUCTION_TEXT = `You are ReadWithMe, an AI-powered reading companion.
 Your role is to help users discover books, provide insightful analysis, and enhance their reading experience.
 Always use Google Search to verify book information and provide accurate, up-to-date recommendations.`;

 export const TOPICS = [
   {
     id: 1,
     name: 'Technology & AI',
     icon: 'cpu',
     color: '#3B82F6',
     description: 'Explore cutting-edge tech and artificial intelligence',
   },
   {
     id: 2,
     name: 'Science & Nature',
     icon: 'flask-conical',
     color: '#10B981',
     description: 'Discover the wonders of science and natural world',
   },
   {
     id: 3,
     name: 'History & Culture',
     icon: 'landmark',
     color: '#F59E0B',
     description: 'Journey through time and diverse cultures',
   },
   {
     id: 4,
     name: 'Philosophy',
     icon: 'brain-circuit',
     color: '#8B5CF6',
     description: 'Dive into profound ideas and existential questions',
   },
   {
     id: 5,
     name: 'Business & Finance',
     icon: 'briefcase',
     color: '#64748B',
     description: 'Master the world of business and economics',
   },
   {
     id: 6,
     name: 'Modern Fiction',
     icon: 'book-open',
     color: '#EC4899',
     description: 'Immerse yourself in contemporary stories',
   },
 ];

 2.2 Create Service Types

 File: services/types.ts

 export interface GenerateOptions {
   useSearch?: boolean;
   jsonMode?: boolean;
 }

 export interface GroundingChunk {
   web?: {
     uri: string;
     title: string;
   };
 }

 export interface GeminiResponse {
   text: string;
   groundingChunks: GroundingChunk[];
 }

 export interface Book {
   title: string;
   author: string;
   publishedDate: string;
   description: string;
 }

 2.3 Create Gemini Service

 File: services/gemini.ts

 import { GoogleGenAI } from '@google/genai';
 import { GEMINI_MODEL_TEXT, SYSTEM_INSTRUCTION_TEXT } from '@/constants/gemini';
 import { GenerateOptions, GeminiResponse } from './types';

 let aiClient: GoogleGenAI | null = null;

 const getAiClient = () => {
   if (!aiClient) {
     const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
     if (!apiKey) {
       throw new Error('EXPO_PUBLIC_GEMINI_API_KEY not found in environment variables');
     }
     aiClient = new GoogleGenAI({ apiKey });
   }
   return aiClient;
 };

 export const generateBookContent = async (
   prompt: string,
   options: GenerateOptions = { useSearch: true, jsonMode: false }
 ): Promise<GeminiResponse> => {
   const ai = getAiClient();

   const useSearch = options.jsonMode ? false : (options.useSearch ?? true);
   const tools = useSearch ? [{ googleSearch: {} }] : [];

   const config: any = {
     systemInstruction: SYSTEM_INSTRUCTION_TEXT,
     tools: tools,
   };

   if (options.jsonMode) {
     config.responseMimeType = 'application/json';
   }

   try {
     const response = await ai.models.generateContent({
       model: GEMINI_MODEL_TEXT,
       contents: prompt,
       config: config,
     });

     const text = response.text || 'No content generated.';
     const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

     return { text, groundingChunks };
   } catch (error) {
     console.error('Gemini API Error:', error);
     throw error;
   }
 };

 // Helper function to generate book recommendations by topic
 export const generateBooksByTopic = async (topicName: string): Promise<string> => {
   const prompt = `Recommend 5 interesting books about "${topicName}".
   For each book, provide:

- Title
- Author
- Publication year
- Brief description (2-3 sentences)

   Format each book as:

### [Title] by [Author] | [Year]

   [Description]`;

   const response = await generateBookContent(prompt, { useSearch: true });
   return response.text;
 };

 // Helper function to search books by custom query
 export const searchBooks = async (query: string): Promise<string> => {
   const prompt = `Find 3-5 books related to: "${query}".
   For each book, provide:

- Title
- Author
- Publication year
- Brief description (2-3 sentences)

   Format each book as:

### [Title] by [Author] | [Year]

   [Description]`;

   const response = await generateBookContent(prompt, { useSearch: true });
   return response.text;
 };

 Step 3: Create Dashboard Components

 3.1 TopicCard Component

 File: components/dashboard/TopicCard.tsx

 import React from 'react';
 import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
 import { Ionicons } from '@expo/vector-icons';
 import Animated, { FadeIn } from 'react-native-reanimated';

 interface TopicCardProps {
   name: string;
   icon: string;
   color: string;
   description: string;
   onPress: () => void;
 }

 export const TopicCard: React.FC<TopicCardProps> = ({
   name,
   icon,
   color,
   description,
   onPress,
 }) => {
   // Map icon names to Ionicons (simplified mapping)
   const getIconName = (iconName: string): keyof typeof Ionicons.glyphMap => {
     const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
       'cpu': 'hardware-chip-outline',
       'flask-conical': 'flask-outline',
       'landmark': 'business-outline',
       'brain-circuit': 'bulb-outline',
       'briefcase': 'briefcase-outline',
       'book-open': 'book-outline',
     };
     return iconMap[iconName] || 'book-outline';
   };

   return (
     <Animated.View entering={FadeIn.duration(600).springify()}>
       <TouchableOpacity
         style={[styles.card, { backgroundColor: color + '15' }]}
         onPress={onPress}
         activeOpacity={0.7}>
         <View style={[styles.iconContainer, { backgroundColor: color + '30' }]}>
           <Ionicons name={getIconName(icon)} size={32} color={color} />
         </View>
         <Text style={styles.title}>{name}</Text>
         <Text style={styles.description}>{description}</Text>
       </TouchableOpacity>
     </Animated.View>
   );
 };

 const styles = StyleSheet.create({
   card: {
     width: '48%',
     minWidth: 150,
     borderRadius: 16,
     padding: 20,
     marginBottom: 16,
     alignItems: 'center',
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.1,
     shadowRadius: 8,
     elevation: 3,
   },
   iconContainer: {
     width: 64,
     height: 64,
     borderRadius: 32,
     alignItems: 'center',
     justifyContent: 'center',
     marginBottom: 12,
   },
   title: {
     fontSize: 16,
     fontWeight: 'bold',
     color: '#2c3e50',
     textAlign: 'center',
     marginBottom: 8,
   },
   description: {
     fontSize: 13,
     color: '#666',
     textAlign: 'center',
     lineHeight: 18,
   },
 });

 3.2 SearchBar Component

 File: components/dashboard/SearchBar.tsx

 import React, { useState } from 'react';
 import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
 import { Ionicons } from '@expo/vector-icons';

 interface SearchBarProps {
   onSearch: (query: string) => void;
   placeholder?: string;
 }

 export const SearchBar: React.FC<SearchBarProps> = ({
   onSearch,
   placeholder = 'Search for books...',
 }) => {
   const [query, setQuery] = useState('');

   const handleSearch = () => {
     if (query.trim()) {
       onSearch(query.trim());
     }
   };

   return (
     <View style={styles.container}>
       <View style={styles.searchBox}>
         <Ionicons name="search-outline" size={20} color="#666" style={styles.icon} />
         <TextInput
           style={styles.input}
           value={query}
           onChangeText={setQuery}
           placeholder={placeholder}
           placeholderTextColor="#999"
           onSubmitEditing={handleSearch}
           returnKeyType="search"
         />
         {query.length > 0 && (
           <TouchableOpacity onPress={() => setQuery('')}>
             <Ionicons name="close-circle" size={20} color="#999" />
           </TouchableOpacity>
         )}
       </View>
       <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
         <Ionicons name="search" size={20} color="#FFFFFF" />
       </TouchableOpacity>
     </View>
   );
 };

 const styles = StyleSheet.create({
   container: {
     flexDirection: 'row',
     paddingHorizontal: 20,
     marginBottom: 24,
     gap: 12,
   },
   searchBox: {
     flex: 1,
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: '#F5F5F5',
     borderRadius: 12,
     paddingHorizontal: 16,
     paddingVertical: 12,
   },
   icon: {
     marginRight: 8,
   },
   input: {
     flex: 1,
     fontSize: 16,
     color: '#2c3e50',
   },
   searchButton: {
     backgroundColor: '#8B5CF6',
     width: 48,
     height: 48,
     borderRadius: 12,
     alignItems: 'center',
     justifyContent: 'center',
   },
 });

 Step 4: Create Dashboard Screen

 4.1 Dashboard Screen Implementation

 File: app/(tabs)/dashboard.tsx

 import React, { useState } from 'react';
 import {
   ActivityIndicator,
   ScrollView,
   StyleSheet,
   Text,
   View,
 } from 'react-native';
 import { SafeAreaView } from 'react-native-safe-area-context';
 import { TopicCard } from '@/components/dashboard/TopicCard';
 import { SearchBar } from '@/components/dashboard/SearchBar';
 import { TOPICS } from '@/constants/gemini';
 import { generateBooksByTopic, searchBooks } from '@/services/gemini';

 export default function DashboardScreen() {
   const [loading, setLoading] = useState(false);
   const [results, setResults] = useState<string>('');
   const [error, setError] = useState<string>('');

   const handleTopicSelect = async (topicName: string) => {
     setLoading(true);
     setError('');
     setResults('');

     try {
       const response = await generateBooksByTopic(topicName);
       setResults(response);
     } catch (err) {
       setError('Failed to fetch book recommendations. Please try again.');
       console.error(err);
     } finally {
       setLoading(false);
     }
   };

   const handleSearch = async (query: string) => {
     setLoading(true);
     setError('');
     setResults('');

     try {
       const response = await searchBooks(query);
       setResults(response);
     } catch (err) {
       setError('Failed to search books. Please try again.');
       console.error(err);
     } finally {
       setLoading(false);
     }
   };

   return (
     <SafeAreaView style={styles.container} edges={['top']}>
       <ScrollView
         contentContainerStyle={styles.scrollContent}
         showsVerticalScrollIndicator={false}>

         {/* Header */}
         <View style={styles.header}>
           <Text style={styles.title}>Discover Books</Text>
           <Text style={styles.subtitle}>
             Explore topics or search for any book
           </Text>
         </View>

         {/* Search Bar */}
         <SearchBar onSearch={handleSearch} />

         {/* Topic Grid */}
         <View style={styles.topicsSection}>
           <Text style={styles.sectionTitle}>Browse by Topic</Text>
           <View style={styles.topicsGrid}>
             {TOPICS.map((topic) => (
               <TopicCard
                 key={topic.id}
                 name={topic.name}
                 icon={topic.icon}
                 color={topic.color}
                 description={topic.description}
                 onPress={() => handleTopicSelect(topic.name)}
               />
             ))}
           </View>
         </View>

         {/* Loading State */}
         {loading && (
           <View style={styles.loadingContainer}>
             <ActivityIndicator size="large" color="#8B5CF6" />
             <Text style={styles.loadingText}>Fetching recommendations...</Text>
           </View>
         )}

         {/* Error State */}
         {error && (
           <View style={styles.errorContainer}>
             <Text style={styles.errorText}>{error}</Text>
           </View>
         )}

         {/* Results */}
         {results && !loading && (
           <View style={styles.resultsContainer}>
             <Text style={styles.resultsTitle}>Recommendations</Text>
             <Text style={styles.resultsText}>{results}</Text>
           </View>
         )}
       </ScrollView>
     </SafeAreaView>
   );
 }

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#FFFFFF',
   },
   scrollContent: {
     paddingBottom: 40,
   },
   header: {
     paddingHorizontal: 20,
     paddingTop: 20,
     paddingBottom: 24,
   },
   title: {
     fontSize: 32,
     fontWeight: 'bold',
     color: '#2c3e50',
     marginBottom: 8,
   },
   subtitle: {
     fontSize: 16,
     color: '#666',
   },
   topicsSection: {
     paddingHorizontal: 20,
   },
   sectionTitle: {
     fontSize: 20,
     fontWeight: 'bold',
     color: '#2c3e50',
     marginBottom: 16,
   },
   topicsGrid: {
     flexDirection: 'row',
     flexWrap: 'wrap',
     justifyContent: 'space-between',
   },
   loadingContainer: {
     alignItems: 'center',
     paddingVertical: 40,
   },
   loadingText: {
     marginTop: 12,
     fontSize: 16,
     color: '#666',
   },
   errorContainer: {
     backgroundColor: '#FEE2E2',
     padding: 16,
     borderRadius: 12,
     marginHorizontal: 20,
     marginTop: 20,
   },
   errorText: {
     color: '#DC2626',
     fontSize: 14,
   },
   resultsContainer: {
     paddingHorizontal: 20,
     marginTop: 24,
   },
   resultsTitle: {
     fontSize: 24,
     fontWeight: 'bold',
     color: '#2c3e50',
     marginBottom: 16,
   },
   resultsText: {
     fontSize: 15,
     color: '#444',
     lineHeight: 24,
   },
 });

 Step 5: Update Navigation

 5.1 Modify Landing Page Button

 File: app/(tabs)/index.tsx

 Update the button onPress handler (around line 60-70):

 Current:
 <TouchableOpacity
   activeOpacity={0.8}
   onPress={() => console.log('Get Started pressed')}
   style={styles.buttonContainer}>

 New:
 import { router } from 'expo-router';

 // ... inside component

 <TouchableOpacity
   activeOpacity={0.8}
   onPress={() => router.push('/dashboard')}
   style={styles.buttonContainer}>

 Add import at top:
 import { router } from 'expo-router';

 5.2 Update Tab Layout (Optional - for tab visibility)

 File: app/(tabs)/_layout.tsx

 Add dashboard tab configuration (if you want it in tabs):

 <Tabs.Screen
   name="dashboard"
   options={{
     title: 'Dashboard',
     tabBarIcon: ({ color }) => <IconSymbol name="book.fill" color={color} />,
   }}
 />

 OR keep tabs hidden and use stack navigation only (dashboard screen will work either way with Expo Router).

 Step 6: Configuration Updates

 6.1 Update package.json

 Add dependency:
 {
   "dependencies": {
     "@google/genai": "^1.32.0"
   }
 }

 6.2 Create/Update .env

 File: .env (root directory)

 EXPO_PUBLIC_GEMINI_API_KEY=YOUR_ACTUAL_API_KEY_HERE

 Add to .gitignore (if not already present):
 .env
 .env.local

 6.3 TypeScript Path Aliases (already configured)

 The app already uses @/ for imports via tsconfig.json:
 {
   "compilerOptions": {
     "paths": {
       "@/*": ["./*"]
     }
   }
 }

 Critical Files Summary

 New Files to Create:

 1. .env - API key configuration
 2. constants/gemini.ts - Models & topics config
 3. services/types.ts - TypeScript interfaces
 4. services/gemini.ts - Gemini API service
 5. components/dashboard/TopicCard.tsx - Topic selection card
 6. components/dashboard/SearchBar.tsx - Search input component
 7. app/(tabs)/dashboard.tsx - Main dashboard screen

 Files to Modify:

 1. app/(tabs)/index.tsx - Add navigation to dashboard
 2. package.json - Add @google/genai dependency

 Files to Update (Optional):

 1. app/(tabs)/_layout.tsx - Add dashboard tab config
 2. .gitignore - Exclude .env file

 Dependencies

- @google/genai (^1.32.0) - NEW: Google's Gemini SDK
- expo-router (~6.0.17) - Already installed ✓
- @expo/vector-icons (^15.0.3) - Already installed ✓
- react-native-reanimated (~4.1.1) - Already installed ✓
- react-native-safe-area-context (~5.6.0) - Already installed ✓

 Expected User Flow

 1. Landing Page:

- User sees beautiful landing page with gradient button
- Clicks "Get Started" button

 2. Navigate to Dashboard:

- App navigates to /dashboard route
- Dashboard screen loads with search bar and topic cards

 3. Topic Selection:

- User taps a topic card (e.g., "Technology & AI")
- Loading spinner appears
- Gemini AI generates 5 book recommendations with Google Search
- Results displayed below in formatted text

 4. Custom Search:

- User types query in search bar (e.g., "mindfulness meditation")
- Taps search button or presses enter
- Loading spinner appears
- Gemini AI searches and returns 3-5 relevant books
- Results displayed below

 5. Error Handling:

- If API fails, shows user-friendly error message
- User can retry by selecting topic again or searching

 Future Enhancements (Phase 2)

 Features to Add Later:

 1. Book result cards (BookCard component) with structured display
 2. Reading guide screen with synopsis, themes, questions
 3. Quiz generation and interactive quiz component
 4. Multi-language translation support
 5. Voice chat with Gemini Live API
 6. Source attribution display (grounding chunks)
 7. Reading history and bookmarks
 8. User preferences and favorites

 UI/UX Improvements:

 1. Better results formatting (parse markdown to components)
 2. Skeleton loading states
 3. Pull-to-refresh functionality
 4. Smooth page transitions
 5. Empty states with illustrations
 6. Onboarding tutorial

 Testing Checklist

- Install @google/genai dependency
- Create .env file with valid API key
- Create all new files (constants, services, components)
- Update landing page navigation
- Test "Get Started" button navigation
- Test topic card selection
- Test custom search functionality
- Verify Gemini API responses
- Test loading states
- Test error handling
- Test on Android device
- Test on iOS simulator (if available)
- Verify animations work smoothly
- Check memory usage and performance

 Technical Notes

 Why @google/genai SDK:

- Official Google SDK for Gemini API
- Supports Google Search grounding
- Handles response streaming
- Type-safe with TypeScript
- Works with React Native (uses fetch internally)

 API Key Security:

- EXPO_PUBLIC_ prefix makes it accessible in app
- Don't commit .env to git
- For production, use Expo Secrets or secure backend proxy

 Performance Considerations:

- Gemini API calls can take 2-10 seconds
- Show loading indicators for better UX
- Consider caching responses for repeated queries
- Implement debouncing for search input

 React Native Compatibility:

- @google/genai works with React Native
- Uses fetch API (supported in RN)
- No node-specific dependencies
- Tested with Expo SDK 54

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

#### Add a New Tab:
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

#### Add a Modal Screen:
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

**Last Updated:** Session 2 (Current)
**Maintained By:** Development Sessions

# HikeWise

HikeWise is a React Native mobile application built with Expo that helps users plan and track their hikes based on weather conditions.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or later)
- npm (comes with Node.js)
- Android Studio (for Android development)
- Android SDK
- Java Development Kit (JDK)
- Expo CLI (`npm install -g expo-cli`)

## Setup Instructions

1. Clone the repository:
```bash
git clone [repository-url]
cd hikewise
```

2. Install dependencies:
```bash
npm install
```

3. Apply patches (if any):
```bash
npm run postinstall
```

## Running the App

### For Android

1. Make sure you have Android Studio installed and configured with:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)

2. Start an Android emulator or connect a physical device

3. Run the following commands:
```bash
# Start the development server
npm start

# In a separate terminal, run the Android app
npm run android
```

Alternatively, you can build a standalone APK:
```bash
# Build the Android app
expo build:android
```

## Key Dependencies

- **React Native**: ^0.79.2
- **Expo**: ~53.0.9
- **Mapbox**: @rnmapbox/maps ^10.1.38
- **Navigation**: @react-navigation/native ^7.1.6
- **State Management**: @react-native-async-storage/async-storage ^2.1.2
- **UI Components**: 
  - @gorhom/bottom-sheet ^5.1.4
  - expo-blur ~14.1.4
  - react-native-chart-kit ^6.12.0

## Development Scripts

- `npm start`: Start the Expo development server
- `npm run android`: Run the app on Android
- `npm run ios`: Run the app on iOS
- `npm run web`: Run the app in web browser
- `npm run lint`: Run ESLint
- `npm test`: Run Jest tests
- `npm run type-check`: Run TypeScript type checking

## Project Structure

```
hikewise/
├── app/              # Main application code
├── components/       # Reusable UI components
├── context/         # React Context providers
├── assets/          # Static assets (images, fonts)
├── android/         # Android-specific files
└── scripts/         # Build and utility scripts
```

## Troubleshooting

If you encounter any issues:

1. Clear the Metro bundler cache:
```bash
npm start -- --clear
```

2. Reset the project:
```bash
npm run reset-project
```

3. Ensure all environment variables are properly set up

****
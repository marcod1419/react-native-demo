# Shopify Storefront Product Browser

## How to Run

1. **Install dependencies**: `npm install` or `yarn install`
2. **iOS setup** (Mac only):
   - `cd ios && pod install && cd ..`
3. **Run Metro bundler**: `npx react-native start` or `npm start`
4. **Start app**:
   - iOS: `npx react-native run-ios` or `npm run ios`
   - Android: `npx react-native run-android` or `npm run android`

## Overview

This is a React Native + TypeScript application that displays a grid of products, allows viewing product details (with variant selection), and manages a cart using React Context. Navigation is handled via React Navigation (bottom tabs + native stack).

### Key Features

- **2-column grid** on the main product screen
- **Product details** screen with variant listing and add-to-cart functionality
- **Cart screen** with item removal and quantity management
- **React Context** for cart state
- **Types** for all navigation routes and product data
- Basic **Jest** tests for cart logic with **React Testing Library** for rendering

### Architecture Choices

- **Context-based cart** keeps logic centralized. Due to the simplicity of the
  app, React's Context API is sufficient for managing global state.
- **React Navigation** organizes screens (bottom tabs for “Collection” and “Cart”, with a stack for “ProductList” and “ProductDetails”).
- **TypeScript** ensures type safety.
- **Avoids Third-Party Libraries Where Possible** to keep the demonstration simple and lightweight.

Enjoy, and thank you for checking it out!

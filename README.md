# Shopify Storefront Product Browser

## How to Run

1. **Install dependencies**: `npm install` or `yarn install`
2. **iOS setup** (Mac only):
   - `cd ios && pod install && cd ..`
3. **Run Metro bundler**: `npx react-native start`
4. **Start app**:
   - iOS: `npx react-native run-ios`
   - Android: `npx react-native run-android`

## Overview

This is a React Native + TypeScript application that displays a grid of products, allows viewing product details (with variant selection), and manages a cart using React Context. Navigation is handled via React Navigation (bottom tabs + native stack).

### Key Features

- **2-column grid** on the main product screen
- **Product details** screen with variant listing and add-to-cart functionality
- **Cart screen** with item removal and quantity management
- **React Context** for cart state
- **Types** for all navigation routes and product data
- Basic **Jest** tests for cart logic

### Architecture Choices

- **Context-based cart** keeps logic centralized.
- **React Navigation** organizes screens (bottom tabs for “Collection” and “Cart”, with a stack for “ProductList” and “ProductDetails”).
- **TypeScript** ensures type safety.

Enjoy!

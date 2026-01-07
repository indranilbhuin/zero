<div align="center">
    &nbsp;&nbsp;&nbsp;
    <img src="assets/icons/adaptive-icon-light.png" height="300" alt="zero logo light">
    <h1 align="center">zero - Minimal Expense Manager</h1>
</div>

Zero is a lightweight, open-source expense tracking app for Android & iOS. Built with privacy-first approach — all your financial data stays on your device. No servers, no tracking, no data collection.

## Screenshots

<div style="display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: center;">
   <img src="assets/screenshots/zero_home_screen_dark.png" width="200"/>
   <img src="assets/screenshots/zero_home_screen_light.png" width="200"/>
   <img src="assets/screenshots/zero_report_screen_dark.png" width="200"/>
   <img src="assets/screenshots/zero_report_screen_light.png" width="200"/>
   <img src="assets/screenshots/zero_debts_screen_dark.png" width="200"/>
   <img src="assets/screenshots/zero_debts_screen_light.png" width="200"/>
   <img src="assets/screenshots/zero_settings_screen_dark.png" width="200"/>
   <img src="assets/screenshots/zero_settings_screen_light.png" width="200"/>
   <img src="assets/screenshots/zero_categories_screen_dark.png" width="200"/>
   <img src="assets/screenshots/zero_categories_screen_light.png" width="200"/>
</div>

## What's New in v2.0

- **WatermelonDB + SQLite** — Migrated from Realm to WatermelonDB for better performance and long-term support
- **Faster load times** — Lazy loading and optimized queries
- **Improved UI** — Bottom sheets, better animations, refined design
- **Better data export** — Export/import your data seamlessly across devices

## Features

### Expense Tracking
Add, edit, and delete transactions with customizable categories.

### Category Management
Create your own categories with custom icons and colors.

### Insights & Reports
- Monthly spending breakdown with pie charts
- Heatmap calendar showing daily expenses
- Average per day calculations

### Debt Tracking
Track money you owe or are owed. Manage debtors and individual debts.

### Customization
- Light & Dark themes (+ system default)
- Multiple currency symbols
- Personalized username

### Data Control
- Export all data as JSON
- Import on new device
- Delete all data option

### Privacy First
- 100% offline — no internet required
- All data stored locally on device
- Zero data collection

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native |
| Database | WatermelonDB (SQLite) |
| State | Redux + Redux Saga |
| UI | Custom components + Lucide icons |
| Navigation | React Navigation |
| Lists | FlashList (performant lists) |

### Why WatermelonDB?

We migrated from Realm to WatermelonDB because:
- **Realm is deprecated** — MongoDB announced end of support
- **SQLite is battle-tested** — Powers millions of apps
- **Lazy loading** — Only loads data when needed
- **Better React Native integration** — Built specifically for RN
- **Smaller bundle size** — Less bloat

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── atoms/         # Basic components (Button, Input, Text)
│   └── molecules/     # Composite components
├── screens/           # App screens
│   └── ScreenName/
│       ├── index.tsx      # UI component
│       ├── useScreenName.ts  # Business logic hook
│       └── style.ts       # Styles
├── watermelondb/      # Database layer
│   ├── models/        # Data models
│   ├── services/      # CRUD operations
│   ├── schema.ts      # Database schema
│   └── database.ts    # DB initialization
├── redux/             # State management
├── navigation/        # Navigation config
├── hooks/             # Global hooks
├── utils/             # Helper functions
└── sheets/            # Bottom sheet components
```

## Getting Started

### Prerequisites
- Node.js 18+
- Yarn or npm
- Android Studio / Xcode

### Installation

```bash
# Clone the repo
git clone https://github.com/indranilbhuin/zero.git
cd zero

# Install dependencies
yarn install

# iOS only
cd ios && pod install && cd ..

# Run the app
yarn android  # or yarn ios
```

## Contributing

Contributions are welcome! Please read our [Code of Conduct](CODE_OF_CONDUCT.md) first.

## Legal

- [Privacy Policy](PRIVACY_POLICY.md) — We collect zero data
- [Terms of Service](TERMS_OF_SERVICE.md) — Usage terms

## License

This project is licensed under the [BSD 2-Clause License](LICENSE).

---

<div align="center">
  <p>Built with ❤️ in India</p>
  <p><i>Embrace the simplicity of zero</i></p>
</div>

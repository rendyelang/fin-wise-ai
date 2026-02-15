# FinWise AI 💰🤖

A smart financial management application powered by AI. Track your expenses and income, manage your budget, and get intelligent recommendations based on your spending patterns.

## Features

### Core Features
- 📊 **Expense Tracking** - Log daily expenses with categories and tags
- 💵 **Income Management** - Record income sources and track earnings
- 🎯 **Budget Planning** - Set and monitor budgets for different categories
- 📈 **Financial Reports** - Generate detailed reports and visualizations of your finances
- 📱 **Offline Mode** - Full functionality with SQLite even without internet connection
- ☁️ **Cloud Sync** - Seamless synchronization between devices via Firebase

### AI Assistant Features
- 🤖 **Smart Analysis** - AI analyzes your spending patterns and financial behavior
- 💡 **Personalized Recommendations** - Get recommendations to improve your financial health
- 🔍 **Pattern Recognition** - Identifies spending habits that negatively impact your finances
- 📚 **Financial Learning** - Learn from AI insights about your money management
- ⚠️ **Anomaly Detection** - Get alerted about unusual spending patterns
- 🎓 **Financial Tips** - Receive tips based on your specific situation

## Tech Stack

### Frontend
- **Framework**: React Native with [Expo](https://expo.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: Redux / Zustand (TBD)
- **Navigation**: React Navigation

### Backend & Database
- **Offline Database**: SQLite
- **Cloud Database**: Firebase (Firestore/Realtime Database)
- **Authentication**: Firebase Authentication
- **AI Integration**: OpenAI API / Google Gemini API (TBD)
- **Cloud Functions**: Firebase Cloud Functions (for AI processing)

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/rendyelang/finwise-ai.git
   cd finwise-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure Firebase**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Add your Firebase config to `.env.local`:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Configure AI API**
   - Get your API key from OpenAI or Google Gemini
   - Add to `.env.local`:
   ```
   EXPO_PUBLIC_AI_API_KEY=your_ai_api_key
   EXPO_PUBLIC_AI_PROVIDER=openai  # or gemini
   ```

## Running the App

### Development Mode
```bash
npm start
# or
yarn start
```

Then:
- Press `i` to run on iOS simulator
- Press `a` to run on Android emulator
- Press `w` to run on web
- Scan QR code with Expo Go app for physical device testing

### Production Build
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android

# Web
npm run build:web
```

## Project Structure

```
finwise-ai/
├── app/                      # App screens & navigation
├── components/               # Reusable components
├── services/
│   ├── firebase/            # Firebase configuration & services
│   ├── sqlite/              # SQLite database operations
│   └── ai/                  # AI assistant integration
├── store/                   # State management
├── utils/                   # Utility functions
├── types/                   # TypeScript type definitions
├── assets/                  # Images, fonts, etc
├── .env.example             # Environment variables template
├── tailwind.config.js       # Tailwind configuration
├── app.json                 # Expo configuration
└── package.json
```

## Environment Variables

See `.env.example` for all required environment variables. Never commit `.env` file with sensitive data!

## Features Roadmap

- [ ] Core CRUD operations (Expenses, Income, Budget)
- [ ] SQLite offline synchronization
- [ ] Firebase cloud synchronization
- [ ] AI pattern analysis
- [ ] Financial recommendations
- [ ] Advanced reporting & charts
- [ ] Budget alerts & notifications
- [ ] Multi-currency support
- [ ] Data export (CSV, PDF)
- [ ] Dark mode support

## Future Backend Migration

When the app scales, we'll separate the backend to:
- Handle complex AI/ML processing
- Improve security for sensitive operations
- Enable better scalability
- Support multiple clients (web, mobile, etc)

Current stack (Firebase) is perfect for MVP and early scaling.

## Database Strategy

### SQLite (Offline)
- Local data storage
- Instant access without internet
- Perfect for daily logging

### Firebase (Online)
- Cloud backup
- Real-time synchronization
- Multi-device support
- Authentication

Data automatically syncs when connection is available.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**Rendy Elang**
- GitHub: [@rendyelang](https://github.com/rendyelang)

---

Made with ❤️ by Rendy Elang

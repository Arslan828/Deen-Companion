# Deen Companion 🕌

A comprehensive Islamic companion app built with React, TypeScript, and Capacitor. Features include Quran reading, prayer times, dua collections, hadith browser, tasbih counter, Qibla compass, and AI-powered Islamic guidance.

## ✨ Features

- 📖 **Quran Reader** - Read and navigate the Holy Quran
- 🕌 **Prayer Times** - Accurate prayer times based on location
- 🤲 **Dua Collection** - Extensive collection of Islamic supplications
- 📚 **Hadith Browser** - Browse authentic hadiths from Sahih collections
- 📿 **Tasbih Counter** - Digital tasbih with history tracking
- 🧭 **Qibla Compass** - Find the direction of the Kaaba
- 🤖 **AI Assistant** - Get Islamic guidance powered by Google Gemini
- 👼 **99 Names of Allah** - Learn the beautiful names of Allah
- 💾 **Offline Support** - Works without internet for core features

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/deen-companion.git
   cd deen-companion
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Mobile App

This app can be built as a native mobile app using Capacitor:

### Android Setup

1. Install Capacitor CLI:
   ```bash
   npm install -g @capacitor/cli
   ```

2. Build the web app:
   ```bash
   npm run build
   ```

3. Sync with Capacitor:
   ```bash
   npx cap sync android
   ```

4. Open in Android Studio:
   ```bash
   npx cap open android
   ```

5. Build and run the APK.

### iOS Setup (macOS only)

1. Add iOS platform:
   ```bash
   npx cap add ios
   ```

2. Sync and open:
   ```bash
   npx cap sync ios
   npx cap open ios
   ```

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS (via Lucide React icons)
- **Mobile:** Capacitor
- **AI:** Google Gemini API
- **APIs:** Aladhan API, Quran API
- **Storage:** IndexedDB (local storage)

## 📂 Project Structure

```
deen-companion/
├── components/          # React components
│   ├── Home.tsx        # Main dashboard
│   ├── QuranReader.tsx # Quran reading interface
│   ├── PrayerTimes.tsx # Prayer time display
│   └── ...
├── services/           # API and utility services
│   ├── db.ts          # IndexedDB operations
│   ├── geminiService.ts # AI service
│   └── islamicService.ts # Islamic APIs
├── android/            # Capacitor Android project
├── ios/               # Capacitor iOS project (if added)
└── dist/              # Built web assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Islamic content sourced from authentic references
- Prayer time calculations via Aladhan API
- Quran text via Quran API
- AI assistance powered by Google Gemini

---

**Note:** This app is developed for educational and devotional purposes. For religious rulings, please consult qualified Islamic scholars.

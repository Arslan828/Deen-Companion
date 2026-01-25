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
   git clone https://github.com/Arslan828/Deen-Companion.git
   cd deen-companion
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
   - Get your API key from: https://aistudio.google.com/app/apikey

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

- **Frontend:** React 19, TypeScript, Ionic React, Vite
- **Mobile Framework:** Ionic with Capacitor
- **Styling:** Ionic CSS, Tailwind CSS (via Lucide React icons)
- **AI:** Google Gemini API
- **APIs:** Aladhan API, Quran API
- **Storage:** IndexedDB (local storage)

## � Mobile App Deployment

### Google Play Store

1. **Prerequisites:**
   - Java JDK 17+ (download from https://adoptium.net/temurin/releases/)
   - Android Studio (download from https://developer.android.com/studio)
   - Google Play Console account ($25 one-time fee)

2. **Build Release APK:**
   ```bash
   npm run build
   npx cap sync android
   cd android
   ./gradlew assembleRelease
   ```

3. **Create Signed APK:**
   - In Android Studio, open the android project
   - Build → Generate Signed Bundle/APK
   - Create/upload a keystore
   - Select APK, then release

4. **Upload to Play Store:**
   - Go to Google Play Console
   - Create new app "Deen Companion"
   - Upload the signed APK
   - Fill in store listing, screenshots, description
   - Submit for review

### App Store (iOS) - macOS Required

1. **Prerequisites:**
   - macOS with Xcode
   - Apple Developer Program ($99/year)

2. **Build for iOS:**
   ```bash
   npm run build
   npx cap add ios
   npx cap sync ios
   npx cap open ios
   ```

3. **Archive and Upload:**
   - In Xcode: Product → Archive
   - Upload to App Store Connect
   - Submit for review

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

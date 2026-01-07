# 🎮 RORK IMPORT GUIDE - City Slickers v2.0

## ✅ CASE A: EXPO + REACT NATIVE

This project is **already** React Native + Expo Router.  
**No framework conversion needed.**

---

## 📦 WHAT YOU'RE IMPORTING

Standard Expo Router project with:
- ✅ `app/` directory (Expo Router)
- ✅ All React Native components
- ✅ Platform-agnostic code (iOS/Android/Web)
- ✅ TypeScript throughout
- ✅ One extra dependency (AsyncStorage)

---

## 🚀 IMPORT INTO RORK

### **Method 1: GitHub Import (Easiest)**

1. **I upload this to GitHub** (or you do)

2. **You import in Rork:**
   ```
   Rork → New Project → Import from GitHub
   → Paste URL: https://github.com/YOUR_USERNAME/city-slickers
   ```

3. **Rork auto-installs dependencies**

4. **Add one extra dependency:**
   ```bash
   npx expo install @react-native-async-storage/async-storage
   ```

5. **Run it:**
   ```bash
   npx expo start
   ```

---

### **Method 2: If You Already Have City Slickers in Rork**

Just replace these 4 files in your existing project:

```
app/index.tsx          ← Main game screen
components/GameComponents.tsx ← UI components
constants/gameTheme.ts ← Configuration
lib/gameEngine.ts      ← Game logic
```

Then:
```bash
npx expo install @react-native-async-storage/async-storage
npx expo start
```

---

## 📁 PROJECT STRUCTURE (STANDARD EXPO ROUTER)

```
city-slickers/
├── app/
│   ├── _layout.tsx       # Root layout
│   └── index.tsx         # Main game screen
│
├── components/
│   └── GameComponents.tsx # All UI
│
├── constants/
│   └── gameTheme.ts      # Config
│
├── lib/
│   └── gameEngine.ts     # Logic
│
├── app.json              # Expo config
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript
└── .gitignore
```

**This is exactly how Rork projects are structured.**

---

## 🔧 DEPENDENCIES

### **Already in Rork projects:**
```json
{
  "expo": "~52.0.0",
  "expo-router": "~4.0.0",
  "react": "18.3.1",
  "react-native": "0.76.5",
  "expo-linear-gradient": "~14.0.1"
}
```

### **NEW - Add this:**
```json
{
  "@react-native-async-storage/async-storage": "^2.1.0"
}
```

Install with:
```bash
npx expo install @react-native-async-storage/async-storage
```

---

## ✅ NO WEB-ONLY CODE

Everything uses React Native primitives:
- `View`, `Text`, `TouchableOpacity` (not div/button)
- `StyleSheet` (not CSS)
- `Platform.OS` for platform detection
- `requestAnimationFrame` (universal API)
- AsyncStorage (Expo module, not localStorage)

**Works on iOS, Android, and Web out of the box.**

---

## 🎯 WHAT TO EXPECT

1. **Import project** → Dependencies install
2. **Add AsyncStorage** → One command
3. **Start dev server** → Game runs
4. **Test on web/mobile** → Everything works

**No conversion, no rewrites, no config changes.**

---

## 🐛 TROUBLESHOOTING

### **Import fails in Rork:**
- Make sure GitHub repo is public (or you have access)
- Try manual file copy instead

### **Dependencies error:**
```bash
# Clear and reinstall
rm -rf node_modules
npm install
npx expo install @react-native-async-storage/async-storage
```

### **AsyncStorage not found:**
```bash
npx expo install @react-native-async-storage/async-storage
```

### **Game doesn't run:**
```bash
npx expo start -c  # Clear cache
```

---

## 📊 FILE ALIGNMENT

This matches Rork's Expo Router structure exactly:

| Rork Standard | This Project | ✅ |
|--------------|-------------|-----|
| `app/index.tsx` | `app/index.tsx` | ✅ Match |
| `app/_layout.tsx` | `app/_layout.tsx` | ✅ Match |
| `components/` | `components/` | ✅ Match |
| `constants/` | `constants/` | ✅ Match |
| Expo Router | Expo Router | ✅ Match |
| TypeScript | TypeScript | ✅ Match |

**Zero conversion needed.**

---

## 🎮 READY TO GO

This is a **complete, working Expo Router app**.

Just:
1. Import to Rork (or copy files)
2. Install AsyncStorage
3. Run it

That's it! 🚀

---

**Questions?** Check the main README.md for full details.

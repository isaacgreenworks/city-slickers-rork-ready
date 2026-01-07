# 🎮 City Slickers - Rork Project Import

**Built with:** Expo + Expo Router + React Native  
**Ready for:** Direct Rork project import  
**Case:** A (Already Expo/React Native)

---

## 📦 WHAT THIS IS

This is a complete Expo Router app with:
- ✅ Expo SDK 52+
- ✅ React Native
- ✅ Expo Router
- ✅ TypeScript
- ✅ All dependencies listed

**File structure matches Rork projects exactly.**

---

## 🚀 RORK IMPORT STEPS

### **Option 1: GitHub Import (Cleanest)**

1. **I'll create a GitHub repo** with this code
2. **You import it into Rork:**
   - Rork → Import Project → GitHub URL
   - Rork will clone and set up automatically

3. **Install the one extra dependency:**
```bash
npx expo install @react-native-async-storage/async-storage
```

4. **Run it:**
```bash
npx expo start
```

---

### **Option 2: Manual File Drop**

If Rork doesn't auto-import well, manually drop these into your existing City Slickers project:

```
YOUR_PROJECT/
├── app/
│   └── index.tsx          ← Replace this file
│
├── components/
│   └── GameComponents.tsx ← Replace this file
│
├── constants/
│   └── gameTheme.ts       ← Replace this file
│
└── lib/
    └── gameEngine.ts      ← Replace this file
```

Then:
```bash
npx expo install @react-native-async-storage/async-storage
npx expo start
```

---

## 📁 PROJECT STRUCTURE

```
city-slickers/
├── app/
│   └── index.tsx              # Main game screen (Expo Router)
│
├── components/
│   └── GameComponents.tsx     # All UI components
│
├── constants/
│   └── gameTheme.ts           # Game configuration
│
├── lib/
│   └── gameEngine.ts          # Core game logic
│
├── app.json                   # Expo config
└── package.json               # Dependencies
```

**This is standard Expo Router structure** - should work in Rork as-is.

---

## 📦 DEPENDENCIES

### **Already in your project:**
- `expo` (SDK 52+)
- `expo-router`
- `react-native`
- `expo-linear-gradient`

### **NEW - You need to add:**
```bash
npx expo install @react-native-async-storage/async-storage
```

That's the ONLY new dependency.

---

## 🎯 NO WEB-ONLY CODE

This game uses:
- ✅ React Native components (View, Text, TouchableOpacity)
- ✅ Expo modules (LinearGradient, AsyncStorage)
- ✅ Platform detection (Platform.OS)
- ✅ requestAnimationFrame (universal)

**Nothing web-specific.** Works on iOS, Android, and Web.

---

## 🔧 WHAT CHANGED FROM v1.0

### **Files Modified:**
1. **`app/index.tsx`**
   - Added start menu
   - Added leaderboard state
   - Added AsyncStorage integration
   - Added SPACE key handling

2. **`components/GameComponents.tsx`**
   - Added StartMenuScreen component
   - Updated styles

3. **`constants/gameTheme.ts`**
   - Reduced scroll speed (2.5 → 1.67)
   - Reduced gravity (0.7 → 0.5)
   - Increased jump power (-14 → -16)
   - Increased building widths (40%)

4. **`lib/gameEngine.ts`**
   - Fixed phantom death bug
   - Fixed powerup spawning
   - Fixed power line distribution
   - Reduced projectile spawn rate

---

## ✅ COMPATIBILITY CHECKLIST

- ✅ **Expo Router** - Uses `app/index.tsx` structure
- ✅ **TypeScript** - All files are `.ts` / `.tsx`
- ✅ **React Native** - No web-only APIs
- ✅ **Platform Detection** - Handles web/mobile differences
- ✅ **AsyncStorage** - Expo-compatible local storage
- ✅ **No Canvas** - Pure React Native rendering
- ✅ **No DOM** - All native components

---

## 🎮 FEATURES

- Start menu with title
- Local high scores (top 3)
- Auto-scrolling parkour
- 8 projectile types
- 4 powerups
- Double jump
- Power line bungee
- Skateboard wall riding
- Hold to slow down

---

## 🐛 BUGS FIXED

- ✅ Phantom death (skateboard teleport)
- ✅ RAF loop duplication
- ✅ Powerups in buildings
- ✅ Power line spam
- ✅ Black screen on load
- ✅ SPACE key not working

---

## 📊 DIFFICULTY (25% EASIER)

| Change | Before | After |
|--------|--------|-------|
| Scroll | 2.5 | 1.67 |
| Platforms | 60-130px | 85-180px |
| Projectiles | 108f | 150f |
| Gravity | 0.7 | 0.5 |
| Jump | -14 | -16 |

---

## 🚀 QUICK START

```bash
# Clone/download this project
# OR import into Rork via GitHub

# Install dependency
npx expo install @react-native-async-storage/async-storage

# Run
npx expo start

# Play on web or mobile
```

---

## 📞 SUPPORT

**If import fails:**
1. Check Expo SDK version (need 52+)
2. Verify all 4 files copied correctly
3. Make sure AsyncStorage installed
4. Clear cache: `npx expo start -c`

**If game doesn't work:**
1. Check console for errors
2. Verify `@react-native-async-storage/async-storage` installed
3. Try restarting dev server

---

## 🎯 EXPECTED BEHAVIOR

1. **Load** → Start menu appears
2. **Press SPACE/START** → Game begins
3. **Play** → Survive as long as possible
4. **Die** → Score saves to leaderboard
5. **Restart** → Back to menu

---

**This is production-ready and Rork-compatible!** 🚀

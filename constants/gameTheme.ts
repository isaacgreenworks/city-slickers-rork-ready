export const GameTheme = {
  colors: {
    skyTop: '#87CEEB',
    skyMid: '#a0d8ef',
    skyBottom: '#b8e6f5',
    playerHelmet: '#FFD700',
    playerHelmetBorder: '#FFA500',
    playerBody: '#00d4ff',
    playerBodyBorder: '#0099cc',
    playerLegs: '#4a5f7f',
    playerLegsBorder: '#334155',
    hudBackground: 'rgba(0,0,0,0.85)',
    hudBorder: '#4a5f7f',
    scoreText: '#ffd700',
    infoText: '#00d4ff',
    groundedIndicator: '#44ff44',
    airborneIndicator: '#ff4444',
    cloudWhite: 'rgba(255,255,255,0.7)',
    skyscraper: {
      main: '#4a7fa8',
      accent: '#2d5a7f',
      roof: '#5d9ac8',
      window: '#e0f2ff',
    },
    midrise: {
      main: '#d97848',
      accent: '#b85a38',
      roof: '#ff8c5a',
      window: '#fff4e6',
    },
    brownstone: {
      main: '#8b6f47',
      accent: '#6b4f27',
      roof: '#ab8f67',
      window: '#fff8dc',
    },
    bodega: {
      main: '#e85d4a',
      accent: '#c83d2a',
      roof: '#ff7d6a',
      window: '#fffacd',
    },
  },
  physics: {
    gravity: 0.5,          // Was 0.7, now 30% lighter - float more, easier to recover
    jumpPower: -16,        // Was -14, now 14% higher jumps - reach platforms easier
    jumpPowerMin: -10,     // Variable jump min
    jumpPowerMax: -16,     // Variable jump max
    moveSpeed: 5,
    autoScrollSpeed: 1.67, // Was 2.5, now 33% slower for better control
  },
  dimensions: {
    screenWidth: 932,
    screenHeight: 430,
    playerWidth: 30,
    playerHeight: 50,
    roofHeight: 20,
    roofOffsetY: -15,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 15,
    xl: 20,
    xxl: 25,
    xxxl: 30,
  },
  typography: {
    fontSize: {
      small: 8,
      medium: 10,
      large: 16,
      xlarge: 36,
      xxlarge: 42,
    },
  },
  buildings: {
    skyscraper: {
      heightMin: 250,
      heightMax: 350,
      widthMin: 110,  // Was 80, now +37% wider
      widthMax: 170,  // Was 120, now +42% wider
    },
    midrise: {
      heightMin: 150,
      heightMax: 220,
      widthMin: 125,  // Was 90, now +39% wider
      widthMax: 180,  // Was 130, now +38% wider
    },
    brownstone: {
      heightMin: 80,
      heightMax: 120,
      widthMin: 85,   // Was 60, now +42% wider
      widthMax: 125,  // Was 90, now +39% wider
    },
    bodega: {
      heightMin: 60,
      heightMax: 100,
      widthMin: 100,  // Was 70, now +43% wider
      widthMax: 140,  // Was 100, now +40% wider
    },
  },
};

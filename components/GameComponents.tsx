import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameTheme } from '@/constants/gameTheme';
import type { BuildingData, ProjectileData, CloudData, PowerLineData, PowerUpData, ExplosionData } from '@/lib/gameEngine';

export const SkyBackground = () => (
  <View style={styles.skyContainer}>
    <LinearGradient
      colors={[GameTheme.colors.skyTop, GameTheme.colors.skyMid, GameTheme.colors.skyBottom]}
      style={StyleSheet.absoluteFill}
    />
  </View>
);

export const CloudComponent = ({ cloud }: { cloud: CloudData }) => (
  <View
    style={[
      styles.cloud,
      {
        left: cloud.screenX,
        top: cloud.y,
        width: cloud.width,
        height: cloud.height,
      },
    ]}
  />
);

export const ExplosionComponent = ({ explosion }: { explosion: ExplosionData }) => {
  // Animation grows from 0 to full size then fades
  const scale = explosion.progress < 0.3 
    ? explosion.progress / 0.3  // Grow phase (0-30%)
    : 1; // Hold at full size
  
  const opacity = explosion.progress < 0.7
    ? 1  // Fully visible (0-70%)
    : 1 - ((explosion.progress - 0.7) / 0.3); // Fade out (70-100%)
  
  return (
    <View
      style={{
        position: 'absolute',
        left: explosion.screenX,
        top: explosion.y,
        width: 60,
        height: 60,
        transform: [
          { translateX: -30 },
          { translateY: -30 },
          { scale: scale },
        ],
        opacity: opacity,
        zIndex: 100,
      }}
    >
      {/* Outer ring - orange/red */}
      <View style={styles.explosionOuter} />
      {/* Middle ring - yellow */}
      <View style={styles.explosionMiddle} />
      {/* Inner ring - bright white/yellow */}
      <View style={styles.explosionInner} />
    </View>
  );
};

export const PowerUpComponent = ({ powerUp }: { powerUp: PowerUpData }) => (
  <View
    style={{
      position: 'absolute',
      left: powerUp.screenX,
      top: powerUp.y,
      width: powerUp.width,
      height: powerUp.height,
      transform: [
        { translateX: -powerUp.width / 2 },
        { translateY: -powerUp.height / 2 },
      ],
      zIndex: 45,
    }}
  >
    {powerUp.type === 'invincibility' ? (
      // Gold Star
      <View style={styles.goldStar}>
        <View style={styles.starPoint1} />
        <View style={styles.starPoint2} />
        <View style={styles.starPoint3} />
        <View style={styles.starPoint4} />
        <View style={styles.starCenter} />
      </View>
    ) : powerUp.type === 'flying' ? (
      // Angel Wings
      <View style={styles.angelWings}>
        <View style={styles.wingLeft}>
          <View style={styles.wingFeather1L} />
          <View style={styles.wingFeather2L} />
          <View style={styles.wingFeather3L} />
        </View>
        <View style={styles.wingRight}>
          <View style={styles.wingFeather1R} />
          <View style={styles.wingFeather2R} />
          <View style={styles.wingFeather3R} />
        </View>
        <View style={styles.wingGlow} />
      </View>
    ) : powerUp.type === 'bomb' ? (
      // Bomb
      <View style={styles.bomb}>
        <View style={styles.bombBody} />
        <View style={styles.bombHighlight} />
        <View style={styles.bombFuse} />
        <View style={styles.bombSpark} />
      </View>
    ) : (
      // Skateboard
      <View style={styles.skateboard}>
        <View style={styles.skateboardDeck} />
        <View style={styles.skateboardGrip} />
        <View style={styles.skateboardWheelLeft} />
        <View style={styles.skateboardWheelRight} />
      </View>
    )}
  </View>
);

export const PowerLineComponent = ({ powerLine }: { powerLine: PowerLineData }) => {
  const dx = powerLine.x2 - powerLine.x1;
  const midX = (powerLine.x1 + powerLine.x2) / 2;
  const midY = (powerLine.y1 + powerLine.y2) / 2;
  
  // Calculate sag for three cables
  const sagAmount = 25;
  const cable1Y = midY + sagAmount;
  const cable2Y = midY + sagAmount - 8;
  const cable3Y = midY + sagAmount - 16;
  
  return (
    <>
      {/* LEFT UTILITY POLE - Equal height */}
      <View
        style={{
          position: 'absolute',
          left: powerLine.x1 - 3,
          top: powerLine.y1,
          width: 6,
          height: powerLine.poleHeight,
          backgroundColor: '#3d2817',
          zIndex: 25,
          borderWidth: 1,
          borderColor: '#2a1a0f',
        }}
      />
      {/* Left crossbar */}
      <View
        style={{
          position: 'absolute',
          left: powerLine.x1 - 18,
          top: powerLine.y1 - 3,
          width: 36,
          height: 6,
          backgroundColor: '#3d2817',
          zIndex: 25,
          borderWidth: 1,
          borderColor: '#2a1a0f',
        }}
      />
      {/* Left insulators (3) */}
      {[-12, 0, 12].map((offset, i) => (
        <View
          key={`left-insulator-${i}`}
          style={{
            position: 'absolute',
            left: powerLine.x1 + offset - 2,
            top: powerLine.y1 + 3,
            width: 4,
            height: 8,
            backgroundColor: '#4a8b9e',
            zIndex: 26,
            borderRadius: 2,
          }}
        />
      ))}
      
      {/* RIGHT UTILITY POLE - Equal height */}
      <View
        style={{
          position: 'absolute',
          left: powerLine.x2 - 3,
          top: powerLine.y2,
          width: 6,
          height: powerLine.poleHeight,
          backgroundColor: '#3d2817',
          zIndex: 25,
          borderWidth: 1,
          borderColor: '#2a1a0f',
        }}
      />
      {/* Right crossbar */}
      <View
        style={{
          position: 'absolute',
          left: powerLine.x2 - 18,
          top: powerLine.y2 - 3,
          width: 36,
          height: 6,
          backgroundColor: '#3d2817',
          zIndex: 25,
          borderWidth: 1,
          borderColor: '#2a1a0f',
        }}
      />
      {/* Right insulators (3) */}
      {[-12, 0, 12].map((offset, i) => (
        <View
          key={`right-insulator-${i}`}
          style={{
            position: 'absolute',
            left: powerLine.x2 + offset - 2,
            top: powerLine.y2 + 3,
            width: 4,
            height: 8,
            backgroundColor: '#4a8b9e',
            zIndex: 26,
            borderRadius: 2,
          }}
        />
      ))}
      
      {/* THREE SAGGING POWER CABLES */}
      {/* Cable 1 (bottom - thickest) */}
      <View
        style={{
          position: 'absolute',
          left: powerLine.x1 - 12,
          top: powerLine.y1 + 11,
          width: 12,
          height: 3,
          backgroundColor: '#1a1a1a',
          zIndex: 24,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: powerLine.x1,
          top: cable1Y - 1.5,
          width: dx,
          height: 3,
          backgroundColor: '#1a1a1a',
          zIndex: 24,
          borderRadius: 1.5,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: powerLine.x2,
          top: powerLine.y2 + 11,
          width: 12,
          height: 3,
          backgroundColor: '#1a1a1a',
          zIndex: 24,
        }}
      />
      
      {/* Cable 2 (middle) */}
      <View
        style={{
          position: 'absolute',
          left: powerLine.x1 - 1,
          top: powerLine.y1 + 11,
          width: 2,
          height: 3,
          backgroundColor: '#1a1a1a',
          zIndex: 24,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: powerLine.x1,
          top: cable2Y - 1,
          width: dx,
          height: 2,
          backgroundColor: '#1a1a1a',
          zIndex: 24,
          borderRadius: 1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: powerLine.x2 - 1,
          top: powerLine.y2 + 11,
          width: 2,
          height: 3,
          backgroundColor: '#1a1a1a',
          zIndex: 24,
        }}
      />
      
      {/* Cable 3 (top - thinnest) */}
      <View
        style={{
          position: 'absolute',
          left: powerLine.x1 + 11,
          top: powerLine.y1 + 11,
          width: 2,
          height: 3,
          backgroundColor: '#1a1a1a',
          zIndex: 24,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: powerLine.x1,
          top: cable3Y - 1,
          width: dx,
          height: 2,
          backgroundColor: '#1a1a1a',
          zIndex: 24,
          borderRadius: 1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: powerLine.x2 + 11,
          top: powerLine.y2 + 11,
          width: 2,
          height: 3,
          backgroundColor: '#1a1a1a',
          zIndex: 24,
        }}
      />
    </>
  );
};

export const PlayerComponent = ({
  screenX,
  y,
  width,
  height,
  isInvincible,
  isFlying,
  isInvincibilityExpiring,
  isFlyingExpiring,
  hasSkateBoard,
  isSkateboardExpiring,
  skateboardRotation,
}: {
  screenX: number;
  y: number;
  width: number;
  height: number;
  isInvincible: boolean;
  isFlying: boolean;
  isInvincibilityExpiring: boolean;
  isFlyingExpiring: boolean;
  hasSkateBoard: boolean;
  isSkateboardExpiring: boolean;
  skateboardRotation: number;
}) => {
  // Flash between normal color and RED every 0.5 seconds when expiring
  const flashState = Math.floor(Date.now() / 500) % 2 === 0;
  
  // Determine aura color: RED when expiring and flash is on, otherwise GOLD
  const auraColor = (isInvincibilityExpiring && flashState) 
    ? 'rgba(255, 0, 0, 0.4)'
    : 'rgba(255, 215, 0, 0.4)';
  
  const auraShadowColor = (isInvincibilityExpiring && flashState)
    ? '#FF0000'
    : '#FFD700';
  
  // Determine wing color: RED when expiring and flash is on, otherwise WHITE
  const wingColor = (isFlyingExpiring && flashState) ? '#ffcccc' : '#fff';
  const wingShadowColor = (isFlyingExpiring && flashState) ? '#FF0000' : '#87CEEB';
  
  // Determine skateboard color: RED when expiring and flash is on, otherwise normal
  const skateboardColor = (isSkateboardExpiring && flashState) ? '#ff6666' : '#ff6b35';
  
  return (
    <View
      style={[
        styles.player,
        {
          left: screenX,
          top: y,
          width,
          height,
        },
      ]}
    >
      {/* Gold/Red aura when invincible */}
      {isInvincible && (
        <View
          style={{
            position: 'absolute',
            left: -8,
            top: -8,
            width: width + 16,
            height: height + 16,
            backgroundColor: auraColor,
            borderRadius: (width + 16) / 2,
            shadowColor: auraShadowColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 15,
            zIndex: -1,
          }}
        />
      )}
      
      {/* White/Red wings when flying */}
      {isFlying && (
        <>
          <View
            style={{
              position: 'absolute',
              left: -15,
              top: 8,
              width: 12,
              height: 20,
              backgroundColor: wingColor,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: '#e0e0e0',
              shadowColor: wingShadowColor,
              shadowOffset: { width: -2, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 4,
              transform: [{ rotate: '-20deg' }],
              zIndex: -1,
            }}
          />
          <View
            style={{
              position: 'absolute',
              right: -15,
              top: 8,
              width: 12,
              height: 20,
              backgroundColor: wingColor,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: '#e0e0e0',
              shadowColor: wingShadowColor,
              shadowOffset: { width: 2, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 4,
              transform: [{ rotate: '20deg' }],
              zIndex: -1,
            }}
          />
        </>
      )}
      
      {/* Skateboard with spin animation */}
      {hasSkateBoard && (
        <View
          style={{
            position: 'absolute',
            left: -8,
            bottom: -12,
            width: 26,
            height: 8,
            transform: [{ rotate: `${skateboardRotation}deg` }],
            zIndex: -1,
          }}
        >
          <View style={[styles.skateboardDeck, { backgroundColor: skateboardColor }]} />
          <View style={styles.skateboardWheelLeft} />
          <View style={styles.skateboardWheelRight} />
        </View>
      )}
      
      <View style={styles.playerHelmet} />
      <View style={styles.playerBody} />
      <View style={styles.playerLegLeft} />
      <View style={styles.playerLegRight} />
    </View>
  );
};

export const BuildingComponent = ({ building }: { building: BuildingData }) => {
  return (
    <View
      style={[
        styles.building,
        {
          left: building.screenX,
          top: building.y,
          width: building.width,
          height: building.height,
        },
      ]}
    >
      <LinearGradient
        colors={[building.colors.main, building.colors.accent]}
        style={[styles.buildingBody, { borderColor: building.colors.accent }]}
      >
        {building.windowPattern.map((row, rowIdx) => (
          <View
            key={rowIdx}
            style={[
              styles.windowRow,
              {
                top: 10 + rowIdx * 35,
                left: '10%',
                width: '80%',
              },
            ]}
          >
            {row.map((isLit, colIdx) => (
              <View
                key={colIdx}
                style={[
                  styles.window,
                  {
                    width: 16,
                    height: 20,
                    backgroundColor: isLit ? building.colors.window : building.colors.accent,
                    borderWidth: 2,
                    borderColor: building.colors.accent,
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </LinearGradient>

      <View
        style={[
          styles.roof,
          {
            top: GameTheme.dimensions.roofOffsetY,
            left: -8,
            width: building.width + 16,
            height: GameTheme.dimensions.roofHeight,
            borderColor: building.colors.accent,
          },
        ]}
      >
        <LinearGradient
          colors={[building.colors.roof, building.colors.accent]}
          style={StyleSheet.absoluteFill}
        />
      </View>
    </View>
  );
};

export const ProjectileComponent = ({ projectile }: { projectile: ProjectileData }) => {
  const renderProjectile = () => {
    switch (projectile.type) {
      case 'paper-plane':
        return (
          <View style={styles.paperPlane}>
            {/* Main body - white with fold lines */}
            <View style={styles.paperPlaneBody} />
            <View style={styles.paperPlaneFold} />
            {/* Nose cone */}
            <View style={styles.paperPlaneNose} />
            {/* Wings with shadows */}
            <View style={styles.paperPlaneWingTop} />
            <View style={styles.paperPlaneWingBottom} />
          </View>
        );
      case 'anvil':
        return (
          <View style={styles.anvil}>
            {/* Classic anvil shape with metallic look */}
            <View style={styles.anvilHorn} />
            <View style={styles.anvilBody} />
            <View style={styles.anvilBodyHighlight} />
            <View style={styles.anvilBase} />
            <View style={styles.anvilBaseShadow} />
          </View>
        );
      case 'pizza':
        return (
          <View style={styles.pizza}>
            {/* Pizza slice with cheese and toppings */}
            <View style={styles.pizzaCrust} />
            <View style={styles.pizzaCheese} />
            <View style={styles.pizzaCrustEdge} />
            {/* Pepperoni with depth */}
            <View style={[styles.pepperoni, { top: 10, left: 12 }]} />
            <View style={[styles.pepperoniHighlight, { top: 11, left: 13 }]} />
            <View style={[styles.pepperoni, { top: 18, left: 20 }]} />
            <View style={[styles.pepperoniHighlight, { top: 19, left: 21 }]} />
            <View style={[styles.pepperoni, { top: 22, left: 10 }]} />
            <View style={[styles.pepperoniHighlight, { top: 23, left: 11 }]} />
          </View>
        );
      case 'rat':
        return (
          <View style={styles.rat}>
            {/* NYC rat with detail */}
            <View style={styles.ratBody} />
            <View style={styles.ratBodyHighlight} />
            <View style={styles.ratHead} />
            <View style={styles.ratEar} />
            <View style={styles.ratEye} />
            <View style={styles.ratNose} />
            <View style={styles.ratTail} />
            <View style={styles.ratFoot1} />
            <View style={styles.ratFoot2} />
          </View>
        );
      case 'needle':
        return (
          <View style={styles.needle}>
            {/* Syringe with clear detail */}
            <View style={styles.needlePoint} />
            <View style={styles.needlePointShine} />
            <View style={styles.needleBarrel} />
            <View style={styles.needleBarrelHighlight} />
            <View style={styles.needlePlunger} />
            <View style={styles.needlePlungerTop} />
            <View style={styles.needleFluid} />
          </View>
        );
      case 'taxi':
        return (
          <View style={styles.taxi}>
            {/* Classic yellow cab with details */}
            <View style={styles.taxiBody} />
            <View style={styles.taxiBodyHighlight} />
            <View style={styles.taxiRoof} />
            <View style={styles.taxiSign} />
            <View style={styles.taxiSignText} />
            <View style={styles.taxiWindow} />
            <View style={styles.taxiWindowGlare} />
            <View style={[styles.taxiWheel, { left: 6 }]} />
            <View style={[styles.taxiWheelHub, { left: 8 }]} />
            <View style={[styles.taxiWheel, { right: 6 }]} />
            <View style={[styles.taxiWheelHub, { right: 8 }]} />
            <View style={styles.taxiGrill} />
            <View style={styles.taxiBumper} />
          </View>
        );
      case 'brick':
        return (
          <View style={styles.brick}>
            {/* Red brick with texture */}
            <View style={styles.brickBody} />
            <View style={styles.brickHighlight} />
            <View style={styles.brickMortar1} />
            <View style={styles.brickMortar2} />
          </View>
        );
      case 'banana':
        return (
          <View style={styles.banana}>
            {/* Curved banana with detail */}
            <View style={styles.bananaPeel} />
            <View style={styles.bananaHighlight} />
            <View style={styles.bananaStem} />
            <View style={styles.bananaStemTip} />
            <View style={styles.bananaSpot1} />
            <View style={styles.bananaSpot2} />
            <View style={styles.bananaCurve} />
          </View>
        );
      default:
        return <View style={{ width: 30, height: 30, backgroundColor: '#999' }} />;
    }
  };

  return (
    <View
      style={[
        styles.projectile,
        {
          left: projectile.screenX,
          top: projectile.y,
          transform: [
            { translateX: -projectile.width / 2 },
            { translateY: -projectile.height / 2 },
            { rotate: `${projectile.rotation}deg` },
          ],
        },
      ]}
    >
      {renderProjectile()}
    </View>
  );
};

export const HUDComponent = ({
  score,
  jumpsAvailable,
  isGrounded,
}: {
  score: number;
  jumpsAvailable: number;
  isGrounded: boolean;
}) => (
  <View style={styles.hud}>
    <Text style={styles.scoreText}>{score}</Text>
    <Text style={styles.infoText}>J: {jumpsAvailable}</Text>
    <Text
      style={[
        styles.groundedIndicator,
        { color: isGrounded ? GameTheme.colors.groundedIndicator : GameTheme.colors.airborneIndicator },
      ]}
    >
      {isGrounded ? '●' : '○'}
    </Text>
  </View>
);

export const StartMenuScreen = ({ 
  onStart, 
  highScores 
}: { 
  onStart: () => void;
  highScores: number[];
}) => (
  <View style={styles.startMenuContainer}>
    <View style={styles.menuContent}>
      <Text style={styles.gameTitle}>CITY SLICKERS</Text>
      
      {/* Leaderboard */}
      <View style={styles.leaderboardContainer}>
        <Text style={styles.leaderboardTitle}>HIGH SCORES</Text>
        {highScores.slice(0, 3).map((score, index) => (
          <View key={index} style={styles.leaderboardRow}>
            <Text style={styles.leaderboardRank}>#{index + 1}</Text>
            <Text style={styles.leaderboardScore}>{score}</Text>
          </View>
        ))}
        {highScores.length === 0 && (
          <Text style={styles.noScoresText}>No scores yet!</Text>
        )}
      </View>
      
      <TouchableOpacity style={styles.startButton} onPress={onStart}>
        <Text style={styles.startButtonText}>PRESS START</Text>
      </TouchableOpacity>
      
      <Text style={styles.instructionText}>
        {Platform.OS === 'web' ? 'SPACE to start/jump • HOLD SPACE to slow down' : 'TAP to jump • HOLD to slow down'}
      </Text>
    </View>
  </View>
);

export const GameOverScreen = ({ score, onRestart }: { score: number; onRestart: () => void }) => (
  <View style={styles.gameOverContainer}>
    <Text style={styles.gameOverTitle}>WASTED</Text>
    <View style={styles.scoreContainer}>
      <Text style={styles.finalScore}>{score}</Text>
    </View>
    <TouchableOpacity style={styles.retryButton} onPress={onRestart}>
      <Text style={styles.retryButtonText}>RETRY</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  skyContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  cloud: {
    position: 'absolute',
    backgroundColor: GameTheme.colors.cloudWhite,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    zIndex: 5, // BEHIND buildings (buildings are 10)
  },
  goldStar: {
    width: 30,
    height: 30,
    position: 'relative',
  },
  starCenter: {
    position: 'absolute',
    left: 10,
    top: 10,
    width: 10,
    height: 10,
    backgroundColor: '#FFD700',
    borderRadius: 5,
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  starPoint1: {
    position: 'absolute',
    left: 12,
    top: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFD700',
  },
  starPoint2: {
    position: 'absolute',
    left: 12,
    bottom: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFD700',
  },
  starPoint3: {
    position: 'absolute',
    left: 0,
    top: 12,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#FFD700',
  },
  starPoint4: {
    position: 'absolute',
    right: 0,
    top: 12,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#FFD700',
  },
  angelWings: {
    width: 30,
    height: 30,
    position: 'relative',
  },
  wingLeft: {
    position: 'absolute',
    left: 0,
    top: 10,
    width: 12,
    height: 18,
  },
  wingFeather1L: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 12,
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    transform: [{ rotate: '-15deg' }],
  },
  wingFeather2L: {
    position: 'absolute',
    left: 2,
    top: 6,
    width: 10,
    height: 6,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  wingFeather3L: {
    position: 'absolute',
    left: 4,
    top: 12,
    width: 8,
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#c0c0c0',
    transform: [{ rotate: '15deg' }],
  },
  wingRight: {
    position: 'absolute',
    right: 0,
    top: 10,
    width: 12,
    height: 18,
  },
  wingFeather1R: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 12,
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    transform: [{ rotate: '15deg' }],
  },
  wingFeather2R: {
    position: 'absolute',
    right: 2,
    top: 6,
    width: 10,
    height: 6,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  wingFeather3R: {
    position: 'absolute',
    right: 4,
    top: 12,
    width: 8,
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#c0c0c0',
    transform: [{ rotate: '-15deg' }],
  },
  wingGlow: {
    position: 'absolute',
    left: 10,
    top: 12,
    width: 10,
    height: 10,
    backgroundColor: '#87CEEB',
    borderRadius: 5,
    opacity: 0.4,
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  bomb: {
    width: 30,
    height: 30,
    position: 'relative',
  },
  bombBody: {
    position: 'absolute',
    left: 5,
    top: 10,
    width: 20,
    height: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  bombHighlight: {
    position: 'absolute',
    left: 10,
    top: 13,
    width: 6,
    height: 6,
    backgroundColor: '#444',
    borderRadius: 3,
  },
  bombFuse: {
    position: 'absolute',
    left: 13,
    top: 4,
    width: 3,
    height: 8,
    backgroundColor: '#8B4513',
    borderRadius: 1.5,
  },
  bombSpark: {
    position: 'absolute',
    left: 12,
    top: 0,
    width: 5,
    height: 5,
    backgroundColor: '#FFA500',
    borderRadius: 2.5,
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  explosionOuter: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 60,
    height: 60,
    backgroundColor: '#FF4500',
    borderRadius: 30,
    opacity: 0.7,
  },
  explosionMiddle: {
    position: 'absolute',
    left: 10,
    top: 10,
    width: 40,
    height: 40,
    backgroundColor: '#FFA500',
    borderRadius: 20,
    opacity: 0.8,
  },
  explosionInner: {
    position: 'absolute',
    left: 20,
    top: 20,
    width: 20,
    height: 20,
    backgroundColor: '#FFFF00',
    borderRadius: 10,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  skateboard: {
    width: 26,
    height: 8,
    position: 'relative',
  },
  skateboardDeck: {
    position: 'absolute',
    left: 0,
    top: 2,
    width: 26,
    height: 4,
    backgroundColor: '#ff6b35',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#d65a2a',
  },
  skateboardGrip: {
    position: 'absolute',
    left: 2,
    top: 3,
    width: 22,
    height: 2,
    backgroundColor: '#1a1a1a',
    opacity: 0.3,
  },
  skateboardWheelLeft: {
    position: 'absolute',
    left: 2,
    top: 0,
    width: 5,
    height: 5,
    backgroundColor: '#333',
    borderRadius: 2.5,
    borderWidth: 1,
    borderColor: '#666',
  },
  skateboardWheelRight: {
    position: 'absolute',
    right: 2,
    top: 0,
    width: 5,
    height: 5,
    backgroundColor: '#333',
    borderRadius: 2.5,
    borderWidth: 1,
    borderColor: '#666',
  },
  powerLine: {
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  powerLineHighlight: {
    borderRadius: 1,
  },
  powerPole: {
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  player: {
    position: 'absolute',
    zIndex: 50,
    transform: [{ translateX: -15 }, { translateY: -25 }],
  },
  playerHelmet: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -9 }],
    width: 18,
    height: 18,
    backgroundColor: GameTheme.colors.playerHelmet,
    borderWidth: 3,
    borderColor: GameTheme.colors.playerHelmetBorder,
  },
  playerBody: {
    position: 'absolute',
    top: 18,
    left: '50%',
    transform: [{ translateX: -11 }],
    width: 22,
    height: 20,
    backgroundColor: GameTheme.colors.playerBody,
    borderWidth: 3,
    borderColor: GameTheme.colors.playerBodyBorder,
  },
  playerLegLeft: {
    position: 'absolute',
    bottom: 0,
    left: '28%',
    width: 7,
    height: 16,
    backgroundColor: GameTheme.colors.playerLegs,
    borderWidth: 2,
    borderColor: GameTheme.colors.playerLegsBorder,
  },
  playerLegRight: {
    position: 'absolute',
    bottom: 0,
    right: '28%',
    width: 7,
    height: 16,
    backgroundColor: GameTheme.colors.playerLegs,
    borderWidth: 2,
    borderColor: GameTheme.colors.playerLegsBorder,
  },
  building: {
    position: 'absolute',
    zIndex: 10,
  },
  buildingBody: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 3,
    overflow: 'hidden',
  },
  windowRow: {
    position: 'absolute',
    height: 25,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  window: {
    height: 20,
    borderWidth: 2,
  },
  roof: {
    position: 'absolute',
    borderWidth: 4,
    zIndex: 20,
    overflow: 'hidden',
  },
  projectile: {
    position: 'absolute',
    zIndex: 40,
  },
  paperPlane: {
    width: 35,
    height: 25,
  },
  paperPlaneBody: {
    position: 'absolute',
    left: 0,
    top: 10,
    width: 35,
    height: 3,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  paperPlaneWingLeft: {
    position: 'absolute',
    left: 5,
    top: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 0,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#f0f0f0',
  },
  paperPlaneWingRight: {
    position: 'absolute',
    right: 5,
    bottom: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 0,
    borderRightWidth: 10,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#f0f0f0',
  },
  paperPlaneTail: {
    position: 'absolute',
    right: 0,
    top: 8,
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  anvil: {
    width: 30,
    height: 30,
  },
  anvilTop: {
    position: 'absolute',
    top: 0,
    left: '25%',
    width: '50%',
    height: 8,
    backgroundColor: '#4a4a4a',
    borderWidth: 2,
    borderColor: '#2a2a2a',
  },
  anvilBody: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    height: 16,
    backgroundColor: '#5a5a5a',
    borderWidth: 2,
    borderColor: '#2a2a2a',
  },
  anvilBottom: {
    position: 'absolute',
    bottom: 0,
    left: '10%',
    width: '80%',
    height: 6,
    backgroundColor: '#4a4a4a',
    borderWidth: 2,
    borderColor: '#2a2a2a',
  },
  pizza: {
    width: 35,
    height: 35,
  },
  pizzaCrust: {
    position: 'absolute',
    width: 35,
    height: 35,
    backgroundColor: '#ffcc66',
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#d4a044',
  },
  pepperoni: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: '#cc3333',
    borderRadius: 3,
  },
  rat: {
    width: 25,
    height: 15,
  },
  ratBody: {
    position: 'absolute',
    left: 4,
    top: 2,
    width: 16,
    height: 12,
    backgroundColor: '#5a5a5a',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  ratHead: {
    position: 'absolute',
    left: 18,
    top: 4,
    width: 7,
    height: 8,
    backgroundColor: '#5a5a5a',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  ratTail: {
    position: 'absolute',
    left: 0,
    top: 6,
    width: 6,
    height: 2,
    backgroundColor: '#7a7a7a',
  },
  needle: {
    width: 20,
    height: 40,
  },
  needlePoint: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -2 }],
    width: 4,
    height: 8,
    backgroundColor: '#aaaaaa',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  needleBody: {
    position: 'absolute',
    top: 8,
    left: '50%',
    transform: [{ translateX: -3 }],
    width: 6,
    height: 24,
    backgroundColor: 'rgba(200, 200, 200, 0.5)',
    borderWidth: 1,
    borderColor: '#888',
  },
  needlePlunger: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -4 }],
    width: 8,
    height: 8,
    backgroundColor: '#ff6666',
    borderWidth: 1,
    borderColor: '#cc4444',
  },
  taxi: {
    width: 45,
    height: 25,
  },
  taxiBody: {
    position: 'absolute',
    left: 0,
    top: 4,
    width: 45,
    height: 16,
    backgroundColor: '#ffcc00',
    borderWidth: 2,
    borderColor: '#cc9900',
    borderRadius: 2,
  },
  taxiSign: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -6 }],
    width: 12,
    height: 6,
    backgroundColor: '#ff3333',
    borderWidth: 1,
    borderColor: '#cc0000',
  },
  taxiWheel: {
    position: 'absolute',
    bottom: 0,
    width: 6,
    height: 6,
    backgroundColor: '#1a1a1a',
    borderRadius: 3,
  },
  brick: {
    width: 25,
    height: 15,
  },
  brickPattern: {
    width: 25,
    height: 15,
    backgroundColor: '#aa5533',
    borderWidth: 2,
    borderColor: '#884422',
  },
  banana: {
    width: 30,
    height: 20,
  },
  bananaPeel: {
    position: 'absolute',
    left: 0,
    top: 2,
    width: 30,
    height: 16,
    backgroundColor: '#ffeb3b',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#fdd835',
  },
  bananaStem: {
    position: 'absolute',
    left: 2,
    top: 0,
    width: 6,
    height: 6,
    backgroundColor: '#8d6e63',
    borderRadius: 3,
  },
  hud: {
    position: 'absolute',
    top: GameTheme.spacing.lg,
    left: GameTheme.spacing.lg,
    zIndex: 200,
    backgroundColor: GameTheme.colors.hudBackground,
    padding: GameTheme.spacing.md,
    borderWidth: 3,
    borderColor: GameTheme.colors.hudBorder,
  },
  scoreText: {
    color: GameTheme.colors.scoreText,
    fontSize: GameTheme.typography.fontSize.medium,
    marginBottom: GameTheme.spacing.xs,
  },
  infoText: {
    color: GameTheme.colors.infoText,
    fontSize: GameTheme.typography.fontSize.small,
  },
  groundedIndicator: {
    fontSize: GameTheme.typography.fontSize.medium,
    marginTop: GameTheme.spacing.xs,
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 300,
  },
  gameOverTitle: {
    fontSize: GameTheme.typography.fontSize.xlarge,
    color: '#ff4444',
    marginBottom: GameTheme.spacing.xxxl,
  },
  scoreContainer: {
    backgroundColor: 'rgba(74,95,127,0.3)',
    borderWidth: 3,
    borderColor: '#4a5f7f',
    padding: GameTheme.spacing.xxl,
    marginBottom: GameTheme.spacing.xxxl,
  },
  finalScore: {
    fontSize: GameTheme.typography.fontSize.xxlarge,
    color: GameTheme.colors.scoreText,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: GameTheme.spacing.lg,
    paddingHorizontal: GameTheme.spacing.xl * 2,
    backgroundColor: '#00d4ff',
    borderWidth: 4,
    borderColor: '#0099cc',
  },
  retryButtonText: {
    fontSize: GameTheme.typography.fontSize.large,
    color: '#000',
    fontWeight: 'bold' as const,
  },
  // START MENU STYLES
  startMenuContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  menuContent: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 20, 40, 0.95)',
    padding: 40,
    borderWidth: 4,
    borderColor: '#00d4ff',
    borderRadius: 8,
  },
  gameTitle: {
    fontSize: 48,
    fontWeight: 'bold' as const,
    color: '#FFD700',
    textShadowColor: '#FFA500',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
    marginBottom: 30,
    letterSpacing: 4,
  },
  leaderboardContainer: {
    width: 300,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderWidth: 2,
    borderColor: '#4a5f7f',
    marginBottom: 30,
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 2,
  },
  leaderboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(74, 95, 127, 0.3)',
  },
  leaderboardRank: {
    fontSize: 16,
    color: '#00d4ff',
    fontWeight: 'bold' as const,
  },
  leaderboardScore: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold' as const,
  },
  noScoresText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic' as const,
  },
  startButton: {
    paddingVertical: 15,
    paddingHorizontal: 60,
    backgroundColor: '#FFD700',
    borderWidth: 4,
    borderColor: '#FFA500',
    marginBottom: 20,
  },
  startButtonText: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold' as const,
    letterSpacing: 2,
  },
  instructionText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});

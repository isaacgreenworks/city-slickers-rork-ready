import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameEngine, type GameState } from '@/lib/gameEngine';
import {
  SkyBackground,
  PlayerComponent,
  BuildingComponent,
  CloudComponent,
  PowerLineComponent,
  PowerUpComponent,
  ExplosionComponent,
  ProjectileComponent,
  HUDComponent,
  GameOverScreen,
  StartMenuScreen,
} from '@/components/GameComponents';
import { GameTheme } from '@/constants/gameTheme';

const HIGH_SCORES_KEY = '@city_slickers_high_scores';

export default function GameScreen() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScores, setHighScores] = useState<number[]>([]);
  const engineRef = useRef<GameEngine | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isUpdatingRef = useRef(false); // Guard against re-entrant RAF calls

  // Load high scores on mount
  useEffect(() => {
    loadHighScores();
  }, []);

  const loadHighScores = async () => {
    try {
      const scoresJson = await AsyncStorage.getItem(HIGH_SCORES_KEY);
      if (scoresJson) {
        const scores = JSON.parse(scoresJson);
        setHighScores(scores);
      }
    } catch (error) {
      console.error('Failed to load high scores:', error);
    }
  };

  const saveHighScore = async (score: number) => {
    try {
      const newScores = [...highScores, score]
        .sort((a, b) => b - a) // Sort descending
        .slice(0, 3); // Keep top 3 only
      
      await AsyncStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(newScores));
      setHighScores(newScores);
    } catch (error) {
      console.error('Failed to save high score:', error);
    }
  };

  useEffect(() => {
    console.log('Initializing game engine');
    engineRef.current = new GameEngine();
    engineRef.current.start(); // Start to generate initial world
    setGameState(engineRef.current.getState()); // Set initial state
    engineRef.current.isRunning = false; // But pause it until player starts

    const updateGame = () => {
      // Prevent multiple RAF loops from calling update simultaneously
      if (isUpdatingRef.current) {
        console.warn('RAF re-entry prevented! Multiple loops detected.');
        return;
      }
      
      isUpdatingRef.current = true;
      
      try {
        if (engineRef.current) {
          engineRef.current.update(); // Always call update, engine checks isRunning internally
          setGameState(engineRef.current.getState());
        }
      } finally {
        isUpdatingRef.current = false;
        animationFrameRef.current = requestAnimationFrame(updateGame);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateGame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const jumpKeyDownTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!engineRef.current) return;
        
        if (e.key === ' ') {
          e.preventDefault();
          
          // If game hasn't started, start it
          if (!gameStarted) {
            handleStart();
            return;
          }
          
          // Otherwise handle jump
          if (jumpKeyDownTimeRef.current === null) {
            jumpKeyDownTimeRef.current = Date.now();
            engineRef.current.player.startJump();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          // Up arrow = hold to slow down
          engineRef.current.player.setSlowDown(true);
        }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        if (!engineRef.current) return;
        
        if (e.key === ' ') {
          e.preventDefault();
          
          // Don't process jump if we just started the game
          if (!gameStarted) return;
          
          // Execute jump based on hold duration
          if (jumpKeyDownTimeRef.current !== null) {
            const holdDuration = Date.now() - jumpKeyDownTimeRef.current;
            engineRef.current.player.executeJump(holdDuration);
            jumpKeyDownTimeRef.current = null;
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          engineRef.current.player.setSlowDown(false);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [gameStarted]); // Add gameStarted dependency

  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoldingRef = useRef(false);
  const jumpTouchStartTimeRef = useRef<number | null>(null);

  const onTouchStart = () => {
    if (!engineRef.current) return;
    
    // Start tracking jump
    jumpTouchStartTimeRef.current = Date.now();
    engineRef.current.player.startJump();
    
    // Start hold timer for slowdown (separate from jump)
    isHoldingRef.current = false;
    touchTimeoutRef.current = setTimeout(() => {
      if (engineRef.current) {
        isHoldingRef.current = true;
        engineRef.current.player.setSlowDown(true);
      }
    }, 200); // 200ms delay before slowdown activates
  };

  const onTouchEnd = () => {
    if (!engineRef.current) return;
    
    // Execute jump based on hold duration
    if (jumpTouchStartTimeRef.current !== null) {
      const holdDuration = Date.now() - jumpTouchStartTimeRef.current;
      engineRef.current.player.executeJump(holdDuration);
      jumpTouchStartTimeRef.current = null;
    }
    
    // Clear hold timer
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
    
    // Stop slowdown
    if (isHoldingRef.current) {
      engineRef.current.player.setSlowDown(false);
      isHoldingRef.current = false;
    }
  };

  const handleStart = () => {
    console.log('Starting game');
    if (engineRef.current) {
      engineRef.current.isRunning = true; // Resume the game
      setGameStarted(true);
    }
  };

  const handleRestart = () => {
    console.log('Restarting game');
    
    // Save high score if game was running
    if (engineRef.current && gameState) {
      saveHighScore(gameState.score);
    }
    
    // CRITICAL FIX: Cancel old RAF loop before creating new engine
    // Without this, multiple RAF loops accumulate causing race conditions
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (engineRef.current) {
      // Create new engine
      engineRef.current = new GameEngine();
      engineRef.current.start();
      setGameState(engineRef.current.getState());
      engineRef.current.isRunning = false; // Pause until player presses start
      setGameStarted(false); // Show menu again
      
      // Restart RAF loop with new engine
      const updateGame = () => {
        if (isUpdatingRef.current) {
          console.warn('RAF re-entry prevented! Multiple loops detected.');
          return;
        }
        
        isUpdatingRef.current = true;
        
        try {
          if (engineRef.current) {
            engineRef.current.update();
            setGameState(engineRef.current.getState());
          }
        } finally {
          isUpdatingRef.current = false;
          animationFrameRef.current = requestAnimationFrame(updateGame);
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(updateGame);
    }
  };

  if (!gameState) {
    return <View style={styles.container} />;
  }

  return (
    <View
      style={styles.container}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <View style={styles.gameContainer}>
        <SkyBackground />
        
        {gameState.clouds.map((cloud) => (
          <CloudComponent key={cloud.id} cloud={cloud} />
        ))}
        
        {gameState.powerLines.map((powerLine) => (
          <PowerLineComponent key={powerLine.id} powerLine={powerLine} />
        ))}
        
        {gameState.buildings.map((building) => (
          <BuildingComponent key={building.id} building={building} />
        ))}
        
        {gameState.powerUps.map((powerUp) => (
          <PowerUpComponent key={powerUp.id} powerUp={powerUp} />
        ))}
        
        {gameState.explosions.map((explosion) => (
          <ExplosionComponent key={explosion.id} explosion={explosion} />
        ))}
        
        {gameState.projectiles.map((projectile) => (
          <ProjectileComponent key={projectile.id} projectile={projectile} />
        ))}
        
        <PlayerComponent
          screenX={gameState.player.screenX}
          y={gameState.player.y}
          width={gameState.player.width}
          height={gameState.player.height}
          isInvincible={gameState.player.isInvincible}
          isFlying={gameState.player.isFlying}
          isInvincibilityExpiring={gameState.player.isInvincibilityExpiring}
          isFlyingExpiring={gameState.player.isFlyingExpiring}
          hasSkateBoard={gameState.player.hasSkateBoard}
          isSkateboardExpiring={gameState.player.isSkateboardExpiring}
          skateboardRotation={gameState.player.skateboardRotation}
        />
        
        <HUDComponent
          score={gameState.score}
          jumpsAvailable={gameState.player.jumpsAvailable}
          isGrounded={gameState.player.isGrounded}
        />
        
        {!gameStarted && (
          <StartMenuScreen onStart={handleStart} highScores={highScores} />
        )}
        
        {gameStarted && !gameState.isRunning && (
          <GameOverScreen score={gameState.score} onRestart={handleRestart} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameContainer: {
    width: GameTheme.dimensions.screenWidth,
    height: GameTheme.dimensions.screenHeight,
    position: 'relative',
    overflow: 'hidden',
  },
});

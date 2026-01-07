import { GameTheme } from '@/constants/gameTheme';
import { SurvivalCalculator } from './survivalCalculator';

type BuildingType = 'SKYSCRAPER' | 'MIDRISE' | 'BROWNSTONE' | 'BODEGA';

export class PowerLine {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  building1Id: number;
  building2Id: number;
  isBungeeActive: boolean;
  bungeeStartTime: number | null;
  poleHeight: number; // Fixed pole height for equal poles

  constructor(id: number, building1: Building, building2: Building) {
    this.id = id;
    this.building1Id = building1.id;
    this.building2Id = building2.id;
    this.isBungeeActive = false;
    this.bungeeStartTime = null;
    
    // Connect from right side of building1 to left side of building2
    this.x1 = building1.x + building1.width;
    this.x2 = building2.x;
    
    // Position in LOWER HALF of screen at varying heights
    // Screen height is 430, so lower half is 215-430
    const lowerHalfStart = 250;
    const lowerHalfEnd = 380;
    const baseHeight = lowerHalfStart + Math.random() * (lowerHalfEnd - lowerHalfStart);
    
    // BOTH poles at SAME height (use base height for both)
    this.y1 = baseHeight;
    this.y2 = baseHeight;
    
    // Calculate consistent pole height (from cable to ground)
    this.poleHeight = GameTheme.dimensions.screenHeight - baseHeight;
  }

  activateBungee(): void {
    this.isBungeeActive = true;
    this.bungeeStartTime = Date.now();
  }

  resetBungee(): void {
    this.isBungeeActive = false;
    this.bungeeStartTime = null;
  }

  isPlayerOnLine(playerX: number, playerY: number, playerWidth: number, playerHeight: number): { onLine: boolean; y?: number } {
    const playerLeft = playerX - playerWidth / 2;
    const playerRight = playerX + playerWidth / 2;
    const playerBottom = playerY + playerHeight / 2;
    
    // Check if player is horizontally within the line
    if (playerRight < this.x1 || playerLeft > this.x2) {
      return { onLine: false };
    }
    
    // Calculate Y position on the line at player's X (with sag)
    const lineProgress = (playerX - this.x1) / (this.x2 - this.x1);
    const baseLineY = this.y1 + (this.y2 - this.y1) * lineProgress;
    
    // Add natural sag (parabola) - lower in the middle
    const sagAmount = 20;
    const sag = sagAmount * Math.sin(lineProgress * Math.PI);
    const lineY = baseLineY + sag;
    
    // Check if player is close enough to the line
    const distanceToLine = Math.abs(playerBottom - lineY);
    if (distanceToLine <= 12) {
      return { onLine: true, y: lineY };
    }
    
    return { onLine: false };
  }

  getScreenCoords(cameraOffset: number): { x1: number; y1: number; x2: number; y2: number; poleHeight: number } {
    return {
      x1: this.x1 - cameraOffset,
      y1: this.y1,
      x2: this.x2 - cameraOffset,
      y2: this.y2,
      poleHeight: this.poleHeight,
    };
  }
}

export class Cloud {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(id: number, xPos: number, yPos: number) {
    this.id = id;
    this.x = xPos;
    this.y = yPos;
    this.width = 80;
    this.height = 40;
  }

  isPlayerOnCloud(playerX: number, playerY: number, playerWidth: number, playerHeight: number): boolean {
    const playerLeft = playerX - playerWidth / 2;
    const playerRight = playerX + playerWidth / 2;
    const playerBottom = playerY + playerHeight / 2;
    
    const horizontalOverlap = playerRight > this.x && playerLeft < this.x + this.width;
    if (!horizontalOverlap) return false;
    
    const distanceToTop = Math.abs(playerBottom - this.y);
    return distanceToTop <= 10;
  }

  getScreenX(cameraOffset: number): number {
    return this.x - cameraOffset;
  }
}

export class PowerUp {
  id: number;
  type: 'invincibility' | 'flying' | 'bomb' | 'skateboard';
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;

  constructor(id: number, xPos: number, yPos: number, type: 'invincibility' | 'flying' | 'bomb' | 'skateboard') {
    this.id = id;
    this.type = type;
    this.x = xPos;
    this.y = yPos;
    this.width = 30;
    this.height = 30;
    this.collected = false;
  }

  checkCollection(playerX: number, playerY: number, playerWidth: number, playerHeight: number): boolean {
    if (this.collected) return false;

    const playerLeft = playerX - playerWidth / 2;
    const playerRight = playerX + playerWidth / 2;
    const playerTop = playerY - playerHeight / 2;
    const playerBottom = playerY + playerHeight / 2;

    const powerUpLeft = this.x - this.width / 2;
    const powerUpRight = this.x + this.width / 2;
    const powerUpTop = this.y - this.height / 2;
    const powerUpBottom = this.y + this.height / 2;

    return (
      playerRight > powerUpLeft &&
      playerLeft < powerUpRight &&
      playerBottom > powerUpTop &&
      playerTop < powerUpBottom
    );
  }

  getScreenX(cameraOffset: number): number {
    return this.x - cameraOffset;
  }
}

export class Explosion {
  id: number;
  x: number;
  y: number;
  startTime: number;
  duration: number;

  constructor(id: number, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.startTime = Date.now();
    this.duration = 500; // 0.5 second explosion animation
  }

  isFinished(): boolean {
    return Date.now() - this.startTime > this.duration;
  }

  getProgress(): number {
    // Returns 0-1 representing animation progress
    return Math.min(1, (Date.now() - this.startTime) / this.duration);
  }

  getScreenX(cameraOffset: number): number {
    return this.x - cameraOffset;
  }
}

export class Building {
  id: number;
  type: BuildingType;
  x: number;
  width: number;
  height: number;
  y: number;
  colors: {
    main: string;
    accent: string;
    roof: string;
    window: string;
  };
  roofX: number;
  roofY: number;
  roofWidth: number;
  roofHeight: number;
  windowPattern: boolean[][];

  constructor(id: number, xPos: number, type: BuildingType) {
    this.id = id;
    this.type = type;
    this.x = xPos;
    const config = GameTheme.buildings[type.toLowerCase() as keyof typeof GameTheme.buildings];
    this.width = config.widthMin + Math.random() * (config.widthMax - config.widthMin);
    this.height = config.heightMin + Math.random() * (config.heightMax - config.heightMin);
    this.y = GameTheme.dimensions.screenHeight - this.height;
    this.colors = GameTheme.colors[type.toLowerCase() as keyof typeof GameTheme.colors] as any;
    
    this.roofX = this.x - 8;
    this.roofY = this.y + GameTheme.dimensions.roofOffsetY;
    this.roofWidth = this.width + 16;
    this.roofHeight = GameTheme.dimensions.roofHeight;
    
    this.windowPattern = this._generateWindowPattern();
  }
  
  _generateWindowPattern(): boolean[][] {
    const windowRows = Math.floor(this.height / 35);
    const windowCols = this.type === 'SKYSCRAPER' ? 4 : 3;
    const pattern: boolean[][] = [];
    
    for (let row = 0; row < windowRows; row++) {
      const rowPattern: boolean[] = [];
      for (let col = 0; col < windowCols; col++) {
        rowPattern.push(Math.random() > 0.5);
      }
      pattern.push(rowPattern);
    }
    
    return pattern;
  }
  
  isPlayerOnRoof(playerX: number, playerY: number, playerWidth: number, playerHeight: number): boolean {
    const playerLeft = playerX - playerWidth / 2;
    const playerRight = playerX + playerWidth / 2;
    const playerBottom = playerY + playerHeight / 2;
    
    const horizontalOverlap = playerRight > this.roofX && playerLeft < this.roofX + this.roofWidth;
    if (!horizontalOverlap) return false;
    
    const distanceToRoof = Math.abs(playerBottom - this.roofY);
    return distanceToRoof <= 10;
  }
  
  getScreenX(cameraOffset: number): number {
    return this.x - cameraOffset;
  }
}

export class Player {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  isGrounded: boolean;
  jumpsAvailable: number;
  width: number;
  height: number;
  isSlowingDown: boolean;
  jumpStartTime: number | null;
  currentPowerLine: PowerLine | null;
  isInvincible: boolean;
  invincibilityEndTime: number | null;
  isFlying: boolean;
  flyingEndTime: number | null;
  hasSkateBoard: boolean;
  skateboardEndTime: number | null;
  skateboardRotation: number;
  clampedToBuilding: Building | null;
  clampSide: 'left' | 'right' | null;

  constructor() {
    this.x = GameTheme.dimensions.screenWidth / 2;
    this.y = 200;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isGrounded = false;
    this.jumpsAvailable = 2;
    this.width = GameTheme.dimensions.playerWidth;
    this.height = GameTheme.dimensions.playerHeight;
    this.isSlowingDown = false;
    this.jumpStartTime = null;
    this.currentPowerLine = null;
    this.isInvincible = false;
    this.invincibilityEndTime = null;
    this.isFlying = false;
    this.flyingEndTime = null;
    this.hasSkateBoard = false;
    this.skateboardEndTime = null;
    this.skateboardRotation = 0;
    this.clampedToBuilding = null;
    this.clampSide = null;
  }
  
  startJump(): void {
    if (this.jumpsAvailable > 0) {
      this.jumpStartTime = Date.now();
    }
  }

  executeJump(holdDuration: number): boolean {
    // FLYING: Allow unlimited jumps (infinite flutter)
    const canJump = this.isFlying || (this.jumpsAvailable > 0 && this.jumpStartTime !== null);
    
    if (canJump && this.jumpStartTime !== null) {
      // BUNGEE EFFECT: If jumping from power line, give double jump boost!
      const onPowerLine = this.currentPowerLine !== null;
      
      // Calculate base jump power
      const minHold = 0;
      const maxHold = 200;
      const clampedDuration = Math.max(minHold, Math.min(holdDuration, maxHold));
      const jumpStrength = clampedDuration / maxHold;
      let jumpPower = GameTheme.physics.jumpPowerMin + 
                     (GameTheme.physics.jumpPowerMax - GameTheme.physics.jumpPowerMin) * jumpStrength;
      
      // BUNGEE BOOST: Power line gives consecutive double jump power!
      if (onPowerLine) {
        jumpPower = GameTheme.physics.jumpPowerMax * 1.6; // 60% more powerful!
        this.currentPowerLine = null; // Release from power line
      }
      
      // FLYING: Reduce jump power to 35% - gentle flutter jumps
      if (this.isFlying) {
        jumpPower = jumpPower * 0.35; // 35% jump power when flying
      }
      
      this.velocityY = jumpPower;
      
      // Only decrement jumps if NOT flying
      if (!this.isFlying) {
        this.jumpsAvailable--;
      }
      
      this.isGrounded = false;
      this.jumpStartTime = null;
      return true;
    }
    return false;
  }

  cancelJump(): void {
    this.jumpStartTime = null;
  }

  setSlowDown(slow: boolean): void {
    this.isSlowingDown = slow;
  }
  
  activateInvincibility(): void {
    this.isInvincible = true;
    this.invincibilityEndTime = Date.now() + 10000; // 10 seconds
  }
  
  activateFlying(): void {
    this.isFlying = true;
    this.flyingEndTime = Date.now() + 10000; // 10 seconds
  }
  
  activateSkateBoard(): void {
    this.hasSkateBoard = true;
    this.skateboardEndTime = Date.now() + 10000; // 10 seconds
    this.skateboardRotation = 0;
  }
  
  updateInvincibility(): void {
    if (this.isInvincible && this.invincibilityEndTime && Date.now() > this.invincibilityEndTime) {
      this.isInvincible = false;
      this.invincibilityEndTime = null;
    }
  }
  
  updateFlying(): void {
    if (this.isFlying && this.flyingEndTime && Date.now() > this.flyingEndTime) {
      this.isFlying = false;
      this.flyingEndTime = null;
    }
  }
  
  updateSkateBoard(): void {
    if (this.hasSkateBoard && this.skateboardEndTime && Date.now() > this.skateboardEndTime) {
      this.hasSkateBoard = false;
      this.skateboardEndTime = null;
      this.clampedToBuilding = null;
      this.clampSide = null;
      this.skateboardRotation = 0;
    }
    
    // Update rotation based on state
    if (this.hasSkateBoard) {
      if (this.clampSide === 'left') {
        // On left wall - vertical orientation
        this.skateboardRotation = 90;
      } else if (this.isGrounded) {
        // On ground/roof - horizontal
        this.skateboardRotation = 0;
      } else {
        // In air - spinning
        this.skateboardRotation += 15;
        if (this.skateboardRotation >= 360) {
          this.skateboardRotation -= 360;
        }
      }
    } else {
      this.skateboardRotation = 0;
    }
  }
  
  isInvincibilityExpiring(): boolean {
    if (!this.isInvincible || !this.invincibilityEndTime) return false;
    const timeLeft = this.invincibilityEndTime - Date.now();
    return timeLeft <= 2000 && timeLeft > 0; // Last 2 seconds
  }
  
  isFlyingExpiring(): boolean {
    if (!this.isFlying || !this.flyingEndTime) return false;
    const timeLeft = this.flyingEndTime - Date.now();
    return timeLeft <= 2000 && timeLeft > 0; // Last 2 seconds
  }
  
  isSkateboardExpiring(): boolean {
    if (!this.hasSkateBoard || !this.skateboardEndTime) return false;
    const timeLeft = this.skateboardEndTime - Date.now();
    return timeLeft <= 2000 && timeLeft > 0; // Last 2 seconds
  }
  
  landOnRoof(roofY: number): void {
    this.y = roofY - this.height / 2;
    this.velocityY = 0;
    this.isGrounded = true;
    this.jumpsAvailable = 2;
  }
  
  setAirborne(): void {
    this.isGrounded = false;
  }
  
  applyGravity(): void {
    // When flying, reduce gravity significantly but don't eliminate it
    // This allows jumps to still work but gives floaty feeling
    const gravityMultiplier = this.isFlying ? 0.2 : 1.0;
    this.velocityY += GameTheme.physics.gravity * gravityMultiplier;
    
    // Air resistance - cap falling speed for more floaty feel
    // When flying, cap is even lower for more control
    const maxFallSpeed = this.isFlying ? 3 : 8;
    if (this.velocityY > maxFallSpeed) {
      this.velocityY = maxFallSpeed;
    }
    
    // Gentle air drag when moving fast
    this.velocityY *= 0.98; // 2% drag
  }
  
  updatePosition(): void {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
}

export type ProjectileType = 'paper-plane' | 'anvil' | 'pizza' | 'rat' | 'needle' | 'taxi' | 'brick' | 'banana';

export class Projectile {
  id: number;
  type: ProjectileType;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  width: number;
  height: number;
  rotation: number;

  constructor(id: number, type: ProjectileType, x: number, y: number) {
    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;
    // Velocities will be set externally by _spawnProjectile
    this.velocityX = 0;
    this.velocityY = 0;
    this.rotation = Math.random() * 360;
    
    switch (type) {
      case 'paper-plane':
        this.width = 35;
        this.height = 25;
        break;
      case 'anvil':
        this.width = 30;
        this.height = 30;
        break;
      case 'pizza':
        this.width = 35;
        this.height = 35;
        break;
      case 'rat':
        this.width = 25;
        this.height = 15;
        break;
      case 'needle':
        this.width = 20;
        this.height = 40;
        break;
      case 'taxi':
        this.width = 45;
        this.height = 25;
        break;
      case 'brick':
        this.width = 25;
        this.height = 15;
        break;
      case 'banana':
        this.width = 30;
        this.height = 20;
        break;
    }
  }

  update(): void {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.rotation += 3;
  }

  getScreenX(cameraOffset: number): number {
    return this.x - cameraOffset;
  }

  checkCollision(playerX: number, playerY: number, playerWidth: number, playerHeight: number): boolean {
    // SAFETY CHECK: If projectile is more than 200px away in WORLD space, no collision possible
    const worldDistance = Math.abs(this.x - playerX);
    if (worldDistance > 200) {
      return false;
    }
    
    // DIFFICULTY: Increased tolerance from 4px to 5px for +8% forgiveness
    const playerTolerance = 5;
    
    const playerLeft = playerX - playerWidth / 2 + playerTolerance;
    const playerRight = playerX + playerWidth / 2 - playerTolerance;
    const playerTop = playerY - playerHeight / 2 + playerTolerance;
    const playerBottom = playerY + playerHeight / 2 - playerTolerance;

    // CRITICAL FIX: Projectile hitboxes are MUCH SMALLER than stated dimensions
    // This matches the actual visual sprite size (not the bounding box)
    // DIFFICULTY: Reduced from 0.6 to 0.55 for more forgiving gameplay
    const hitboxShrink = 0.55; // Projectile hitbox is 55% of stated size
    const effectiveWidth = this.width * hitboxShrink;
    const effectiveHeight = this.height * hitboxShrink;
    
    const projLeft = this.x - effectiveWidth / 2;
    const projRight = this.x + effectiveWidth / 2;
    const projTop = this.y - effectiveHeight / 2;
    const projBottom = this.y + effectiveHeight / 2;

    const collision = (
      playerRight > projLeft &&
      playerLeft < projRight &&
      playerBottom > projTop &&
      playerTop < projBottom
    );
    
    return collision;
  }
}

export interface BuildingData {
  id: number;
  type: BuildingType;
  x: number;
  width: number;
  height: number;
  y: number;
  colors: {
    main: string;
    accent: string;
    roof: string;
    window: string;
  };
  roofX: number;
  roofY: number;
  roofWidth: number;
  roofHeight: number;
  windowPattern: boolean[][];
  screenX: number;
}

export interface CloudData {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  screenX: number;
}

export interface PowerLineData {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  poleHeight: number;
}

export interface ProjectileData {
  id: number;
  type: ProjectileType;
  screenX: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface PowerUpData {
  id: number;
  type: 'invincibility' | 'flying' | 'bomb' | 'skateboard';
  screenX: number;
  y: number;
  width: number;
  height: number;
}

export interface ExplosionData {
  id: number;
  screenX: number;
  y: number;
  progress: number;
}

export interface GameState {
  player: {
    screenX: number;
    y: number;
    width: number;
    height: number;
    isGrounded: boolean;
    jumpsAvailable: number;
    isInvincible: boolean;
    isFlying: boolean;
    isInvincibilityExpiring: boolean;
    isFlyingExpiring: boolean;
    hasSkateBoard: boolean;
    isSkateboardExpiring: boolean;
    skateboardRotation: number;
  };
  buildings: BuildingData[];
  clouds: CloudData[];
  powerLines: PowerLineData[];
  projectiles: ProjectileData[];
  powerUps: PowerUpData[];
  explosions: ExplosionData[];
  score: number;
  isRunning: boolean;
  cameraOffset: number;
}

export class GameEngine {
  player: Player;
  buildings: Building[];
  clouds: Cloud[];
  powerLines: PowerLine[];
  projectiles: Projectile[];
  powerUps: PowerUp[];
  explosions: Explosion[];
  cameraOffset: number;
  score: number;
  isRunning: boolean;
  keys: { left: boolean; right: boolean };
  projectileSpawnTimer: number;
  lastPowerLineIndex: number;
  survivalCalcCounter: number; // OPTIMIZATION: Only calculate every 30 frames

  constructor() {
    this.player = new Player();
    this.buildings = [];
    this.clouds = [];
    this.powerLines = [];
    this.projectiles = [];
    this.powerUps = [];
    this.explosions = [];
    this.cameraOffset = 0;
    this.score = 0;
    this.isRunning = false;
    this.keys = { left: false, right: false };
    this.projectileSpawnTimer = 0;
    this.lastPowerLineIndex = -2;
    this.survivalCalcCounter = 0;
  }
  
  start(): void {
    this.buildings = this._createBuildings();
    this.powerLines = this._createPowerLines();
    this.clouds = this._createClouds();
    this.projectiles = [];
    this.powerUps = [];
    this.explosions = [];
    const first = this.buildings[0];
    this.player.x = first.x + first.width / 2;
    this.player.y = first.roofY - GameTheme.dimensions.playerHeight / 2;
    this.player.velocityY = 0;
    this.player.isGrounded = true;
    this.score = 0;
    this.cameraOffset = 0;
    this.isRunning = true;
    this.projectileSpawnTimer = 0;
  }
  
  _createBuildings(): Building[] {
    const types: BuildingType[] = ['SKYSCRAPER', 'MIDRISE', 'BROWNSTONE', 'BODEGA'];
    const buildings: Building[] = [];
    
    const startingPlatformWidth = 300;
    const startingPlatformX = GameTheme.dimensions.screenWidth / 2 - startingPlatformWidth / 2;
    const startingBuilding = new Building(0, startingPlatformX, 'MIDRISE');
    startingBuilding.width = startingPlatformWidth;
    startingBuilding.roofX = startingBuilding.x - 8;
    startingBuilding.roofWidth = startingBuilding.width + 16;
    buildings.push(startingBuilding);
    
    let xPos = startingPlatformX + startingPlatformWidth + (100 + Math.random() * 70);
    for (let i = 1; i < 20; i++) {
      const prevBuilding = buildings[buildings.length - 1];
      const type = types[Math.floor(Math.random() * types.length)];
      const newBuilding = this._createReachableBuilding(i, xPos, type, prevBuilding);
      buildings.push(newBuilding);
      xPos += newBuilding.width + (100 + Math.random() * 80);
    }
    return buildings;
  }
  
  _createClouds(): Cloud[] {
    const clouds: Cloud[] = [];
    let xPos = 200;
    
    for (let i = 0; i < 30; i++) {
      const y = 50 + Math.random() * 150; // Clouds between y=50 and y=200
      const cloud = new Cloud(i, xPos, y);
      clouds.push(cloud);
      xPos += 250 + Math.random() * 200; // Spacing between clouds
    }
    
    return clouds;
  }
  
  _createPowerLines(): PowerLine[] {
    const lines: PowerLine[] = [];
    let lastSpawnedIndex = -3; // Track last spawned position
    
    // Create power lines strategically between buildings
    for (let i = 0; i < this.buildings.length - 1; i++) {
      const building1 = this.buildings[i];
      const building2 = this.buildings[i + 1];
      
      // Only create power line if buildings aren't too far apart
      const distance = building2.x - (building1.x + building1.width);
      
      // CRITICAL: At least 2 buildings gap since last power line (prevents consecutive)
      const gapSinceLastLine = i - lastSpawnedIndex;
      const enoughGap = gapSinceLastLine >= 3; // At least 2 buildings between power lines
      
      if (distance < 300 && distance > 50 && enoughGap) {
        // Calculate height difference - useful for escaping or reaching higher platforms
        const heightDiff = Math.abs(building1.roofY - building2.roofY);
        
        // Strategic spawning:
        // - Higher chance (40%) when there's a height difference (helps player climb)
        // - Lower chance (15%) when buildings are level (less useful)
        let spawnChance = heightDiff > 30 ? 0.40 : 0.15;
        
        if (Math.random() < spawnChance) {
          const line = new PowerLine(i, building1, building2);
          lines.push(line);
          lastSpawnedIndex = i; // Mark this position
        }
      }
    }
    
    return lines;
  }
  
  _createReachableBuilding(id: number, xPos: number, type: BuildingType, prevBuilding: Building): Building {
    const maxJumpHeight = 120;
    const maxJumpDown = 180;
    
    const prevRoofY = prevBuilding.roofY;
    const minRoofY = prevRoofY - maxJumpHeight;
    const maxRoofY = prevRoofY + maxJumpDown;
    
    const newBuilding = new Building(id, xPos, type);
    
    if (newBuilding.roofY < minRoofY) {
      const adjustment = minRoofY - newBuilding.roofY;
      newBuilding.height -= adjustment;
      newBuilding.y = GameTheme.dimensions.screenHeight - newBuilding.height;
      newBuilding.roofY = newBuilding.y + GameTheme.dimensions.roofOffsetY;
    } else if (newBuilding.roofY > maxRoofY) {
      const adjustment = newBuilding.roofY - maxRoofY;
      newBuilding.height -= adjustment;
      newBuilding.y = GameTheme.dimensions.screenHeight - newBuilding.height;
      newBuilding.roofY = newBuilding.y + GameTheme.dimensions.roofOffsetY;
    }
    
    const minHeight = 60;
    if (newBuilding.height < minHeight) {
      newBuilding.height = minHeight;
      newBuilding.y = GameTheme.dimensions.screenHeight - newBuilding.height;
      newBuilding.roofY = newBuilding.y + GameTheme.dimensions.roofOffsetY;
    }
    
    return newBuilding;
  }
  
  update(): void {
    if (!this.isRunning) return;
    
    // Apply slow-down if player is holding
    const scrollSpeed = this.player.isSlowingDown 
      ? GameTheme.physics.autoScrollSpeed * 0.5 
      : GameTheme.physics.autoScrollSpeed;
    
    this.player.x += scrollSpeed;
    this.cameraOffset += scrollSpeed;
    
    // Update player physics
    this.player.applyGravity();
    this.player.updatePosition();
    
    // Update invincibility timer
    this.player.updateInvincibility();
    
    // Update flying timer
    this.player.updateFlying();
    
    // Update skateboard timer and rotation
    this.player.updateSkateBoard();
    
    // Update all projectiles BEFORE checking collisions
    for (const projectile of this.projectiles) {
      projectile.update();
    }
    
    // Check powerup collection
    for (const powerUp of this.powerUps) {
      if (powerUp.checkCollection(this.player.x, this.player.y, this.player.width, this.player.height)) {
        powerUp.collected = true;
        
        // Activate the appropriate powerup
        if (powerUp.type === 'invincibility') {
          this.player.activateInvincibility();
        } else if (powerUp.type === 'flying') {
          this.player.activateFlying();
        } else if (powerUp.type === 'skateboard') {
          this.player.activateSkateBoard();
        } else if (powerUp.type === 'bomb') {
          // BOMB: Explode all visible projectiles!
          for (const projectile of this.projectiles) {
            const screenX = projectile.getScreenX(this.cameraOffset);
            
            // Only explode visible projectiles
            if (screenX > -100 && screenX < GameTheme.dimensions.screenWidth + 100) {
              // Create explosion at projectile location
              const explosion = new Explosion(Date.now() + Math.random(), projectile.x, projectile.y);
              this.explosions.push(explosion);
            }
          }
          
          // Remove all projectiles from screen
          this.projectiles = this.projectiles.filter(p => {
            const screenX = p.getScreenX(this.cameraOffset);
            return screenX < -100 || screenX > GameTheme.dimensions.screenWidth + 100;
          });
        }
      }
    }
    
    // Remove collected powerups
    this.powerUps = this.powerUps.filter(p => !p.collected && p.getScreenX(this.cameraOffset) > -100);
    
    // Remove finished explosions
    this.explosions = this.explosions.filter(e => !e.isFinished());
    
    // NOW check platform collisions (player is on something)
    if (this.player.velocityY >= 0) {
      let standingOnSurface = false;
      let surfaceY: number | null = null;
      
      // Reset power line at start of check
      this.player.currentPowerLine = null;
      
      // Only check platforms within reasonable distance (OPTIMIZATION)
      const checkDistance = 500;
      
      // Check building roofs
      for (const building of this.buildings) {
        const distanceToBuilding = Math.abs(building.x - this.player.x);
        if (distanceToBuilding < checkDistance && 
            building.isPlayerOnRoof(this.player.x, this.player.y, this.player.width, this.player.height)) {
          standingOnSurface = true;
          surfaceY = building.roofY;
          break;
        }
      }
      
      // Check power lines if not on a building
      if (!standingOnSurface) {
        for (const line of this.powerLines) {
          const distanceToLine = Math.abs((line.x1 + line.x2) / 2 - this.player.x);
          if (distanceToLine < checkDistance) {
            const lineCheck = line.isPlayerOnLine(this.player.x, this.player.y, this.player.width, this.player.height);
            if (lineCheck.onLine && lineCheck.y !== undefined) {
              standingOnSurface = true;
              surfaceY = lineCheck.y;
              this.player.currentPowerLine = line; // Track which power line
              break;
            }
          }
        }
      }
      
      // Check clouds if not on building or power line
      if (!standingOnSurface) {
        for (const cloud of this.clouds) {
          const distanceToCloud = Math.abs(cloud.x - this.player.x);
          if (distanceToCloud < checkDistance &&
              cloud.isPlayerOnCloud(this.player.x, this.player.y, this.player.width, this.player.height)) {
            standingOnSurface = true;
            surfaceY = cloud.y;
            break;
          }
        }
      }
      
      if (standingOnSurface && surfaceY !== null) {
        this.player.landOnRoof(surfaceY);
      } else {
        this.player.setAirborne();
      }
    } else {
      // Player is moving upward - clear power line
      this.player.currentPowerLine = null;
    }
    
    // CRITICAL: Check projectile collisions BEFORE skateboard (prevents position corruption)
    // Only check projectiles that are on-screen
    // AND only kill if player is NOT invincible
    if (!this.player.isInvincible) {
      for (const projectile of this.projectiles) {
        const screenX = projectile.getScreenX(this.cameraOffset);
        
        // ULTRA STRICT on-screen check - must be FULLY VISIBLE
        const isOnScreen = screenX >= 0 && screenX <= GameTheme.dimensions.screenWidth;
        
        // Also check Y bounds - projectile must be in visible area (not off top/bottom)
        const isInVisibleArea = projectile.y >= 0 && projectile.y <= GameTheme.dimensions.screenHeight;
        
        // ADDITIONAL: Check world distance - must be reasonably close
        const worldDistance = Math.abs(projectile.x - this.player.x);
        const isReasonablyClose = worldDistance < 400; // Must be within 400px in world space
        
        if (isOnScreen && isInVisibleArea && isReasonablyClose) {
          if (projectile.checkCollision(this.player.x, this.player.y, this.player.width, this.player.height)) {
            // DEBUG: Log what killed the player
            console.log('DEATH BY PROJECTILE:', {
              projectileType: projectile.type,
              projectileWorldX: projectile.x,
              projectileY: projectile.y,
              projectileScreenX: screenX,
              playerWorldX: this.player.x,
              playerY: this.player.y,
              worldDistance: worldDistance,
              cameraOffset: this.cameraOffset
            });
            this.isRunning = false;
            break; // Stop checking once we find a collision
          }
        }
      }
    }
    
    // SKATEBOARD: Wall riding physics (LEFT SIDE ONLY)
    // NOW happens AFTER collision check (prevents teleport-into-projectile bug)
    if (this.player.hasSkateBoard) {
      let onLeftWall = false;
      
      // Player can JUMP to break free from wall at any time
      // (Jump logic happens earlier in update, so this only applies if not jumping)
      
      for (const building of this.buildings) {
        const distanceToBuilding = Math.abs(building.x - this.player.x);
        
        if (distanceToBuilding < 500) {
          const playerLeft = this.player.x - this.player.width / 2;
          const playerRight = this.player.x + this.player.width / 2;
          const playerTop = this.player.y - this.player.height / 2;
          const playerBottom = this.player.y + this.player.height / 2;
          const playerCenterY = this.player.y;
          
          const buildingLeft = building.x;
          const buildingRight = building.x + building.width;
          const buildingTop = building.y;
          const buildingBottom = building.y + building.height;
          const roofY = building.roofY;
          
          // ONLY STICK TO LEFT WALL - ride UP
          const touchingLeftWall = Math.abs(playerRight - buildingLeft) < 25 && 
                                   playerCenterY > roofY + 10 && 
                                   playerCenterY < buildingBottom;
          
          if (touchingLeftWall) {
            onLeftWall = true;
            this.player.clampedToBuilding = building;
            this.player.clampSide = 'left';
            this.player.x = buildingLeft - this.player.width / 2 - 3;
            this.player.velocityX = 0;
            this.player.velocityY = -5; // Ride UP
            this.player.jumpsAvailable = 2; // Can jump off wall
            this.player.isGrounded = false;
            break;
          }
          
          // TRANSITION TO ROOF when reaching top
          const atTopCorner = Math.abs(playerRight - buildingLeft) < 25 &&
                             playerCenterY <= roofY + 10 &&
                             playerCenterY >= roofY - 10;
          
          if (atTopCorner) {
            onLeftWall = true;
            this.player.clampedToBuilding = building;
            this.player.clampSide = null;
            this.player.y = roofY - this.player.height / 2;
            this.player.velocityY = 0;
            this.player.velocityX = 0;
            this.player.isGrounded = true;
            this.player.jumpsAvailable = 2;
            break;
          }
        }
      }
      
      // If not on left wall, clear clamp state
      if (!onLeftWall) {
        this.player.clampedToBuilding = null;
        this.player.clampSide = null;
      }
    } else {
      // No skateboard - clear all clamp state
      this.player.clampedToBuilding = null;
      this.player.clampSide = null;
    }
    
    // Remove off-screen projectiles
    this.projectiles = this.projectiles.filter(p => p.getScreenX(this.cameraOffset) > -100);
    
    // Spawn projectiles - LESS OFTEN for easier gameplay
    this.projectileSpawnTimer++;
    if (this.projectileSpawnTimer > 150) { // Was 108, now 150 = 40% less frequent
      this.projectileSpawnTimer = 0;
      
      // OPTIMIZATION: Only run survival calc every 30 frames (0.5 seconds)
      this.survivalCalcCounter++;
      const shouldRunCalc = this.survivalCalcCounter % 30 === 0;
      
      let shouldSpawn = true; // Default to spawning
      
      if (shouldRunCalc) {
        // Check if we should spawn based on current difficulty
        shouldSpawn = SurvivalCalculator.shouldSpawnProjectile(
          this.player,
          this.buildings,
          this.powerLines,
          this.clouds,
          this.projectiles,
          this.cameraOffset
        );
      }
      
      if (shouldSpawn) {
        this._spawnProjectile();
        
        // 12.5% each powerup (50% total for any powerup)
        const powerUpRoll = Math.random();
        if (powerUpRoll < 0.125) {
          this._spawnPowerUp('invincibility');
        } else if (powerUpRoll < 0.25) {
          this._spawnPowerUp('flying');
        } else if (powerUpRoll < 0.375) {
          this._spawnPowerUp('bomb');
        } else if (powerUpRoll < 0.5) {
          this._spawnPowerUp('skateboard');
        }
      }
    }
    
    // Spawn new buildings
    const last = this.buildings[this.buildings.length - 1];
    if (last.getScreenX(this.cameraOffset) < 1400) {
      const types: BuildingType[] = ['SKYSCRAPER', 'MIDRISE', 'BROWNSTONE', 'BODEGA'];
      const type = types[Math.floor(Math.random() * types.length)];
      const xPos = last.x + last.width + (100 + Math.random() * 80);
      const newBuilding = this._createReachableBuilding(Date.now(), xPos, type, last);
      this.buildings.push(newBuilding);
      
      // Create power line to new building (33% chance, not consecutive)
      const currentBuildingIndex = this.buildings.length - 1;
      const buildingsSinceLastPowerLine = currentBuildingIndex - this.lastPowerLineIndex;
      const canSpawnPowerLine = buildingsSinceLastPowerLine > 1; // At least 1 building gap
      
      const prevBuilding = this.buildings[this.buildings.length - 2];
      const distance = newBuilding.x - (prevBuilding.x + prevBuilding.width);
      
      if (distance < 300 && distance > 50 && canSpawnPowerLine && Math.random() < 0.33) {
        const newLine = new PowerLine(Date.now(), prevBuilding, newBuilding);
        this.powerLines.push(newLine);
        this.lastPowerLineIndex = currentBuildingIndex;
      }
    }
    
    // Spawn new clouds
    const lastCloud = this.clouds[this.clouds.length - 1];
    if (lastCloud && lastCloud.getScreenX(this.cameraOffset) < 1400) {
      const xPos = lastCloud.x + 250 + Math.random() * 200;
      const y = 50 + Math.random() * 150;
      const newCloud = new Cloud(Date.now(), xPos, y);
      this.clouds.push(newCloud);
    }
    
    // SAFETY CHECK: Add emergency platform if situation is unsurvivable
    // OPTIMIZATION: Only check every 30 frames
    if (this.survivalCalcCounter % 30 === 0) {
      const needsSafety = SurvivalCalculator.shouldAddSafetyPlatform(
        this.player,
        this.buildings,
        this.powerLines,
        this.clouds,
        this.projectiles,
        this.cameraOffset
      );
      
      if (needsSafety) {
        // Spawn safety cloud ahead of player
        const safetyX = this.player.x + 150 + Math.random() * 100;
        const safetyY = Math.max(50, this.player.y - 50 - Math.random() * 50); // Clamp to min Y=50
        const safetyCloud = new Cloud(Date.now() + 1000, safetyX, safetyY);
        this.clouds.push(safetyCloud);
      }
    }
    
    // Remove off-screen buildings, power lines, and clouds
    this.buildings = this.buildings.filter(b => b.getScreenX(this.cameraOffset) > -400);
    this.powerLines = this.powerLines.filter(line => line.x2 - this.cameraOffset > -400);
    this.clouds = this.clouds.filter(c => c.getScreenX(this.cameraOffset) > -200);
    
    // Game over conditions - ONLY bottom/left, NEVER top!
    // Player can go as high as they want without dying
    const fellOffBottom = this.player.y > GameTheme.dimensions.screenHeight + 50; // Below screen
    const fellOffLeft = this.player.x - this.cameraOffset < -50; // Behind camera
    
    if (fellOffBottom || fellOffLeft) {
      console.log('Game Over:', fellOffBottom ? 'Fell off bottom' : 'Fell off left');
      this.isRunning = false;
    }
    
    this.score++;
  }
  
  _spawnProjectile(): void {
    const types: ProjectileType[] = ['paper-plane', 'anvil', 'pizza', 'rat', 'needle', 'taxi', 'brick', 'banana'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    // ALL projectiles spawn from the right side of screen
    // CRITICAL: Spawn FURTHER right to ensure they're never too close to player
    const x = this.cameraOffset + GameTheme.dimensions.screenWidth + 100; // Increased from 50 to 100
    
    // Random height from top 60% of screen (visible but varied)
    const y = 20 + Math.random() * 250; // Between y=20 and y=270
    
    const projectile = new Projectile(Date.now(), type, x, y);
    
    // DIFFICULTY: Reduced speed from -1 to -1.75 → -0.9 to -1.5 (14% slower avg = +10% reaction time)
    projectile.velocityX = -0.9 - Math.random() * 0.6; // Slower: -0.9 to -1.5
    
    // Small vertical drift (up or down slightly for variety)
    projectile.velocityY = (Math.random() - 0.5) * 0.75; // Slight up/down drift
    
    this.projectiles.push(projectile);
  }
  
  _spawnPowerUp(type: 'invincibility' | 'flying' | 'bomb' | 'skateboard'): void {
    // Spawn powerup ahead of player
    const spawnX = this.cameraOffset + GameTheme.dimensions.screenWidth + 100;
    
    // Find nearby buildings to avoid collision
    const nearbyBuildings = this.buildings.filter(b => {
      const dist = Math.abs(b.x - spawnX);
      return dist < 300; // Check buildings within 300px
    });
    
    let spawnY: number;
    
    if (nearbyBuildings.length > 0) {
      // Find the closest building
      const closest = nearbyBuildings.reduce((prev, curr) => {
        const prevDist = Math.abs(prev.x - spawnX);
        const currDist = Math.abs(curr.x - spawnX);
        return currDist < prevDist ? curr : prev;
      });
      
      // Check if spawn X is inside this building
      const isInsideBuilding = spawnX >= closest.x && spawnX <= (closest.x + closest.width);
      
      if (isInsideBuilding) {
        // Spawn ON TOP of the building roof instead
        spawnY = closest.roofY - 40; // 40px above the roof
      } else {
        // Spawn in open air, but avoid building height range
        const buildingTop = closest.y;
        const buildingBottom = closest.y + closest.height;
        
        // Spawn either well above or well below the building
        if (Math.random() < 0.5) {
          spawnY = Math.max(50, buildingTop - 80); // Above building
        } else {
          spawnY = Math.min(350, buildingBottom + 40); // Below building (if space)
        }
      }
    } else {
      // No buildings nearby - spawn in open air
      spawnY = 80 + Math.random() * 250; // Mid-screen height
    }
    
    const powerUp = new PowerUp(Date.now(), spawnX, spawnY, type);
    this.powerUps.push(powerUp);
  }
  
  getState(): GameState {
    return {
      player: {
        screenX: this.player.x - this.cameraOffset,
        y: this.player.y,
        width: this.player.width,
        height: this.player.height,
        isGrounded: this.player.isGrounded,
        jumpsAvailable: this.player.jumpsAvailable,
        isInvincible: this.player.isInvincible,
        isFlying: this.player.isFlying,
        isInvincibilityExpiring: this.player.isInvincibilityExpiring(),
        isFlyingExpiring: this.player.isFlyingExpiring(),
        hasSkateBoard: this.player.hasSkateBoard,
        isSkateboardExpiring: this.player.isSkateboardExpiring(),
        skateboardRotation: this.player.skateboardRotation,
      },
      buildings: this.buildings.map(b => ({
        id: b.id,
        type: b.type,
        x: b.x,
        width: b.width,
        height: b.height,
        y: b.y,
        colors: b.colors,
        roofX: b.roofX,
        roofY: b.roofY,
        roofWidth: b.roofWidth,
        roofHeight: b.roofHeight,
        windowPattern: b.windowPattern,
        screenX: b.getScreenX(this.cameraOffset),
      })),
      clouds: this.clouds.map(c => ({
        id: c.id,
        x: c.x,
        y: c.y,
        width: c.width,
        height: c.height,
        screenX: c.getScreenX(this.cameraOffset),
      })),
      powerLines: this.powerLines.map(line => {
        const coords = line.getScreenCoords(this.cameraOffset);
        return {
          id: line.id,
          x1: coords.x1,
          y1: coords.y1,
          x2: coords.x2,
          y2: coords.y2,
          poleHeight: coords.poleHeight,
        };
      }),
      projectiles: this.projectiles.map(p => ({
        id: p.id,
        type: p.type,
        screenX: p.getScreenX(this.cameraOffset),
        y: p.y,
        width: p.width,
        height: p.height,
        rotation: p.rotation,
      })),
      powerUps: this.powerUps.map(p => ({
        id: p.id,
        type: p.type,
        screenX: p.getScreenX(this.cameraOffset),
        y: p.y,
        width: p.width,
        height: p.height,
      })),
      explosions: this.explosions.map(e => ({
        id: e.id,
        screenX: e.getScreenX(this.cameraOffset),
        y: e.y,
        progress: e.getProgress(),
      })),
      score: this.score,
      isRunning: this.isRunning,
      cameraOffset: this.cameraOffset,
    };
  }
}

import type { Ship, Obstacle, GameState, GameSettings } from './types';
import { getRandomInRange, getRandomInt, generateId, clamp, distance } from '../lib/utils';

export class GameEngine {
  private animationId: number | null = null;
  private lastTime = 0;
  private gameState: GameState;
  private onStateChange: (state: GameState) => void;
  private canvas: { width: number; height: number };

  constructor(
    initialState: GameState,
    onStateChange: (state: GameState) => void,
    canvasSize: { width: number; height: number }
  ) {
    this.gameState = { ...initialState };
    this.onStateChange = onStateChange;
    this.canvas = canvasSize;
  }

  start() {
    if (this.animationId) {
      this.stop();
    }
    this.lastTime = performance.now();
    this.gameLoop();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  pause() {
    this.gameState.isPaused = true;
    this.onStateChange({ ...this.gameState });
    this.stop();
  }

  resume() {
    this.gameState.isPaused = false;
    this.onStateChange({ ...this.gameState });
    this.start();
  }

  updateCanvasSize(width: number, height: number) {
    this.canvas = { width, height };
  }

  private gameLoop = () => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;

    if (!this.gameState.isPaused && this.gameState.isPlaying) {
      this.update(deltaTime);
    }

    this.onStateChange({ ...this.gameState });

    if (this.gameState.isPlaying && !this.gameState.isGameOver) {
      this.animationId = requestAnimationFrame(this.gameLoop);
    }
  };

  private update(deltaTime: number) {
    // Update timer
    if (!this.gameState.settings.infiniteMode) {
      this.gameState.timer -= deltaTime;
      if (this.gameState.timer <= 0) {
        this.gameState.timer = 0;
        this.endGame(false);
        return;
      }
    }

    // Update blackout effect
    if (this.gameState.blackoutActive && performance.now() > this.gameState.blackoutEndTime) {
      this.gameState.blackoutActive = false;
    }

    // Update stun effect
    if (this.gameState.stunned && performance.now() > this.gameState.stunnedEndTime) {
      this.gameState.stunned = false;
    }

    // Update ships
    this.updateShips(deltaTime);

    // Update obstacles
    this.updateObstacles(deltaTime);

    // Check for random events
    this.checkRandomEvents();

    // Check win condition
    if (this.gameState.repairedCount >= this.gameState.totalShips) {
      this.endGame(true);
    }

    // Progressive difficulty
    this.updateDifficulty();
  }

  private updateShips(deltaTime: number) {
    this.gameState.ships.forEach(ship => {
      if (ship.isBroken && !ship.isRepairing) {
        // Update position
        ship.x += ship.velocityX * deltaTime;
        ship.y += ship.velocityY * deltaTime;

        // Update angle for visual rotation
        ship.angle += 0.5 * deltaTime;

        // Bounce off edges
        if (ship.x <= 0 || ship.x >= this.canvas.width - ship.size) {
          ship.velocityX *= -1;
          ship.x = clamp(ship.x, 0, this.canvas.width - ship.size);
        }
        if (ship.y <= 0 || ship.y >= this.canvas.height - ship.size) {
          ship.velocityY *= -1;
          ship.y = clamp(ship.y, 0, this.canvas.height - ship.size);
        }

        // Add some randomness to movement
        if (Math.random() < 0.01) {
          ship.velocityX += getRandomInRange(-20, 20);
          ship.velocityY += getRandomInRange(-20, 20);
          
          // Clamp velocities
          const maxSpeed = this.getMaxShipSpeed();
          ship.velocityX = clamp(ship.velocityX, -maxSpeed, maxSpeed);
          ship.velocityY = clamp(ship.velocityY, -maxSpeed, maxSpeed);
        }
      }
    });
  }

  private updateObstacles(deltaTime: number) {
    this.gameState.obstacles.forEach(obstacle => {
      // Update position
      obstacle.x += obstacle.velocityX * deltaTime;
      obstacle.y += obstacle.velocityY * deltaTime;

      // Update rotation
      obstacle.angle += obstacle.rotationSpeed * deltaTime;

      // Wrap around screen edges
      if (obstacle.x < -obstacle.width) {
        obstacle.x = this.canvas.width;
      } else if (obstacle.x > this.canvas.width) {
        obstacle.x = -obstacle.width;
      }

      if (obstacle.y < -obstacle.height) {
        obstacle.y = this.canvas.height;
      } else if (obstacle.y > this.canvas.height) {
        obstacle.y = -obstacle.height;
      }

      // Occasional speed bursts
      if (Math.random() < 0.005) {
        obstacle.velocityX *= 1.5;
        obstacle.velocityY *= 1.5;
        
        // Reset after a short time
        setTimeout(() => {
          obstacle.velocityX /= 1.5;
          obstacle.velocityY /= 1.5;
        }, 2000);
      }
    });
  }

  private checkRandomEvents() {
    // Random blackout event (1% chance per frame, but limit frequency)
    if (Math.random() < 0.0001 && !this.gameState.blackoutActive) {
      this.triggerBlackout();
    }

    // Spawn additional obstacles occasionally
    if (Math.random() < 0.001 && this.gameState.obstacles.length < 15) {
      this.spawnRandomObstacle();
    }
  }

  private triggerBlackout() {
    this.gameState.blackoutActive = true;
    this.gameState.blackoutEndTime = performance.now() + getRandomInRange(1000, 2000);
  }

  public triggerStun() {
    this.gameState.stunned = true;
    this.gameState.stunnedEndTime = performance.now() + 1000; // 1 second stun
  }

  private updateDifficulty() {
    const progressRatio = this.gameState.repairedCount / this.gameState.totalShips;
    const speedMultiplier = 1 + progressRatio * 0.5; // Up to 50% faster

    this.gameState.ships.forEach(ship => {
      if (ship.isBroken) {
        const baseSpeed = 50;
        const currentSpeed = Math.sqrt(ship.velocityX ** 2 + ship.velocityY ** 2);
        if (currentSpeed > 0) {
          const newSpeed = Math.min(baseSpeed * speedMultiplier, 120);
          const ratio = newSpeed / currentSpeed;
          ship.velocityX *= ratio;
          ship.velocityY *= ratio;
        }
      }
    });
  }

  private getMaxShipSpeed(): number {
    const progressRatio = this.gameState.repairedCount / this.gameState.totalShips;
    return 80 + progressRatio * 40; // Speed increases from 80 to 120
  }

  private spawnRandomObstacle() {
    const obstacle: Obstacle = {
      id: generateId(),
      type: ['asteroid', 'debris', 'energy-field'][getRandomInt(0, 2)] as 'asteroid' | 'debris' | 'energy-field',
      x: getRandomInRange(-50, this.canvas.width + 50),
      y: getRandomInRange(-50, this.canvas.height + 50),
      width: getRandomInRange(20, 60),
      height: getRandomInRange(20, 60),
      velocityX: getRandomInRange(-30, 30),
      velocityY: getRandomInRange(-30, 30),
      angle: 0,
      rotationSpeed: getRandomInRange(-2, 2),
      opacity: getRandomInRange(0.6, 0.9)
    };

    this.gameState.obstacles.push(obstacle);
  }

  public isClickBlocked(x: number, y: number): boolean {
    if (this.gameState.stunned) {
      return true;
    }

    // Check if click is blocked by obstacles
    return this.gameState.obstacles.some(obstacle => {
      return x >= obstacle.x &&
             x <= obstacle.x + obstacle.width &&
             y >= obstacle.y &&
             y <= obstacle.y + obstacle.height;
    });
  }

  public getShipAt(x: number, y: number): Ship | null {
    // During blackout, make it harder to see ships
    if (this.gameState.blackoutActive && Math.random() < 0.7) {
      return null;
    }

    for (const ship of this.gameState.ships) {
      if (ship.isBroken && !ship.isRepairing) {
        const shipDistance = distance(x, y, ship.x + ship.size / 2, ship.y + ship.size / 2);
        const hitRadius = ship.size / 2;
        
        // Progressive difficulty: shrink hitbox slightly
        const progressRatio = this.gameState.repairedCount / this.gameState.totalShips;
        const adjustedRadius = hitRadius * (1 - progressRatio * 0.2); // Up to 20% smaller
        
        if (shipDistance <= adjustedRadius) {
          return ship;
        }
      }
    }
    return null;
  }

  public repairShip(shipId: string) {
    const ship = this.gameState.ships.find(s => s.id === shipId);
    if (ship) {
      ship.isBroken = false;
      ship.quizState = 'passed';
      ship.isRepairing = true;
      
      // Move ship to safe zone (animation will be handled by component)
      ship.velocityX = 0;
      ship.velocityY = 0;
      
      this.gameState.repairedCount++;
      this.gameState.currentStreak++;
      
      if (this.gameState.currentStreak > this.gameState.streakCount) {
        this.gameState.streakCount = this.gameState.currentStreak;
      }
      
      // Calculate score
      const basePoints = 100;
      const difficultyMultiplier = ship.difficulty === 'hard' ? 1.5 : ship.difficulty === 'medium' ? 1.2 : 1;
      const streakBonus = this.gameState.currentStreak >= 3 ? 50 : 0;
      
      this.gameState.score += Math.floor((basePoints * difficultyMultiplier) + streakBonus);
    }
  }

  public failShip(shipId: string) {
    const ship = this.gameState.ships.find(s => s.id === shipId);
    if (ship) {
      ship.quizState = 'failed';
      // Reset streak on failure
      this.gameState.currentStreak = 0;
      // Ship becomes clickable again after a delay
      setTimeout(() => {
        if (ship.quizState === 'failed') {
          ship.quizState = 'unanswered';
        }
      }, 3000);
    }
  }

  private endGame(won: boolean) {
    this.gameState.isGameOver = true;
    this.gameState.hasWon = won;
    this.gameState.isPlaying = false;
    this.stop();
  }

  public startNewGame(settings: GameSettings) {
    this.stop();
    this.gameState = this.createInitialGameState(settings);
    this.gameState.isPlaying = true;
    this.gameState.isGameOver = false;
    this.gameState.isPaused = false;
    this.onStateChange({ ...this.gameState });
    this.start();
  }

  public resetGame(settings: GameSettings) {
    this.stop();
    this.gameState = this.createInitialGameState(settings);
    this.gameState.isPlaying = true;
    this.gameState.isGameOver = false;
    this.gameState.isPaused = false;
    this.onStateChange({ ...this.gameState });
  }

  private createInitialGameState(settings: GameSettings): GameState {
    const ships: Ship[] = [];
    const obstacles: Obstacle[] = [];

    // Create ships
    for (let i = 0; i < settings.shipCount; i++) {
      const difficulty = i < 3 ? 'easy' : i < 6 ? 'medium' : 'hard';
      const ship: Ship = {
        id: generateId(),
        x: getRandomInRange(50, this.canvas.width - 100),
        y: getRandomInRange(50, this.canvas.height - 100),
        velocityX: getRandomInRange(-50, 50),
        velocityY: getRandomInRange(-50, 50),
        isBroken: true,
        isRepairing: false,
        difficulty,
        size: 40,
        color: difficulty === 'hard' ? '#FF6B35' : difficulty === 'medium' ? '#FFD700' : '#00D4FF',
        angle: 0,
        quizState: 'unanswered'
      };
      ships.push(ship);
    }

    // Create initial obstacles
    for (let i = 0; i < 6; i++) {
      obstacles.push(this.createRandomObstacle());
    }

    return {
      ships,
      obstacles,
      score: 0,
      repairedCount: 0,
      totalShips: settings.shipCount,
      timer: settings.infiniteMode ? 0 : 240, // 4 minutes default
      maxTime: settings.infiniteMode ? 0 : 240,
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      hasWon: false,
      streakCount: 0,
      currentStreak: 0,
      settings,
      blackoutActive: false,
      blackoutEndTime: 0,
      stunned: false,
      stunnedEndTime: 0
    };
  }

  private createRandomObstacle(): Obstacle {
    return {
      id: generateId(),
      type: ['asteroid', 'debris', 'energy-field'][getRandomInt(0, 2)] as 'asteroid' | 'debris' | 'energy-field',
      x: getRandomInRange(0, this.canvas.width),
      y: getRandomInRange(0, this.canvas.height),
      width: getRandomInRange(30, 80),
      height: getRandomInRange(30, 80),
      velocityX: getRandomInRange(-40, 40),
      velocityY: getRandomInRange(-40, 40),
      angle: 0,
      rotationSpeed: getRandomInRange(-1, 1),
      opacity: getRandomInRange(0.7, 1)
    };
  }
}

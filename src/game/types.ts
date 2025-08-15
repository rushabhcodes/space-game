export interface Ship {
  id: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  isBroken: boolean;
  isRepairing: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  size: number;
  color: string;
  angle: number;
  quizState: 'unanswered' | 'in-progress' | 'passed' | 'failed';
  lastClickTime?: number;
}

export interface Obstacle {
  id: string;
  type: 'asteroid' | 'debris' | 'energy-field' | 'space-mine' | 'plasma-cloud' | 'metal-scrap' | 'crystal-fragment';
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  angle: number;
  rotationSpeed: number;
  opacity: number;
  shape?: 'circle' | 'square' | 'triangle' | 'diamond' | 'hexagon' | 'irregular';
  size?: 'small' | 'medium' | 'large' | 'huge';
}

export interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  answerIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

export interface GameState {
  ships: Ship[];
  obstacles: Obstacle[];
  score: number;
  repairedCount: number;
  totalShips: number;
  timer: number;
  maxTime: number;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  hasWon: boolean;
  streakCount: number;
  currentStreak: number;
  settings: GameSettings;
  blackoutActive: boolean;
  blackoutEndTime: number;
  stunned: boolean;
  stunnedEndTime: number;
}

export interface GameSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  infiniteMode: boolean;
  soundEnabled: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  shipCount: number;
}

export interface QuizModalState {
  isOpen: boolean;
  ship: Ship | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: (number | null)[];
  showFeedback: boolean;
  feedbackMessage: string;
  isCorrect: boolean;
}

export interface GameStats {
  totalScore: number;
  shipsRepaired: number;
  totalShips: number;
  timeRemaining: number;
  accuracy: number;
  streaks: number;
  timeBonus: number;
}

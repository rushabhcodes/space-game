import { useState, useCallback, useRef, useEffect } from 'react';
import type { GameState, GameSettings, Ship, QuizModalState } from '../game/types';
import type { Question } from '../game/types';
import { GameEngine } from '../game/engine';
import { loadFromLocalStorage, saveToLocalStorage } from '../lib/utils';
import questionsData from '../data/questions.json';

const defaultSettings: GameSettings = {
  difficulty: 'medium',
  infiniteMode: false,
  soundEnabled: true,
  reducedMotion: false,
  highContrast: false,
  shipCount: 8
};

const initialGameState: GameState = {
  ships: [],
  obstacles: [],
  score: 0,
  repairedCount: 0,
  totalShips: 8,
  timer: 240,
  maxTime: 240,
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
  hasWon: false,
  streakCount: 0,
  currentStreak: 0,
  settings: defaultSettings,
  blackoutActive: false,
  blackoutEndTime: 0,
  stunned: false,
  stunnedEndTime: 0
};

export function useGameLoop() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [quizModal, setQuizModal] = useState<QuizModalState>({
    isOpen: false,
    ship: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    showFeedback: false,
    feedbackMessage: '',
    isCorrect: false
  });

  const gameEngineRef = useRef<GameEngine | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Initialize game engine
  useEffect(() => {
    const settings = loadFromLocalStorage('spaceGameSettings', defaultSettings);
    const canvasSize = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // Create initial state with proper settings
    const initialState = {
      ...initialGameState,
      settings,
      totalShips: settings.shipCount
    };

    gameEngineRef.current = new GameEngine(
      initialState,
      setGameState,
      canvasSize
    );

    // Handle window resize
    const handleResize = () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.updateCanvasSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (gameEngineRef.current) {
        gameEngineRef.current.stop();
      }
    };
  }, []);

  const startGame = useCallback(() => {
    console.log('Starting game...', gameEngineRef.current);
    if (gameEngineRef.current) {
      console.log('Game engine found, starting new game');
      gameEngineRef.current.startNewGame(gameState.settings);
    } else {
      console.log('No game engine found!');
    }
  }, [gameState.settings]);

  const pauseGame = useCallback(() => {
    if (gameEngineRef.current) {
      if (gameState.isPaused) {
        gameEngineRef.current.resume();
      } else {
        gameEngineRef.current.pause();
      }
    }
  }, [gameState.isPaused]);

  const openQuizModal = useCallback((ship: Ship) => {
    const allQuestions = questionsData.questions as Question[];
    const filteredQuestions = allQuestions.filter(q => q.difficulty === ship.difficulty);
    const selectedQuestions = filteredQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(3, filteredQuestions.length));

    setQuizModal({
      isOpen: true,
      ship,
      questions: selectedQuestions,
      currentQuestionIndex: 0,
      answers: new Array(selectedQuestions.length).fill(null),
      showFeedback: false,
      feedbackMessage: '',
      isCorrect: false
    });

    // Pause the game when quiz opens
    if (gameEngineRef.current) {
      gameEngineRef.current.pause();
    }
  }, []);

  const handleShipClick = useCallback((x: number, y: number) => {
    if (!gameEngineRef.current || gameState.isPaused || gameState.isGameOver) {
      return;
    }

    // Check if click is blocked
    if (gameEngineRef.current.isClickBlocked(x, y)) {
      gameEngineRef.current.triggerStun();
      return;
    }

    // Get ship at click position
    const ship = gameEngineRef.current.getShipAt(x, y);
    if (ship && ship.quizState === 'unanswered') {
      openQuizModal(ship);
    }
  }, [gameState.isPaused, gameState.isGameOver, openQuizModal]);

  const closeQuizModal = useCallback(() => {
    setQuizModal(prev => ({ ...prev, isOpen: false }));
    
    // Resume the game when quiz closes
    if (gameEngineRef.current && gameState.isPlaying) {
      gameEngineRef.current.resume();
    }
  }, [gameState.isPlaying]);

  const answerQuestion = useCallback((answerIndex: number) => {
    const { questions, currentQuestionIndex, ship } = quizModal;
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.answerIndex;

    // Update answers array
    const newAnswers = [...quizModal.answers];
    newAnswers[currentQuestionIndex] = answerIndex;

    setQuizModal(prev => ({
      ...prev,
      answers: newAnswers,
      showFeedback: true,
      feedbackMessage: isCorrect ? 'Correct!' : `Incorrect. ${currentQuestion.explanation || ''}`,
      isCorrect
    }));

    // After feedback delay, move to next question or finish
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        // Move to next question
        setQuizModal(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          showFeedback: false,
          feedbackMessage: '',
          isCorrect: false
        }));
      } else {
        // Check if all answers are correct
        const allCorrect = newAnswers.every((answer, index) => 
          answer === questions[index].answerIndex
        );

        if (allCorrect && ship && gameEngineRef.current) {
          gameEngineRef.current.repairShip(ship.id);
        } else if (ship && gameEngineRef.current) {
          gameEngineRef.current.failShip(ship.id);
        }

        closeQuizModal();
      }
    }, 2000);
  }, [quizModal, closeQuizModal]);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    const updatedSettings = { ...gameState.settings, ...newSettings };
    setGameState(prev => ({ ...prev, settings: updatedSettings }));
    saveToLocalStorage('spaceGameSettings', updatedSettings);
  }, [gameState.settings]);

  const resetGame = useCallback(() => {
    if (gameEngineRef.current) {
      gameEngineRef.current.startNewGame(gameState.settings);
    }
    setQuizModal(prev => ({ ...prev, isOpen: false }));
  }, [gameState.settings]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'p':
          if (gameState.isPlaying) {
            pauseGame();
          }
          break;
        case 'escape':
          if (quizModal.isOpen) {
            closeQuizModal();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isPlaying, pauseGame, quizModal.isOpen, closeQuizModal]);

  // Save high score
  useEffect(() => {
    if (gameState.isGameOver) {
      const highScore = loadFromLocalStorage('spaceGameHighScore', 0);
      if (gameState.score > highScore) {
        saveToLocalStorage('spaceGameHighScore', gameState.score);
      }
    }
  }, [gameState.isGameOver, gameState.score]);

  return {
    gameState,
    quizModal,
    gameContainerRef,
    startGame,
    pauseGame,
    resetGame,
    handleShipClick,
    answerQuestion,
    closeQuizModal,
    updateSettings
  };
}

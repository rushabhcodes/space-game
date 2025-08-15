import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { StarfieldBackground } from '../components/StarfieldBackground';
import { ShipSprite } from '../components/ShipSprite';
import { ObstacleSprite } from '../components/ObstacleSprite';
import { HUD } from '../components/HUD';
import { QuizModal } from '../components/QuizModal';
import { PenaltyEffect } from '../components/PenaltyEffect';
import { useGameLoop } from '../hooks/useGameLoop';
import { cn } from '../lib/utils';

export const Game: React.FC = () => {
  const [penaltyEffect, setPenaltyEffect] = useState<{
    isVisible: boolean;
    effectType: 'default' | 'explosion' | 'electric' | 'toxic' | 'freeze' | 'energy';
  }>({
    isVisible: false,
    effectType: 'default'
  });

  const {
    gameState,
    quizModal,
    gameContainerRef,
    startGame,
    pauseGame,
    resetGame,
    handleShipClick,
    answerQuestion,
    closeQuizModal
  } = useGameLoop();

  const handleContainerClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!gameContainerRef.current) return;
    
    const rect = gameContainerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if clicking on a ship or empty space
    handleShipClick(x, y);
    
    // For now, we'll trigger penalty on any click that doesn't hit a ship
    // This is a simplified version - in a real game you'd want more precise hit detection
    if (gameState.isPlaying && Math.random() > 0.7) { // Random chance for demonstration
      setPenaltyEffect({ isVisible: true, effectType: 'default' });
      setTimeout(() => {
        setPenaltyEffect({ isVisible: false, effectType: 'default' });
      }, 1000);
    }
  }, [handleShipClick, gameContainerRef, gameState.isPlaying]);

  const handleObstacleClick = useCallback((obstacleType: string) => {
    if (gameState.isPlaying) {
      let effectType: 'default' | 'explosion' | 'electric' | 'toxic' | 'freeze' | 'energy' = 'default';
      
      switch (obstacleType) {
        case 'asteroid':
          effectType = 'explosion';
          break;
        case 'debris':
        case 'metal-scrap':
          effectType = 'electric';
          break;
        case 'space-mine':
          effectType = 'explosion';
          break;
        case 'plasma-cloud':
          effectType = 'energy';
          break;
        case 'crystal-fragment':
          effectType = 'freeze';
          break;
        case 'energy-field':
          effectType = 'electric';
          break;
        default:
          effectType = 'default';
      }
      
      // If effect is already visible, reset it first
      if (penaltyEffect.isVisible) {
        setPenaltyEffect({ isVisible: false, effectType: 'default' });
        // Use a small delay to ensure the previous effect is properly cleared
        setTimeout(() => {
          setPenaltyEffect({ isVisible: true, effectType });
        }, 50);
      } else {
        setPenaltyEffect({ isVisible: true, effectType });
      }
    }
  }, [gameState.isPlaying, penaltyEffect.isVisible]);

  if (!gameState.isPlaying && !gameState.isGameOver) {
    return (
      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        <StarfieldBackground />
        
        {/* Background nebula image */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1920&h=1080&fit=crop&crop=center')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'hue-rotate(180deg) saturate(1.5)'
          }}
        />
        
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 p-8 bg-black/40 backdrop-blur-md rounded-3xl border border-space-blue/20 shadow-2xl max-w-4xl mx-4"
          >
            {/* Custom Space Rescue Logo */}
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex justify-center mb-6"
            >
              <motion.svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                className="drop-shadow-2xl"
                animate={{
                  filter: [
                    "drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))",
                    "drop-shadow(0 0 20px rgba(138, 43, 226, 0.8))",
                    "drop-shadow(0 0 15px rgba(0, 255, 136, 0.6))",
                    "drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {/* Outer ring - space station */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="url(#outerGradient)"
                  strokeWidth="3"
                  strokeDasharray="8 4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "60px 60px" }}
                />
                
                {/* Inner ring */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="35"
                  fill="none"
                  stroke="url(#innerGradient)"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "60px 60px" }}
                />
                
                {/* Central spaceship */}
                <motion.g
                  animate={{
                    y: [0, -2, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Ship body */}
                  <ellipse cx="60" cy="60" rx="12" ry="20" fill="url(#shipGradient)" />
                  
                  {/* Ship wings */}
                  <path
                    d="M45 55 L55 60 L45 65 Z"
                    fill="url(#wingGradient)"
                  />
                  <path
                    d="M75 55 L65 60 L75 65 Z"
                    fill="url(#wingGradient)"
                  />
                  
                  {/* Engine glow */}
                  <motion.ellipse
                    cx="60"
                    cy="75"
                    rx="4"
                    ry="8"
                    fill="url(#engineGradient)"
                    animate={{
                      opacity: [0.6, 1, 0.6],
                      ry: [6, 10, 6]
                    }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.g>
                
                {/* Rescue beam */}
                <motion.path
                  d="M60 40 L50 20 L70 20 Z"
                  fill="url(#beamGradient)"
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scaleY: [0.8, 1.2, 0.8]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: "60px 40px" }}
                />
                
                {/* Stars */}
                {[
                  { x: 20, y: 25 },
                  { x: 100, y: 30 },
                  { x: 15, y: 90 },
                  { x: 105, y: 85 },
                  { x: 25, y: 55 },
                  { x: 95, y: 65 }
                ].map((star, i) => (
                  <motion.circle
                    key={i}
                    cx={star.x}
                    cy={star.y}
                    r="1.5"
                    fill="#ffffff"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                      duration: 2 + i * 0.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2
                    }}
                  />
                ))}
                
                {/* Gradients */}
                <defs>
                  <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="50%" stopColor="#8a2be2" />
                    <stop offset="100%" stopColor="#00ff88" />
                  </linearGradient>
                  
                  <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00ff88" />
                    <stop offset="50%" stopColor="#ff6b35" />
                    <stop offset="100%" stopColor="#00d4ff" />
                  </linearGradient>
                  
                  <linearGradient id="shipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e0e7ff" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                  
                  <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                  
                  <linearGradient id="engineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ff6b35" />
                    <stop offset="100%" stopColor="#ffeb3b" />
                  </linearGradient>
                  
                  <linearGradient id="beamGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="rgba(0, 255, 136, 0.8)" />
                    <stop offset="100%" stopColor="rgba(0, 255, 136, 0.1)" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </motion.div>
            
            <motion.h1
              className="text-7xl font-bold bg-gradient-to-r from-space-blue via-space-purple to-space-green bg-clip-text text-transparent"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(0, 212, 255, 0.5)",
                  "0 0 40px rgba(138, 43, 226, 0.8)",
                  "0 0 20px rgba(0, 255, 136, 0.5)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              SPACE RESCUE
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light mb-8"
            >
              🚀 Emergency distress signals echo through the void! Stranded vessels drift helplessly with critical system failures. 
              As the lead rescue specialist aboard the orbital station, you must <span className="text-space-blue font-semibold">diagnose and repair</span> their 
              malfunctioning systems. <span className="text-space-green font-semibold">Time is running out</span> - can you save them all before their life support fails?
            </motion.div>

            <div className="space-y-6">
              <motion.button
                onClick={startGame}
                className={cn(
                  "px-12 py-6 text-2xl font-bold rounded-2xl relative overflow-hidden",
                  "bg-gradient-to-r from-space-blue via-space-purple to-space-blue",
                  "text-white shadow-2xl hover:shadow-3xl",
                  "transition-all duration-500 transform hover:scale-105",
                  "focus:outline-none focus:ring-4 focus:ring-space-blue/50",
                  "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
                  "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: '0 0 50px rgba(0, 212, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  🚀 LAUNCH RESCUE MISSION
                </span>
              </motion.button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base text-gray-300 max-w-2xl mx-auto">
                <motion.div 
                  className="flex items-center gap-3 p-4 bg-black/30 rounded-xl border border-space-blue/20"
                  whileHover={{ backgroundColor: 'rgba(0, 212, 255, 0.1)' }}
                >
                  <span className="text-2xl">🎯</span>
                  <span>Click damaged ships to begin repairs</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 p-4 bg-black/30 rounded-xl border border-space-purple/20"
                  whileHover={{ backgroundColor: 'rgba(138, 43, 226, 0.1)' }}
                >
                  <span className="text-2xl">�</span>
                  <span>Complete diagnostic procedures</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 p-4 bg-black/30 rounded-xl border border-space-orange/20"
                  whileHover={{ backgroundColor: 'rgba(255, 107, 53, 0.1)' }}
                >
                  <span className="text-2xl">⚡</span>
                  <span>Avoid floating space debris</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 p-4 bg-black/30 rounded-xl border border-space-green/20"
                  whileHover={{ backgroundColor: 'rgba(0, 255, 136, 0.1)' }}
                >
                  <span className="text-2xl">⏱️</span>
                  <span>Race against the mission timer</span>
                </motion.div>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>🎮 Controls: P to pause • ESC to close dialogs • Mouse to interact</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (gameState.isGameOver) {
    return (
      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        <StarfieldBackground />
        
        {/* Dynamic background based on result */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: gameState.hasWon 
              ? `url('https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920&h=1080&fit=crop&crop=center')`
              : `url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop&crop=center')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: gameState.hasWon ? 'hue-rotate(120deg) saturate(1.5)' : 'hue-rotate(0deg) saturate(0.8) brightness(0.7)'
          }}
        />
        
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 p-8 bg-black/60 backdrop-blur-lg rounded-3xl border border-space-blue/30 max-w-4xl mx-4"
          >
            {/* Result Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex justify-center mb-6"
            >
              {gameState.hasWon ? (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3588/3588292.png"
                  alt="Victory"
                  className="w-32 h-32"
                  style={{ filter: 'invert(1) sepia(1) saturate(3) hue-rotate(120deg) brightness(1.2)' }}
                />
              ) : (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1250/1250615.png"
                  alt="Defeat"
                  className="w-32 h-32"
                  style={{ filter: 'invert(1) sepia(1) saturate(3) hue-rotate(0deg) brightness(1.2)' }}
                />
              )}
            </motion.div>

            <motion.h1
              className={cn(
                "text-6xl font-bold mb-6",
                gameState.hasWon 
                  ? "bg-gradient-to-r from-space-green via-space-blue to-space-green bg-clip-text text-transparent" 
                  : "bg-gradient-to-r from-space-orange via-red-500 to-space-orange bg-clip-text text-transparent"
              )}
              animate={gameState.hasWon ? {
                textShadow: [
                  "0 0 20px rgba(0, 255, 136, 0.5)",
                  "0 0 40px rgba(0, 255, 136, 0.8)",
                  "0 0 20px rgba(0, 255, 136, 0.5)"
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {gameState.hasWon ? '🚀 MISSION ACCOMPLISHED!' : '💥 MISSION FAILED'}
            </motion.h1>

            {/* Results Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-200 mb-8"
            >
              {gameState.hasWon ? (
                <p>Outstanding work, Commander! All vessels have been successfully rescued and their systems restored.</p>
              ) : (
                <p>Despite your efforts, some ships remain stranded in the void. The mission continues...</p>
              )}
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-space-blue/30"
              >
                <div className="text-space-blue text-sm font-medium mb-2">FINAL SCORE</div>
                <div className="text-4xl font-bold text-white mb-2">{gameState.score.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Total points earned</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-space-green/30"
              >
                <div className="text-space-green text-sm font-medium mb-2">SHIPS SAVED</div>
                <div className="text-4xl font-bold text-white mb-2">
                  {gameState.repairedCount} / {gameState.totalShips}
                </div>
                <div className="text-xs text-gray-400">Successful rescues</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-space-yellow/30"
              >
                <div className="text-space-yellow text-sm font-medium mb-2">BEST STREAK</div>
                <div className="text-4xl font-bold text-white mb-2">{gameState.streakCount}</div>
                <div className="text-xs text-gray-400">Consecutive saves</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 }}
                className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-space-purple/30"
              >
                <div className="text-space-purple text-sm font-medium mb-2">SUCCESS RATE</div>
                <div className="text-4xl font-bold text-white mb-2">
                  {gameState.totalShips > 0 ? Math.round((gameState.repairedCount / gameState.totalShips) * 100) : 0}%
                </div>
                <div className="text-xs text-gray-400">Mission efficiency</div>
              </motion.div>
            </div>

            <div className="space-y-4">
              <motion.button
                onClick={resetGame}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className={cn(
                  "px-10 py-4 text-xl font-bold rounded-2xl relative overflow-hidden",
                  "bg-gradient-to-r from-space-blue via-space-purple to-space-blue",
                  "text-white shadow-2xl hover:shadow-3xl",
                  "transition-all duration-500 transform hover:scale-105",
                  "focus:outline-none focus:ring-4 focus:ring-space-blue/50",
                  "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
                  "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: '0 0 40px rgba(0, 212, 255, 0.4)'
                }}
              >
                <span className="relative z-10">🚀 LAUNCH NEW MISSION</span>
              </motion.button>

              {gameState.hasWon && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="text-space-green text-lg font-medium"
                >
                  🎉 Exceptional performance! All rescue protocols completed successfully!
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={gameContainerRef}
      className={cn(
        "min-h-screen bg-gray-900 relative overflow-hidden cursor-crosshair",
        gameState.settings.highContrast && "high-contrast",
        gameState.blackoutActive && "brightness-50"
      )}
      onClick={handleContainerClick}
    >
      <StarfieldBackground 
        starCount={gameState.settings.reducedMotion ? 50 : 200}
      />
      
      {/* Deep space nebula background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1920&h=1080&fit=crop&crop=center')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'hue-rotate(240deg) saturate(0.8) brightness(0.6)'
        }}
      />

      {/* Game Elements */}
      <div className="relative z-10">
        {/* Ships */}
        {gameState.ships.map(ship => (
          <ShipSprite
            key={ship.id}
            ship={ship}
            onClick={() => {}}
            isBlackout={gameState.blackoutActive}
          />
        ))}

        {/* Obstacles */}
        {gameState.obstacles.map(obstacle => (
          <ObstacleSprite
            key={obstacle.id}
            obstacle={obstacle}
            onObstacleClick={handleObstacleClick}
          />
        ))}
      </div>

      {/* UI */}
      <HUD 
        gameState={gameState}
        onPause={pauseGame}
      />

      {/* Quiz Modal */}
      <QuizModal
        quizModal={quizModal}
        onAnswer={answerQuestion}
        onClose={closeQuizModal}
      />

      {/* Pause Overlay */}
      {gameState.isPaused && !quizModal.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl font-bold text-white">GAME PAUSED</h2>
            <p className="text-xl text-gray-300">Press P or click Resume to continue</p>
            <motion.button
              onClick={pauseGame}
              className={cn(
                "px-6 py-3 text-lg font-bold rounded-lg",
                "bg-space-blue text-white",
                "hover:bg-space-blue/80 transition-colors"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              RESUME
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Blackout Overlay */}
      {gameState.blackoutActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          className="fixed inset-0 bg-black z-30 pointer-events-none"
        />
      )}

      {/* Penalty Effect */}
      <PenaltyEffect
        isVisible={penaltyEffect.isVisible}
        effectType={penaltyEffect.effectType}
        onComplete={() => setPenaltyEffect({ isVisible: false, effectType: 'default' })}
      />
    </div>
  );
};

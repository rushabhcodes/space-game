import React from 'react';
import { motion } from 'framer-motion';
import type { GameState } from '../game/types';
import { formatTime } from '../lib/utils';
import { cn } from '../lib/utils';

interface HUDProps {
  gameState: GameState;
  onPause: () => void;
  className?: string;
}

export const HUD: React.FC<HUDProps> = ({
  gameState,
  onPause,
  className
}) => {
  const progressPercentage = (gameState.repairedCount / gameState.totalShips) * 100;
  const timePercentage = gameState.settings.infiniteMode ? 100 : 
    (gameState.timer / gameState.maxTime) * 100;

  return (
    <div className={cn(
      "fixed top-4 left-4 right-4 z-50 pointer-events-none",
      className
    )}>
      <div className="flex justify-between items-start">
        {/* Left Panel - Score and Progress */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black/60 backdrop-blur-lg rounded-2xl p-6 border border-space-blue/40 pointer-events-auto shadow-2xl relative overflow-hidden"
          style={{ boxShadow: '0 0 30px rgba(0, 212, 255, 0.2)' }}
        >
          {/* Background circuit pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1518430292197-a0e0e3fb9d48?w=400&h=300&fit=crop&crop=center')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          <div className="relative z-10 space-y-4">
            {/* Score */}
            <div className="text-center">
              <div className="text-space-blue text-sm font-semibold mb-1 flex items-center justify-center gap-2">
                <span>🎯</span>
                MISSION SCORE
              </div>
              <motion.div 
                className="text-3xl font-bold text-white"
                key={gameState.score}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
              >
                {gameState.score.toLocaleString()}
              </motion.div>
            </div>

            {/* Ships Progress */}
            <div className="text-center">
              <div className="text-space-green text-sm font-semibold mb-2 flex items-center justify-center gap-2">
                <span>🚀</span>
                SHIPS RESCUED
              </div>
              <div className="text-xl font-bold text-white mb-2">
                {gameState.repairedCount} / {gameState.totalShips}
              </div>
              <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
                <motion.div
                  className="h-full bg-gradient-to-r from-space-green via-space-blue to-space-purple relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </motion.div>
              </div>
            </div>

            {/* Streak */}
            {gameState.currentStreak > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-3 bg-gradient-to-r from-space-yellow/20 to-space-orange/20 rounded-xl border border-space-yellow/40"
              >
                <div className="text-space-yellow text-sm font-semibold mb-1 flex items-center justify-center gap-2">
                  <span>🔥</span>
                  HOT STREAK
                </div>
                <div className="text-2xl font-bold text-space-yellow">
                  {gameState.currentStreak}
                  {gameState.currentStreak >= 3 && (
                    <span className="text-lg ml-2 animate-bounce">�</span>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Right Panel - Timer and Controls */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black/60 backdrop-blur-lg rounded-2xl p-6 border border-space-blue/40 pointer-events-auto shadow-2xl relative overflow-hidden"
          style={{ boxShadow: '0 0 30px rgba(0, 212, 255, 0.2)' }}
        >
          {/* Background circuit pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1518430292197-a0e0e3fb9d48?w=400&h=300&fit=crop&crop=center')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          <div className="relative z-10 space-y-4 text-center">
            {/* Timer */}
            {!gameState.settings.infiniteMode && (
              <div>
                <div className="text-space-orange text-sm font-semibold mb-2 flex items-center justify-center gap-2">
                  <span>⏱️</span>
                  MISSION TIMER
                </div>
                <motion.div 
                  className={cn(
                    "text-3xl font-bold font-mono mb-2",
                    gameState.timer < 30 ? "text-red-400" : "text-white"
                  )}
                  key={Math.floor(gameState.timer)}
                  animate={gameState.timer < 30 ? { 
                    scale: [1, 1.1, 1],
                    textShadow: [
                      "0 0 10px rgba(239, 68, 68, 0.5)",
                      "0 0 20px rgba(239, 68, 68, 0.8)",
                      "0 0 10px rgba(239, 68, 68, 0.5)"
                    ]
                  } : {}}
                  transition={{ duration: 1, repeat: gameState.timer < 30 ? Infinity : 0 }}
                >
                  {formatTime(gameState.timer)}
                </motion.div>
                <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
                  <motion.div
                    className={cn(
                      "h-full transition-colors duration-300 relative",
                      timePercentage > 50 ? "bg-gradient-to-r from-space-green to-green-400" :
                      timePercentage > 25 ? "bg-gradient-to-r from-space-yellow to-yellow-400" : 
                      "bg-gradient-to-r from-red-500 to-red-600"
                    )}
                    animate={{ width: `${timePercentage}%` }}
                    transition={{ duration: 0.1 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                  </motion.div>
                </div>
              </div>
            )}

            {/* Enhanced Pause Button */}
            <motion.button
              onClick={onPause}
              className={cn(
                "px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden",
                "bg-gradient-to-r from-space-blue/30 to-space-purple/30 border-2 border-space-blue text-white",
                "hover:from-space-blue/50 hover:to-space-purple/50 hover:shadow-lg hover:scale-105",
                "focus:outline-none focus:ring-2 focus:ring-space-blue focus:ring-opacity-50",
                "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
                "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={gameState.isGameOver}
            >
              <span className="relative z-10 flex items-center gap-2">
                {gameState.isPaused ? '▶️ RESUME' : '⏸️ PAUSE'}
              </span>
            </motion.button>

            {/* Enhanced Keyboard Hint */}
            <div className="text-xs text-gray-400 bg-black/20 p-2 rounded-lg border border-gray-600">
              <span className="flex items-center justify-center gap-1">
                <span>⌨️</span>
                Press P to pause
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Status Effects */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 space-y-2">
        {/* Blackout Effect */}
        {gameState.blackoutActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-red-900/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-red-500"
          >
            <div className="text-red-300 text-sm font-medium text-center">
              ⚡ SYSTEM BLACKOUT ⚡
            </div>
          </motion.div>
        )}

        {/* Stunned Effect */}
        {gameState.stunned && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-yellow-900/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-yellow-500"
          >
            <div className="text-yellow-300 text-sm font-medium text-center">
              💫 STUNNED 💫
            </div>
          </motion.div>
        )}

        {/* High Streak Notification */}
        {gameState.currentStreak >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-space-yellow/20 to-space-orange/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-space-yellow"
          >
            <div className="text-space-yellow text-sm font-medium text-center animate-pulse">
              🔥 ON FIRE! {gameState.currentStreak} STREAK! 🔥
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

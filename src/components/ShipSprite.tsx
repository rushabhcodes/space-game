import React from 'react';
import { motion } from 'framer-motion';
import type { Ship } from '../game/types';
import { cn } from '../lib/utils';

interface ShipSpriteProps {
  ship: Ship;
  onClick: () => void;
  isBlackout: boolean;
  className?: string;
}

export const ShipSprite: React.FC<ShipSpriteProps> = ({
  ship,
  onClick,
  isBlackout,
  className
}) => {
  const getShipContent = () => {
    if (ship.isBroken) {
      return (
        <div className="relative">
          {/* Main ship body with enhanced design */}
          <div
            className={cn(
              "w-12 h-12 rounded-full bg-gradient-to-br relative overflow-hidden border-2",
              ship.difficulty === 'hard' ? 'border-space-orange from-space-orange/30 to-red-600/20' :
              ship.difficulty === 'medium' ? 'border-space-yellow from-space-yellow/30 to-orange-500/20' :
              'border-space-blue from-space-blue/30 to-blue-600/20',
              'hover:scale-110 hover:shadow-2xl cursor-pointer transform transition-all duration-300',
              isBlackout ? 'opacity-40' : 'opacity-100'
            )}
            style={{
              boxShadow: isBlackout ? 'none' : `0 0 20px ${ship.color}60, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
              clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
            }}
          >
            {/* Ship icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3104/3104636.png"
                alt="Damaged Spaceship"
                className="w-10 h-10 opacity-90"
                style={{ 
                  filter: ship.difficulty === 'hard' ? 'invert(1) sepia(1) saturate(2) hue-rotate(0deg) brightness(0.8) contrast(1.2)' :
                          ship.difficulty === 'medium' ? 'invert(1) sepia(1) saturate(2) hue-rotate(40deg) brightness(0.9) contrast(1.1)' :
                          'invert(1) sepia(1) saturate(2) hue-rotate(200deg) brightness(1) contrast(1)'
                }}
              />
            </div>
            
            {/* Damage indicators */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse absolute top-1 right-1" />
            </div>
            
            {/* Enhanced sparks and effects */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-orange-400 rounded-full animate-ping animation-delay-500" />
            <div className="absolute top-1/2 -left-1 w-1 h-1 bg-red-400 rounded-full animate-pulse animation-delay-1000" />
            
            {/* Pulsing border effect */}
            <div className="absolute inset-0 rounded-xl border-2 border-white/20 animate-pulse" />
          </div>
          
          {/* Enhanced status indicators */}
          {ship.quizState === 'failed' && (
            <motion.div 
              className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white text-xs">✕</span>
              </div>
            </motion.div>
          )}
          
          {ship.quizState === 'in-progress' && (
            <motion.div 
              className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white text-xs">⚙</span>
              </div>
            </motion.div>
          )}
        </div>
      );
    } else {
      // Repaired ship with enhanced design
      return (
        <motion.div
          initial={{ scale: 1 }}
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ 
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity
          }}
          className="relative"
        >
          <div className="w-12 h-12 rounded-full border-2 border-space-green bg-gradient-to-br from-space-green/40 to-green-600/30 relative overflow-hidden shadow-2xl transform transition-all duration-300"
               style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}>
            {/* Repaired ship icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3104/3104636.png"
                alt="Repaired Spaceship"
                className="w-10 h-10"
                style={{ filter: 'invert(1) sepia(1) saturate(2) hue-rotate(120deg) brightness(1.1) contrast(1.1)' }}
              />
            </div>
            
            {/* Success indicator */}
            <motion.div 
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-green-900 text-xs font-bold">✓</span>
              </div>
            </motion.div>
            
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 rounded-xl border-2 border-green-400/60 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-pulse" />
          </div>
          
          {/* Success particle effects */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  scale: 0, 
                  x: 0, 
                  y: 0,
                  opacity: 1 
                }}
                animate={{ 
                  scale: [0, 1, 0], 
                  x: Math.cos(i * 60 * Math.PI / 180) * 20,
                  y: Math.sin(i * 60 * Math.PI / 180) * 20,
                  opacity: [1, 0.5, 0]
                }}
                transition={{ 
                  duration: 1,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute top-1/2 left-1/2 w-1 h-1 bg-space-green rounded-full"
              />
            ))}
          </div>
        </motion.div>
      );
    }
  };

  return (
    <motion.div
      className={cn(
        "absolute cursor-crosshair touch-target",
        ship.isBroken ? "z-20" : "z-10",
        className
      )}
      style={{
        left: ship.x,
        top: ship.y,
        transform: `rotate(${ship.angle}rad)`,
      }}
      onClick={ship.isBroken ? onClick : undefined}
      whileHover={ship.isBroken ? { scale: 1.1 } : undefined}
      whileTap={ship.isBroken ? { scale: 0.95 } : undefined}
      animate={{
        x: ship.isBroken ? [0, 2, -2, 0] : 0,
        y: ship.isBroken ? [0, -1, 1, 0] : 0,
      }}
      transition={{
        duration: ship.isBroken ? 2 + Math.random() : 0,
        repeat: ship.isBroken ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      {getShipContent()}
      
      {/* Hover tooltip */}
      {ship.isBroken && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {ship.difficulty.charAt(0).toUpperCase() + ship.difficulty.slice(1)} Ship
            {ship.quizState === 'failed' && ' (Failed - Try Again)'}
          </div>
        </div>
      )}
    </motion.div>
  );
};

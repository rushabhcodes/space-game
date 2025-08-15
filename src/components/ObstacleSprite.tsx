import React from 'react';
import { motion } from 'framer-motion';
import type { Obstacle } from '../game/types';
import { cn } from '../lib/utils';

interface ObstacleSpriteProps {
  obstacle: Obstacle;
  className?: string;
  onObstacleClick?: (obstacleType: string) => void;
}

export const ObstacleSprite: React.FC<ObstacleSpriteProps> = ({
  obstacle,
  className,
  onObstacleClick
}) => {
  const getObstacleContent = () => {
    const baseStyle = {
      width: obstacle.width,
      height: obstacle.height,
      opacity: obstacle.opacity
    };

    switch (obstacle.type) {
      case 'asteroid':
        return (
          <div
            className={cn(
              "bg-gradient-to-br from-gray-600 via-gray-700 to-gray-900 relative overflow-hidden border-2 border-gray-500 shadow-2xl",
              obstacle.shape === 'irregular' ? 'rounded-3xl' : 'rounded-full'
            )}
            style={{
              ...baseStyle,
              boxShadow: '0 0 20px rgba(107, 114, 128, 0.3), inset 0 2px 4px rgba(0, 0, 0, 0.3)',
              clipPath: obstacle.shape === 'irregular' ? 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' : undefined
            }}
          >
            <div 
              className="absolute inset-0 rounded-full opacity-30"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1545156521-77bd85671d30?w=200&h=200&fit=crop&crop=center')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-gray-800 rounded-full shadow-inner" />
              <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-gray-700 rounded-full shadow-inner" />
              <div className="absolute top-2/3 left-2/3 w-2 h-2 bg-gray-600 rounded-full shadow-inner" />
            </div>
            <div className="absolute inset-0 rounded-full border border-gray-400/30 animate-pulse" />
          </div>
        );

      case 'debris':
      case 'metal-scrap':
        return (
          <div
            className={cn(
              "bg-gradient-to-br from-orange-500 via-red-600 to-red-800 relative overflow-hidden border-2 border-orange-400 shadow-2xl",
              obstacle.shape === 'triangle' ? '' : 'transform rotate-45'
            )}
            style={{
              ...baseStyle,
              width: baseStyle.width * 0.8,
              height: baseStyle.height * 0.8,
              boxShadow: '0 0 25px rgba(239, 68, 68, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.3)',
              clipPath: obstacle.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 
                        obstacle.shape === 'diamond' ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : undefined
            }}
          >
            <div 
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=100&h=100&fit=crop&crop=center')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'hue-rotate(30deg) saturate(1.5)'
              }}
            />
            <div className="absolute inset-0">
              <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <div className="absolute bottom-1 right-1 w-1 h-1 bg-orange-400 rounded-full animate-ping" />
              <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-400 rounded-full animate-pulse animation-delay-500" />
            </div>
            <div className="absolute inset-0">
              <div className="absolute -top-1 left-1/2 w-1 h-1 bg-yellow-300 rounded-full animate-ping animation-delay-300" />
              <div className="absolute top-1/2 -right-1 w-1 h-1 bg-orange-300 rounded-full animate-ping animation-delay-700" />
            </div>
          </div>
        );

      case 'space-mine':
        return (
          <div className="relative" style={baseStyle}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 via-red-700 to-red-800 border-4 border-red-500 shadow-2xl"
                 style={{ boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)' }}>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-4 bg-red-400 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transformOrigin: '50% 0%',
                    transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-${obstacle.width/2 + 8}px)`
                  }}
                />
              ))}
              <div className="absolute inset-2 rounded-full bg-red-500 animate-pulse" />
              <div className="absolute inset-4 rounded-full bg-red-400 animate-pulse animation-delay-500" />
            </div>
          </div>
        );

      case 'plasma-cloud':
        return (
          <div className="relative" style={baseStyle}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/60 via-pink-500/60 to-purple-500/60 animate-pulse">
              <div className="absolute inset-0 rounded-full border-2 border-purple-400/60 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-purple-300 rounded-full shadow-lg shadow-purple-300/50"
                  style={{
                    left: `${15 + i * 15}%`,
                    top: `${20 + (i % 3) * 30}%`
                  }}
                  animate={{
                    scale: [0.5, 1.5, 0.5],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              ))}
            </div>
          </div>
        );

      case 'crystal-fragment':
        return (
          <div className="relative" style={baseStyle}>
            <div 
              className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 border-2 border-cyan-300 shadow-2xl"
              style={{
                clipPath: 'polygon(50% 0%, 85% 25%, 85% 75%, 50% 100%, 15% 75%, 15% 25%)',
                boxShadow: '0 0 25px rgba(34, 211, 238, 0.5)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse" />
              <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-cyan-200 rounded-full animate-ping" />
            </div>
          </div>
        );

      case 'energy-field':
        return (
          <div className="relative" style={baseStyle}>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-blue-500/40 relative overflow-hidden">
              <div className="absolute inset-0 rounded-xl border-2 border-blue-400/60 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
            <div className="absolute inset-4 rounded-lg bg-blue-400/80 animate-pulse shadow-lg shadow-blue-400/50" />
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-300 rounded-full shadow-lg shadow-blue-300/50"
                  style={{
                    left: `${15 + i * 15}%`,
                    top: `${20 + (i % 3) * 30}%`
                  }}
                  animate={{
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div
            className="w-4 h-4 bg-gray-500 rounded"
            style={{
              opacity: obstacle.opacity
            }}
          />
        );
    }
  };

  return (
    <motion.div
      className={cn("absolute pointer-events-auto cursor-pointer", className)}
      style={{
        left: obstacle.x,
        top: obstacle.y,
        transform: `rotate(${obstacle.angle}rad)`
      }}
      animate={{
        rotate: [obstacle.angle, obstacle.angle + Math.PI * 2]
      }}
      transition={{
        duration: Math.abs(obstacle.rotationSpeed) || 1,
        repeat: Infinity,
        ease: "linear"
      }}
      onClick={(e) => {
        e.stopPropagation();
        onObstacleClick?.(obstacle.type);
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {getObstacleContent()}
    </motion.div>
  );
};

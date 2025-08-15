import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PenaltyEffectProps {
  isVisible: boolean;
  effectType: 'default' | 'explosion' | 'electric' | 'toxic' | 'freeze' | 'energy';
  onComplete: () => void;
}

export const PenaltyEffect: React.FC<PenaltyEffectProps> = ({
  isVisible,
  effectType,
  onComplete
}) => {
  // Auto-complete the effect after animation duration
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000); // Duration should match the longest animation
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  const getEffectColors = () => {
    switch (effectType) {
      case 'explosion':
        return {
          primary: 'rgba(239, 68, 68, 0.4)',   // Red
          secondary: 'rgba(255, 165, 0, 0.6)', // Orange
          accent: 'rgba(255, 255, 0, 0.8)',    // Yellow
          shadowLight: 'rgba(239, 68, 68, 0.6)',
          shadowMedium: 'rgba(239, 68, 68, 0.8)',
          shadowHeavy: 'rgba(239, 68, 68, 1)'
        };
      case 'electric':
        return {
          primary: 'rgba(59, 130, 246, 0.4)',  // Blue
          secondary: 'rgba(147, 51, 234, 0.6)', // Purple
          accent: 'rgba(255, 255, 255, 0.8)',  // White
          shadowLight: 'rgba(59, 130, 246, 0.6)',
          shadowMedium: 'rgba(59, 130, 246, 0.8)',
          shadowHeavy: 'rgba(59, 130, 246, 1)'
        };
      case 'toxic':
        return {
          primary: 'rgba(34, 197, 94, 0.4)',   // Green
          secondary: 'rgba(101, 163, 13, 0.6)', // Lime
          accent: 'rgba(255, 255, 0, 0.8)',    // Yellow
          shadowLight: 'rgba(34, 197, 94, 0.6)',
          shadowMedium: 'rgba(34, 197, 94, 0.8)',
          shadowHeavy: 'rgba(34, 197, 94, 1)'
        };
      case 'freeze':
        return {
          primary: 'rgba(59, 130, 246, 0.4)',  // Blue
          secondary: 'rgba(147, 197, 253, 0.6)', // Light blue
          accent: 'rgba(255, 255, 255, 0.8)',  // White
          shadowLight: 'rgba(59, 130, 246, 0.6)',
          shadowMedium: 'rgba(59, 130, 246, 0.8)',
          shadowHeavy: 'rgba(59, 130, 246, 1)'
        };
      case 'energy':
        return {
          primary: 'rgba(147, 51, 234, 0.4)',  // Purple
          secondary: 'rgba(236, 72, 153, 0.6)', // Pink
          accent: 'rgba(59, 130, 246, 0.8)',   // Blue
          shadowLight: 'rgba(147, 51, 234, 0.6)',
          shadowMedium: 'rgba(147, 51, 234, 0.8)',
          shadowHeavy: 'rgba(147, 51, 234, 1)'
        };
      default:
        return {
          primary: 'rgba(220, 38, 38, 0.4)',   // Red
          secondary: 'rgba(239, 68, 68, 0.6)', // Light red
          accent: 'rgba(248, 113, 113, 0.8)',  // Lighter red
          shadowLight: 'rgba(220, 38, 38, 0.6)',
          shadowMedium: 'rgba(220, 38, 38, 0.8)',
          shadowHeavy: 'rgba(220, 38, 38, 1)'
        };
    }
  };

  const colors = getEffectColors();
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {/* Dynamic overlay with flickering effect */}
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: colors.primary }}
            animate={{
              opacity: [0, 0.6, 0, 0.8, 0, 0.4, 0],
              backgroundColor: [
                colors.primary,
                colors.secondary,
                colors.primary,
                colors.accent,
                colors.primary,
                colors.secondary,
                colors.primary
              ]
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut"
            }}
          />

          {/* Corner sparks/flashes */}
          {[
            { top: '10%', left: '10%' },
            { top: '10%', right: '10%' },
            { bottom: '10%', left: '10%' },
            { bottom: '10%', right: '10%' },
            { top: '30%', left: '20%' },
            { top: '60%', right: '25%' },
            { bottom: '40%', left: '30%' },
            { top: '80%', right: '15%' }
          ].map((position, i) => (
            <motion.div
              key={i}
              className={`absolute w-8 h-8 rounded-full shadow-lg`}
              style={{
                ...position,
                backgroundColor: colors.primary,
                boxShadow: `0 0 10px ${colors.shadowMedium}`
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 0.8, 2, 0],
                opacity: [0, 1, 0.7, 1, 0],
                boxShadow: [
                  `0 0 0px ${colors.shadowLight}`,
                  `0 0 20px ${colors.shadowMedium}`,
                  `0 0 15px ${colors.shadowLight}`,
                  `0 0 30px ${colors.shadowHeavy}`,
                  `0 0 0px ${colors.shadowLight}`
                ]
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.05,
                ease: "easeOut"
              }}
            />
          ))}

          {/* Screen border flash */}
          <motion.div
            className="absolute inset-0 border-8"
            style={{ borderColor: colors.primary }}
            initial={{ opacity: 0, borderWidth: 0 }}
            animate={{
              opacity: [0, 1, 0.5, 1, 0],
              borderWidth: [0, 8, 4, 12, 0],
              borderColor: [
                colors.shadowLight,
                colors.secondary,
                colors.shadowMedium,
                colors.shadowHeavy,
                colors.shadowLight
              ]
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut"
            }}
          />

          {/* Lightning/spark lines */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`lightning-${i}`}
              className="absolute"
              style={{
                top: `${20 + i * 15}%`,
                left: '0%',
                right: '0%',
                height: '2px',
                transform: `rotate(${(i - 3) * 5}deg)`,
                background: `linear-gradient(to right, transparent, ${colors.accent}, transparent)`
              }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{
                opacity: [0, 1, 0, 0.8, 0],
                scaleX: [0, 1, 0.6, 1, 0]
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Central warning flash */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 2, 1.5, 3, 0],
              opacity: [0, 0.8, 0.6, 1, 0]
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut"
            }}
          >
            <div 
              className="w-32 h-32 rounded-full shadow-2xl border-4 animate-pulse"
              style={{
                backgroundColor: colors.primary,
                boxShadow: `0 0 30px ${colors.shadowHeavy}`,
                borderColor: colors.secondary
              }}
            >
              <div 
                className="absolute inset-4 rounded-full animate-ping"
                style={{ backgroundColor: colors.secondary }}
              />
              <div 
                className="absolute inset-8 rounded-full"
                style={{ backgroundColor: colors.accent }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

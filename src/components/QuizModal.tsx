import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import type { QuizModalState } from '../game/types';
import { cn } from '../lib/utils';

interface QuizModalProps {
  quizModal: QuizModalState;
  onAnswer: (answerIndex: number) => void;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  quizModal,
  onAnswer,
  onClose
}) => {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [showTerminalCursor, setShowTerminalCursor] = useState(true);
  const [terminalReady, setTerminalReady] = useState(false);
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setShowTerminalCursor(prev => !prev);
    }, 800);

    return () => clearInterval(cursorInterval);
  }, []);

  // Auto-scroll to bottom when terminal lines change
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTo({
        top: terminalScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [terminalLines, terminalReady]);

  useEffect(() => {
    if (!quizModal.isOpen) {
      setTerminalLines([]);
      setTerminalReady(false);
      return;
    }

    if (quizModal.ship && quizModal.questions.length > 0) {
      const currentQuestion = quizModal.questions[quizModal.currentQuestionIndex];
      
      // Terminal startup sequence
      const startupLines = [
        'SPACESHIP DIAGNOSTIC TERMINAL v3.2.1',
        'Quantum Systems Inc. - Licensed Software',
        '════════════════════════════════════════',
        '',
        '> Initializing neural interface...',
        '> Scanning ship subsystems...',
        '> Anomaly detected in ship configuration.',
        '> Running emergency diagnostic protocol...',
        '',
        `> SHIP ID: ${quizModal.ship.id}`,
        `> DAMAGE LEVEL: ${quizModal.ship.difficulty.toUpperCase()}`,
        `> SYSTEMS AFFECTED: ${currentQuestion.category}`,
        '',
        '> Technician input required.',
        '> Select appropriate repair procedure:',
        ''
      ];
      
      setTerminalLines([]);
      setTerminalReady(false);
      
      startupLines.forEach((line, index) => {
        setTimeout(() => {
          setTerminalLines(prev => [...prev, line]);
          if (index === startupLines.length - 1) {
            setTimeout(() => setTerminalReady(true), 500);
          }
        }, index * 200);
      });
    }
  }, [quizModal.isOpen, quizModal.currentQuestionIndex, quizModal.ship, quizModal.questions]);

  if (!quizModal.isOpen || !quizModal.ship || quizModal.questions.length === 0) {
    return null;
  }

  const currentQuestion = quizModal.questions[quizModal.currentQuestionIndex];
  const progress = ((quizModal.currentQuestionIndex + 1) / quizModal.questions.length) * 100;

  return (
    <Dialog.Root open={quizModal.isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl p-8 border-2 border-green-400/50 shadow-2xl max-w-4xl w-full mx-4 relative overflow-hidden"
            style={{
              boxShadow: '0 0 60px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(34, 197, 94, 0.2)'
            }}
          >
            {/* Matrix-style background effect */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-transparent to-blue-900/20" />
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-px h-full bg-green-400/20"
                  style={{ left: `${i * 5}%` }}
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
            
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-3xl">
              <motion.div 
                className="absolute inset-0 rounded-3xl border-2 border-green-400/80"
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(34, 197, 94, 0.5)',
                    '0 0 40px rgba(34, 197, 94, 0.8)',
                    '0 0 20px rgba(34, 197, 94, 0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  {/* Rotating diagnostic icon */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="relative"
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/2791/2791265.png"
                      alt="Repair"
                      className="w-12 h-12"
                      style={{ filter: 'invert(1) sepia(1) saturate(3) hue-rotate(100deg) brightness(1.2)' }}
                    />
                  </motion.div>
                  
                  <div 
                    className={cn(
                      "w-6 h-6 rounded-full ring-4 ring-white/20 animate-pulse",
                      quizModal.ship.difficulty === 'hard' ? 'bg-red-500 ring-red-500/30' :
                      quizModal.ship.difficulty === 'medium' ? 'bg-yellow-500 ring-yellow-500/30' :
                      'bg-green-500 ring-green-500/30'
                    )}
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2 font-mono">
                      🔧 SHIP DIAGNOSTIC PROTOCOL
                    </h2>
                    <p className="text-base text-gray-300 font-mono">
                      {quizModal.ship.difficulty.charAt(0).toUpperCase() + quizModal.ship.difficulty.slice(1)} Level Systems Analysis
                    </p>
                  </div>
                </div>
                
                <Dialog.Close asChild>
                  <motion.button 
                    className="text-gray-400 hover:text-red-400 transition-colors p-3 rounded-xl hover:bg-red-500/10 border border-gray-600 hover:border-red-400"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </Dialog.Close>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-300 mb-3 font-mono">
                  <span className="flex items-center gap-2">
                    <span className="text-green-400">📋</span>
                    Diagnostic {quizModal.currentQuestionIndex + 1} of {quizModal.questions.length}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-green-400">⚡</span>
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-green-400/30">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-green-500 relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                  </motion.div>
                </div>
              </div>

              {/* Terminal Display */}
              <div className="mb-8 p-6 bg-black/80 rounded-2xl border border-green-400/50 font-mono text-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse animation-delay-200"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse animation-delay-400"></div>
                  </div>
                  <div className="text-green-400 text-xs">DIAGNOSTIC_TERMINAL.exe</div>
                </div>
                
                <div 
                  ref={terminalScrollRef}
                  className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-transparent scroll-smooth"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {terminalLines.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "text-green-400 leading-relaxed",
                        line.startsWith('>') ? 'text-blue-400 font-semibold' : '',
                        line.includes('ERROR') || line.includes('FAILED') ? 'text-red-400' : '',
                        line.includes('SUCCESS') || line.includes('COMPLETE') ? 'text-green-300' : '',
                        line.includes('DAMAGE LEVEL: HARD') ? 'text-red-400 font-bold' : '',
                        line.includes('DAMAGE LEVEL: MEDIUM') ? 'text-yellow-400 font-bold' : '',
                        line.includes('DAMAGE LEVEL: EASY') ? 'text-green-400 font-bold' : ''
                      )}
                    >
                      {line}
                    </motion.div>
                  ))}
                  
                  {terminalReady && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-green-400 mt-2"
                    >
                      <span className="text-cyan-400 font-semibold">TECHNICIAN_PROMPT:</span>
                      <div className="ml-4 mt-2 text-white bg-blue-900/40 p-4 rounded border-l-4 border-blue-400">
                        {currentQuestion.question}
                      </div>
                      <div className="flex items-center mt-2">
                        <span className="text-yellow-400">user@spaceship:~$</span>
                        {showTerminalCursor && <span className="ml-1 bg-green-400 w-2 h-4 inline-block animate-pulse"></span>}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {quizModal.showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn(
                      "mb-8 p-6 rounded-2xl border-2 font-mono",
                      quizModal.isCorrect 
                        ? "bg-green-900/40 border-green-400 text-green-200"
                        : "bg-red-900/40 border-red-400 text-red-200"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      {quizModal.isCorrect ? (
                        <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center">
                          <svg className="w-5 h-5 text-red-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-lg">{quizModal.feedbackMessage}</div>
                        <div className="text-sm opacity-80 mt-1">{currentQuestion.explanation}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Answer Options */}
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = quizModal.answers[quizModal.currentQuestionIndex] === index;
                  const isCorrect = index === currentQuestion.answerIndex;
                  const showResult = quizModal.showFeedback;

                  return (
                    <motion.button
                      key={index}
                      onClick={() => !quizModal.showFeedback && onAnswer(index)}
                      disabled={quizModal.showFeedback}
                      className={cn(
                        "w-full p-5 text-left rounded-2xl border-2 transition-all duration-300 font-mono",
                        "hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-green-400",
                        !showResult && "hover:border-green-400 hover:shadow-lg hover:shadow-green-400/20",
                        showResult && isSelected && isCorrect && "bg-green-900/40 border-green-400 shadow-green-400/30 shadow-lg",
                        showResult && isSelected && !isCorrect && "bg-red-900/40 border-red-400 shadow-red-400/30 shadow-lg",
                        showResult && !isSelected && isCorrect && "bg-green-900/20 border-green-500",
                        !showResult && !isSelected && "border-gray-600 text-gray-300",
                        !showResult && isSelected && "border-green-400 bg-green-400/15 shadow-green-400/20 shadow-lg"
                      )}
                      whileHover={!quizModal.showFeedback ? { scale: 1.02, y: -2 } : {}}
                      whileTap={!quizModal.showFeedback ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full border-2 flex items-center justify-center text-base font-bold transition-all",
                          showResult && isCorrect ? "border-green-400 bg-green-400 text-green-900 shadow-lg" :
                          showResult && isSelected && !isCorrect ? "border-red-400 bg-red-400 text-red-900 shadow-lg" :
                          isSelected ? "border-green-400 bg-green-400 text-black shadow-lg" :
                          "border-gray-500 text-gray-400"
                        )}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className={cn(
                          "flex-1 text-lg",
                          showResult && isCorrect ? "text-green-200 font-semibold" :
                          showResult && isSelected && !isCorrect ? "text-red-200" :
                          isSelected ? "text-white font-medium" : "text-gray-300"
                        )}>
                          {option}
                        </span>
                        {showResult && isCorrect && (
                          <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center">
                            <svg className="w-5 h-5 text-red-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-600">
                <div className="flex justify-between items-center text-base text-gray-400 font-mono">
                  <span className="flex items-center gap-2">
                    <span>🔧</span>
                    Complete all diagnostics to repair ship
                  </span>
                  <span className="flex items-center gap-2">
                    <span>⌨️</span>
                    Press ESC to abort
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

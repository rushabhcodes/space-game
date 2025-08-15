# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Space Rescue Game

A cinematic space-themed web game built with Vite, React, TypeScript, pnpm, and Tailwind CSS.

## 🚀 Overview

Space Rescue is an interactive browser game where players must click on broken spaceships drifting through space to repair them by correctly answering quiz questions. Race against time while navigating obstacles and dynamic challenges in a beautiful starfield environment.

## ✨ Features

### Core Gameplay
- **Interactive Ship Repair**: Click broken ships to open quiz modals with science questions
- **Dynamic Physics**: Ships move with realistic curves, bouncing, and easing animations
- **Progressive Difficulty**: Speed and obstacles increase as you progress
- **Multiple Question Categories**: Space technology, astronomy, physics, and exploration
- **Scoring System**: Points for repairs, time bonuses, and streak multipliers

### Visual & Audio
- **Cinematic Space Theme**: Dark backgrounds with neon accents and particle effects
- **Starfield Background**: Animated twinkling stars with parallax effects
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Sound Effects**: Audio feedback for clicks, repairs, and game events
- **Visual Feedback**: Glows, explosions, and status indicators

### Game Mechanics
- **Moving Obstacles**: Asteroids, debris, and energy fields that block clicks
- **Special Events**: Blackout periods and temporary stun effects
- **Streak System**: Bonus points for consecutive correct repairs
- **Multiple Difficulty Levels**: Easy, medium, and hard ships with varying complexity

### Accessibility & UX
- **Keyboard Support**: Full keyboard navigation and controls
- **Pause Functionality**: P key or UI button to pause/resume
- **Reduced Motion**: Respects prefers-reduced-motion settings
- **High Contrast Mode**: Accessibility option for better visibility
- **Mobile Responsive**: Touch-friendly controls and proper hit targets
- **Local Storage**: Saves high scores and game settings

## 🛠️ Tech Stack

- **Frontend Framework**: React 19+ with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with custom space-themed design system
- **Animations**: Framer Motion for smooth animations and transitions
- **UI Components**: Radix UI primitives for accessible modals and controls
- **Package Manager**: pnpm for efficient dependency management
- **State Management**: React hooks with custom game loop management

## 🎮 Game Controls

- **Mouse/Touch**: Click on broken ships to start repair protocols
- **P Key**: Pause/Resume game
- **ESC Key**: Close modal dialogs
- **Arrow Keys**: Navigate through quiz options (when modal is open)
- **Enter**: Select quiz answer
- **R Key**: Restart game (when game over)

## 🎯 Game Rules

1. **Objective**: Repair all broken ships before time runs out
2. **Ship Interaction**: Click on broken ships (highlighted with damage indicators)
3. **Quiz System**: Answer 1-3 questions correctly to repair each ship
4. **Obstacles**: Avoid clicking on moving obstacles (asteroids, debris, energy fields)
5. **Time Limit**: Complete all repairs within the time limit (default: 4 minutes)
6. **Scoring**: 
   - Base points per ship repaired
   - Difficulty multipliers (Easy: 1x, Medium: 1.2x, Hard: 1.5x)
   - Streak bonuses for consecutive repairs
   - Time remaining bonus

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd space-game

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Development
```bash
# Run in development mode with hot reload
pnpm dev

# Type checking
pnpm lint

# Build production bundle
pnpm build
```

The game will be available at `http://localhost:5173` in development mode.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── StarfieldBackground.tsx
│   ├── ShipSprite.tsx
│   ├── ObstacleSprite.tsx
│   ├── HUD.tsx
│   └── QuizModal.tsx
├── game/               # Game logic and engine
│   ├── engine.ts       # Main game engine with physics
│   └── types.ts        # TypeScript type definitions
├── pages/              # Main game screens
│   └── Game.tsx        # Primary game component
├── hooks/              # Custom React hooks
│   └── useGameLoop.ts  # Game state management
├── data/               # Static game data
│   └── questions.json  # Quiz questions database
├── lib/                # Utility functions
│   └── utils.ts        # Helper functions and utilities
└── styles/             # Global styles
    └── index.css       # Tailwind CSS imports and custom styles
```

## 🎨 Customization

### Adding Questions
Edit `src/data/questions.json` to add new quiz questions:

```json
{
  "id": "unique-id",
  "category": "Space Technology",
  "question": "Your question here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answerIndex": 0,
  "difficulty": "easy|medium|hard",
  "explanation": "Optional explanation text"
}
```

### Game Settings
Modify default settings in `src/hooks/useGameLoop.ts`:

```typescript
const defaultSettings: GameSettings = {
  difficulty: 'medium',
  infiniteMode: false,
  soundEnabled: true,
  reducedMotion: false,
  highContrast: false,
  shipCount: 8
};
```

### Visual Themes
Customize colors in `tailwind.config.js`:

```javascript
colors: {
  space: {
    blue: "#00D4FF",
    purple: "#8B5FFF", 
    green: "#00FF88",
    orange: "#FF6B35",
    yellow: "#FFD700",
  }
}
```

## 🏗️ Architecture

### Game Engine
The `GameEngine` class handles:
- Ship movement physics and collision detection
- Obstacle generation and animation
- Game state updates and progression
- Event system for blackouts and special effects
- Performance-optimized RequestAnimationFrame loop

### State Management
- Central game state using React's useState
- Custom hooks for game logic separation
- Local storage for persistent settings and high scores
- Immutable state updates for predictable behavior

### Component Architecture
- Functional components with TypeScript
- Custom hooks for business logic
- Separation of concerns between UI and game logic
- Responsive design with mobile-first approach

## 🔧 Performance Optimization

- **RequestAnimationFrame**: Smooth 60 FPS animations
- **Component Memoization**: Prevents unnecessary re-renders
- **Canvas Rendering**: Efficient starfield background
- **Lazy Loading**: Components loaded as needed
- **Optimized Animations**: Framer Motion with performance settings

## 🌟 Future Enhancements

- [ ] Multiplayer support
- [ ] Additional game modes (Infinite, Zen, Challenge)
- [ ] Ship customization and upgrades
- [ ] Achievement system
- [ ] Leaderboards and social features
- [ ] Progressive Web App (PWA) support
- [ ] WebGL-powered visual effects
- [ ] Custom sound design and music

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

# CLAUDE.md - VibeBASIC

This file provides guidance to Claude Code (claude.ai/code) when working with the VibeBASIC project.

## Project Overview

**VibeBASIC** is a modern retro BASIC interpreter with Web Audio support, built with React. It recreates the nostalgic 1980s programming experience with added musical capabilities through the Web Audio API.

## Repository Information

- **Local Directory**: `/Users/harrissyed/Code/experiments/gwBasic/`
- **GitHub Repository**: https://github.com/harragi/vibebasic
- **Status**: READ-ONLY repository (educational reference)
- **Branch**: main

## Project Structure

```
vibebasic/
├── src/                        # Source code
│   ├── App.js                 # Main React application
│   ├── App.css                # Global styles
│   ├── index.js               # React entry point
│   ├── components/            # React components
│   │   ├── Terminal.js        # Terminal emulator (VibeBASIC branding)
│   │   ├── CRTMonitor.js      # CRT monitor effect
│   │   ├── MonitorSelector.js # Display options
│   │   └── MonitorSelector.css
│   ├── programs/              # BASIC programs
│   │   ├── samplePrograms.js  # 16+ demo programs
│   │   ├── autoRunner.js      # Auto-run functionality
│   │   └── testProgram.js     # Test utilities
│   ├── utils/                 # Core functionality
│   │   └── BasicInterpreter.js # BASIC interpreter with Web Audio
│   └── config/
│       └── monitorStyles.js   # Monitor styling options
├── public/                     # Static files
│   ├── index.html             # VibeBASIC HTML entry
│   └── favicon.ico            # App icon
├── tests/                      # Test suite
│   ├── commands/              # Command tests
│   │   ├── test-print.js
│   │   ├── test-let.js
│   │   ├── test-for-next.js
│   │   ├── test-if-then.js
│   │   └── test-gosub-return.js
│   ├── functions/             # Function tests
│   │   ├── test-math.js
│   │   └── test-string.js
│   ├── run-tests.js           # Test runner
│   └── test-documentation.js  # Test docs generator
├── package.json               # Node.js config (name: vibebasic)
├── README.md                  # VibeBASIC documentation
├── CONTRIBUTING.md            # Read-only status explanation
├── LICENSE                    # MIT License
└── .gitignore                # Git ignore rules
```

## Key Features Implemented

### Sound & Music 🎵
- **Web Audio API Integration**: Real sound generation
- **BEEP Command**: `BEEP frequency, duration` for custom tones
- **Audio Context**: Initialized in BasicInterpreter constructor
- **Square Wave Generation**: Authentic retro computer sounds
- **Musical Programs**: MUSIC.BAS and BEEPTEST.BAS demonstrations

### BASIC Commands
- **Program**: NEW, LIST, RUN, CLEAR, FILES, LOAD, SAVE
- **Control**: GOTO, GOSUB/RETURN, END, STOP
- **Flow**: IF/THEN/ELSE, FOR/NEXT (with STEP)
- **I/O**: PRINT, INPUT, READ/DATA/RESTORE
- **Variables**: LET, DIM (arrays)
- **Display**: CLS, LOCATE (with ANSI escape sequences), TAB, SPC
- **Sound**: BEEP (with Web Audio API)
- **System**: REM, SYSTEM, POKE (simulated)

### Built-in Functions
- **Math**: ABS, INT, SGN, SQR, RND, SIN, COS, TAN, ATN, LOG, EXP
- **String**: LEN, VAL, ASC, CHR$, STR$, LEFT$, RIGHT$, MID$
- **System**: PEEK (simulated), FRE, POS

### Sample Programs (16+)
1. HELLO.BAS - Hello World
2. FIBONACCI.BAS - Fibonacci sequence
3. PRIME.BAS - Prime number finder
4. GUESS.BAS - Number guessing game
5. STAR.BAS - Animated starfield
6. SINE.BAS - Sine wave visualization
7. BOUNCE.BAS - Bouncing ball animation
8. MAZE.BAS - Random maze generator
9. MUSIC.BAS - Musical melody demo 🎵
10. GATES.BAS - Tech Pioneer ASCII art
11. JOBS.BAS - Tech Innovator ASCII art
12. LIFE.BAS - Conway's Game of Life
13. PONG.BAS - Simple Pong game
14. MANDEL.BAS - Mandelbrot set
15. PYRAMID.BAS - Pyramid patterns
16. BEEPTEST.BAS - Sound test program 🔊

## Development Commands

```bash
# Navigate to project
cd /Users/harrissyed/Code/experiments/gwBasic

# Install dependencies
npm install

# Start development server
npm start
# Opens at http://localhost:3000

# Run tests
cd tests && node run-tests.js

# Build for production
npm run build

# Git operations
git status
git add .
git commit -m "message"
git push origin main
```

## VibeBASIC Branding

- **Name**: VibeBASIC (not GW-BASIC)
- **Tagline**: "Feel the Retro Vibe with Modern Sound!"
- **Terminal Header**: "VibeBASIC 1.0 🎵"
- **Colors**: Purple badges, green phosphor terminal
- **Focus**: Web Audio and musical capabilities

## Important Technical Details

### BasicInterpreter.js
- Audio context initialization in constructor
- `playBeep(frequency, duration)` method for sound generation
- Screen buffer management with refs to avoid stale closures
- LOCATE command uses ANSI escape sequences
- Animation delays in FOR/NEXT loops for smooth rendering

### Terminal.js
- VibeBASIC branding in initial lines
- Screen buffer mode vs scrolling output mode
- useRef hooks for real-time state updates
- "Ready" prompt instead of "Ok"

### Key Bug Fixes Applied
- LOCATE command no longer hangs
- PRINT has proper type parameter for output
- CLS doesn't create screen buffer unnecessarily
- Ctrl+C properly resets interpreter state
- Animation programs (STAR, BOUNCE) display correctly

## Testing
- 85+ test cases covering all commands and functions
- Test documentation available
- Run with: `node tests/run-tests.js`

## Repository Status

**READ-ONLY Repository**
- No pull requests accepted
- Fork for modifications
- Educational reference only
- See CONTRIBUTING.md for details

## Common Tasks

### Update branding references
Search for: "GW-BASIC", "Classic BASIC"
Replace with: "VibeBASIC"

### Add new BASIC program
1. Edit `src/programs/samplePrograms.js`
2. Add program to the samplePrograms object
3. Test with interpreter

### Modify BEEP sound
Edit `src/utils/BasicInterpreter.js`:
- `playBeep()` method
- Oscillator type (currently 'square')
- Gain values for volume

### Change terminal colors
Edit `src/App.css`:
- `.terminal` class for background
- `.terminal-line` for text color
- Current: green (#00ff00) on black

## Git Workflow

```bash
# Make changes locally
cd /Users/harrissyed/Code/experiments/gwBasic
# Edit files...

# Commit and push
git add .
git commit -m "Description of changes"
git push origin main
```

Changes made in `/Users/harrissyed/Code/experiments/gwBasic/` will be pushed to the remote repository at https://github.com/harragi/vibebasic

## Notes
- Always maintain VibeBASIC branding
- Focus on sound/music capabilities
- Keep retro aesthetic
- Test all BASIC programs after changes
- Repository is read-only for others
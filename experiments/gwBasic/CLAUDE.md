# CLAUDE.md - GW-BASIC Web Edition

This file provides guidance to Claude Code (claude.ai/code) when working with the GW-BASIC Web Edition project.

## Project Overview

GW-BASIC Web Edition is a browser-based implementation of a classic BASIC interpreter, inspired by Microsoft's 6502 BASIC V1.1 (1978). The project recreates the nostalgic experience of 1980s personal computer BASIC programming environments entirely in a self-contained HTML file.

## Repository Structure

```
gwBasic/
├── basic.html              # Self-contained BASIC interpreter (main application)
├── basic-interpreter.js    # Core BASIC interpreter logic (modular version)
├── console-basic.js        # Command-line BASIC interpreter
├── build-html.js           # Build script to generate self-contained HTML
├── 6502basic/             # Git submodule: Microsoft's original 6502 BASIC assembly source
│   ├── m6502.asm          # Original 1978 assembly source (161KB)
│   ├── README.md          # Microsoft's documentation
│   └── LICENSE            # MIT License
├── gwbasic-react/         # React-based version of the interpreter
├── Test Files:
│   ├── quick-test-programs.js   # Quick test suite for BASIC programs
│   ├── run-test-programs.js     # Test runner script
│   ├── detailed-test.js         # Detailed testing utilities
│   └── debug-for.js             # FOR/NEXT loop debugging
├── package.json           # Node.js dependencies
└── CLAUDE.md             # This file
```

## Key Features Implemented

### Commands
- **Program Management**: NEW, LIST, RUN, CLEAR
- **Program Control**: GOTO, GOSUB/RETURN, END, STOP
- **Flow Control**: IF/THEN, FOR/NEXT (with STEP)
- **I/O Operations**: PRINT, INPUT, READ/DATA/RESTORE
- **Variable Operations**: LET, DIM (arrays)
- **System**: REM, CLS, SYSTEM
- **Memory**: POKE (simulated)

### Built-in Functions
- **Math**: ABS, INT, SGN, SQR, RND, SIN, COS, TAN, ATN, LOG, EXP
- **String**: LEN, VAL, ASC, CHR$, STR$, LEFT$, RIGHT$, MID$
- **System**: PEEK (simulated), FRE, POS, TAB, SPC

### Features
- Line-numbered programs (classic BASIC style)
- Immediate mode execution
- String and numeric variables (A-Z, A$-Z$)
- Multi-dimensional arrays
- Nested FOR/NEXT loops
- GOSUB/RETURN subroutine calls
- DATA/READ/RESTORE for data handling
- Expression evaluation with operator precedence
- String concatenation

## Technical Implementation

### Architecture
- **Modular Design**: Core interpreter logic separated into basic-interpreter.js
- **Multiple Interfaces**:
  - Self-contained HTML version (basic.html)
  - Command-line interface (console-basic.js)
  - React-based web app (gwbasic-react/)
- **Pure JavaScript**: Minimal dependencies, no complex build process for core
- **Event-driven**: Keyboard input handling for authentic terminal experience
- **State management**: Complete interpreter state for variables, program storage, and execution context
- **Build System**: build-html.js creates self-contained HTML from modular components

### UI/UX Design
- **Retro Terminal**: Green phosphor on black background
- **Blinking Cursor**: Authentic 1980s terminal cursor
- **Monospace Font**: Courier New for classic code appearance
- **Full-screen Terminal**: Immersive retro computing experience

## Development Commands

```bash
# Open in browser (no build required)
open basic.html

# Run console version
node console-basic.js

# Run tests
node run-test-programs.js
node quick-test-programs.js

# Build self-contained HTML from modular JS
node build-html.js

# Start React version
cd gwbasic-react
npm install
npm start

# Or start a simple HTTP server for basic.html
python3 -m http.server 8000
# Then navigate to http://localhost:8000/basic.html
```

## Example BASIC Programs

### Hello World
```basic
10 PRINT "HELLO, WORLD!"
20 END
RUN
```

### Number Guessing Game
```basic
10 REM NUMBER GUESSING GAME
20 LET N = INT(RND(1) * 100) + 1
30 LET G = 0
40 PRINT "I'M THINKING OF A NUMBER BETWEEN 1 AND 100"
50 INPUT "YOUR GUESS"; G
60 IF G = N THEN GOTO 100
70 IF G < N THEN PRINT "TOO LOW!"
80 IF G > N THEN PRINT "TOO HIGH!"
90 GOTO 50
100 PRINT "CORRECT! THE NUMBER WAS"; N
110 END
```

### Fibonacci Sequence
```basic
10 REM FIBONACCI SEQUENCE
20 LET A = 0
30 LET B = 1
40 PRINT A
50 PRINT B
60 FOR I = 1 TO 10
70 LET C = A + B
80 PRINT C
90 LET A = B
100 LET B = C
110 NEXT I
120 END
```

## Historical Context

This project is inspired by Microsoft's 6502 BASIC, originally developed by Bill Gates and Paul Allen in 1976-1978. The 6502 microprocessor powered iconic computers including:
- Commodore PET, VIC-20, and Commodore 64
- Apple II (Applesoft BASIC)
- Atari 8-bit computers
- BBC Micro

The original assembly source code (included as a git submodule) was released as open source by Microsoft in 2025 under the MIT license, marking a historic moment in computing history.

## Working with the 6502 Assembly Source

The original 6502 BASIC assembly source is included as a git submodule for reference and inspiration:

```bash
# Initialize and update the submodule
git submodule init
git submodule update

# View the original assembly source
less 6502basic/m6502.asm
```

The assembly source reveals the original implementation details including:
- Token-based command parsing
- Floating-point arithmetic routines
- Memory management strategies
- The famous "Bill Gates Easter egg" (labels STORDO and STORD0)

## Future Enhancements

Potential improvements while maintaining the retro aesthetic:
- Sound generation (BEEP, SOUND commands)
- Graphics commands (PLOT, LINE, CIRCLE)
- File operations (SAVE/LOAD to browser localStorage)
- Extended memory simulation
- More string manipulation functions
- Printer output simulation
- Cassette tape loading animation

## Contributing

When modifying the BASIC interpreter:
1. Maintain the retro aesthetic and user experience
2. Ensure compatibility with classic BASIC programs
3. Test with various example programs
4. Keep the single-file, self-contained architecture
5. Document any new commands or functions

## License

The GW-BASIC Web Edition is inspired by the MIT-licensed Microsoft BASIC-M6502. The web implementation maintains compatibility with classic BASIC programs while providing a modern, browser-based experience.
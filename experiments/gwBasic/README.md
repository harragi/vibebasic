# GW-BASIC Web Edition

A browser-based implementation of a classic BASIC interpreter, inspired by Microsoft's 6502 BASIC. Experience the nostalgia of 1980s personal computer programming in your modern web browser!

![GW-BASIC Web Edition](https://img.shields.io/badge/BASIC-Web%20Edition-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-orange)

## 🎮 Live Demo

Try it now: [GW-BASIC Web Edition](#) *(Link will be updated after deployment)*

## ✨ Features

### Core BASIC Commands
- **Program Management**: `NEW`, `LIST`, `RUN`, `CLEAR`, `FILES`, `LOAD`, `SAVE`
- **Program Control**: `GOTO`, `GOSUB`/`RETURN`, `END`, `STOP`
- **Flow Control**: `IF`/`THEN`, `FOR`/`NEXT` (with `STEP`)
- **I/O Operations**: `PRINT`, `INPUT`, `READ`/`DATA`/`RESTORE`
- **Variable Operations**: `LET`, `DIM` (arrays)
- **Display Control**: `CLS`, `LOCATE`, `TAB`, `SPC`
- **System**: `REM`, `SYSTEM`, `BEEP`

### Built-in Functions
- **Math**: `ABS`, `INT`, `SGN`, `SQR`, `RND`, `SIN`, `COS`, `TAN`, `ATN`, `LOG`, `EXP`
- **String**: `LEN`, `VAL`, `ASC`, `CHR$`, `STR$`, `LEFT$`, `RIGHT$`, `MID$`
- **System**: `PEEK`, `POKE` (simulated), `FRE`, `POS`

### Sample Programs
The project includes 15 classic BASIC programs demonstrating various features:
- **HELLO.BAS** - Classic Hello World
- **FIBONACCI.BAS** - Fibonacci sequence generator
- **PRIME.BAS** - Prime number finder
- **GUESS.BAS** - Number guessing game
- **STAR.BAS** - Animated starfield
- **SINE.BAS** - Sine wave visualization
- **BOUNCE.BAS** - Bouncing ball animation
- **MAZE.BAS** - Random maze generator
- **MUSIC.BAS** - Musical notes demo
- **GATES.BAS** - Bill Gates ASCII portrait
- **JOBS.BAS** - Steve Jobs ASCII portrait
- **LIFE.BAS** - Conway's Game of Life
- **PONG.BAS** - Simple Pong game
- **MANDEL.BAS** - Mandelbrot set renderer
- **PYRAMID.BAS** - Pyramid pattern generator

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/[username]/gwbasic-web.git
cd gwbasic-web
```

2. Install dependencies:
```bash
cd gwbasic-react
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser to `http://localhost:3000`

## 📁 Project Structure

```
gwbasic-web/
├── README.md                    # This file
├── gwbasic-react/              # React application
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js              # Main application
│       ├── App.css             # Styling
│       ├── components/
│       │   └── Terminal.js     # Terminal emulator
│       ├── utils/
│       │   └── BasicInterpreter.js  # BASIC interpreter engine
│       └── programs/
│           └── samplePrograms.js    # Built-in sample programs
├── 6502basic/                  # Git submodule: Original Microsoft BASIC source
│   ├── m6502.asm              # Original 1978 assembly source
│   └── README.md              # Microsoft's documentation
└── CLAUDE.md                   # AI assistant instructions
```

## 🎯 Usage Examples

### Running a Simple Program
```basic
10 PRINT "HELLO, WORLD!"
20 END
RUN
```

### Loading Sample Programs
```basic
FILES
LOAD "STAR.BAS"
RUN
```

### Creating an Animation
```basic
10 CLS
20 FOR I = 1 TO 20
30 LOCATE I, I * 2
40 PRINT "*"
50 FOR D = 1 TO 100: NEXT D
60 NEXT I
70 END
RUN
```

### Interactive Number Game
```basic
10 LET N = INT(RND(1) * 100) + 1
20 INPUT "Guess a number (1-100): "; G
30 IF G = N THEN PRINT "Correct!" : END
40 IF G < N THEN PRINT "Too low!"
50 IF G > N THEN PRINT "Too high!"
60 GOTO 20
RUN
```

## 🎨 Technical Details

### Architecture
- **Pure JavaScript/React**: No external BASIC interpreter dependencies
- **Self-contained**: Everything runs in the browser
- **Event-driven**: Authentic terminal keyboard handling
- **State management**: Complete interpreter state preservation

### Interpreter Features
- Line-numbered programs (classic BASIC style)
- Immediate mode execution
- String and numeric variables
- Multi-dimensional arrays
- Nested FOR/NEXT loops
- GOSUB/RETURN subroutine calls
- DATA/READ/RESTORE for data handling
- Expression evaluation with operator precedence
- String concatenation
- ANSI escape sequence support for cursor positioning

## 🤝 Contributing

This repository is configured for read-only public access. If you'd like to contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 Historical Context

This project is inspired by Microsoft's 6502 BASIC, originally developed by Bill Gates and Paul Allen in 1976-1978. The 6502 microprocessor powered iconic computers including:
- Commodore PET, VIC-20, and Commodore 64
- Apple II (Applesoft BASIC)
- Atari 8-bit computers
- BBC Micro

The original assembly source code was released as open source by Microsoft in 2025 under the MIT license.

## 🔒 Security

This interpreter runs entirely in the browser sandbox. PEEK/POKE commands are simulated and cannot access actual system memory.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The original Microsoft BASIC-M6502 source code (in the 6502basic submodule) is also MIT licensed.

## 🙏 Acknowledgments

- Microsoft for releasing the original 6502 BASIC source code
- The retro computing community for keeping BASIC alive
- All contributors to this project

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Experience the golden age of personal computing!** 🖥️✨
# VibeBASIC 🎵

Feel the retro vibe! A modern BASIC interpreter with Web Audio support, featuring musical capabilities and authentic 1980s programming experience.

![VibeBASIC Demo](vibebasic-demo.gif)

**🎮 RETRO PROGRAMMING WITH MODERN SOUND**

![VibeBASIC](https://img.shields.io/badge/VibeBASIC-Interpreter-purple)
![License](https://img.shields.io/badge/license-MIT-blue)
![Sound](https://img.shields.io/badge/Web%20Audio-Enabled-green)

## 🎵 About VibeBASIC

VibeBASIC is a modern take on classic BASIC programming, adding Web Audio API support for creating music and sound effects. Perfect for learning programming with a retro vibe!

## ✨ Features

### Core BASIC Commands
- **Program Management**: `NEW`, `LIST`, `RUN`, `CLEAR`, `FILES`, `LOAD`, `SAVE`
- **Program Control**: `GOTO`, `GOSUB`/`RETURN`, `END`, `STOP`
- **Flow Control**: `IF`/`THEN`, `FOR`/`NEXT` (with `STEP`)
- **I/O Operations**: `PRINT`, `INPUT`, `READ`/`DATA`/`RESTORE`
- **Variable Operations**: `LET`, `DIM` (arrays)
- **Display Control**: `CLS`, `LOCATE`, `TAB`, `SPC`
- **Sound**: `BEEP` with frequency and duration control 🔊
- **System**: `REM`, `SYSTEM`

### Built-in Functions
- **Math**: `ABS`, `INT`, `SGN`, `SQR`, `RND`, `SIN`, `COS`, `TAN`, `ATN`, `LOG`, `EXP`
- **String**: `LEN`, `VAL`, `ASC`, `CHR$`, `STR$`, `LEFT$`, `RIGHT$`, `MID$`
- **System**: `PEEK`, `POKE` (simulated), `FRE`, `POS`

### 🎹 Musical Features
- **Web Audio API Integration**: Real sound generation
- **BEEP Command**: Create tones with custom frequency and duration
- **Musical Programs**: Built-in demos for melodies and sound effects
- **Square Wave Generation**: Authentic retro computer sounds

### Sample Programs
VibeBASIC includes 16+ classic programs demonstrating various features:
- **HELLO.BAS** - Classic Hello World
- **FIBONACCI.BAS** - Fibonacci sequence generator
- **PRIME.BAS** - Prime number finder
- **GUESS.BAS** - Number guessing game
- **STAR.BAS** - Animated starfield
- **SINE.BAS** - Sine wave visualization
- **BOUNCE.BAS** - Bouncing ball animation
- **MAZE.BAS** - Random maze generator
- **MUSIC.BAS** - Musical melody demonstration 🎵
- **BEEPTEST.BAS** - Sound effect showcase 🔊
- **GATES.BAS** - Tech Pioneer ASCII portrait
- **JOBS.BAS** - Tech Innovator ASCII portrait
- **LIFE.BAS** - Conway's Game of Life
- **PONG.BAS** - Simple Pong game
- **MANDEL.BAS** - Mandelbrot set renderer
- **PYRAMID.BAS** - Pyramid pattern generator

## 🚀 Getting Started

### Quick Start
```bash
# Clone the repository
git clone https://github.com/harragi/vibebasic.git
cd vibebasic

# Install dependencies
npm install

# Start VibeBASIC
npm start
```

Open your browser to `http://localhost:3000` and feel the vibe!

### Try These Commands
```basic
# Load and run the music demo
LOAD "MUSIC.BAS"
RUN

# Create your own beep
BEEP 440, 500

# Try the sound test program
LOAD "BEEPTEST.BAS"
RUN
```

## 📁 Project Structure

```
vibebasic/
├── README.md              # You are here!
├── package.json           # Node.js configuration
├── public/                # Static assets
│   └── index.html        # Main HTML file
├── src/                   # Source code
│   ├── App.js            # Main React component
│   ├── components/       # UI components
│   │   └── Terminal.js   # Terminal emulator
│   ├── utils/            # Core functionality
│   │   └── BasicInterpreter.js # BASIC interpreter with audio
│   └── programs/         # Built-in BASIC programs
│       └── samplePrograms.js # Demo programs
└── tests/                 # Test suite
    ├── commands/         # Command tests
    ├── functions/        # Function tests
    └── run-tests.js      # Test runner
```

## 🎨 User Interface

VibeBASIC features a retro terminal interface with:
- Green phosphor text on black background
- Authentic blinking cursor
- Monospace font for classic code appearance
- Full-screen terminal mode
- Sound visualization with ♪ symbols

## 🧪 Testing

VibeBASIC includes a comprehensive test suite:
```bash
cd tests
node run-tests.js
```

- 85+ test cases covering all commands and functions
- Test documentation available
- Continuous testing during development

## 📚 Repository Status

**This is a READ-ONLY repository for educational reference.**

- ✅ **You CAN**: Clone, fork, download, and learn from the code
- ❌ **Pull requests**: Not accepted - this is a completed project
- 💡 **Suggestions**: Feel free to fork and create your own version!

## 📜 License

MIT License - Educational and personal use encouraged!

## 🎮 Tips & Tricks

1. **Quick Program Loading**: Type numbers 1-16 to load sample programs instantly
2. **Sound Check**: Make sure your volume is on to hear the BEEP commands
3. **Create Music**: Use BEEP with different frequencies to create melodies
4. **Retro Feel**: The terminal emulates classic 1980s computer displays

## 🔗 Links

- **Repository**: [github.com/harragi/vibebasic](https://github.com/harragi/vibebasic)
- **Issues**: [Report bugs or request features](https://github.com/harragi/vibebasic/issues)

---

**VibeBASIC** - *Feel the Retro Vibe with Modern Sound!* 🎵

© 2025 VibeBASIC Contributors
# GW-BASIC Test Programs Guide

## Available Commands

### FILES
Lists all available sample programs:
```
FILES
```

### LOAD
Loads a program from the library:
```
LOAD "HELLO.BAS"
LOAD "MAZE"
LOAD "GATES"
```

## Sample Programs Included

1. **HELLO.BAS** - Classic Hello World
2. **MAZE.BAS** - Famous one-liner maze generator
3. **GUESS.BAS** - Number guessing game
4. **STAR.BAS** - Animated starfield
5. **SINE.BAS** - Sine wave pattern
6. **HAMURABI.BAS** - Ancient kingdom management game
7. **FIBONACCI.BAS** - Fibonacci sequence generator
8. **PRIME.BAS** - Prime number finder
9. **BOUNCE.BAS** - ASCII bouncing ball animation
10. **MUSIC.BAS** - Simple music player
11. **GATES.BAS** - Morphing ASCII art of Bill Gates and Steve Jobs
12. **LIFE.BAS** - Conway's Game of Life
13. **PONG.BAS** - Simple text-based Pong
14. **MANDEL.BAS** - ASCII Mandelbrot fractal

## Quick Test Sequence

```basic
FILES
LOAD "MAZE"
LIST
RUN
```

Press Ctrl+C or type NEW to stop the maze.

```basic
NEW
LOAD "GATES"
RUN
```

## Classic One-Liners

Try typing these directly:

```basic
10 PRINT "HELLO WORLD": GOTO 10
RUN
```

```basic
NEW
10 FOR I=1 TO 10: PRINT I; "SQUARED ="; I*I: NEXT I
RUN
```

## Monitor Styles

Use the monitor selector (📺 button) to switch between:
- **IBM 5151 Green** - Classic green phosphor
- **IBM CGA** - 4-color CGA mode
- **Commodore 1701** - Composite color monitor

## Notes

- Programs are read-only (no SAVE command yet)
- Use NEW or CLEAR to reset the current program
- Use CLS to clear the screen
- Use SYSTEM to restart the interpreter
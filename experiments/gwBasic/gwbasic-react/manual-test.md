# Manual Test Guide for BASIC Programs

To test each program, open http://localhost:3000 and run these commands:

## 1. HELLO.BAS
```
FILES
LOAD "HELLO"
LIST
RUN
```
Expected: Should print Hello World message

## 2. MAZE.BAS
```
LOAD "MAZE"
RUN
```
Expected: Should generate infinite maze pattern (Ctrl+C to stop)

## 3. GUESS.BAS
```
LOAD "GUESS"
RUN
```
When prompted, enter: 50
Expected: Should play number guessing game

## 4. GATES.BAS (Bill Gates & Steve Jobs)
```
LOAD "GATES"
RUN
```
Expected: Should show ASCII art morphing animation

## 5. FIBONACCI.BAS
```
LOAD "FIBONACCI"
RUN
```
Expected: Should print Fibonacci sequence

## 6. PRIME.BAS
```
LOAD "PRIME"
RUN
```
Expected: Should find prime numbers up to 100

## 7. HAMURABI.BAS
```
LOAD "HAMURABI"
RUN
```
When prompted for acres, enter: 100
Expected: Should play kingdom management game

## Common Issues to Check:

1. **Syntax Error on line X** - Note the exact line and error
2. **IF statements with THEN** - Check if `IF X THEN PRINT "Y"` works
3. **Multiple statements with :** - Check if `PRINT: PRINT: PRINT` works
4. **FOR loops with :** - Check if `FOR I=1 TO 10: NEXT I` works
5. **DATA/READ** - Check if MUSIC.BAS reads DATA correctly

## Testing Checklist:

- [ ] HELLO.BAS runs without errors
- [ ] MAZE.BAS generates maze pattern
- [ ] GUESS.BAS accepts input and plays game
- [ ] GATES.BAS shows animation
- [ ] FIBONACCI.BAS prints sequence
- [ ] PRIME.BAS finds primes
- [ ] HAMURABI.BAS plays game
- [ ] STAR.BAS shows starfield
- [ ] SINE.BAS draws sine wave
- [ ] BOUNCE.BAS shows bouncing ball
- [ ] MUSIC.BAS reads DATA values
- [ ] LIFE.BAS runs Conway's Game of Life
- [ ] PONG.BAS shows pong game
- [ ] MANDEL.BAS draws fractal
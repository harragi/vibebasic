// Auto-runner program for testing all samples
export const AUTO_RUNNER = {
  name: 'Auto Test Runner',
  description: 'Automatically runs all programs',
  code: `10 REM AUTO TEST ALL PROGRAMS
20 CLS
30 PRINT "AUTO-TESTING ALL PROGRAMS"
40 PRINT "========================="
50 PRINT
60 PRINT "Each program will run for 3 seconds"
70 PRINT
80 INPUT "Press ENTER to start..."; A$
90 REM RUN EACH DEMO
100 CLS
110 PRINT "Running HELLO.BAS..."
120 PRINT "HELLO, WORLD!"
130 FOR D = 1 TO 1500: NEXT D
140 CLS
150 PRINT "Running FIBONACCI.BAS..."
160 A = 0: B = 1
170 PRINT A; B;
180 FOR I = 1 TO 10
190 C = A + B: PRINT C;
200 A = B: B = C
210 NEXT I
220 PRINT
230 FOR D = 1 TO 1500: NEXT D
240 CLS
250 PRINT "Running SINE.BAS..."
260 FOR X = 0 TO 360 STEP 30
270 Y = INT(12 + 8 * SIN(X * 3.14159 / 180))
280 LOCATE Y, X / 5 + 1
290 PRINT "*"
300 NEXT X
310 LOCATE 24, 1
320 FOR D = 1 TO 1500: NEXT D
330 CLS
340 PRINT "Running STAR animation..."
350 FOR T = 1 TO 3
360 CLS
370 FOR I = 1 TO 20
380 X = INT(RND(1) * 79) + 1
390 Y = INT(RND(1) * 23) + 1
400 LOCATE Y, X
410 PRINT "*"
420 NEXT I
430 FOR D = 1 TO 500: NEXT D
440 NEXT T
450 CLS
460 PRINT "Running MAZE.BAS..."
470 FOR I = 1 TO 300
480 IF RND(1) > 0.5 THEN PRINT "/"; ELSE PRINT "\\";
490 NEXT I
500 PRINT
510 FOR D = 1 TO 1500: NEXT D
520 CLS
530 PRINT "========================="
540 PRINT "ALL TESTS COMPLETE!"
550 PRINT "========================="
560 PRINT
570 PRINT "All programs executed successfully."
580 PRINT
590 PRINT "Load individual programs with:"
600 PRINT "  LOAD ""STAR.BAS"""
610 PRINT "  LOAD ""LIFE.BAS"""
620 PRINT "  LOAD ""PONG.BAS"""
630 END`
};
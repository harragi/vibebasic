// Classic BASIC programs from the 1980s
export const samplePrograms = {
  'HELLO.BAS': {
    name: 'Hello World',
    description: 'The classic first program',
    code: `10 REM HELLO WORLD - THE CLASSIC
20 PRINT "Hello, World!"
30 PRINT
40 PRINT "Welcome to GW-BASIC!"
50 END`
  },

  'MAZE.BAS': {
    name: 'Maze Generator',
    description: 'Famous one-liner maze pattern',
    code: `10 REM INFINITE MAZE GENERATOR
20 R = RND(1)
25 IF R > 0.5 THEN PRINT "/";
30 IF R <= 0.5 THEN PRINT "\\";
40 GOTO 20`
  },

  'GUESS.BAS': {
    name: 'Number Guessing Game',
    description: 'Classic number guessing game',
    code: `10 REM NUMBER GUESSING GAME
20 CLS
30 PRINT "I'M THINKING OF A NUMBER BETWEEN 1 AND 100"
40 LET N = INT(RND(1) * 100) + 1
50 LET G = 0
60 PRINT "ENTER YOUR GUESS";
70 INPUT X
80 LET G = G + 1
90 IF X = N THEN GOTO 150
100 IF X < N THEN PRINT "TOO LOW!"
110 IF X > N THEN PRINT "TOO HIGH!"
120 GOTO 60
150 PRINT "CORRECT! YOU GOT IT IN"; G; "GUESSES!"
160 PRINT "PLAY AGAIN (Y/N)";
170 INPUT A$
180 IF A$ = "Y" OR A$ = "y" THEN GOTO 20
190 PRINT "THANKS FOR PLAYING!"
200 END`
  },

  'STAR.BAS': {
    name: 'Star Field',
    description: 'Animated starfield effect',
    code: `10 REM STAR FIELD ANIMATION
20 CLS
30 FOR I = 1 TO 50
40 X = INT(RND(1) * 79) + 1
50 Y = INT(RND(1) * 23) + 1
60 LOCATE Y, X
70 PRINT "*"
80 NEXT I
90 FOR D = 1 TO 500
95 NEXT D
100 GOTO 20`
  },

  'TEST.BAS': {
    name: 'Simple Test',
    description: 'Test screen buffer rendering',
    code: `10 CLS
20 LOCATE 10, 40
30 PRINT "*"
40 END`
  },

  'SINE.BAS': {
    name: 'Sine Wave',
    description: 'Draws a sine wave pattern',
    code: `10 REM SINE WAVE PATTERN
20 CLS
30 FOR X = 0 TO 360 STEP 10
40 Y = INT(12 + 10 * SIN(X * 3.14159 / 180))
50 LOCATE Y, X / 5 + 1
60 PRINT "*"
70 NEXT X
80 LOCATE 24, 1
90 END`
  },

  'HAMURABI.BAS': {
    name: 'Hamurabi',
    description: 'Classic kingdom management game',
    code: `10 REM HAMURABI - ANCIENT KINGDOM GAME
20 PRINT "HAMURABI: MANAGE YOUR KINGDOM"
30 PRINT "================================"
40 LET Y = 1
50 LET P = 100
60 LET G = 2800
70 LET L = 1000
80 PRINT
90 PRINT "YEAR"; Y; "OF YOUR REIGN"
100 PRINT "POPULATION:"; P
110 PRINT "BUSHELS OF GRAIN:"; G
120 PRINT "ACRES OF LAND:"; L
130 PRINT
140 PRINT "HOW MANY ACRES TO PLANT";
150 INPUT A
160 IF A > L THEN PRINT "YOU DON'T HAVE THAT MUCH LAND!": GOTO 140
170 IF A * 2 > G THEN PRINT "NOT ENOUGH GRAIN!": GOTO 140
180 LET G = G - A * 2
190 LET H = INT(RND(1) * 5 + 1) * A
200 LET G = G + H
210 PRINT "HARVEST:"; H; "BUSHELS"
220 LET F = INT(P * 20)
230 IF F > G THEN LET F = G
240 LET G = G - F
250 PRINT "FED"; F / 20; "PEOPLE"
260 LET D = P - F / 20
270 IF D > 0 THEN PRINT D; "PEOPLE STARVED"
280 LET P = P - D
290 IF P <= 0 THEN PRINT "EVERYONE DIED! GAME OVER": END
300 LET Y = Y + 1
310 IF Y > 10 THEN PRINT "YOU RULED FOR 10 YEARS!": END
320 GOTO 80`
  },

  'FIBONACCI.BAS': {
    name: 'Fibonacci Sequence',
    description: 'Generates Fibonacci numbers',
    code: `10 REM FIBONACCI SEQUENCE GENERATOR
20 PRINT "FIBONACCI SEQUENCE"
30 PRINT "=================="
40 LET A = 1
50 LET B = 1
60 PRINT A
70 PRINT B
80 FOR I = 3 TO 20
90 LET C = A + B
100 PRINT C
110 LET A = B
120 LET B = C
130 NEXT I
140 END`
  },

  'PRIME.BAS': {
    name: 'Prime Numbers',
    description: 'Finds prime numbers',
    code: `10 REM PRIME NUMBER FINDER
20 PRINT "PRIME NUMBERS UP TO 100"
30 PRINT "======================="
40 FOR N = 2 TO 100
50 LET P = 1
60 FOR D = 2 TO SQR(N)
70 IF N / D = INT(N / D) THEN LET P = 0: GOTO 100
80 NEXT D
100 IF P = 1 THEN PRINT N;
110 NEXT N
120 PRINT
130 END`
  },

  'BOUNCE.BAS': {
    name: 'Bouncing Ball',
    description: 'ASCII bouncing ball animation',
    code: `10 REM BOUNCING BALL ANIMATION
20 CLS
30 LET X = 1
40 LET Y = 1
50 LET DX = 1
60 LET DY = 1
70 FOR T = 1 TO 200
80 LOCATE Y, X
90 PRINT " "
100 LET X = X + DX
110 LET Y = Y + DY
120 IF X <= 1 OR X >= 78 THEN LET DX = -DX
130 IF Y <= 1 OR Y >= 23 THEN LET DY = -DY
140 LOCATE Y, X
150 PRINT "O"
160 FOR D = 1 TO 100
165 NEXT D
170 NEXT T
180 END`
  },

  'MUSIC.BAS': {
    name: 'Music Notes',
    description: 'Simple music player',
    code: `10 REM SIMPLE MUSIC PLAYER
20 PRINT "PLAYING A SIMPLE MELODY..."
30 DATA 262, 294, 330, 349, 392, 440, 494, 523
40 FOR I = 1 TO 8
50 READ F
60 PRINT "NOTE FREQUENCY:"; F; "HZ"
70 BEEP F, 500
80 NEXT I
90 RESTORE
100 PRINT "MELODY COMPLETE!"
110 END`
  },

  'GATES.BAS': {
    name: 'Bill Gates ASCII Art',
    description: 'ASCII portrait of Bill Gates',
    code: `10 REM BILL GATES - GRADIENT PORTRAIT 1985
20 CLS
30 PRINT "LOADING BILL GATES PORTRAIT..."
40 PRINT "Microsoft Co-founder (1985)"
50 FOR D = 1 TO 1000: NEXT D
60 CLS
70 REM BEGIN PORTRAIT DISPLAY
100 PRINT "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
110 FOR D = 1 TO 150: NEXT D
120 PRINT "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
130 PRINT "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
140 FOR D = 1 TO 150: NEXT D
150 PRINT "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
160 PRINT "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
170 FOR D = 1 TO 150: NEXT D
180 PRINT "@@@@@@@@@@@@@@@@@@@@@@@@@#*+===:::::::::===**#@@@@@@@@@@@@@@@@@@@@@@@@"
190 PRINT "@@@@@@@@@@@@@@@@@@@@*==:..                   ..:==@@@@@@@@@@@@@@@@@@@@"
200 FOR D = 1 TO 150: NEXT D
210 PRINT "@@@@@@@@@@@@@@@@@@@-.                             :+@@@@@@@@@@@@@@@@@@"
220 PRINT "@@@@@@@@@@@@@@@@@#.                                 -@@@@@@@@@@@@@@@@@"
230 FOR D = 1 TO 150: NEXT D
240 PRINT "@@@@@@@@@@@@@@@@*. ... -+=====================+. ... -#@@@@@@@@@@@@@@@"
250 PRINT "@@@@@@@@@@@@@@@- ..... =*********+++++*********:..... .*@@@@@@@@@@@@@@"
260 FOR D = 1 TO 150: NEXT D
270 PRINT "@@@@@@@@@@@@@@+ .....  :--------=++++=---------.  ......#@@@@@@@@@@@@@"
280 PRINT "@@@@@@@@@@@@@@* .... :+=======+:       ========+= .... :@@@@@@@@@@@@@@"
290 FOR D = 1 TO 150: NEXT D
300 PRINT "@@@@@@@@@@@@@@@+. .. :##+=:=+##- ::::: *#*=--=*#*  .. :#@@@@@@@@@@@@@@"
310 PRINT "@@@@@@@@@@@@@@@@@-.- :#***+***#:.*+++= *#**++**#* :::*@@@@@@@@@@@@@@@@"
320 FOR D = 1 TO 150: NEXT D
330 PRINT "@@@@@@@@@@@@@@@#@+-*:.-:-----:-.:+==+=.:--------:.=+-#@@@@@@@@@@@@@@@@"
340 PRINT "@@@@@@@@@@@@@@@@@#-=+===========++=+=++==========++-=@@@@@@@@@@@@@@@@@"
350 FOR D = 1 TO 150: NEXT D
360 PRINT "@@@@@@@@@@@@@@@@@@*-++++++++++++++++++++++++++++++=-#@@@@@@@@@@@@@@@@@"
370 PRINT "@@@@@@@@@@@@@@@@@#@=-+++++==+++++++++++++++==++++=:*@#@@@@@@@@@@@@@@@@"
380 FOR D = 1 TO 150: NEXT D
390 PRINT "###################@+-=+++=--=++++++++++==--=+++=-*@##################"
400 PRINT "####################@*-==+++=++++++++++++==+++=-=#@###################"
410 FOR D = 1 TO 150: NEXT D
420 PRINT "#####################@#*===+++++++++++++++++==+#@#####################"
430 PRINT "#######################@@**+++++++++++++++++*#@@######################"
440 FOR D = 1 TO 150: NEXT D
450 PRINT "#########################@@##++++++++++++*##@#########################"
460 PRINT "#############################*+++++++++++*############################"
470 FOR D = 1 TO 150: NEXT D
480 PRINT "#############################*+++++++++++*############################"
490 PRINT "#############################++++++++++++*############################"
500 FOR D = 1 TO 150: NEXT D
510 PRINT "############@@@@@@@@@@@@@@*+#****+::-******+#@@@@@@@@@@@@@@###########"
520 PRINT "###########*=++++++++++++++==+###+  .*###===+++++++++++++=+###########"
530 FOR D = 1 TO 150: NEXT D
540 PRINT "###########:.................:#*#:.. +##*..................=@#########"
550 PRINT "##########=..................:###:...=##*...................*#########"
560 FOR D = 1 TO 150: NEXT D
570 PRINT "#########*...................:##+ ....##*...................-#########"
580 PRINT "#########:...................:##=.....*#*....................+########"
590 FOR D = 1 TO 150: NEXT D
600 PRINT "########+....................:##. ... =@*....................:########"
610 PRINT "#######*.....................:##*-..:=##*.....................-#######"
620 FOR D = 1 TO 150: NEXT D
630 PRINT "#######-.....................:####*+####*......................*######"
640 PRINT "######=..............::::----=##########*----:::::..............######"
650 FOR D = 1 TO 150: NEXT D
660 PRINT "#####*-----=====*****#############################****+====----:=*####"
670 PRINT "#####*##########################################################**####"
680 FOR D = 1 TO 150: NEXT D
690 END`
  },

  'JOBS.BAS': {
    name: 'Steve Jobs ASCII Art',
    description: 'ASCII portrait of Steve Jobs',
    code: `10 REM STEVE JOBS - GRADIENT PORTRAIT 1985
20 CLS
30 PRINT "LOADING STEVE JOBS PORTRAIT..."
40 PRINT "Apple Co-founder (1985)"
50 FOR D = 1 TO 1000: NEXT D
60 CLS
70 REM BEGIN PORTRAIT DISPLAY
100 PRINT "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
110 FOR D = 1 TO 150: NEXT D
120 PRINT "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
130 PRINT "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
140 FOR D = 1 TO 150: NEXT D
150 PRINT "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
160 PRINT "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
170 FOR D = 1 TO 150: NEXT D
180 PRINT "@@@@@@@@@@@@@@@@@@@@@@@@@#*=-=-:::::::.:==-+*#@@@@@@@@@@@@@@@@@@@@@@@@"
190 PRINT "@@@@@@@@@@@@@@@@@@@@*--.                      .:=-@@@@@@@@@@@@@@@@@@@@"
200 FOR D = 1 TO 150: NEXT D
210 PRINT "@@@@@@@@@@@@@@@@@@@-    .......................   .+@@@@@@@@@@@@@@@@@@"
220 PRINT "@@@@@@@@@@@@@@@@@#.   :++++++++++++++++++++++++=.   :@@@@@@@@@@@@@@@@@"
230 FOR D = 1 TO 150: NEXT D
240 PRINT "@@@@@@@@@@@@@@@@#:    =++++++++++++++++++++++++*:    +@@@@@@@@@@@@@@@@"
250 PRINT "@@@@@@@@@@@@@@@-      =+++++++++++++++++++++++++:     .*@@@@@@@@@@@@@@"
260 FOR D = 1 TO 150: NEXT D
270 PRINT "@@@@@@@@@@@@@@=       =*++++*++++++++++++*+++++*:       #@@@@@@@@@@@@@"
280 PRINT "@@@@@@@@@@@@@@+       --------=--------==------=:      .@@@@@@@@@@@@@@"
290 FOR D = 1 TO 150: NEXT D
300 PRINT "@@@@@@@@@@@@@@@*:      .:=-=-.:-:::::-:-.:=--=:      .-#@@@@@@@@@@@@@@"
310 PRINT "@@@@@@@@@@@@@@@@@=.::: =*=:=*+ ========: #+--+#..::::#@@@@@@@@@@@@@@@@"
320 FOR D = 1 TO 150: NEXT D
330 PRINT "@@@@@@@@@@@@@@@#@+-+++=.-+++-.-++++=++++:.=++=::++++-#@@@@@@@@@@@@@@@@"
340 PRINT "@@@@@@@@@@@@@@@@@#-=+=++--:--=++++===++++=-::-=++=+-=@@@@@@@@@@@@@@@@@"
350 FOR D = 1 TO 150: NEXT D
360 PRINT "@@@@@@@@@@@@@@@@@@*-++++++++++++++=+=+++++++++++++=-#@@@@@@@@@@@@@@@@@"
370 PRINT "@@@@@@@@@@@@@@@@@#@=-++++++=++===++++====++++++++=:*@#@@@@@@@@@@@@@@@@"
380 FOR D = 1 TO 150: NEXT D
390 PRINT "###################@+-=++++++===-:::::-===++++++=-*@##################"
400 PRINT "####################@*-==+++++=.       :++++++=-=#@###################"
410 FOR D = 1 TO 150: NEXT D
420 PRINT "#####################@#*=====-          .-====+#@#####################"
430 PRINT "#######################@@*+=.-===========.:+*#@@######################"
440 FOR D = 1 TO 150: NEXT D
450 PRINT "#########################@@##++++++++++++*#@@#########################"
460 PRINT "############################@*+++++++++++#@###########################"
470 FOR D = 1 TO 150: NEXT D
480 PRINT "#############################+++++++++++=*############################"
490 PRINT "########################@@@#.             -@#@@#######################"
500 FOR D = 1 TO 150: NEXT D
510 PRINT "######################@-.:::              .:::.*######################"
520 PRINT "######################@:                       +@#####################"
530 FOR D = 1 TO 150: NEXT D
540 PRINT "############**********#:                       =***********###########"
550 PRINT "###########=                                               ###########"
560 FOR D = 1 TO 150: NEXT D
570 PRINT "###########.                                               -@#########"
580 PRINT "##########*                                                :##########"
590 FOR D = 1 TO 150: NEXT D
600 PRINT "#########@-                                                 *#########"
610 PRINT "##########:                                                 =#########"
620 FOR D = 1 TO 150: NEXT D
630 PRINT "#########*                                                  :@########"
640 PRINT "#########-                                                   *########"
650 FOR D = 1 TO 150: NEXT D
660 PRINT "#########:                                                   +########"
670 PRINT "########+                                                    :########"
680 FOR D = 1 TO 150: NEXT D
690 END`
  },

  'LIFE.BAS': {
    name: "Conway's Game of Life",
    description: 'Cellular automaton simulation',
    code: `10 REM CONWAY'S GAME OF LIFE (SIMPLE)
20 CLS
30 DIM G(25, 80), N(25, 80)
40 REM INITIALIZE RANDOM CELLS
50 FOR Y = 2 TO 24
60 FOR X = 2 TO 79
70 IF RND(1) > 0.7 THEN G(Y, X) = 1
80 NEXT X
90 NEXT Y
100 REM MAIN LOOP
110 FOR GEN = 1 TO 50
120 CLS
130 PRINT "GENERATION:"; GEN
140 FOR Y = 2 TO 24
150 FOR X = 2 TO 79
160 IF G(Y, X) = 1 THEN LOCATE Y, X: PRINT "*"
170 NEXT X
180 NEXT Y
190 REM CALCULATE NEXT GENERATION
200 FOR Y = 2 TO 24
210 FOR X = 2 TO 79
220 LET C = 0
230 FOR DY = -1 TO 1
240 FOR DX = -1 TO 1
250 IF DX = 0 AND DY = 0 THEN GOTO 270
260 C = C + G(Y + DY, X + DX)
270 NEXT DX
280 NEXT DY
290 IF G(Y, X) = 1 AND (C = 2 OR C = 3) THEN N(Y, X) = 1
300 IF G(Y, X) = 0 AND C = 3 THEN N(Y, X) = 1
310 IF C < 2 OR C > 3 THEN N(Y, X) = 0
320 NEXT X
330 NEXT Y
340 REM COPY NEXT TO CURRENT
350 FOR Y = 2 TO 24
360 FOR X = 2 TO 79
370 G(Y, X) = N(Y, X)
380 NEXT X
390 NEXT Y
400 FOR D = 1 TO 500
405 NEXT D
410 NEXT GEN
420 PRINT "SIMULATION COMPLETE"
430 END`
  },

  'PONG.BAS': {
    name: 'Simple Pong',
    description: 'Text-based Pong game',
    code: `10 REM SIMPLE TEXT PONG
20 CLS
30 LET BX = 40
35 LET BY = 12
40 LET DX = 1
45 LET DY = 1
50 LET P1 = 10
55 LET P2 = 10
60 LET S1 = 0
65 LET S2 = 0
70 PRINT "USE Q/A FOR LEFT, P/L FOR RIGHT"
80 FOR D = 1 TO 2000
85 NEXT D
90 CLS
100 REM GAME LOOP
110 FOR T = 1 TO 1000
120 CLS
130 LOCATE 1, 35
140 PRINT S1; " - "; S2
150 REM DRAW PADDLES
160 FOR I = 0 TO 3
170 LOCATE P1 + I, 2: PRINT "|"
180 LOCATE P2 + I, 78: PRINT "|"
190 NEXT I
200 REM MOVE BALL
210 BX = BX + DX
220 BY = BY + DY
230 REM BALL COLLISION
240 IF BY <= 2 OR BY >= 23 THEN DY = -DY
250 IF BX <= 3 AND BY >= P1 AND BY <= P1 + 3 THEN DX = -DX
260 IF BX >= 77 AND BY >= P2 AND BY <= P2 + 3 THEN DX = -DX
270 REM SCORING
280 IF BX < 1 THEN S2 = S2 + 1
285 IF BX < 1 THEN BX = 40
287 IF BX < 1 THEN BY = 12
290 IF BX > 79 THEN S1 = S1 + 1
295 IF BX > 79 THEN BX = 40
297 IF BX > 79 THEN BY = 12
300 REM DRAW BALL
310 LOCATE BY, BX
315 PRINT "O"
320 REM SIMPLE AI
330 IF BY < P1 + 2 AND P1 > 2 THEN P1 = P1 - 1
340 IF BY > P1 + 2 AND P1 < 20 THEN P1 = P1 + 1
350 IF BY < P2 + 2 AND P2 > 2 THEN P2 = P2 - 1
360 IF BY > P2 + 2 AND P2 < 20 THEN P2 = P2 + 1
370 FOR D = 1 TO 50
375 NEXT D
380 NEXT T
390 PRINT "GAME OVER!"
400 END`
  },

  'MANDEL.BAS': {
    name: 'Mandelbrot Set',
    description: 'ASCII Mandelbrot fractal',
    code: `10 REM MANDELBROT SET IN ASCII
20 CLS
30 PRINT "MANDELBROT SET - PLEASE WAIT..."
40 FOR Y = -12 TO 12
50 FOR X = -39 TO 39
60 LET CA = X * 0.0458
70 LET CB = Y * 0.08333
80 LET A = CA
85 LET B = CB
90 FOR I = 0 TO 15
100 LET T = A * A - B * B + CA
110 LET B = 2 * A * B + CB
120 LET A = T
130 IF A * A + B * B > 4 THEN GOTO 160
140 NEXT I
150 PRINT " ";
155 GOTO 170
160 PRINT CHR$(64 + I);
170 NEXT X
180 PRINT
190 NEXT Y
200 END`
  }
};

// Directory listing for FILES command
export const getFileList = () => {
  const files = Object.keys(samplePrograms);
  return files.map(filename => ({
    name: filename,
    size: samplePrograms[filename].code.length,
    description: samplePrograms[filename].description
  }));
};

// Get program by filename
export const getProgram = (filename) => {
  const upperName = filename.toUpperCase();
  // Try with and without .BAS extension
  if (samplePrograms[upperName]) {
    return samplePrograms[upperName];
  }
  if (!upperName.endsWith('.BAS') && samplePrograms[upperName + '.BAS']) {
    return samplePrograms[upperName + '.BAS'];
  }
  return null;
};
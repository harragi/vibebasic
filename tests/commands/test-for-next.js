// Test cases for FOR/NEXT loops
module.exports = {
  command: 'FOR/NEXT',
  description: 'Tests for FOR/NEXT loop functionality',
  tests: [
    {
      name: 'Simple loop 1 to 5',
      code: '10 FOR I = 1 TO 5\n20 PRINT I;\n30 NEXT I\n40 END',
      expected: '12345'
    },
    {
      name: 'Loop with STEP',
      code: '10 FOR I = 0 TO 10 STEP 2\n20 PRINT I;\n30 NEXT I\n40 END',
      expected: '0246810'
    },
    {
      name: 'Negative STEP',
      code: '10 FOR I = 5 TO 1 STEP -1\n20 PRINT I;\n30 NEXT I\n40 END',
      expected: '54321'
    },
    {
      name: 'Nested loops',
      code: '10 FOR I = 1 TO 2\n20 FOR J = 1 TO 3\n30 PRINT I; J;\n40 NEXT J\n50 NEXT I\n60 END',
      expected: '111213212223'
    },
    {
      name: 'Loop with expression limits',
      code: '10 LET X = 3\n20 FOR I = 1 TO X * 2\n30 PRINT I;\n40 NEXT I\n50 END',
      expected: '123456'
    },
    {
      name: 'Zero iterations (start > end)',
      code: '10 FOR I = 5 TO 1\n20 PRINT "Should not print"\n30 NEXT I\n40 PRINT "Done"\n50 END',
      expected: 'Done\n'
    },
    {
      name: 'Floating point STEP',
      code: '10 FOR X = 0 TO 2 STEP 0.5\n20 PRINT X;\n30 NEXT X\n40 END',
      expected: /0.*0\.5.*1.*1\.5.*2/
    },
    {
      name: 'NEXT without variable',
      code: '10 FOR I = 1 TO 3\n20 PRINT I;\n30 NEXT\n40 END',
      expected: '123'
    },
    {
      name: 'Variable value after loop',
      code: '10 FOR I = 1 TO 3\n20 NEXT I\n30 PRINT I\n40 END',
      expected: '4\n'
    },
    {
      name: 'Empty loop body',
      code: '10 FOR I = 1 TO 1000\n20 NEXT I\n30 PRINT "Done"\n40 END',
      expected: 'Done\n'
    }
  ]
};
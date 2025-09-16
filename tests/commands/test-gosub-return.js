// Test cases for GOSUB/RETURN subroutines
module.exports = {
  command: 'GOSUB/RETURN',
  description: 'Tests for GOSUB/RETURN subroutine calls',
  tests: [
    {
      name: 'Simple subroutine call',
      code: '10 GOSUB 100\n20 PRINT "Back"\n30 END\n100 PRINT "In sub"\n110 RETURN',
      expected: 'In sub\nBack\n'
    },
    {
      name: 'Multiple GOSUB calls',
      code: '10 GOSUB 100\n20 GOSUB 100\n30 END\n100 PRINT "Sub"\n110 RETURN',
      expected: 'Sub\nSub\n'
    },
    {
      name: 'Nested GOSUB',
      code: '10 GOSUB 100\n20 END\n100 PRINT "Sub1"\n110 GOSUB 200\n120 RETURN\n200 PRINT "Sub2"\n210 RETURN',
      expected: 'Sub1\nSub2\n'
    },
    {
      name: 'GOSUB with variables',
      code: '10 LET X = 5\n20 GOSUB 100\n30 PRINT X\n40 END\n100 LET X = X * 2\n110 RETURN',
      expected: '10\n'
    },
    {
      name: 'Multiple RETURN paths',
      code: '10 LET X = 1\n20 GOSUB 100\n30 END\n100 IF X = 1 THEN RETURN\n110 PRINT "Should not print"\n120 RETURN',
      expected: ''
    },
    {
      name: 'GOSUB in loop',
      code: '10 FOR I = 1 TO 3\n20 GOSUB 100\n30 NEXT I\n40 END\n100 PRINT I;\n110 RETURN',
      expected: '123'
    }
  ]
};
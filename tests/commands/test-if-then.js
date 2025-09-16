// Test cases for IF/THEN statements
module.exports = {
  command: 'IF/THEN',
  description: 'Tests for IF/THEN conditional statements',
  tests: [
    {
      name: 'Simple IF/THEN true',
      code: '10 LET X = 5\n20 IF X = 5 THEN PRINT "Equal"\n30 END',
      expected: 'Equal\n'
    },
    {
      name: 'Simple IF/THEN false',
      code: '10 LET X = 3\n20 IF X = 5 THEN PRINT "Equal"\n30 PRINT "Done"\n40 END',
      expected: 'Done\n'
    },
    {
      name: 'IF/THEN with GOTO',
      code: '10 LET X = 10\n20 IF X > 5 THEN GOTO 50\n30 PRINT "Small"\n40 GOTO 60\n50 PRINT "Large"\n60 END',
      expected: 'Large\n'
    },
    {
      name: 'Greater than comparison',
      code: '10 IF 10 > 5 THEN PRINT "True"\n20 END',
      expected: 'True\n'
    },
    {
      name: 'Less than comparison',
      code: '10 IF 3 < 7 THEN PRINT "True"\n20 END',
      expected: 'True\n'
    },
    {
      name: 'Greater or equal',
      code: '10 IF 5 >= 5 THEN PRINT "True"\n20 END',
      expected: 'True\n'
    },
    {
      name: 'Less or equal',
      code: '10 IF 5 <= 5 THEN PRINT "True"\n20 END',
      expected: 'True\n'
    },
    {
      name: 'Not equal (<>)',
      code: '10 IF 5 <> 3 THEN PRINT "Different"\n20 END',
      expected: 'Different\n'
    },
    {
      name: 'String comparison',
      code: '10 LET A$ = "Hello"\n20 IF A$ = "Hello" THEN PRINT "Match"\n30 END',
      expected: 'Match\n'
    },
    {
      name: 'Complex expression in condition',
      code: '10 LET X = 5\n20 LET Y = 3\n30 IF X + Y = 8 THEN PRINT "Sum is 8"\n40 END',
      expected: 'Sum is 8\n'
    },
    {
      name: 'AND operator',
      code: '10 LET X = 5\n20 LET Y = 10\n30 IF X > 0 AND Y > 0 THEN PRINT "Both positive"\n40 END',
      expected: 'Both positive\n'
    },
    {
      name: 'OR operator',
      code: '10 LET X = -5\n20 IF X < 0 OR X > 10 THEN PRINT "Outside range"\n30 END',
      expected: 'Outside range\n'
    },
    {
      name: 'Multiple statements after THEN',
      code: '10 IF 1 = 1 THEN LET X = 10: PRINT X\n20 END',
      expected: '10\n'
    }
  ]
};
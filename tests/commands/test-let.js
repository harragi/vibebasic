// Test cases for LET command
module.exports = {
  command: 'LET',
  description: 'Tests for LET variable assignment',
  tests: [
    {
      name: 'Simple numeric assignment',
      code: '10 LET A = 10\n20 PRINT A\n30 END',
      expected: '10\n'
    },
    {
      name: 'String assignment',
      code: '10 LET A$ = "Hello"\n20 PRINT A$\n30 END',
      expected: 'Hello\n'
    },
    {
      name: 'Expression assignment',
      code: '10 LET X = 5 + 3 * 2\n20 PRINT X\n30 END',
      expected: '11\n'
    },
    {
      name: 'Variable to variable',
      code: '10 LET A = 5\n20 LET B = A\n30 PRINT B\n40 END',
      expected: '5\n'
    },
    {
      name: 'Floating point',
      code: '10 LET X = 3.14159\n20 PRINT X\n30 END',
      expected: /3\.14/
    },
    {
      name: 'Negative numbers',
      code: '10 LET N = -42\n20 PRINT N\n30 END',
      expected: '-42\n'
    },
    {
      name: 'String concatenation',
      code: '10 LET A$ = "Hello"\n20 LET B$ = "World"\n30 LET C$ = A$ + B$\n40 PRINT C$\n50 END',
      expected: 'HelloWorld\n'
    },
    {
      name: 'Optional LET keyword',
      code: '10 A = 100\n20 PRINT A\n30 END',
      expected: '100\n'
    },
    {
      name: 'Multi-character variable names',
      code: '10 LET COUNT = 25\n20 PRINT COUNT\n30 END',
      expected: '25\n'
    },
    {
      name: 'Update existing variable',
      code: '10 LET X = 10\n20 LET X = X + 5\n30 PRINT X\n40 END',
      expected: '15\n'
    }
  ]
};
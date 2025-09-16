// Test cases for Math functions
module.exports = {
  category: 'Math Functions',
  description: 'Tests for mathematical functions',
  tests: [
    // ABS tests
    {
      name: 'ABS positive',
      code: '10 PRINT ABS(5)\n20 END',
      expected: '5\n'
    },
    {
      name: 'ABS negative',
      code: '10 PRINT ABS(-5)\n20 END',
      expected: '5\n'
    },
    {
      name: 'ABS zero',
      code: '10 PRINT ABS(0)\n20 END',
      expected: '0\n'
    },
    // INT tests
    {
      name: 'INT positive',
      code: '10 PRINT INT(3.7)\n20 END',
      expected: '3\n'
    },
    {
      name: 'INT negative',
      code: '10 PRINT INT(-2.3)\n20 END',
      expected: '-3\n'
    },
    // SGN tests
    {
      name: 'SGN positive',
      code: '10 PRINT SGN(42)\n20 END',
      expected: '1\n'
    },
    {
      name: 'SGN negative',
      code: '10 PRINT SGN(-42)\n20 END',
      expected: '-1\n'
    },
    {
      name: 'SGN zero',
      code: '10 PRINT SGN(0)\n20 END',
      expected: '0\n'
    },
    // SQR tests
    {
      name: 'SQR of 4',
      code: '10 PRINT SQR(4)\n20 END',
      expected: '2\n'
    },
    {
      name: 'SQR of 9',
      code: '10 PRINT SQR(9)\n20 END',
      expected: '3\n'
    },
    // RND tests
    {
      name: 'RND range check',
      code: '10 LET X = RND(1)\n20 IF X >= 0 AND X < 1 THEN PRINT "OK"\n30 END',
      expected: 'OK\n'
    },
    // Trigonometric functions
    {
      name: 'SIN(0)',
      code: '10 PRINT SIN(0)\n20 END',
      expected: '0\n'
    },
    {
      name: 'COS(0)',
      code: '10 PRINT COS(0)\n20 END',
      expected: '1\n'
    },
    {
      name: 'TAN(0)',
      code: '10 PRINT TAN(0)\n20 END',
      expected: '0\n'
    },
    // Complex expressions
    {
      name: 'Combined math functions',
      code: '10 PRINT ABS(INT(-3.7))\n20 END',
      expected: '4\n'
    },
    {
      name: 'Math in expression',
      code: '10 PRINT SQR(16) + ABS(-5)\n20 END',
      expected: '9\n'
    }
  ]
};
// Test cases for String functions
module.exports = {
  category: 'String Functions',
  description: 'Tests for string manipulation functions',
  tests: [
    // LEN tests
    {
      name: 'LEN of string',
      code: '10 PRINT LEN("Hello")\n20 END',
      expected: '5\n'
    },
    {
      name: 'LEN of empty string',
      code: '10 PRINT LEN("")\n20 END',
      expected: '0\n'
    },
    {
      name: 'LEN of variable',
      code: '10 LET A$ = "Test"\n20 PRINT LEN(A$)\n30 END',
      expected: '4\n'
    },
    // VAL tests
    {
      name: 'VAL integer',
      code: '10 PRINT VAL("123")\n20 END',
      expected: '123\n'
    },
    {
      name: 'VAL decimal',
      code: '10 PRINT VAL("3.14")\n20 END',
      expected: /3\.14/
    },
    {
      name: 'VAL with text',
      code: '10 PRINT VAL("42ABC")\n20 END',
      expected: '42\n'
    },
    // ASC tests
    {
      name: 'ASC of A',
      code: '10 PRINT ASC("A")\n20 END',
      expected: '65\n'
    },
    {
      name: 'ASC of space',
      code: '10 PRINT ASC(" ")\n20 END',
      expected: '32\n'
    },
    // CHR$ tests
    {
      name: 'CHR$ of 65',
      code: '10 PRINT CHR$(65)\n20 END',
      expected: 'A\n'
    },
    {
      name: 'CHR$ of 32',
      code: '10 PRINT CHR$(32); "X"\n20 END',
      expected: ' X\n'
    },
    // STR$ tests
    {
      name: 'STR$ of number',
      code: '10 PRINT STR$(123)\n20 END',
      expected: /123/
    },
    {
      name: 'STR$ of negative',
      code: '10 PRINT STR$(-42)\n20 END',
      expected: /-42/
    },
    // LEFT$ tests
    {
      name: 'LEFT$ basic',
      code: '10 PRINT LEFT$("Hello", 3)\n20 END',
      expected: 'Hel\n'
    },
    {
      name: 'LEFT$ full string',
      code: '10 PRINT LEFT$("Test", 10)\n20 END',
      expected: 'Test\n'
    },
    // RIGHT$ tests
    {
      name: 'RIGHT$ basic',
      code: '10 PRINT RIGHT$("Hello", 2)\n20 END',
      expected: 'lo\n'
    },
    {
      name: 'RIGHT$ full string',
      code: '10 PRINT RIGHT$("Test", 10)\n20 END',
      expected: 'Test\n'
    },
    // MID$ tests
    {
      name: 'MID$ with 2 params',
      code: '10 PRINT MID$("Hello", 2)\n20 END',
      expected: 'ello\n'
    },
    {
      name: 'MID$ with 3 params',
      code: '10 PRINT MID$("Hello", 2, 2)\n20 END',
      expected: 'el\n'
    },
    // String concatenation
    {
      name: 'String concatenation',
      code: '10 PRINT "Hello" + "World"\n20 END',
      expected: 'HelloWorld\n'
    },
    {
      name: 'Variable concatenation',
      code: '10 LET A$ = "Hi"\n20 LET B$ = "There"\n30 PRINT A$ + B$\n40 END',
      expected: 'HiThere\n'
    }
  ]
};
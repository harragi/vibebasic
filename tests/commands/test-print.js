// Test cases for PRINT command
module.exports = {
  command: 'PRINT',
  description: 'Tests for PRINT command functionality',
  tests: [
    {
      name: 'Simple string print',
      code: '10 PRINT "Hello, World!"\n20 END',
      expected: 'Hello, World!\n'
    },
    {
      name: 'Print with semicolon (no newline)',
      code: '10 PRINT "Hello";\n20 PRINT "World"\n30 END',
      expected: 'HelloWorld\n'
    },
    {
      name: 'Print with comma (tab spacing)',
      code: '10 PRINT "A","B","C"\n20 END',
      expected: /A\s+B\s+C/
    },
    {
      name: 'Print numeric value',
      code: '10 PRINT 42\n20 END',
      expected: '42\n'
    },
    {
      name: 'Print variable',
      code: '10 LET A = 100\n20 PRINT A\n30 END',
      expected: '100\n'
    },
    {
      name: 'Print string variable',
      code: '10 LET A$ = "Test"\n20 PRINT A$\n30 END',
      expected: 'Test\n'
    },
    {
      name: 'Print expression',
      code: '10 PRINT 5 + 3 * 2\n20 END',
      expected: '11\n'
    },
    {
      name: 'Print multiple items',
      code: '10 LET X = 5\n20 PRINT "X ="; X\n30 END',
      expected: 'X =5\n'
    },
    {
      name: 'Empty PRINT (blank line)',
      code: '10 PRINT\n20 PRINT "After blank"\n30 END',
      expected: '\nAfter blank\n'
    },
    {
      name: 'PRINT with TAB function',
      code: '10 PRINT TAB(10); "Indented"\n20 END',
      expected: /^\s{10}Indented/
    }
  ]
};
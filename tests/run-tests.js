#!/usr/bin/env node

/**
 * Test Runner for Classic BASIC Web Interpreter
 *
 * This script runs all test cases and reports results
 * Usage: node run-tests.js [category]
 * Examples:
 *   node run-tests.js           # Run all tests
 *   node run-tests.js commands  # Run command tests only
 *   node run-tests.js functions # Run function tests only
 */

const fs = require('fs');
const path = require('path');
const BasicInterpreter = require('../gwbasic-react/src/utils/BasicInterpreter');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

class TestRunner {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      skipped: 0,
      errors: []
    };
  }

  /**
   * Run a single test case
   */
  runTest(test, testFile) {
    try {
      const interpreter = new BasicInterpreter();
      let output = '';

      // Capture output
      interpreter.onOutput = (text) => {
        output += text;
      };

      // Load and run the program
      const lines = test.code.split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          interpreter.executeLine(line);
        }
      });

      // Run the program
      interpreter.executeCommand('RUN');

      // Check expected output
      if (test.expected instanceof RegExp) {
        if (test.expected.test(output)) {
          return { passed: true };
        } else {
          return {
            passed: false,
            reason: `Output mismatch\nExpected pattern: ${test.expected}\nGot: ${output}`
          };
        }
      } else {
        if (output === test.expected) {
          return { passed: true };
        } else {
          return {
            passed: false,
            reason: `Output mismatch\nExpected: ${JSON.stringify(test.expected)}\nGot: ${JSON.stringify(output)}`
          };
        }
      }
    } catch (error) {
      return {
        passed: false,
        reason: `Error: ${error.message}`
      };
    }
  }

  /**
   * Load and run tests from a file
   */
  runTestFile(filePath) {
    const fileName = path.basename(filePath, '.js');
    console.log(`\n${colors.cyan}Running ${fileName}...${colors.reset}`);

    try {
      const testModule = require(filePath);
      const tests = testModule.tests;

      if (!tests || !Array.isArray(tests)) {
        console.log(`${colors.yellow}No tests found in ${fileName}${colors.reset}`);
        return;
      }

      tests.forEach((test, index) => {
        const result = this.runTest(test, fileName);

        if (result.passed) {
          this.results.passed++;
          console.log(`  ${colors.green}✓${colors.reset} ${test.name}`);
        } else {
          this.results.failed++;
          console.log(`  ${colors.red}✗${colors.reset} ${test.name}`);
          if (result.reason) {
            console.log(`    ${colors.red}${result.reason}${colors.reset}`);
          }
          this.results.errors.push({
            file: fileName,
            test: test.name,
            reason: result.reason
          });
        }
      });
    } catch (error) {
      console.log(`${colors.red}Error loading ${fileName}: ${error.message}${colors.reset}`);
      this.results.errors.push({
        file: fileName,
        test: 'File Load',
        reason: error.message
      });
    }
  }

  /**
   * Run all tests in a directory
   */
  runTestDirectory(dirPath, dirName) {
    console.log(`\n${colors.blue}═══ ${dirName.toUpperCase()} TESTS ═══${colors.reset}`);

    if (!fs.existsSync(dirPath)) {
      console.log(`${colors.yellow}Directory ${dirPath} not found${colors.reset}`);
      return;
    }

    const files = fs.readdirSync(dirPath)
      .filter(file => file.startsWith('test-') && file.endsWith('.js'));

    if (files.length === 0) {
      console.log(`${colors.yellow}No test files found in ${dirName}${colors.reset}`);
      return;
    }

    files.forEach(file => {
      this.runTestFile(path.join(dirPath, file));
    });
  }

  /**
   * Print test results summary
   */
  printSummary() {
    console.log(`\n${colors.blue}═══ TEST SUMMARY ═══${colors.reset}`);
    console.log(`${colors.green}Passed: ${this.results.passed}${colors.reset}`);
    console.log(`${colors.red}Failed: ${this.results.failed}${colors.reset}`);

    if (this.results.skipped > 0) {
      console.log(`${colors.yellow}Skipped: ${this.results.skipped}${colors.reset}`);
    }

    const total = this.results.passed + this.results.failed + this.results.skipped;
    const percentage = total > 0 ? Math.round((this.results.passed / total) * 100) : 0;

    console.log(`\nTotal: ${total} tests`);
    console.log(`Success rate: ${percentage}%`);

    if (this.results.errors.length > 0) {
      console.log(`\n${colors.red}═══ FAILED TESTS ═══${colors.reset}`);
      this.results.errors.forEach(error => {
        console.log(`${colors.red}${error.file} - ${error.test}${colors.reset}`);
        if (error.reason) {
          console.log(`  ${error.reason}`);
        }
      });
    }

    // Return exit code
    return this.results.failed === 0 ? 0 : 1;
  }

  /**
   * Main run method
   */
  run(category) {
    console.log(`${colors.cyan}Classic BASIC Web Interpreter - Test Suite${colors.reset}`);
    console.log(`${colors.cyan}${'═'.repeat(50)}${colors.reset}`);

    const testsDir = path.join(__dirname);

    if (category) {
      // Run specific category
      const dirPath = path.join(testsDir, category);
      this.runTestDirectory(dirPath, category);
    } else {
      // Run all categories
      this.runTestDirectory(path.join(testsDir, 'commands'), 'Command');
      this.runTestDirectory(path.join(testsDir, 'functions'), 'Function');
      this.runTestDirectory(path.join(testsDir, 'programs'), 'Program');
      this.runTestDirectory(path.join(testsDir, 'integration'), 'Integration');
    }

    return this.printSummary();
  }
}

// Run tests if executed directly
if (require.main === module) {
  const runner = new TestRunner();
  const category = process.argv[2];
  const exitCode = runner.run(category);
  process.exit(exitCode);
}

module.exports = TestRunner;
#!/usr/bin/env node

/**
 * Test Documentation for Classic BASIC Web Interpreter
 *
 * This script documents all available test cases.
 * Actual test execution should be done in the browser environment.
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function documentTests() {
  console.log(`${colors.cyan}Classic BASIC Web Interpreter - Test Documentation${colors.reset}`);
  console.log(`${colors.cyan}${'═'.repeat(60)}${colors.reset}`);

  const categories = ['commands', 'functions', 'programs', 'integration'];
  let totalTests = 0;

  categories.forEach(category => {
    const dirPath = path.join(__dirname, category);

    if (!fs.existsSync(dirPath)) {
      return;
    }

    console.log(`\n${colors.blue}═══ ${category.toUpperCase()} TESTS ═══${colors.reset}`);

    const files = fs.readdirSync(dirPath)
      .filter(file => file.startsWith('test-') && file.endsWith('.js'))
      .sort();

    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      try {
        const testModule = require(filePath);
        const testName = testModule.command || testModule.category || path.basename(file, '.js');
        const tests = testModule.tests || [];

        console.log(`\n${colors.green}${testName}${colors.reset}`);
        console.log(`${colors.gray}${testModule.description || 'No description'}${colors.reset}`);
        console.log(`${colors.gray}Tests: ${tests.length}${colors.reset}`);

        tests.forEach(test => {
          console.log(`  • ${test.name}`);
        });

        totalTests += tests.length;
      } catch (error) {
        console.log(`${colors.yellow}  Could not load: ${file}${colors.reset}`);
      }
    });
  });

  console.log(`\n${colors.blue}═══ SUMMARY ═══${colors.reset}`);
  console.log(`Total test cases documented: ${colors.green}${totalTests}${colors.reset}`);
  console.log(`\n${colors.gray}Note: To run tests, use the browser-based test runner${colors.reset}`);
  console.log(`${colors.gray}or integrate with a testing framework like Jest.${colors.reset}`);
}

documentTests();
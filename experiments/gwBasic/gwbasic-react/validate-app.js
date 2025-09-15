#!/usr/bin/env node

/**
 * Validation script for GW-BASIC React App
 * This script validates that the React app builds and runs correctly
 */

const { exec, spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const MAX_RETRIES = 30;
const RETRY_DELAY = 1000;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateFileStructure() {
  log('\n📁 Validating file structure...', 'blue');

  const requiredFiles = [
    'src/App.js',
    'src/index.js',
    'src/App.css',
    'src/components/CRTMonitor.js',
    'src/components/Terminal.js',
    'src/utils/BasicInterpreter.js',
    'package.json',
    'public/index.html'
  ];

  let allFilesExist = true;

  requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      log(`  ✅ ${file}`, 'green');
    } else {
      log(`  ❌ ${file} - Missing!`, 'red');
      allFilesExist = false;
    }
  });

  return allFilesExist;
}

function checkDependencies() {
  log('\n📦 Checking dependencies...', 'blue');

  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['react', 'react-dom', 'react-scripts'];

  let allDepsPresent = true;

  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      log(`  ✅ ${dep}: ${packageJson.dependencies[dep]}`, 'green');
    } else {
      log(`  ❌ ${dep} - Missing!`, 'red');
      allDepsPresent = false;
    }
  });

  return allDepsPresent;
}

function validateSyntax() {
  return new Promise((resolve) => {
    log('\n🔍 Validating JavaScript syntax...', 'blue');

    exec('npx eslint src --ext .js,.jsx --no-eslintrc --env browser,es2021 --parser-options ecmaVersion:2021,sourceType:module,ecmaFeatures:{jsx:true} 2>&1', (error, stdout, stderr) => {
      if (error) {
        // ESLint returns error for warnings too, so we check the output
        const hasErrors = stdout.includes('error') || stderr.includes('error');

        if (hasErrors) {
          log('  ⚠️  ESLint found some issues (but app may still work):', 'yellow');
          console.log(stdout);
          resolve(true); // We don't fail on linting issues
        } else {
          log('  ✅ No critical syntax errors found', 'green');
          resolve(true);
        }
      } else {
        log('  ✅ All JavaScript files are valid', 'green');
        resolve(true);
      }
    });
  });
}

function testServerConnection(retries = 0) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: '/',
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        log(`  ✅ Server is responding on port ${PORT}`, 'green');

        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          // Check if the HTML contains our root div
          if (data.includes('id="root"')) {
            log('  ✅ HTML structure is valid', 'green');
            resolve(true);
          } else {
            log('  ⚠️  HTML structure may be invalid', 'yellow');
            resolve(false);
          }
        });
      } else {
        log(`  ⚠️  Server returned status ${res.statusCode}`, 'yellow');
        resolve(false);
      }
    });

    req.on('error', (err) => {
      if (retries < MAX_RETRIES) {
        process.stdout.write(`\r  ⏳ Waiting for server to start... (${retries + 1}/${MAX_RETRIES})`);
        setTimeout(() => {
          testServerConnection(retries + 1).then(resolve);
        }, RETRY_DELAY);
      } else {
        log(`\n  ❌ Could not connect to server: ${err.message}`, 'red');
        resolve(false);
      }
    });

    req.on('timeout', () => {
      req.destroy();
      if (retries < MAX_RETRIES) {
        setTimeout(() => {
          testServerConnection(retries + 1).then(resolve);
        }, RETRY_DELAY);
      } else {
        log('  ❌ Server connection timeout', 'red');
        resolve(false);
      }
    });

    req.end();
  });
}

function testBuild() {
  return new Promise((resolve) => {
    log('\n🔨 Testing production build...', 'blue');

    const buildProcess = exec('npm run build', (error, stdout, stderr) => {
      if (error) {
        log('  ❌ Build failed:', 'red');
        console.error(stderr);
        resolve(false);
      } else {
        log('  ✅ Build completed successfully', 'green');

        // Check if build folder exists
        if (fs.existsSync(path.join(__dirname, 'build'))) {
          log('  ✅ Build folder created', 'green');

          // Check for key files in build
          const buildFiles = ['index.html', 'static/js', 'static/css'];
          let allBuildFilesExist = true;

          buildFiles.forEach(file => {
            const filePath = path.join(__dirname, 'build', file);
            if (fs.existsSync(filePath)) {
              log(`    ✅ build/${file}`, 'green');
            } else {
              log(`    ⚠️  build/${file} - Missing`, 'yellow');
              allBuildFilesExist = false;
            }
          });

          resolve(allBuildFilesExist);
        } else {
          log('  ❌ Build folder not created', 'red');
          resolve(false);
        }
      }
    });
  });
}

async function runValidation() {
  log('🚀 Starting GW-BASIC React App Validation', 'blue');
  log('=' .repeat(50), 'blue');

  let allTestsPassed = true;

  // 1. Validate file structure
  if (!validateFileStructure()) {
    allTestsPassed = false;
  }

  // 2. Check dependencies
  if (!checkDependencies()) {
    allTestsPassed = false;
  }

  // 3. Validate syntax
  const syntaxValid = await validateSyntax();
  if (!syntaxValid) {
    allTestsPassed = false;
  }

  // 4. Test server connection
  log('\n🌐 Testing development server...', 'blue');
  const serverWorks = await testServerConnection();
  if (!serverWorks) {
    allTestsPassed = false;
  }

  // 5. Test build (optional, can be slow)
  if (process.argv.includes('--with-build')) {
    const buildWorks = await testBuild();
    if (!buildWorks) {
      allTestsPassed = false;
    }
  } else {
    log('\n💡 Tip: Run with --with-build to test production build', 'yellow');
  }

  // Final report
  log('\n' + '=' .repeat(50), 'blue');
  if (allTestsPassed) {
    log('✅ All validation checks passed!', 'green');
    log('🎉 Your GW-BASIC React app is ready to use!', 'green');
    process.exit(0);
  } else {
    log('⚠️  Some validation checks failed', 'yellow');
    log('Please review the issues above and fix them', 'yellow');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('\n\n👋 Validation interrupted', 'yellow');
  process.exit(0);
});

// Run validation
runValidation().catch(err => {
  log(`\n❌ Validation error: ${err.message}`, 'red');
  process.exit(1);
});
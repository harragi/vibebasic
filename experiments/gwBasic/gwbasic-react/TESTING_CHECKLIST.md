# Testing Checklist for GW-BASIC React App

## 🔍 Pre-Deployment Testing Steps

### 1. File Structure Validation
Before any changes, ensure all required files exist:
```bash
node validate-app.js
```

### 2. Dependency Check
Verify all npm packages are installed:
```bash
npm install
npm ls react react-dom react-scripts
```

### 3. Development Server Test
```bash
# Start the dev server
npm start

# In another terminal, run validation
node validate-app.js
```

### 4. Build Test
```bash
# Test production build
node validate-app.js --with-build
```

### 5. Manual Browser Testing

#### Visual Checks:
- [ ] CRT monitor frame renders correctly
- [ ] Green phosphor text is visible
- [ ] Scanlines animation is working
- [ ] Screen curve effect is applied
- [ ] Power button LED is glowing
- [ ] Terminal cursor is blinking

#### Functionality Tests:
- [ ] Can type in the terminal
- [ ] Enter key processes commands
- [ ] Basic commands work:
  ```basic
  PRINT "HELLO"
  ```

- [ ] Line-numbered programs work:
  ```basic
  10 PRINT "TEST"
  20 END
  LIST
  RUN
  ```

- [ ] FOR loops work:
  ```basic
  10 FOR I = 1 TO 3
  20 PRINT I
  30 NEXT I
  RUN
  ```

- [ ] INPUT works:
  ```basic
  10 INPUT "NAME"; N$
  20 PRINT "HELLO "; N$
  RUN
  ```

### 6. Console Error Check
Open browser DevTools and check for:
- [ ] No React errors in console
- [ ] No missing asset errors (404s)
- [ ] No runtime exceptions

### 7. Responsive Design Test
Test on different viewport sizes:
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

## 🚀 Automated Testing Command

Run this single command to validate everything:
```bash
# Full validation including build
npm install && npm start & sleep 10 && node validate-app.js --with-build
```

## 🔧 Common Issues and Fixes

### Issue: React 18 Render Error
**Error:** `ReactDOM.render is not a function`
**Fix:** Update `src/index.js` to use `createRoot`:
```javascript
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### Issue: Missing Dependencies
**Error:** Module not found
**Fix:**
```bash
npm install
```

### Issue: Port Already in Use
**Error:** Port 3000 is already in use
**Fix:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
PORT=3001 npm start
```

### Issue: ESLint Warnings
**Warning:** Expected '===' and instead saw '=='
**Fix:** These are warnings, not errors. App will still work. To fix:
- Use strict equality (`===`) instead of loose equality (`==`)
- Add `// eslint-disable-next-line` above the line to suppress

## 📋 Deployment Readiness Checklist

Before deploying to production:

- [ ] All tests pass in `validate-app.js`
- [ ] Build completes without errors
- [ ] No console errors in browser
- [ ] All BASIC commands tested
- [ ] Performance is acceptable (< 3s load time)
- [ ] Works on Chrome, Firefox, Safari
- [ ] Mobile responsive design works

## 🔄 After Making Changes

Always run these steps after modifying code:

1. **Save all files**
2. **Run validation:**
   ```bash
   node validate-app.js
   ```
3. **Test in browser:**
   - Refresh the page
   - Test the specific feature you changed
   - Check console for errors
4. **Test a BASIC program:**
   ```basic
   10 REM TEST PROGRAM
   20 PRINT "TESTING 1,2,3"
   30 FOR I = 1 TO 3
   40 PRINT "COUNT: "; I
   50 NEXT I
   60 END
   RUN
   ```

## 📊 Performance Benchmarks

Expected performance metrics:
- **Initial Load:** < 3 seconds
- **Time to Interactive:** < 2 seconds
- **BASIC Program Execution:** < 100ms for 100 lines
- **Memory Usage:** < 50MB

## 🐛 Debug Mode

To enable debug output in the BASIC interpreter:
```javascript
// In Terminal.js, set debug mode
interpreterRef.current.debugMode = true;
```

This will log execution details to the browser console.
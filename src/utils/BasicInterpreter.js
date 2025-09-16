class BasicInterpreter {
    constructor() {
        this.reset();
        this.initializeAudio();
    }

    initializeAudio() {
        // Initialize Web Audio API for BEEP command
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
            this.audioContext = null;
        }
    }

    playBeep(frequency = 800, duration = 200) {
        if (!this.audioContext) {
            console.log('Audio context not available');
            return;
        }

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'square'; // Classic beep sound

            const currentTime = this.audioContext.currentTime;
            gainNode.gain.setValueAtTime(0.3, currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + duration / 1000);

            oscillator.start(currentTime);
            oscillator.stop(currentTime + duration / 1000);
        } catch (e) {
            console.error('Error playing beep:', e);
        }
    }

    reset() {
        this.program = {};
        this.variables = {};
        this.arrays = {};
        this.stringVars = {};
        this.forLoops = [];
        this.gosubStack = [];
        this.dataPointer = { line: null, index: 0 };
        this.dataStatements = {};
        this.running = false;
        this.currentLine = null;
        this.functions = {};
        this.output = [];
        this.skippedForLoops = new Set();
        this.initializeBuiltinFunctions();
    }

    initializeBuiltinFunctions() {
        this.builtinFunctions = {
            'ABS': (x) => Math.abs(this.evaluateExpression(x)),
            'INT': (x) => Math.floor(this.evaluateExpression(x)),
            'SGN': (x) => {
                const val = this.evaluateExpression(x);
                return val > 0 ? 1 : val < 0 ? -1 : 0;
            },
            'SQR': (x) => Math.sqrt(this.evaluateExpression(x)),
            'RND': (x) => Math.random(),
            'SIN': (x) => Math.sin(this.evaluateExpression(x)),
            'COS': (x) => Math.cos(this.evaluateExpression(x)),
            'TAN': (x) => Math.tan(this.evaluateExpression(x)),
            'ATN': (x) => Math.atan(this.evaluateExpression(x)),
            'LOG': (x) => Math.log(this.evaluateExpression(x)),
            'EXP': (x) => Math.exp(this.evaluateExpression(x)),
            'LEN': (x) => {
                const str = String(this.evaluateExpression(x));
                return str.length;
            },
            'VAL': (x) => {
                const str = String(this.evaluateExpression(x));
                return parseFloat(str) || 0;
            },
            'ASC': (x) => {
                const str = String(this.evaluateExpression(x));
                return str.charCodeAt(0) || 0;
            },
            'CHR$': (x) => {
                const code = this.evaluateExpression(x);
                return String.fromCharCode(Math.floor(code));
            },
            'STR$': (x) => String(this.evaluateExpression(x)),
            'LEFT$': (str, n) => {
                const s = String(this.evaluateExpression(str));
                const len = this.evaluateExpression(n);
                return s.substring(0, len);
            },
            'RIGHT$': (str, n) => {
                const s = String(this.evaluateExpression(str));
                const len = this.evaluateExpression(n);
                return s.substring(s.length - len);
            },
            'MID$': (str, start, len) => {
                const s = String(this.evaluateExpression(str));
                const st = this.evaluateExpression(start) - 1;
                const l = len ? this.evaluateExpression(len) : s.length;
                return s.substring(st, st + l);
            },
            'PEEK': (addr) => 0,
            'FRE': (x) => 32768,
            'POS': (x) => 0,
            'TAB': (x) => {
                const pos = Math.floor(this.evaluateExpression(x));
                // TAB moves to column position, so we need to calculate spaces
                // For simplicity, just return the number of spaces
                return ' '.repeat(Math.max(0, pos));
            },
            'SPC': (x) => ' '.repeat(Math.max(0, this.evaluateExpression(x)))
        };
    }

    addLine(lineNum, content) {
        if (content) {
            this.program[lineNum] = content;
        } else {
            delete this.program[lineNum];
        }
    }

    listProgram() {
        const lines = Object.keys(this.program).map(Number).sort((a, b) => a - b);
        const listing = [];
        for (const line of lines) {
            listing.push(`${line} ${this.program[line]}`);
        }
        return listing;
    }

    async run(onOutput, onInput) {
        this.running = true;
        this.variables = {};
        this.stringVars = {};
        this.arrays = {};
        this.forLoops = [];
        this.gosubStack = [];
        this.output = [];
        this.dataPointer = { line: null, index: 0 };
        this.skippedForLoops = new Set();
        this.onOutput = onOutput || ((text) => this.output.push(text));
        this.onInput = onInput;
        this.stepCount = 0;
        this.lastYield = Date.now();

        this.preprocessData();

        const lines = Object.keys(this.program).map(Number).sort((a, b) => a - b);

        for (let i = 0; i < lines.length && this.running; i++) {
            this.currentLine = lines[i];

            try {
                await this.executeLine(this.program[this.currentLine]);

                // Yield control periodically to prevent browser freezing
                this.stepCount++;

                // Check if we're in an animation pattern (LOCATE or drawing in a loop)
                const lineContent = this.program[this.currentLine].toUpperCase();
                if (lineContent.includes('LOCATE')) {
                    // Small delay after LOCATE to allow screen updates
                    await new Promise(resolve => setTimeout(resolve, 1));
                } else if (lineContent.includes('GOTO')) {
                    // Check if this is a backward jump (animation loop)
                    const gotoMatch = lineContent.match(/GOTO\s+(\d+)/);
                    if (gotoMatch) {
                        const targetLine = parseInt(gotoMatch[1]);
                        if (targetLine < this.currentLine) {
                            // Backward jump - determine delay based on context
                            // If we're in a FOR loop (game loop), use minimal delay
                            // If it's a simple GOTO loop (animation), use longer delay
                            const isInForLoop = this.forLoops.length > 0;
                            const delay = isInForLoop ? 20 : 100;
                            await new Promise(resolve => setTimeout(resolve, delay));
                        }
                    }
                }

                if (this.stepCount % 50 === 0) {
                    const now = Date.now();
                    if (now - this.lastYield > 30) {  // Yield every 30ms
                        await new Promise(resolve => setTimeout(resolve, 0));
                        this.lastYield = now;
                    }
                }

                if (this.currentLine !== lines[i]) {
                    const newIndex = lines.indexOf(this.currentLine);
                    if (newIndex >= 0) {
                        i = newIndex - 1;
                    } else {
                        throw new Error(`Line ${this.currentLine} not found`);
                    }
                }
            } catch (e) {
                this.onOutput(`Error in line ${this.currentLine}: ${e.message}`, 'error');
                this.running = false;
                throw e;
            }
        }

        this.running = false;
        return this.output;
    }

    stop() {
        this.running = false;
        // Clear any pending loops or subroutines
        this.forLoops = [];
        this.gosubStack = [];
        // Reset step counter
        this.stepCount = 0;
        this.lastYield = Date.now();
    }

    preprocessData() {
        const lines = Object.keys(this.program).map(Number).sort((a, b) => a - b);
        for (const line of lines) {
            const content = this.program[line].trim();
            if (content.toUpperCase().startsWith('DATA')) {
                const dataContent = content.substring(4).trim();
                this.dataStatements[line] = this.parseDataItems(dataContent);
            }
        }

        const dataLines = Object.keys(this.dataStatements).map(Number).sort((a, b) => a - b);
        if (dataLines.length > 0) {
            this.dataPointer.line = dataLines[0];
            this.dataPointer.index = 0;
        }
    }

    parseDataItems(content) {
        const items = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < content.length; i++) {
            const char = content[i];
            if (char === '"') {
                inQuotes = !inQuotes;
                current += char;
            } else if (char === ',' && !inQuotes) {
                items.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        if (current) {
            items.push(current.trim());
        }

        return items;
    }

    async executeLine(line) {
        line = line.trim();
        if (!line) return;

        // Check for multiple statements separated by colons
        // But be careful not to split colons inside strings
        const statements = this.splitStatements(line);

        if (statements.length > 1) {
            // Execute each statement in sequence
            for (const stmt of statements) {
                await this.executeSingleStatement(stmt);
            }
            return;
        }

        await this.executeSingleStatement(line);
    }

    splitStatements(line) {
        const statements = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                inQuotes = !inQuotes;
                current += char;
            } else if (char === ':' && !inQuotes) {
                // Found a statement separator
                if (current.trim()) {
                    statements.push(current.trim());
                }
                current = '';
            } else {
                current += char;
            }
        }

        if (current.trim()) {
            statements.push(current.trim());
        }

        return statements.length > 0 ? statements : [line];
    }

    async executeSingleStatement(line) {
        line = line.trim();
        if (!line) return;

        // Handle FOR loop
        const forMatch = line.match(/^FOR\s+([A-Z])\s*=\s*(.+?)\s+TO\s+(.+?)(?:\s+STEP\s+(.+))?$/i);
        if (forMatch) {
            await this.executeFor(forMatch[1], forMatch[2], forMatch[3], forMatch[4]);
            return;
        }

        // Handle NEXT
        if (line.toUpperCase().startsWith('NEXT')) {
            const varName = line.substring(4).trim().toUpperCase();

            if (this.skippedForLoops && this.skippedForLoops.has(varName)) {
                this.skippedForLoops.delete(varName);
                return;
            }

            await this.executeNext(varName);
            return;
        }

        // Handle IF
        if (line.toUpperCase().startsWith('IF')) {
            await this.executeIf(line.substring(2).trim());
            return;
        }

        // Handle GOSUB
        if (line.toUpperCase().startsWith('GOSUB')) {
            const target = parseInt(this.evaluateExpression(line.substring(5).trim()));
            const lines = Object.keys(this.program).map(Number).sort((a, b) => a - b);
            const currentIndex = lines.indexOf(this.currentLine);
            const returnLine = currentIndex < lines.length - 1 ? lines[currentIndex + 1] : null;
            this.gosubStack.push(returnLine);
            this.currentLine = target;
            return;
        }

        // Handle RETURN
        if (line.toUpperCase() === 'RETURN') {
            if (this.gosubStack.length > 0) {
                this.currentLine = this.gosubStack.pop();
            } else {
                throw new Error('RETURN without GOSUB');
            }
            return;
        }

        await this.executeCommand(line);
    }

    async executeCommand(command) {
        const parts = this.tokenize(command);
        if (parts.length === 0) return;

        const cmd = parts[0].toUpperCase();
        const args = parts.slice(1).join(' ');

        switch (cmd) {
            case 'RUN':
                // Handled at higher level
                break;
            case 'LIST':
                // Handled at higher level
                break;
            case 'NEW':
            case 'CLEAR':
                this.reset();
                this.onOutput('Ok', 'system');
                break;
            case 'PRINT':
                await this.executePrint(args);
                break;
            case 'LET':
                this.executeLet(args);
                break;
            case 'INPUT':
                await this.executeInput(args);
                break;
            case 'GOTO':
                const line = parseInt(this.evaluateExpression(args));
                if (this.program[line]) {
                    this.currentLine = line;
                } else {
                    throw new Error(`Line ${line} not found`);
                }
                break;
            case 'END':
            case 'STOP':
                this.running = false;
                break;
            case 'REM':
                break;
            case 'DATA':
                break;
            case 'READ':
                await this.executeRead(args);
                break;
            case 'RESTORE':
                this.executeRestore(args);
                break;
            case 'DIM':
                this.executeDim(args);
                break;
            case 'POKE':
                const pokeArgs = args.split(',');
                if (pokeArgs.length === 2) {
                    // Simulated POKE
                }
                break;
            case 'CLS':
                this.onOutput('', 'clear');
                // Add a small delay after CLS to ensure screen buffer is created
                // But keep it minimal for games that clear screen frequently
                await new Promise(resolve => setTimeout(resolve, 10));
                break;
            case 'LOCATE':
                // Parse LOCATE Y, X command
                const locateArgs = args.split(',').map(arg => this.evaluateExpression(arg.trim()));
                if (locateArgs.length >= 2) {
                    const y = Math.floor(locateArgs[0]);
                    const x = Math.floor(locateArgs[1]);
                    // Send a locate command to the terminal
                    this.onOutput(`\x1B[${y};${x}H`, 'locate');
                }
                break;
            case 'BEEP':
                // Parse BEEP frequency, duration or just BEEP
                const beepArgs = args ? args.split(',').map(arg => this.evaluateExpression(arg.trim())) : [];
                const freq = beepArgs[0] || 800;
                const duration = beepArgs[1] || 200;
                this.playBeep(freq, duration);
                this.onOutput(`♪ BEEP ${freq}Hz ${duration}ms`, 'system');
                break;
            case 'SYSTEM':
                this.onOutput('Returning to system...', 'system');
                this.running = false;
                break;
            default:
                if (this.isAssignment(command)) {
                    this.executeLet(command);
                } else {
                    throw new Error(`Syntax error`);
                }
        }
    }

    async executeFor(variable, start, end, step) {
        const varName = variable.toUpperCase();

        const existingLoop = this.forLoops.find(loop =>
            loop.variable === varName && loop.line === this.currentLine
        );

        if (existingLoop) {
            return;
        }

        const startVal = this.evaluateExpression(start);
        const endVal = this.evaluateExpression(end);
        const stepVal = step ? this.evaluateExpression(step) : 1;

        this.variables[varName] = startVal;

        const shouldEnter = (stepVal > 0) ? (startVal <= endVal) : (startVal >= endVal);

        if (!shouldEnter) {
            const lines = Object.keys(this.program).map(Number).sort((a, b) => a - b);
            let depth = 1;
            const currentIndex = lines.indexOf(this.currentLine);

            for (let i = currentIndex + 1; i < lines.length; i++) {
                const content = this.program[lines[i]].trim().toUpperCase();
                if (content.startsWith('FOR ')) {
                    depth++;
                }
                if (content.startsWith('NEXT')) {
                    const nextMatch = content.match(/^NEXT\s*(.*)$/);
                    const nextVar = nextMatch && nextMatch[1] ? nextMatch[1].trim() : '';

                    if (!nextVar || nextVar === varName) {
                        depth--;
                        if (depth === 0) {
                            this.skippedForLoops.add(varName);
                            this.currentLine = lines[i];
                            return;
                        }
                    }
                }
            }
            throw new Error('FOR without NEXT');
        }

        this.forLoops.push({
            variable: varName,
            end: endVal,
            step: stepVal,
            line: this.currentLine
        });
    }

    async executeNext(variable) {
        const varName = variable ? variable.toUpperCase() : null;

        if (this.forLoops.length === 0) {
            throw new Error('NEXT without FOR');
        }

        // If a variable is specified, we may need to pop inner loops to find it
        if (varName) {
            // Look for the matching FOR loop
            let found = false;
            while (this.forLoops.length > 0) {
                const loop = this.forLoops[this.forLoops.length - 1];
                if (loop.variable === varName) {
                    found = true;
                    break;
                }
                // Pop inner loops that were exited via GOTO
                this.forLoops.pop();
            }

            if (!found) {
                throw new Error(`NEXT without matching FOR for variable ${varName}`);
            }
        }

        const loop = this.forLoops[this.forLoops.length - 1];

        // Check if this is a delay loop (common in BASIC animations)
        // Delay loops have no body between FOR and NEXT
        const isDelayLoop = loop.line && this.currentLine &&
                           (this.currentLine - loop.line <= 2);

        this.variables[loop.variable] += loop.step;

        const continueLoop = (loop.step > 0) ?
            (this.variables[loop.variable] <= loop.end) :
            (this.variables[loop.variable] >= loop.end);

        if (continueLoop) {
            // Add delay for delay loops to slow down animation
            if (isDelayLoop) {
                // Scale delay based on loop size
                if (loop.end >= 500) {
                    await new Promise(resolve => setTimeout(resolve, 3));
                } else if (loop.end >= 100) {
                    await new Promise(resolve => setTimeout(resolve, 2));
                } else if (loop.end >= 50) {
                    await new Promise(resolve => setTimeout(resolve, 1));
                }
            }
            this.currentLine = loop.line;
        } else {
            this.forLoops.pop();
        }
    }

    async executeIf(condition) {
        const thenIndex = condition.toUpperCase().indexOf('THEN');
        if (thenIndex === -1) {
            throw new Error('IF without THEN');
        }

        const condExpr = condition.substring(0, thenIndex).trim();
        let thenPart = condition.substring(thenIndex + 4).trim();

        // Check for ELSE
        const elseIndex = thenPart.toUpperCase().indexOf(' ELSE ');
        let elsePart = null;
        if (elseIndex !== -1) {
            elsePart = thenPart.substring(elseIndex + 6).trim();
            thenPart = thenPart.substring(0, elseIndex).trim();
        }

        const condResult = this.evaluateCondition(condExpr);
        const partToExecute = condResult ? thenPart : elsePart;

        if (partToExecute) {
            const lineNum = parseInt(partToExecute);
            if (!isNaN(lineNum) && partToExecute.match(/^\d+$/)) {
                // It's a pure line number (GOTO)
                if (this.program[lineNum]) {
                    this.currentLine = lineNum;
                } else {
                    throw new Error(`Line ${lineNum} not found`);
                }
            } else {
                // It's a statement or multiple statements
                // Since executeLine already handles splitting by colons, just call it
                await this.executeLine(partToExecute);
            }
        }
    }

    evaluateCondition(expr) {
        const operators = ['<=', '>=', '<>', '=', '<', '>'];
        for (const op of operators) {
            const index = expr.indexOf(op);
            if (index !== -1) {
                const left = this.evaluateExpression(expr.substring(0, index).trim());
                const right = this.evaluateExpression(expr.substring(index + op.length).trim());

                switch (op) {
                    case '=': return left == right;
                    case '<>': return left != right;
                    case '<': return left < right;
                    case '>': return left > right;
                    case '<=': return left <= right;
                    case '>=': return left >= right;
                }
            }
        }

        return this.evaluateExpression(expr) !== 0;
    }

    async executePrint(args) {
        if (!args) {
            this.onOutput('', 'output');
            return;
        }

        let output = '';
        let parts = [];
        let current = '';
        let inQuotes = false;
        let parenDepth = 0;
        let endsWithSemicolon = false;

        for (let i = 0; i < args.length; i++) {
            const char = args[i];

            if (char === '"' && !inQuotes) {
                inQuotes = true;
                current += char;
            } else if (char === '"' && inQuotes) {
                inQuotes = false;
                current += char;
            } else if (!inQuotes) {
                if (char === '(') parenDepth++;
                if (char === ')') parenDepth--;

                if (parenDepth === 0 && (char === ';' || char === ',')) {
                    if (current.trim()) {
                        parts.push({ value: current.trim(), separator: char });
                    }
                    current = '';
                    if (char === ';' && i === args.length - 1) {
                        endsWithSemicolon = true;
                    }
                } else {
                    current += char;
                }
            } else {
                current += char;
            }
        }

        // Check if the statement ends with a semicolon
        if (args.trim().endsWith(';')) {
            endsWithSemicolon = true;
        }

        if (current.trim()) {
            parts.push({ value: current.trim(), separator: '' });
        }

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            let value = '';

            if (part.value.startsWith('"') && part.value.endsWith('"')) {
                value = part.value.substring(1, part.value.length - 1);
            } else {
                value = String(this.evaluateExpression(part.value));
            }

            output += value;

            if (part.separator === ',') {
                output += '\t';
            }
        }

        // Only add newline if not ending with semicolon
        if (endsWithSemicolon) {
            this.onOutput(output, 'print-no-newline');
        } else {
            this.onOutput(output, 'output');
        }
    }

    async executeInput(args) {
        const parts = args.split(';');
        let prompt = '? ';
        let variables = args;

        if (parts.length > 1 && parts[0].startsWith('"')) {
            const promptEnd = parts[0].lastIndexOf('"');
            prompt = parts[0].substring(1, promptEnd);
            variables = parts.slice(1).join(';');
        }

        const varList = variables.split(',').map(v => v.trim());

        if (this.onInput) {
            const input = await this.onInput(prompt);
            const values = input.split(',').map(v => v.trim());

            for (let i = 0; i < varList.length; i++) {
                const varName = varList[i].toUpperCase();
                const value = values[i] || '';

                if (varName.endsWith('$')) {
                    this.stringVars[varName] = value;
                } else {
                    this.variables[varName] = parseFloat(value) || 0;
                }
            }
        }
    }

    executeRead(vars) {
        const varList = vars.split(',').map(v => v.trim());

        for (const varName of varList) {
            if (!this.dataPointer.line) {
                throw new Error('Out of DATA');
            }

            const data = this.dataStatements[this.dataPointer.line];
            const value = data[this.dataPointer.index];

            if (varName.endsWith('$')) {
                this.stringVars[varName.toUpperCase()] = value.replace(/^"(.*)"$/, '$1');
            } else {
                this.variables[varName.toUpperCase()] = parseFloat(value) || 0;
            }

            this.dataPointer.index++;

            if (this.dataPointer.index >= data.length) {
                const dataLines = Object.keys(this.dataStatements).map(Number).sort((a, b) => a - b);
                const currentIndex = dataLines.indexOf(this.dataPointer.line);

                if (currentIndex < dataLines.length - 1) {
                    this.dataPointer.line = dataLines[currentIndex + 1];
                    this.dataPointer.index = 0;
                } else {
                    this.dataPointer.line = null;
                }
            }
        }
    }

    executeRestore(lineNum) {
        const dataLines = Object.keys(this.dataStatements).map(Number).sort((a, b) => a - b);

        if (lineNum) {
            const target = parseInt(this.evaluateExpression(lineNum));
            if (this.dataStatements[target]) {
                this.dataPointer.line = target;
                this.dataPointer.index = 0;
            } else {
                throw new Error(`No DATA at line ${target}`);
            }
        } else if (dataLines.length > 0) {
            this.dataPointer.line = dataLines[0];
            this.dataPointer.index = 0;
        }
    }

    executeDim(declaration) {
        // Need to parse array declarations more carefully - handle nested parens
        const arrays = [];
        let current = '';
        let parenDepth = 0;

        for (let i = 0; i < declaration.length; i++) {
            const char = declaration[i];
            if (char === '(') parenDepth++;
            if (char === ')') parenDepth--;

            if (char === ',' && parenDepth === 0) {
                if (current.trim()) arrays.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        if (current.trim()) arrays.push(current.trim());

        for (const arrayDecl of arrays) {
            const match = arrayDecl.match(/^([A-Z][A-Z0-9]*\$?)\((.+)\)$/i);
            if (match) {
                const varName = match[1].toUpperCase();
                const dimensions = match[2].split(',').map(d => parseInt(this.evaluateExpression(d.trim())));

                const isString = varName.endsWith('$');
                this.arrays[varName] = {
                    dimensions: dimensions,
                    data: this.createArray(dimensions, isString)
                };
            }
        }
    }

    createArray(dimensions, isString = false) {
        if (dimensions.length === 1) {
            return new Array(dimensions[0] + 1).fill(isString ? '' : 0);
        } else {
            const arr = new Array(dimensions[0] + 1);
            for (let i = 0; i <= dimensions[0]; i++) {
                arr[i] = this.createArray(dimensions.slice(1), isString);
            }
            return arr;
        }
    }

    executeLet(assignment) {
        const arrayMatch = assignment.match(/^([A-Z][A-Z0-9]*\$?)\((.+?)\)\s*=\s*(.+)$/i);
        if (arrayMatch) {
            const varName = arrayMatch[1].toUpperCase();
            const indices = arrayMatch[2].split(',').map(i => parseInt(this.evaluateExpression(i.trim())));
            const value = arrayMatch[3];

            if (!this.arrays[varName]) {
                this.arrays[varName] = {
                    dimensions: indices.map(i => i),
                    data: this.createArray(indices.map(i => i))
                };
            }

            let arr = this.arrays[varName].data;
            for (let i = 0; i < indices.length - 1; i++) {
                arr = arr[indices[i]];
            }

            if (varName.endsWith('$')) {
                arr[indices[indices.length - 1]] = this.evaluateStringExpression(value);
            } else {
                arr[indices[indices.length - 1]] = this.evaluateExpression(value);
            }
            return;
        }

        const match = assignment.match(/^([A-Z][A-Z0-9]*\$?)\s*=\s*(.+)$/i);
        if (match) {
            const varName = match[1].toUpperCase();
            const value = match[2];

            if (varName.endsWith('$')) {
                this.stringVars[varName] = this.evaluateStringExpression(value);
            } else {
                this.variables[varName] = this.evaluateExpression(value);
            }
        } else {
            throw new Error('Syntax error in assignment');
        }
    }

    isAssignment(command) {
        return /^[A-Z][A-Z0-9]*\$?\s*=/i.test(command) || /^[A-Z][A-Z0-9]*\$?\(/i.test(command);
    }

    evaluateStringExpression(expr) {
        expr = expr.trim();

        if (expr.startsWith('"') && expr.endsWith('"')) {
            return expr.substring(1, expr.length - 1);
        }

        if (expr.match(/^[A-Z]\$$/i)) {
            return this.stringVars[expr.toUpperCase()] || '';
        }

        const funcMatch = expr.match(/^([A-Z]+\$?)\((.*)\)$/i);
        if (funcMatch) {
            const funcName = funcMatch[1].toUpperCase();
            const args = this.parseArguments(funcMatch[2]);

            if (this.builtinFunctions[funcName]) {
                return this.builtinFunctions[funcName](...args);
            }
        }

        const plusIndex = expr.indexOf('+');
        if (plusIndex !== -1) {
            const left = this.evaluateStringExpression(expr.substring(0, plusIndex).trim());
            const right = this.evaluateStringExpression(expr.substring(plusIndex + 1).trim());
            return left + right;
        }

        return String(this.evaluateExpression(expr));
    }

    evaluateExpression(expr) {
        expr = String(expr).trim();

        if (expr === '') return 0;

        const num = parseFloat(expr);
        if (!isNaN(num) && expr.match(/^-?\d+(\.\d+)?$/)) return num;

        if (expr.match(/^[A-Z][A-Z0-9]*$/i)) {
            return this.variables[expr.toUpperCase()] || 0;
        }

        if (expr.match(/^[A-Z][A-Z0-9]*\$$/i)) {
            return this.stringVars[expr.toUpperCase()] || '';
        }

        // Check for comparison operators (for expressions like RND(1) > 0.5)
        // Need to handle these within parentheses correctly
        if (expr.includes('(') && expr.includes(')')) {
            // Check if this is a comparison within parentheses
            const parenMatch = expr.match(/\(([^)]+)\)/);
            if (parenMatch) {
                const innerExpr = parenMatch[1];
                // Check if inner expression has comparison operators
                const compOps = ['<=', '>=', '<>', '=', '<', '>'];
                for (const op of compOps) {
                    if (innerExpr.includes(op)) {
                        const idx = innerExpr.indexOf(op);
                        const left = this.evaluateExpression(innerExpr.substring(0, idx).trim());
                        const right = this.evaluateExpression(innerExpr.substring(idx + op.length).trim());
                        let result = false;
                        switch (op) {
                            case '=': result = left == right; break;
                            case '<>': result = left != right; break;
                            case '<': result = left < right; break;
                            case '>': result = left > right; break;
                            case '<=': result = left <= right; break;
                            case '>=': result = left >= right; break;
                        }
                        // Replace the comparison with its result (0 or 1)
                        const newExpr = expr.replace(parenMatch[0], result ? '1' : '0');
                        return this.evaluateExpression(newExpr);
                    }
                }
            }
        }

        // Check for function calls (including string functions)
        const funcMatch = expr.match(/^([A-Z]+\$?)\((.+)\)$/i);
        if (funcMatch) {
            const funcName = funcMatch[1].toUpperCase();
            const argsStr = funcMatch[2];

            // Check if it's a built-in function
            if (this.builtinFunctions[funcName]) {
                const args = this.parseArguments(argsStr);
                return this.builtinFunctions[funcName](...args);
            }

            // Check if it's an array
            if (this.arrays[funcName]) {
                const indices = argsStr.split(',').map(i => parseInt(this.evaluateExpression(i.trim())));
                let value = this.arrays[funcName].data;
                for (const index of indices) {
                    value = value[index];
                }
                return value || 0;
            }
        }


        const ops = [
            { ops: ['+', '-'], fn: { '+': (a, b) => a + b, '-': (a, b) => a - b } },
            { ops: ['*', '/'], fn: { '*': (a, b) => a * b, '/': (a, b) => a / b } },
            { ops: ['^'], fn: { '^': (a, b) => Math.pow(a, b) } }
        ];

        for (const { ops: operators, fn } of ops) {
            let parenDepth = 0;
            for (let i = expr.length - 1; i >= 0; i--) {
                if (expr[i] === ')') parenDepth++;
                if (expr[i] === '(') parenDepth--;

                if (parenDepth === 0 && operators.includes(expr[i])) {
                    if (expr[i] === '-' && (i === 0 || ['+', '-', '*', '/', '^', '('].includes(expr[i-1]))) {
                        continue;
                    }
                    const left = this.evaluateExpression(expr.substring(0, i).trim());
                    const right = this.evaluateExpression(expr.substring(i + 1).trim());
                    return fn[expr[i]](left, right);
                }
            }
        }

        if (expr.startsWith('(') && expr.endsWith(')')) {
            return this.evaluateExpression(expr.substring(1, expr.length - 1));
        }

        if (expr.startsWith('-')) {
            return -this.evaluateExpression(expr.substring(1));
        }

        if (expr.toUpperCase().startsWith('NOT ')) {
            return this.evaluateExpression(expr.substring(4)) === 0 ? -1 : 0;
        }

        return 0;
    }

    parseArguments(argsStr) {
        const args = [];
        let current = '';
        let parenDepth = 0;
        let inQuotes = false;

        for (let i = 0; i < argsStr.length; i++) {
            const char = argsStr[i];

            if (char === '"') {
                inQuotes = !inQuotes;
                current += char;
            } else if (!inQuotes) {
                if (char === '(') parenDepth++;
                if (char === ')') parenDepth--;

                if (char === ',' && parenDepth === 0) {
                    args.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            } else {
                current += char;
            }
        }

        if (current) {
            args.push(current.trim());
        }

        return args;
    }

    tokenize(input) {
        const tokens = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < input.length; i++) {
            const char = input[i];
            if (char === '"') {
                inQuotes = !inQuotes;
                current += char;
            } else if (char === ' ' && !inQuotes && current) {
                tokens.push(current);
                current = '';
            } else if (char !== ' ' || inQuotes) {
                current += char;
            }
        }

        if (current) {
            tokens.push(current);
        }

        return tokens;
    }
}

// Support both ES6 and CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BasicInterpreter;
}

export default BasicInterpreter;
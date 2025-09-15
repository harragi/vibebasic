import React, { useState, useEffect, useRef, useCallback } from 'react';
import BasicInterpreter from '../utils/BasicInterpreter';
import { getFileList, getProgram } from '../programs/samplePrograms';

const Terminal = () => {
  const [lines, setLines] = useState([
    { text: 'GW-BASIC Web Edition 1.0', type: 'system' },
    { text: 'Inspired by Microsoft 6502 BASIC V1.1 (1978)', type: 'system' },
    { text: '(C) 1978 Microsoft, Web Edition 2025', type: 'system' },
    { text: '32768 Bytes free', type: 'system' },
    { text: '', type: 'output' },
    { text: 'Type FILES to see available programs', type: 'system' },
    { text: 'Type LOAD "filename" to load a program', type: 'system' },
    { text: '', type: 'output' },
    { text: 'Ok', type: 'prompt' }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [inputCallback, setInputCallback] = useState(null);
  const [screenBuffer, setScreenBuffer] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 1, y: 1 });

  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const interpreterRef = useRef(new BasicInterpreter());
  const screenBufferRef = useRef(null);
  const cursorPosRef = useRef({ x: 1, y: 1 });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const addLine = useCallback((text, type = 'output') => {
    setLines(prev => [...prev, { text, type }]);
  }, []);

  const [outputBuffer, setOutputBuffer] = useState('');

  // Update refs when state changes
  useEffect(() => {
    screenBufferRef.current = screenBuffer;
  }, [screenBuffer]);

  useEffect(() => {
    cursorPosRef.current = cursorPos;
  }, [cursorPos]);

  const handleOutput = useCallback((text, type = 'output') => {
    const currentScreenBuffer = screenBufferRef.current;
    const currentCursorPos = cursorPosRef.current;

    console.log('handleOutput called:', {
      text: text.substring(0, 50),
      type,
      hasScreenBuffer: !!currentScreenBuffer,
      cursorPos: currentCursorPos,
      screenBufferDimensions: currentScreenBuffer ? `${currentScreenBuffer.length}x${currentScreenBuffer[0]?.length}` : 'null'
    });

    if (type === 'clear') {
      console.log('CLS: Clearing screen, no buffer yet');
      setLines([]);
      // Don't create screen buffer on CLS alone - wait for LOCATE
      setScreenBuffer(null);
      screenBufferRef.current = null;
      setCursorPos({ x: 1, y: 1 });
      cursorPosRef.current = { x: 1, y: 1 };
      setOutputBuffer('');
      console.log('Screen cleared');
    } else if (type === 'locate') {
      // Parse ANSI escape sequence for cursor position
      // eslint-disable-next-line no-control-regex
      const match = text.match(/\x1B\[(\d+);(\d+)H/);
      if (match) {
        const y = parseInt(match[1]);
        const x = parseInt(match[2]);
        console.log(`LOCATE: Moving cursor to (${x}, ${y})`);
        setCursorPos({ x, y });
        cursorPosRef.current = { x, y };

        // Initialize screen buffer if needed (for LOCATE-based programs)
        if (!screenBufferRef.current) {
          console.log('LOCATE: Creating screen buffer for positioned output');
          const newBuffer = Array(25).fill(null).map(() => Array(80).fill(' '));
          setScreenBuffer(newBuffer);
          screenBufferRef.current = newBuffer;
        }
      } else {
        console.log('LOCATE: Failed to parse ANSI sequence:', text);
      }
    } else if (type === 'print-no-newline') {
      // Accumulate text without adding newline
      setOutputBuffer(prev => {
        const newBuffer = prev + text;
        // If buffer gets too long, flush it to display
        if (newBuffer.length >= 80) {
          addLine(newBuffer, 'output');
          return '';
        }
        return newBuffer;
      });
    } else if (currentScreenBuffer && currentCursorPos.y > 0 && currentCursorPos.y <= 25) {
      // We're in screen buffer mode (after a CLS and LOCATE)
      console.log(`PRINT to screen buffer: "${text}" at cursor (${currentCursorPos.x}, ${currentCursorPos.y})`);

      // Deep clone the buffer to ensure React detects the change
      const buffer = currentScreenBuffer.map(row => [...row]);
      const y = currentCursorPos.y - 1; // Convert to 0-based
      const x = currentCursorPos.x - 1;

      // Write text to buffer at current position
      for (let i = 0; i < text.length && x + i < 80; i++) {
        if (buffer[y] && x + i >= 0) {
          buffer[y][x + i] = text[i];
          console.log(`  Wrote '${text[i]}' at buffer[${y}][${x + i}]`);
        }
      }

      setScreenBuffer(buffer);
      console.log('Screen buffer updated, non-empty cells:',
        buffer.reduce((count, row) => count + row.filter(c => c !== ' ').length, 0));

      // Update cursor position based on type
      if (type === 'output') {
        // Regular PRINT - move to next line
        setCursorPos({ x: 1, y: Math.min(currentCursorPos.y + 1, 25) });
      } else {
        // print-no-newline or other - stay on same line
        setCursorPos(prev => ({ ...prev, x: Math.min(prev.x + text.length, 80) }));
      }
    } else {
      // Regular output - check if we have accumulated text
      if (outputBuffer) {
        addLine(outputBuffer + text, type);
        setOutputBuffer('');
      } else {
        addLine(text, type);
      }
    }
  }, [addLine, outputBuffer]);

  const handleInput = useCallback((prompt) => {
    return new Promise((resolve) => {
      setInputPrompt(prompt);
      setWaitingForInput(true);
      setInputCallback(() => (value) => {
        setWaitingForInput(false);
        setInputPrompt('');
        resolve(value);
      });
    });
  }, []);

  const processCommand = async (input) => {
    const interpreter = interpreterRef.current;

    // Check for line number
    const lineMatch = input.match(/^(\d+)\s*(.*)/);
    if (lineMatch) {
      const lineNum = parseInt(lineMatch[1]);
      const content = lineMatch[2];
      interpreter.addLine(lineNum, content);
      addLine('Ok', 'prompt');
      return;
    }

    // Process immediate commands
    const parts = input.trim().split(/\s+/);
    const command = parts[0].toUpperCase();

    switch (command) {
      case 'RUN':
        setScreenBuffer(null);
        screenBufferRef.current = null;
        setCursorPos({ x: 1, y: 1 });
        cursorPosRef.current = { x: 1, y: 1 };
        setOutputBuffer('');
        addLine('Running... (Press Ctrl+C to stop)', 'system');
        try {
          await interpreter.run(handleOutput, handleInput);
          // Flush any remaining output buffer
          if (outputBuffer) {
            addLine(outputBuffer, 'output');
            setOutputBuffer('');
          }
          // Clear screen buffer after program ends
          if (screenBufferRef.current) {
            setScreenBuffer(null);
            screenBufferRef.current = null;
            setCursorPos({ x: 1, y: 1 });
            cursorPosRef.current = { x: 1, y: 1 };
          }
          addLine('', 'output');
          addLine('Ok', 'prompt');
        } catch (e) {
          // Flush any remaining output buffer
          if (outputBuffer) {
            addLine(outputBuffer, 'output');
            setOutputBuffer('');
          }
          if (screenBufferRef.current) {
            setScreenBuffer(null);
            screenBufferRef.current = null;
            setCursorPos({ x: 1, y: 1 });
            cursorPosRef.current = { x: 1, y: 1 };
          }
          addLine(e.message, 'error');
          addLine('Ok', 'prompt');
        }
        break;

      case 'LIST':
        const listing = interpreter.listProgram();
        if (listing.length === 0) {
          addLine('No program in memory', 'output');
        } else {
          listing.forEach(line => addLine(line, 'output'));
        }
        addLine('Ok', 'prompt');
        break;

      case 'NEW':
      case 'CLEAR':
        interpreter.reset();
        setLines([
          { text: 'Ok', type: 'system' },
          { text: '', type: 'output' }
        ]);
        addLine('Ok', 'prompt');
        break;

      case 'CLS':
        setLines([]);
        addLine('Ok', 'prompt');
        break;

      case 'FILES':
        addLine('', 'output');
        addLine('Directory of A:\\PROGRAMS', 'system');
        addLine('', 'output');
        const files = getFileList();
        files.forEach(file => {
          const paddedName = file.name.padEnd(15);
          const paddedSize = String(file.size).padStart(6);
          addLine(`${paddedName} ${paddedSize} bytes  ${file.description}`, 'output');
        });
        addLine('', 'output');
        addLine(`${files.length} File(s)`, 'system');
        addLine('Ok', 'prompt');
        break;

      case 'LOAD':
        const filename = parts.slice(1).join(' ').replace(/['"]/g, '');
        if (!filename) {
          addLine('Syntax error', 'error');
          addLine('Ok', 'prompt');
          break;
        }
        const program = getProgram(filename);
        if (!program) {
          addLine(`File not found - ${filename}`, 'error');
          addLine('Ok', 'prompt');
          break;
        }
        // Clear current program and load new one
        interpreter.reset();
        const programLines = program.code.split('\n');
        programLines.forEach(line => {
          const lineMatch = line.match(/^(\d+)\s*(.*)/);
          if (lineMatch) {
            const lineNum = parseInt(lineMatch[1]);
            const content = lineMatch[2];
            interpreter.addLine(lineNum, content);
          }
        });
        addLine(`Loaded: ${program.name}`, 'system');
        addLine('Ok', 'prompt');
        break;

      case 'SYSTEM':
        window.location.reload();
        break;

      case '':
        addLine('Ok', 'prompt');
        break;

      default:
        // Try to execute as immediate mode
        try {
          const tempInterpreter = new BasicInterpreter();
          tempInterpreter.onOutput = handleOutput;
          tempInterpreter.onInput = handleInput;

          // Copy current variables to temp interpreter
          tempInterpreter.variables = { ...interpreter.variables };
          tempInterpreter.stringVars = { ...interpreter.stringVars };
          tempInterpreter.arrays = { ...interpreter.arrays };

          await tempInterpreter.executeCommand(input);

          // Copy variables back
          interpreter.variables = tempInterpreter.variables;
          interpreter.stringVars = tempInterpreter.stringVars;
          interpreter.arrays = tempInterpreter.arrays;

          addLine('Ok', 'prompt');
        } catch (e) {
          addLine(`Syntax error`, 'error');
          addLine('Ok', 'prompt');
        }
    }
  };

  const handleKeyDown = (e) => {
    // Handle Ctrl+C to stop running programs
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      const interpreter = interpreterRef.current;
      if (interpreter.running) {
        interpreter.stop();
        // Flush any accumulated output
        if (outputBuffer) {
          addLine(outputBuffer, 'output');
          setOutputBuffer('');
        }
        addLine('^C', 'system');
        addLine('Break', 'error');
        addLine('Ok', 'prompt');
        setScreenBuffer(null);
        screenBufferRef.current = null;
        setCursorPos({ x: 1, y: 1 });
        cursorPosRef.current = { x: 1, y: 1 };
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const input = currentInput;
      setCurrentInput('');

      if (waitingForInput && inputCallback) {
        addLine(inputPrompt + input, 'output');
        inputCallback(input);
        setInputCallback(null);
      } else {
        addLine(input, 'output');
        processCommand(input);
      }
    }
  };

  const handleInputChange = (e) => {
    setCurrentInput(e.target.value);
  };

  return (
    <div className="terminal" ref={terminalRef}>
      <div className="terminal-content">
        {screenBuffer ? (
          // Render screen buffer (for programs using LOCATE)
          <div className="screen-buffer">
            {(() => {
              const nonEmptyRows = screenBuffer.filter(row => row.some(c => c !== ' ')).length;
              console.log(`Rendering screen buffer: ${nonEmptyRows} non-empty rows out of ${screenBuffer.length}`);
              return null;
            })()}
            {screenBuffer.map((row, y) => {
              const rowContent = row.join('');
              if (row.some(c => c !== ' ')) {
                console.log(`  Row ${y}: "${rowContent.trim()}"`);
              }
              return (
                <div key={y} className="terminal-line terminal-output">
                  {rowContent}
                </div>
              );
            })}
          </div>
        ) : (
          // Render normal scrolling output
          lines.map((line, index) => (
            <div key={index} className={`terminal-line terminal-${line.type}`}>
              {line.text}
            </div>
          ))
        )}
        {!screenBuffer && (
          <div className="terminal-line">
            {waitingForInput && inputPrompt}
            {currentInput}
            <span className="terminal-cursor"></span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="text"
        className="hidden-input"
        value={currentInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={(e) => e.target.focus()}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
    </div>
  );
};

export default Terminal;
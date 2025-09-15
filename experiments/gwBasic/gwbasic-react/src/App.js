import React, { useState, useEffect } from 'react';
import './App.css';
import CRTMonitor from './components/CRTMonitor';
import Terminal from './components/Terminal';
import MonitorSelector from './components/MonitorSelector';

function App() {
  const [powerOn, setPowerOn] = useState(false);
  const [monitorStyle, setMonitorStyle] = useState('ibmGreen');

  useEffect(() => {
    // Simulate power on after a short delay
    setTimeout(() => setPowerOn(true), 500);
  }, []);

  const handleStyleChange = (newStyle) => {
    setPowerOn(false);
    setMonitorStyle(newStyle);

    // Simulate monitor restart with new style
    setTimeout(() => setPowerOn(true), 300);
  };

  return (
    <div className="App">
      <MonitorSelector
        currentStyle={monitorStyle}
        onStyleChange={handleStyleChange}
      />
      <CRTMonitor styleKey={monitorStyle} powerOn={powerOn}>
        <Terminal />
      </CRTMonitor>
    </div>
  );
}

export default App;

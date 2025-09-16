import React, { useState } from 'react';
import { monitorStyles } from '../config/monitorStyles';
import './MonitorSelector.css';

const MonitorSelector = ({ currentStyle, onStyleChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleStyleSelect = (styleKey) => {
    onStyleChange(styleKey);
    setIsOpen(false);
  };

  return (
    <div className="monitor-selector">
      <button
        className="selector-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Change Monitor Style"
      >
        <span className="selector-icon">📺</span>
        <span className="selector-text">{monitorStyles[currentStyle].name}</span>
      </button>

      {isOpen && (
        <div className="selector-dropdown">
          <div className="selector-header">
            <h3>Choose Your Retro Monitor</h3>
            <button className="selector-close" onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="selector-grid">
            {Object.entries(monitorStyles).map(([key, monitor]) => (
              <div
                key={key}
                className={`monitor-option ${currentStyle === key ? 'selected' : ''}`}
                onClick={() => handleStyleSelect(key)}
              >
                <div className="monitor-preview" style={{
                  background: monitor.style.background,
                  borderRadius: '8px'
                }}>
                  <div className="preview-screen" style={{
                    background: monitor.style.screenColor,
                    borderRadius: monitor.style.hasRoundScreen ? '50%' : '4px'
                  }}>
                    <span style={{ color: monitor.style.phosphorColor }}>■</span>
                  </div>
                </div>
                <div className="monitor-info">
                  <div className="monitor-brand">{monitor.brand}</div>
                  <div className="monitor-model">{monitor.model}</div>
                  <div className="monitor-year">{monitor.year}</div>
                  {monitor.style.description && (
                    <div className="monitor-description">{monitor.style.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitorSelector;
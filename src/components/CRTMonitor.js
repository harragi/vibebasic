import React from 'react';
import { monitorStyles } from '../config/monitorStyles';

const CRTMonitor = ({ children, styleKey = 'commodore', powerOn = true }) => {
  const style = monitorStyles[styleKey];
  const isCGA = style.style.cgaMode;

  return (
    <div
      className={`crt-monitor ${styleKey} ${isCGA ? 'cga-mode' : ''}`}
      style={{
        background: style.style.background,
        borderRadius: style.style.borderRadius
      }}
    >
      <div className="monitor-brand">{style.brand}</div>

      {style.style.hasSpeaker && (
        <div className={`monitor-speaker ${style.style.speakerPosition}`}></div>
      )}

      <div className={`power-button ${powerOn ? 'on' : 'off'}`}></div>

      {style.model && (
        <div className="monitor-model">{style.model}</div>
      )}

      {style.style.hasChannelDials && (
        <div className="channel-dials">
          <div className="dial vhf">VHF</div>
          <div className="dial uhf">UHF</div>
        </div>
      )}

      {style.style.hasVentSlots && (
        <div className="vent-slots"></div>
      )}

      <div className="crt-container">
        <div
          className={`crt-screen ${powerOn ? 'starting' : ''}`}
          style={{
            background: `radial-gradient(ellipse at center, ${style.style.screenColor} 0%, #000000 100%)`,
            borderRadius: '8px'
          }}
        >
          {powerOn && (
            <>
              <div
                className="scanlines"
                style={{
                  background: `repeating-linear-gradient(
                    0deg,
                    transparent 0px,
                    transparent 2px,
                    ${isCGA ? 'rgba(255,255,255,0.02)' : style.style.phosphorColor + '22'} 2px,
                    ${isCGA ? 'rgba(255,255,255,0.02)' : style.style.phosphorColor + '22'} 4px
                  )`
                }}
              ></div>
              <div
                className="flicker"
                style={{
                  background: isCGA ? 'rgba(255,255,255,0.01)' : `${style.style.phosphorColor}1a`
                }}
              ></div>
              <div className="terminal-wrapper" style={{
                '--phosphor-color': style.style.phosphorColor,
                '--screen-color': style.style.screenColor,
                '--cga-cyan': style.style.cgaPalette?.cyan || '#00ffff',
                '--cga-magenta': style.style.cgaPalette?.magenta || '#ff00ff',
                '--cga-white': style.style.cgaPalette?.white || '#ffffff',
                '--cga-black': style.style.cgaPalette?.black || '#000000'
              }}>
                {children}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CRTMonitor;
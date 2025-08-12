// ModeToggle.js - Toggle between Auto and Manual referee positioning modes
import React from 'react';
import './ModeToggle.css';

export default function ModeToggle({ isManualMode, onToggle }) {
  return (
    <div className="mode-toggle-container">
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        onClick={() => {
          console.log('🎯 MODE TOGGLE CLICKED:', !isManualMode);
          onToggle(!isManualMode);
        }}
      >
        <span className="mode-label">Auto Mode</span>
        <label className="mode-switch">
          <input
            type="checkbox"
            checked={isManualMode}
            onChange={(e) => {
              console.log('🎯 INPUT CHANGE:', e.target.checked);
              onToggle(e.target.checked);
            }}
            onClick={(e) => e.stopPropagation()} // Prevent double firing
          />
          <span className="mode-slider"></span>
        </label>
        <span className="mode-label">Manual Training</span>
      </div>
      
      {isManualMode && (
        <div className="manual-mode-hint">
          <span className="hint-text">🎯 Drag referees freely for training</span>
        </div>
      )}
    </div>
  );
}
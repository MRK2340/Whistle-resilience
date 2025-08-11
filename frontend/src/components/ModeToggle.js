// ModeToggle.js - Toggle between Auto and Manual referee positioning modes
import React from 'react';
import './ModeToggle.css';

export default function ModeToggle({ isManualMode, onToggle }) {
  return (
    <div className="mode-toggle-container">
      <span className="mode-label">Auto Mode</span>
      <label className="mode-switch">
        <input
          type="checkbox"
          checked={isManualMode}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <span className="mode-slider"></span>
      </label>
      <span className="mode-label">Manual Training</span>
      
      {isManualMode && (
        <div className="manual-mode-hint">
          <span className="hint-text">🎯 Drag referees freely for training</span>
        </div>
      )}
    </div>
  );
}
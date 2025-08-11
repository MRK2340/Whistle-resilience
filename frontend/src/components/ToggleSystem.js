// ToggleSystem.js - Web version
import React from 'react';
import './ToggleSystem.css';

export default function ToggleSystem({ isThreePerson, onToggle }) {
  return (
    <div className="toggle-container">
      <span className="toggle-label">2-Person</span>
      <label className="switch">
        <input
          type="checkbox"
          checked={isThreePerson}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <span className="slider"></span>
      </label>
      <span className="toggle-label">3-Person</span>
    </div>
  );
}
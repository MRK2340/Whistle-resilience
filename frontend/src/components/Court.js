// Court.js - Web version
import React from 'react';
import './Court.css';
import { COURT_WIDTH, COURT_HEIGHT, ftToPx } from '../utils/courtUtils';

export default function Court({ children }) {
  return (
    <div className="court-container">
      <div 
        className="court" 
        style={{ 
          width: COURT_WIDTH, 
          height: COURT_HEIGHT,
          position: 'relative'
        }}
      >
        {/* Half Court Line */}
        <div 
          className="half-court-line"
          style={{
            left: COURT_WIDTH / 2 - 1,
            top: 0,
            width: 2,
            height: '100%'
          }}
        />
        {/* Key */}
        <div 
          className="key-top"
          style={{
            left: COURT_WIDTH - ftToPx(19),
            top: ftToPx(14),
            width: ftToPx(12),
            height: 2
          }}
        />
        {/* 3PT Line */}
        <div 
          className="three-point-line"
          style={{
            left: COURT_WIDTH - ftToPx(23),
            top: ftToPx(14),
            width: ftToPx(4),
            height: ftToPx(14),
            borderRadius: ftToPx(20)
          }}
        />
        {children}
      </div>
    </div>
  );
}
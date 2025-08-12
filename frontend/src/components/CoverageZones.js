// CoverageZones.js - Visual display of referee coverage areas
import React from 'react';
import './CoverageZones.css';
import { COURT_WIDTH, COURT_HEIGHT, ftToPx } from '../utils/courtUtils';

export default function CoverageZones({ showCoverage, ballPosition, leadPosition, trailPosition, centerPosition, isThreePerson }) {
  if (!showCoverage) return null;

  // Calculate dynamic coverage zones based on ball position
  const ballSide = ballPosition.x > COURT_WIDTH / 2 ? 'right' : 'left';
  
  return (
    <div className="coverage-zones">
      {/* Lead Coverage Zone */}
      <div 
        className="coverage-zone lead-coverage"
        style={{
          position: 'absolute',
          left: COURT_WIDTH - ftToPx(25),
          top: 0,
          width: ftToPx(25),
          height: COURT_HEIGHT,
          opacity: 0.15
        }}
      />
      
      {/* Lead Primary Zone (Paint Area) */}
      <div 
        className="coverage-zone lead-primary"
        style={{
          position: 'absolute',
          left: COURT_WIDTH - ftToPx(19),
          top: ftToPx(14),
          width: ftToPx(12),
          height: ftToPx(15),
          opacity: 0.25
        }}
      />
      
      {/* Center Coverage Zone (Help-side) */}
      {isThreePerson && (
        <div 
          className="coverage-zone center-coverage"
          style={{
            position: 'absolute',
            left: COURT_WIDTH - ftToPx(45),
            top: ballPosition.y > COURT_HEIGHT / 2 ? 0 : COURT_HEIGHT * 0.6,
            width: ftToPx(25),
            height: COURT_HEIGHT * 0.4,
            opacity: 0.15
          }}
        />
      )}
      
      {/* Trail Coverage Zone (Perimeter) */}
      <div 
        className="coverage-zone trail-coverage"
        style={{
          position: 'absolute',
          left: COURT_WIDTH - ftToPx(50),
          top: 0,
          width: ftToPx(25),
          height: COURT_HEIGHT,
          opacity: 0.15
        }}
      />
      
      {/* Three-Point Arc Coverage */}
      <div 
        className="coverage-zone three-point-coverage"
        style={{
          position: 'absolute',
          left: COURT_WIDTH - ftToPx(35),
          top: ftToPx(5),
          width: ftToPx(30),
          height: COURT_HEIGHT - ftToPx(10),
          opacity: 0.1,
          borderRadius: ftToPx(25)
        }}
      />
      
      {/* Coverage Labels */}
      <div className="coverage-labels">
        <span 
          className="coverage-label lead-label"
          style={{
            position: 'absolute',
            left: COURT_WIDTH - ftToPx(12),
            top: ftToPx(25),
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#d32f2f'
          }}
        >
          LEAD ZONE
        </span>
        
        {isThreePerson && (
          <span 
            className="coverage-label center-label"
            style={{
              position: 'absolute',
              left: COURT_WIDTH - ftToPx(32),
              top: ballPosition.y > COURT_HEIGHT / 2 ? ftToPx(8) : COURT_HEIGHT - ftToPx(15),
              fontSize: '10px',
              fontWeight: 'bold',
              color: '#388e3c'
            }}
          >
            CENTER ZONE
          </span>
        )}
        
        <span 
          className="coverage-label trail-label"
          style={{
            position: 'absolute',
            left: COURT_WIDTH - ftToPx(42),
            top: ftToPx(8),
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#1976d2'
          }}
        >
          TRAIL ZONE
        </span>
      </div>
    </div>
  );
}
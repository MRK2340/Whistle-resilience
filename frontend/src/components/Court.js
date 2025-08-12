// Court.js - Full realistic basketball court with all markings
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
        {/* Court Border */}
        <div className="court-border" />
        
        {/* Half Court Line */}
        <div 
          className="half-court-line"
          style={{
            left: COURT_WIDTH / 2 - 1,
            top: 0,
            width: 2,
            height: COURT_HEIGHT
          }}
        />
        
        {/* Center Circle */}
        <div 
          className="center-circle"
          style={{
            left: COURT_WIDTH / 2 - ftToPx(6),
            top: COURT_HEIGHT / 2 - ftToPx(6),
            width: ftToPx(12),
            height: ftToPx(12)
          }}
        />
        
        {/* Center Circle Inner */}
        <div 
          className="center-circle-inner"
          style={{
            left: COURT_WIDTH / 2 - ftToPx(2),
            top: COURT_HEIGHT / 2 - ftToPx(2),
            width: ftToPx(4),
            height: ftToPx(4)
          }}
        />

        {/* LEFT SIDE (Defensive End) */}
        
        {/* Left Basket */}
        <div 
          className="basket left-basket"
          style={{
            left: ftToPx(4),
            top: COURT_HEIGHT / 2 - 3,
            width: 6,
            height: 6
          }}
        />
        
        {/* Left Backboard */}
        <div 
          className="backboard left-backboard"
          style={{
            left: 0,
            top: COURT_HEIGHT / 2 - ftToPx(3),
            width: 3,
            height: ftToPx(6)
          }}
        />
        
        {/* Left Three-Point Arc */}
        <div 
          className="three-point-arc left-three-point"
          style={{
            left: ftToPx(4) - ftToPx(23.75),
            top: COURT_HEIGHT / 2 - ftToPx(23.75),
            width: ftToPx(47.5),
            height: ftToPx(47.5)
          }}
        />
        
        {/* Left Free Throw Circle */}
        <div 
          className="free-throw-circle left-ft-circle"
          style={{
            left: ftToPx(19) - ftToPx(6),
            top: COURT_HEIGHT / 2 - ftToPx(6),
            width: ftToPx(12),
            height: ftToPx(12)
          }}
        />
        
        {/* Left Lane (Paint) */}
        <div 
          className="lane left-lane"
          style={{
            left: 0,
            top: COURT_HEIGHT / 2 - ftToPx(8),
            width: ftToPx(19),
            height: ftToPx(16)
          }}
        />
        
        {/* Left Free Throw Line */}
        <div 
          className="free-throw-line left-ft-line"
          style={{
            left: ftToPx(19) - 1,
            top: COURT_HEIGHT / 2 - ftToPx(6),
            width: 2,
            height: ftToPx(12)
          }}
        />

        {/* RIGHT SIDE (Offensive End) */}
        
        {/* Right Basket */}
        <div 
          className="basket right-basket"
          style={{
            left: COURT_WIDTH - ftToPx(4) - 3,
            top: COURT_HEIGHT / 2 - 3,
            width: 6,
            height: 6
          }}
        />
        
        {/* Right Backboard */}
        <div 
          className="backboard right-backboard"
          style={{
            left: COURT_WIDTH - 3,
            top: COURT_HEIGHT / 2 - ftToPx(3),
            width: 3,
            height: ftToPx(6)
          }}
        />
        
        {/* Right Three-Point Arc */}
        <div 
          className="three-point-arc right-three-point"
          style={{
            left: COURT_WIDTH - ftToPx(4) - ftToPx(23.75),
            top: COURT_HEIGHT / 2 - ftToPx(23.75),
            width: ftToPx(47.5),
            height: ftToPx(47.5)
          }}
        />
        
        {/* Right Free Throw Circle */}
        <div 
          className="free-throw-circle right-ft-circle"
          style={{
            left: COURT_WIDTH - ftToPx(19) - ftToPx(6),
            top: COURT_HEIGHT / 2 - ftToPx(6),
            width: ftToPx(12),
            height: ftToPx(12)
          }}
        />
        
        {/* Right Lane (Paint) */}
        <div 
          className="lane right-lane"
          style={{
            left: COURT_WIDTH - ftToPx(19),
            top: COURT_HEIGHT / 2 - ftToPx(8),
            width: ftToPx(19),
            height: ftToPx(16)
          }}
        />
        
        {/* Right Free Throw Line */}
        <div 
          className="free-throw-line right-ft-line"
          style={{
            left: COURT_WIDTH - ftToPx(19) - 1,
            top: COURT_HEIGHT / 2 - ftToPx(6),
            width: 2,
            height: ftToPx(12)
          }}
        />
        
        {/* Lane Hash Marks - Right Side */}
        {Array.from({length: 4}, (_, i) => (
          <div 
            key={`right-hash-${i}`}
            className="lane-hash-mark"
            style={{
              left: COURT_WIDTH - ftToPx(19) + (i % 2 === 0 ? -8 : ftToPx(19) - 4),
              top: COURT_HEIGHT / 2 - ftToPx(7) + i * ftToPx(2),
              width: 8,
              height: 2
            }}
          />
        ))}
        
        {/* Lane Hash Marks - Left Side */}
        {Array.from({length: 4}, (_, i) => (
          <div 
            key={`left-hash-${i}`}
            className="lane-hash-mark"
            style={{
              left: i % 2 === 0 ? -4 : ftToPx(19) - 4,
              top: COURT_HEIGHT / 2 - ftToPx(7) + i * ftToPx(2),
              width: 8,
              height: 2
            }}
          />
        ))}
        
        {/* Court Labels */}
        <div className="court-labels">
          <div 
            className="court-label home-label"
            style={{
              left: COURT_WIDTH * 0.75,
              top: 10
            }}
          >
            OFFENSIVE END
          </div>
          <div 
            className="court-label away-label"
            style={{
              left: COURT_WIDTH * 0.15,
              top: 10
            }}
          >
            DEFENSIVE END
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
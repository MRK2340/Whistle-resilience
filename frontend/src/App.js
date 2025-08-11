import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import './App.css';

// Components
import Court from './components/Court';
import ToggleSystem from './components/ToggleSystem';
import ShotOverlay from './components/ShotOverlay';

// Utils & Constants
import { 
  COURT_WIDTH, 
  COURT_HEIGHT, 
  COURT_ORIGIN_X, 
  COURT_ORIGIN_Y, 
  ftToPx, 
  HALF_COURT_X, 
  BASKET_X, 
  BASKET_Y, 
  SHOT_DISTANCE_THRESHOLD 
} from './utils/courtUtils';

// Config
const REF_SIZE = 14;
const BALL_SIZE = 18;

export default function App() {
  const [ballPosition, setBallPosition] = useState({ 
    x: COURT_WIDTH / 2, 
    y: COURT_HEIGHT / 2 
  });
  const [isThreePerson, setIsThreePerson] = useState(true);
  const [isShotMode, setIsShotMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const lastBallX = useRef(ballPosition.x);

  // Ball animation
  const [ballStyle, setBallStyle] = useSpring(() => ({
    transform: `translate(${ballPosition.x - BALL_SIZE / 2}px, ${ballPosition.y - BALL_SIZE / 2}px)`,
    config: { tension: 300, friction: 30 }
  }));

  // Referee positions - memoized to prevent unnecessary re-renders
  const getLeadPosition = useCallback(() => {
    const x = isShotMode ? COURT_WIDTH - ftToPx(10) : ballPosition.x + ftToPx(6);
    const y = isShotMode ? BASKET_Y + ftToPx(4) : Math.max(ftToPx(10), ballPosition.y - ftToPx(8));
    return { x: x - REF_SIZE / 2, y: y - REF_SIZE / 2 };
  }, [ballPosition, isShotMode]);

  const getTrailPosition = useCallback(() => {
    // Ensure Trail is always visible and properly positioned
    const x = isShotMode 
      ? Math.max(10, COURT_WIDTH - ftToPx(16))  // Keep within bounds
      : Math.max(10, Math.min(COURT_WIDTH * 0.3, ballPosition.x - ftToPx(8))); // Adjust positioning
    const y = isShotMode 
      ? Math.min(COURT_HEIGHT - 20, BASKET_Y + ftToPx(12))  // Keep within court bounds
      : Math.min(COURT_HEIGHT - 20, Math.max(COURT_HEIGHT * 0.7, ballPosition.y + ftToPx(8))); // Better positioning
    return { x: x - REF_SIZE / 2, y: y - REF_SIZE / 2 };
  }, [ballPosition, isShotMode]);

  const getCenterPosition = useCallback(() => {
    if (!isThreePerson) return { x: 0, y: 0, opacity: 0 };
    const x = isShotMode ? COURT_WIDTH - ftToPx(10) : COURT_WIDTH / 2;
    const y = isShotMode ? BASKET_Y : (ballPosition.y + Math.max(ftToPx(60), ballPosition.y + ftToPx(12))) / 2;
    return { x: x - REF_SIZE / 2, y: y - REF_SIZE / 2, opacity: 1 };
  }, [ballPosition, isShotMode, isThreePerson]);

  const [leadStyle, setLeadStyle] = useSpring(() => {
    const pos = getLeadPosition();
    return {
      transform: `translate(${pos.x}px, ${pos.y}px)`,
      config: { tension: 200, friction: 25 }
    };
  });

  const [trailStyle, setTrailStyle] = useSpring(() => {
    const pos = getTrailPosition();
    return {
      transform: `translate(${pos.x}px, ${pos.y}px)`,
      config: { tension: 200, friction: 25 }
    };
  });

  const [centerStyle, setCenterStyle] = useSpring(() => {
    const pos = getCenterPosition();
    return {
      transform: `translate(${pos.x}px, ${pos.y}px)`,
      opacity: pos.opacity,
      config: { tension: 200, friction: 25 }
    };
  });

  // Update referee positions when ball moves or mode changes
  useEffect(() => {
    const leadPos = getLeadPosition();
    const trailPos = getTrailPosition();
    const centerPos = getCenterPosition();

    setLeadStyle.start({
      transform: `translate(${leadPos.x}px, ${leadPos.y}px)`
    });
    setTrailStyle.start({
      transform: `translate(${trailPos.x}px, ${trailPos.y}px)`
    });
    setCenterStyle.start({
      transform: `translate(${centerPos.x}px, ${centerPos.y}px)`,
      opacity: centerPos.opacity
    });
  }, [ballPosition, isShotMode, isThreePerson, getLeadPosition, getTrailPosition, getCenterPosition, setLeadStyle, setTrailStyle, setCenterStyle]);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - COURT_ORIGIN_X;
    const y = e.clientY - rect.top - COURT_ORIGIN_Y;
    
    const clampedX = Math.max(0, Math.min(x, COURT_WIDTH));
    const clampedY = Math.max(0, Math.min(y, COURT_HEIGHT));
    
    setBallPosition({ x: clampedX, y: clampedY });
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - COURT_ORIGIN_X;
    const y = e.clientY - rect.top - COURT_ORIGIN_Y;
    
    const clampedX = Math.max(0, Math.min(x, COURT_WIDTH));
    const clampedY = Math.max(0, Math.min(y, COURT_HEIGHT));
    
    setBallPosition({ x: clampedX, y: clampedY });

    // Shot detection
    const dx = clampedX - BASKET_X;
    const dy = clampedY - BASKET_Y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < SHOT_DISTANCE_THRESHOLD && !isShotMode) {
      setIsShotMode(true);
      setTimeout(() => setIsShotMode(false), 1500);
    }

    // Rotation on fast break
    if (lastBallX.current < HALF_COURT_X && clampedX > HALF_COURT_X + 10) {
      // Future: Trigger rotation logic here if desired
    }
    lastBallX.current = clampedX;
  }, [isDragging, isShotMode]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Update ball spring animation
  useEffect(() => {
    setBallStyle.start({
      transform: `translate(${ballPosition.x - BALL_SIZE / 2}px, ${ballPosition.y - BALL_SIZE / 2}px)`
    });
  }, [ballPosition, setBallStyle]);

  return (
    <div className="app-container">
      <h1 className="app-title">🏀 RefereeCourt Pro</h1>
      <p className="app-subtitle">Drag ball to train positioning</p>

      <ToggleSystem isThreePerson={isThreePerson} onToggle={setIsThreePerson} />

      <div 
        className="court-wrapper"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Court>
          {/* Ball */}
          <animated.div 
            className="ball" 
            style={{
              ...ballStyle,
              width: BALL_SIZE,
              height: BALL_SIZE,
              position: 'absolute',
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
          >
            <span className="ball-text">🏀</span>
          </animated.div>

          {/* Lead */}
          <animated.div 
            className="ref lead-ref" 
            style={{
              ...leadStyle,
              width: REF_SIZE,
              height: REF_SIZE,
              position: 'absolute'
            }}
          >
            <span className="ref-text">L</span>
          </animated.div>

          {/* Trail */}
          <animated.div 
            className="ref trail-ref" 
            style={{
              ...trailStyle,
              width: REF_SIZE,
              height: REF_SIZE,
              position: 'absolute'
            }}
          >
            <span className="ref-text">T</span>
          </animated.div>

          {/* Center */}
          {isThreePerson && (
            <animated.div 
              className="ref center-ref" 
              style={{
                ...centerStyle,
                width: REF_SIZE,
                height: REF_SIZE,
                position: 'absolute'
              }}
            >
              <span className="ref-text">C</span>
            </animated.div>
          )}

          {/* Shot Overlay */}
          {isShotMode && <ShotOverlay />}
        </Court>
      </div>

      {/* Legend */}
      <div className="legend">
        <div className="legend-item">
          <div className="dot lead-dot"></div>
          <span className="legend-text">Lead</span>
        </div>
        <div className="legend-item">
          <div className="dot trail-dot"></div>
          <span className="legend-text">Trail</span>
        </div>
        {isThreePerson && (
          <div className="legend-item">
            <div className="dot center-dot"></div>
            <span className="legend-text">Center</span>
          </div>
        )}
      </div>

      <p className="mode-text">
        Mode: <span className="bold">{isThreePerson ? '3-Person' : '2-Person'}</span>
      </p>
    </div>
  );
}
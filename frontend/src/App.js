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
  const [isTransition, setIsTransition] = useState(false);
  
  // Track current referee roles - they can swap during transitions
  const [currentLeadRef, setCurrentLeadRef] = useState('LEAD'); // 'LEAD' or 'TRAIL'  
  const [currentTrailRef, setCurrentTrailRef] = useState('TRAIL'); // 'TRAIL' or 'LEAD'
  
  const lastBallX = useRef(ballPosition.x);
  const lastTransitionDirection = useRef(null); // 'to-frontcourt' or 'to-backcourt'

  // Ball animation
  const [ballStyle, setBallStyle] = useSpring(() => ({
    transform: `translate(${ballPosition.x - BALL_SIZE / 2}px, ${ballPosition.y - BALL_SIZE / 2}px)`,
    config: { tension: 300, friction: 30 }
  }));

  // Proper basketball referee positioning mechanics
  const getLeadPosition = useCallback(() => {
    // Lead referee should be on the baseline, typically opposite side of ball
    // Primary responsibility: paint area, baseline, close-down plays
    
    if (isShotMode) {
      // During shots: Lead moves to basket area for rebound coverage
      return { 
        x: COURT_WIDTH - ftToPx(8) - REF_SIZE / 2, 
        y: BASKET_Y - ftToPx(6) - REF_SIZE / 2 
      };
    }
    
    // Normal play: Lead on baseline, opposite side of ball when possible
    const ballSide = ballPosition.x > COURT_WIDTH / 2 ? 'right' : 'left';
    const leadX = ballSide === 'right' 
      ? COURT_WIDTH - ftToPx(5)  // Right baseline
      : COURT_WIDTH - ftToPx(25); // Left baseline (opposite side)
    
    // Lead stays near baseline but adjusts slightly with ball movement
    const leadY = Math.max(ftToPx(5), 
                  Math.min(COURT_HEIGHT - ftToPx(5), 
                          ballPosition.y + ftToPx(2)));
    
    return { x: leadX - REF_SIZE / 2, y: leadY - REF_SIZE / 2 };
  }, [ballPosition, isShotMode]);

  const getTrailPosition = useCallback(() => {
    // Trail referee should be behind the play, managing perimeter and transitions
    // Primary responsibility: perimeter action, three-point line, transitions
    
    if (isShotMode) {
      // During shots: Trail provides different angle coverage
      return { 
        x: COURT_WIDTH - ftToPx(20) - REF_SIZE / 2, 
        y: BASKET_Y + ftToPx(8) - REF_SIZE / 2 
      };
    }
    
    // Trail positioning based on ball location and court coverage
    let trailX, trailY;
    
    if (ballPosition.x < HALF_COURT_X) {
      // Ball in backcourt: Trail manages from behind
      trailX = Math.max(ftToPx(8), ballPosition.x - ftToPx(15));
      trailY = Math.max(ftToPx(8), 
                      Math.min(COURT_HEIGHT - ftToPx(8), 
                              ballPosition.y - ftToPx(5)));
    } else {
      // Ball in frontcourt: Trail at top of key/perimeter
      trailX = COURT_WIDTH - ftToPx(35); // Top of key area
      trailY = Math.max(COURT_HEIGHT * 0.2,
                       Math.min(COURT_HEIGHT * 0.8, 
                               ballPosition.y - ftToPx(10)));
    }
    
    return { x: trailX - REF_SIZE / 2, y: trailY - REF_SIZE / 2 };
  }, [ballPosition, isShotMode]);

  const getCenterPosition = useCallback(() => {
    if (!isThreePerson) return { x: 0, y: 0, opacity: 0 };
    
    // Center referee provides help-side coverage and off-ball officiating
    // Primary responsibility: help-side, off-ball action, weak-side coverage
    
    if (isShotMode) {
      // During shots: Center provides help-side rebound coverage
      return { 
        x: COURT_WIDTH - ftToPx(15) - REF_SIZE / 2, 
        y: BASKET_Y - REF_SIZE / 2,
        opacity: 1
      };
    }
    
    // Center positioning for optimal court coverage
    let centerX, centerY;
    
    if (ballPosition.x < HALF_COURT_X) {
      // Ball in backcourt: Center near mid-court for transition coverage
      centerX = HALF_COURT_X - ftToPx(8);
      centerY = COURT_HEIGHT / 2;
    } else {
      // Ball in frontcourt: Center on help-side (opposite ball)
      const ballSide = ballPosition.x > (COURT_WIDTH - ftToPx(20)) ? 'deep' : 'perimeter';
      centerX = ballSide === 'deep' 
        ? COURT_WIDTH - ftToPx(30)  // Help-side when ball is deep
        : COURT_WIDTH - ftToPx(20); // Closer when ball on perimeter
      
      centerY = ballPosition.y < COURT_HEIGHT / 2
        ? COURT_HEIGHT * 0.7  // Opposite vertical position for coverage
        : COURT_HEIGHT * 0.3;
    }
    
    return { 
      x: centerX - REF_SIZE / 2, 
      y: centerY - REF_SIZE / 2, 
      opacity: 1 
    };
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
  }, [ballPosition, isShotMode, isThreePerson, isTransition, currentLeadRef, currentTrailRef, getLeadPosition, getTrailPosition, getCenterPosition, setLeadStyle, setTrailStyle, setCenterStyle]);

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

    // Shot detection near basket
    const dx = clampedX - BASKET_X;
    const dy = clampedY - BASKET_Y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < SHOT_DISTANCE_THRESHOLD && !isShotMode) {
      setIsShotMode(true);
      setTimeout(() => setIsShotMode(false), 1500);
    }

    // Lead/Trail rotation detection during transitions
    const isMovingToFrontcourt = lastBallX.current < HALF_COURT_X && clampedX > HALF_COURT_X + ftToPx(5);
    const isMovingToBackcourt = lastBallX.current > HALF_COURT_X && clampedX < HALF_COURT_X - ftToPx(5);
    
    if (isMovingToFrontcourt) {
      // Ball transitioning to frontcourt - Trail becomes Lead, Lead becomes Trail
      if (lastTransitionDirection.current !== 'to-frontcourt') {
        console.log('🏀 TRANSITION: Lead/Trail rotation - ball to frontcourt');
        setCurrentLeadRef(currentTrailRef);   // Trail becomes new Lead
        setCurrentTrailRef(currentLeadRef);   // Lead becomes new Trail  
        lastTransitionDirection.current = 'to-frontcourt';
        setIsTransition(true);
        setTimeout(() => setIsTransition(false), 1000);
      }
    } else if (isMovingToBackcourt) {
      // Ball transitioning to backcourt - reverse rotation
      if (lastTransitionDirection.current !== 'to-backcourt') {
        console.log('🏀 TRANSITION: Lead/Trail rotation - ball to backcourt');
        setCurrentLeadRef(currentTrailRef);   // Trail becomes new Lead
        setCurrentTrailRef(currentLeadRef);   // Lead becomes new Trail
        lastTransitionDirection.current = 'to-backcourt';
        setIsTransition(true);
        setTimeout(() => setIsTransition(false), 1000);
      }
    }
    
    lastBallX.current = clampedX;
  }, [isDragging, isShotMode, currentLeadRef, currentTrailRef]);

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

          {/* Lead Referee - shows current role symbol */}
          <animated.div 
            className="ref lead-ref" 
            style={{
              ...leadStyle,
              width: REF_SIZE,
              height: REF_SIZE,
              position: 'absolute'
            }}
          >
            <span className="ref-text">{currentLeadRef === 'LEAD' ? 'L' : 'T'}</span>
          </animated.div>

          {/* Trail Referee - shows current role symbol */}
          <animated.div 
            className="ref trail-ref" 
            style={{
              ...trailStyle,
              width: REF_SIZE,
              height: REF_SIZE,
              position: 'absolute'
            }}
          >
            <span className="ref-text">{currentTrailRef === 'TRAIL' ? 'T' : 'L'}</span>
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
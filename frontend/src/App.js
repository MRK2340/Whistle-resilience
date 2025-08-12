import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import './App.css';

// Components
import Court from './components/Court';
import ToggleSystem from './components/ToggleSystem';
import ModeToggle from './components/ModeToggle';
import CoverageZones from './components/CoverageZones';
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
  SHOT_DISTANCE_THRESHOLD,
  getOptimalPosition,
  isInZone,
  getBallSide
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
  const [isManualMode, setIsManualMode] = useState(false);
  const [showCoverage, setShowCoverage] = useState(false); // New: Show coverage zones
  
  // Enhanced game state tracking
  const [gameState, setGameState] = useState({
    ballZone: 'PERIMETER',
    ballSide: 'BALL_SIDE',
    isPostPlay: false,
    isCornerPlay: false,
    isTransitionPlay: false,
    lastRotationTime: 0
  });
  
  // Manual positioning for training mode
  const [manualLeadPosition, setManualLeadPosition] = useState({ x: 0, y: 0 });
  const [manualTrailPosition, setManualTrailPosition] = useState({ x: 0, y: 0 });
  const [manualCenterPosition, setManualCenterPosition] = useState({ x: 0, y: 0 });
  
  // Track what's being dragged
  const [dragTarget, setDragTarget] = useState(null);
  
  // Track current referee roles - they can swap during transitions
  const [currentLeadRef, setCurrentLeadRef] = useState('LEAD');
  const [currentTrailRef, setCurrentTrailRef] = useState('TRAIL');
  
  const lastBallX = useRef(ballPosition.x);
  const lastTransitionDirection = useRef(null);

  // Ball animation
  const [ballStyle, setBallStyle] = useSpring(() => ({
    transform: `translate(${ballPosition.x - BALL_SIZE / 2}px, ${ballPosition.y - BALL_SIZE / 2}px)`,
    config: { tension: 300, friction: 30 }
  }));

  // Enhanced game state tracking based on ball position
  useEffect(() => {
    const ballSide = getBallSide(ballPosition.x);
    const newGameState = {
      ballZone: isInZone(ballPosition.x, ballPosition.y, 'PAINT') ? 'PAINT' : 
                isInZone(ballPosition.x, ballPosition.y, 'PERIMETER') ? 'PERIMETER' :
                isInZone(ballPosition.x, ballPosition.y, 'BACKCOURT') ? 'BACKCOURT' : 'PERIMETER',
      ballSide: ballSide,
      isPostPlay: isInZone(ballPosition.x, ballPosition.y, 'PAINT'),
      isCornerPlay: isInZone(ballPosition.x, ballPosition.y, 'CORNER_LEFT') || 
                    isInZone(ballPosition.x, ballPosition.y, 'CORNER_RIGHT'),
      isTransitionPlay: isInZone(ballPosition.x, ballPosition.y, 'BACKCOURT'),
      isShotMode: isShotMode,
      lastRotationTime: gameState.lastRotationTime
    };
    setGameState(newGameState);
  }, [ballPosition, isShotMode, gameState.lastRotationTime]);

  // Enhanced referee positioning using authentic basketball mechanics
  const getLeadPosition = useCallback(() => {
    if (isManualMode) return manualLeadPosition;
    const optimalPos = getOptimalPosition('LEAD', ballPosition.x, ballPosition.y, gameState);
    return { x: optimalPos.x - REF_SIZE / 2, y: optimalPos.y - REF_SIZE / 2 };
  }, [ballPosition, gameState, isManualMode, manualLeadPosition]);

  const getTrailPosition = useCallback(() => {
    if (isManualMode) return manualTrailPosition;
    const optimalPos = getOptimalPosition('TRAIL', ballPosition.x, ballPosition.y, gameState);
    return { x: optimalPos.x - REF_SIZE / 2, y: optimalPos.y - REF_SIZE / 2 };
  }, [ballPosition, gameState, isManualMode, manualTrailPosition]);

  const getCenterPosition = useCallback(() => {
    if (!isThreePerson) return { x: 0, y: 0, opacity: 0 };
    if (isManualMode) return { ...manualCenterPosition, opacity: 1 };
    const optimalPos = getOptimalPosition('CENTER', ballPosition.x, ballPosition.y, gameState);
    return { x: optimalPos.x - REF_SIZE / 2, y: optimalPos.y - REF_SIZE / 2, opacity: 1 };
  }, [ballPosition, gameState, isThreePerson, isManualMode, manualCenterPosition]);

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

  // Update referee spring animations based on mode
  useEffect(() => {
    if (isManualMode) {
      // In manual mode, use manual positions
      setLeadStyle.start({
        transform: `translate(${manualLeadPosition.x}px, ${manualLeadPosition.y}px)`
      });
      setTrailStyle.start({
        transform: `translate(${manualTrailPosition.x}px, ${manualTrailPosition.y}px)`
      });
      setCenterStyle.start({
        transform: `translate(${manualCenterPosition.x}px, ${manualCenterPosition.y}px)`,
        opacity: isThreePerson ? 1 : 0
      });
    } else {
      // In auto mode, use calculated positions
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
    }
  }, [
    ballPosition, isShotMode, isThreePerson, isTransition, currentLeadRef, currentTrailRef,
    isManualMode, manualLeadPosition, manualTrailPosition, manualCenterPosition,
    getLeadPosition, getTrailPosition, getCenterPosition, setLeadStyle, setTrailStyle, setCenterStyle
  ]);

  // Initialize manual positions when switching to manual mode
  useEffect(() => {
    if (isManualMode) {
      // Set manual positions to current auto positions when switching to manual mode
      const leadPos = getLeadPosition();
      const trailPos = getTrailPosition();
      const centerPos = getCenterPosition();
      
      setManualLeadPosition({ x: leadPos.x, y: leadPos.y });
      setManualTrailPosition({ x: trailPos.x, y: trailPos.y });
      setManualCenterPosition({ x: centerPos.x, y: centerPos.y });
    }
  }, [isManualMode, getLeadPosition, getTrailPosition, getCenterPosition]);

  // Handle mouse down for both ball and referee dragging
  const handleMouseDown = useCallback((e, target = 'ball') => {
    setIsDragging(true);
    setDragTarget(target);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - COURT_ORIGIN_X;
    const y = e.clientY - rect.top - COURT_ORIGIN_Y;
    
    const clampedX = Math.max(0, Math.min(x, COURT_WIDTH));
    const clampedY = Math.max(0, Math.min(y, COURT_HEIGHT));
    
    if (target === 'ball') {
      setBallPosition({ x: clampedX, y: clampedY });
    }
    // For referee pieces, initial position update happens in handleMouseMove
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !dragTarget) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - COURT_ORIGIN_X;
    const y = e.clientY - rect.top - COURT_ORIGIN_Y;
    
    const clampedX = Math.max(0, Math.min(x, COURT_WIDTH));
    const clampedY = Math.max(0, Math.min(y, COURT_HEIGHT));
    
    if (dragTarget === 'ball') {
      setBallPosition({ x: clampedX, y: clampedY });

      // Only do shot detection and rotation in auto mode
      if (!isManualMode) {
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
          if (lastTransitionDirection.current !== 'to-frontcourt') {
            console.log('🏀 TRANSITION: Lead/Trail rotation - ball to frontcourt');
            setCurrentLeadRef(prev => prev === 'LEAD' ? 'TRAIL' : 'LEAD');
            setCurrentTrailRef(prev => prev === 'TRAIL' ? 'LEAD' : 'TRAIL');
            lastTransitionDirection.current = 'to-frontcourt';
            setIsTransition(true);
            setTimeout(() => setIsTransition(false), 1000);
          }
        } else if (isMovingToBackcourt) {
          if (lastTransitionDirection.current !== 'to-backcourt') {
            console.log('🏀 TRANSITION: Lead/Trail rotation - ball to backcourt');
            setCurrentLeadRef(prev => prev === 'LEAD' ? 'TRAIL' : 'LEAD');
            setCurrentTrailRef(prev => prev === 'TRAIL' ? 'LEAD' : 'TRAIL');
            lastTransitionDirection.current = 'to-backcourt';
            setIsTransition(true);
            setTimeout(() => setIsTransition(false), 1000);
          }
        }
        
        lastBallX.current = clampedX;
      }
    } else if (isManualMode) {
      // Handle referee dragging in manual mode
      const refereeX = clampedX - REF_SIZE / 2;
      const refereeY = clampedY - REF_SIZE / 2;
      
      if (dragTarget === 'lead') {
        setManualLeadPosition({ x: refereeX, y: refereeY });
      } else if (dragTarget === 'trail') {
        setManualTrailPosition({ x: refereeX, y: refereeY });
      } else if (dragTarget === 'center') {
        setManualCenterPosition({ x: refereeX, y: refereeY });
      }
    }
  }, [isDragging, dragTarget, isShotMode, isManualMode]); // Removed stale dependencies

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragTarget(null);
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
      <ModeToggle isManualMode={isManualMode} onToggle={setIsManualMode} />

      <div 
        className="court-wrapper"
        onMouseDown={(e) => handleMouseDown(e, 'ball')}
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
              cursor: isDragging && dragTarget === 'ball' ? 'grabbing' : 'grab'
            }}
          >
            <span className="ball-text">🏀</span>
          </animated.div>

          {/* Lead Referee - shows current role symbol with transition effect */}
          <animated.div 
            className={`ref lead-ref ${isTransition ? 'rotating' : ''} ${isManualMode ? 'manual-mode' : ''}`}
            style={{
              ...leadStyle,
              width: REF_SIZE,
              height: REF_SIZE,
              position: 'absolute',
              cursor: isManualMode ? (isDragging && dragTarget === 'lead' ? 'grabbing' : 'grab') : 'default'
            }}
            onMouseDown={isManualMode ? (e) => { e.stopPropagation(); handleMouseDown(e, 'lead'); } : undefined}
          >
            <span className="ref-text">{currentLeadRef === 'LEAD' ? 'L' : 'T'}</span>
          </animated.div>

          {/* Trail Referee - shows current role symbol with transition effect */}
          <animated.div 
            className={`ref trail-ref ${isTransition ? 'rotating' : ''} ${isManualMode ? 'manual-mode' : ''}`}
            style={{
              ...trailStyle,
              width: REF_SIZE,
              height: REF_SIZE,
              position: 'absolute',
              cursor: isManualMode ? (isDragging && dragTarget === 'trail' ? 'grabbing' : 'grab') : 'default'
            }}
            onMouseDown={isManualMode ? (e) => { e.stopPropagation(); handleMouseDown(e, 'trail'); } : undefined}
          >
            <span className="ref-text">{currentTrailRef === 'TRAIL' ? 'T' : 'L'}</span>
          </animated.div>

          {/* Center Referee */}
          {isThreePerson && (
            <animated.div 
              className={`ref center-ref ${isTransition ? 'rotating' : ''} ${isManualMode ? 'manual-mode' : ''}`}
              style={{
                ...centerStyle,
                width: REF_SIZE,
                height: REF_SIZE,
                position: 'absolute',
                cursor: isManualMode ? (isDragging && dragTarget === 'center' ? 'grabbing' : 'grab') : 'default'
              }}
              onMouseDown={isManualMode ? (e) => { e.stopPropagation(); handleMouseDown(e, 'center'); } : undefined}
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
        System: <span className="bold">{isThreePerson ? '3-Person' : '2-Person'}</span> | 
        Mode: <span className="bold">{isManualMode ? 'Manual Training' : 'Auto Positioning'}</span>
      </p>
    </div>
  );
}
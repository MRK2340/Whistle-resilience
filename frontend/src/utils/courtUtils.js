// courtUtils.js - Enhanced with official court zones and coverage areas
const getWindowWidth = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth;
  }
  return 800; // Default for server-side rendering
};

export const COURT_WIDTH = Math.min(getWindowWidth() * 0.8, 600);
export const COURT_HEIGHT = (COURT_WIDTH * 50) / 94; // 50x94 ft basketball court ratio
export const COURT_ORIGIN_X = (getWindowWidth() - COURT_WIDTH) / 2;
export const COURT_ORIGIN_Y = 80;

// Convert feet to pixels
export const ftToPx = (ft) => (ft / 94) * COURT_WIDTH;

// Court zones and key landmarks - Full Court
export const HALF_COURT_X = COURT_WIDTH / 2;

// Both baskets
export const LEFT_BASKET_X = ftToPx(4); // Defensive basket
export const LEFT_BASKET_Y = COURT_HEIGHT / 2;
export const RIGHT_BASKET_X = COURT_WIDTH - ftToPx(4); // Offensive basket  
export const RIGHT_BASKET_Y = COURT_HEIGHT / 2;

// Legacy support - Right basket is the main "BASKET" for offensive plays
export const BASKET_X = RIGHT_BASKET_X;
export const BASKET_Y = RIGHT_BASKET_Y;

export const SHOT_DISTANCE_THRESHOLD = ftToPx(20); // Within 20ft

// Key court zones for referee positioning - Full Court
export const COURT_ZONES = {
  // Right side zones (Offensive/Attacking end)
  RIGHT_PAINT: {
    x: COURT_WIDTH - ftToPx(19),
    y: COURT_HEIGHT / 2 - ftToPx(8),
    width: ftToPx(19),
    height: ftToPx(16)
  },
  
  RIGHT_FREE_THROW_CIRCLE: {
    center: { x: COURT_WIDTH - ftToPx(19), y: COURT_HEIGHT / 2 },
    radius: ftToPx(6)
  },
  
  RIGHT_THREE_POINT_ARC: {
    center: { x: RIGHT_BASKET_X, y: RIGHT_BASKET_Y },
    radius: ftToPx(23.75)
  },
  
  // Left side zones (Defensive end)
  LEFT_PAINT: {
    x: 0,
    y: COURT_HEIGHT / 2 - ftToPx(8),
    width: ftToPx(19),
    height: ftToPx(16)
  },
  
  LEFT_FREE_THROW_CIRCLE: {
    center: { x: ftToPx(19), y: COURT_HEIGHT / 2 },
    radius: ftToPx(6)
  },
  
  LEFT_THREE_POINT_ARC: {
    center: { x: LEFT_BASKET_X, y: LEFT_BASKET_Y },
    radius: ftToPx(23.75)
  },
  
  // Corner areas - both ends
  RIGHT_CORNERS: {
    TOP: { x: COURT_WIDTH - ftToPx(22), y: 0, width: ftToPx(22), height: ftToPx(14) },
    BOTTOM: { x: COURT_WIDTH - ftToPx(22), y: COURT_HEIGHT - ftToPx(14), width: ftToPx(22), height: ftToPx(14) }
  },
  
  LEFT_CORNERS: {
    TOP: { x: 0, y: 0, width: ftToPx(22), height: ftToPx(14) },
    BOTTOM: { x: 0, y: COURT_HEIGHT - ftToPx(14), width: ftToPx(22), height: ftToPx(14) }
  },
  
  // Center court
  CENTER_CIRCLE: {
    center: { x: HALF_COURT_X, y: COURT_HEIGHT / 2 },
    radius: ftToPx(6)
  }
};

// Coverage responsibilities for three-person crew
export const COVERAGE_AREAS = {
  LEAD: {
    primary: ['PAINT', 'BASELINE', 'POST_PLAY'],
    secondary: ['BALL_SIDE_COVERAGE'],
    positioning: 'BASELINE_BALL_SIDE'
  },
  
  CENTER: {
    primary: ['HELP_SIDE', 'OFF_BALL_COVERAGE', 'WEAK_SIDE'],
    secondary: ['SECONDARY_DEFENDER'],
    positioning: 'SIDELINE_HELP_SIDE'
  },
  
  TRAIL: {
    primary: ['PERIMETER', 'THREE_POINT_COVERAGE', 'TRANSITION'],
    secondary: ['BACKCOURT', 'TOP_OF_KEY'],
    positioning: 'TOP_OF_KEY_PERIMETER'
  }
};

// Determine court side based on ball position
export const getBallSide = (ballX) => {
  const courtCenter = COURT_WIDTH / 2;
  if (ballX > COURT_WIDTH - ftToPx(25)) {
    return 'DEEP_BALL_SIDE'; // Ball very close to basket
  } else if (ballX > courtCenter) {
    return 'BALL_SIDE'; // Ball on offensive side
  } else {
    return 'TRANSITION'; // Ball in backcourt/transition
  }
};

// Determine if ball is in specific zones
export const isInZone = (ballX, ballY, zone) => {
  switch (zone) {
    case 'PAINT':
      return ballX >= COURT_ZONES.PAINT.x && 
             ballX <= COURT_ZONES.PAINT.x + COURT_ZONES.PAINT.width &&
             ballY >= COURT_ZONES.PAINT.y && 
             ballY <= COURT_ZONES.PAINT.y + COURT_ZONES.PAINT.height;
             
    case 'PERIMETER':
      return ballX < COURT_ZONES.PAINT.x && ballX > HALF_COURT_X;
      
    case 'CORNER_LEFT':
      return ballY < COURT_HEIGHT * 0.3 && ballX > COURT_WIDTH - ftToPx(25);
      
    case 'CORNER_RIGHT': 
      return ballY > COURT_HEIGHT * 0.7 && ballX > COURT_WIDTH - ftToPx(25);
      
    case 'BACKCOURT':
      return ballX < HALF_COURT_X;
      
    default:
      return false;
  }
};

// Calculate optimal referee positioning based on coverage principles
export const getOptimalPosition = (role, ballX, ballY, gameState = {}) => {
  const ballSide = getBallSide(ballX);
  const ballVertical = ballY < COURT_HEIGHT / 2 ? 'TOP' : 'BOTTOM';
  
  switch (role) {
    case 'LEAD':
      return getLeadOptimalPosition(ballX, ballY, ballSide, ballVertical, gameState);
    case 'CENTER':
      return getCenterOptimalPosition(ballX, ballY, ballSide, ballVertical, gameState);
    case 'TRAIL':
      return getTrailOptimalPosition(ballX, ballY, ballSide, ballVertical, gameState);
    default:
      return { x: COURT_WIDTH / 2, y: COURT_HEIGHT / 2 };
  }
};

// Lead positioning based on authentic officiating mechanics
const getLeadOptimalPosition = (ballX, ballY, ballSide, ballVertical, gameState) => {
  if (gameState.isShotMode) {
    // Shot coverage: Lead covers basket area for rebounds
    return {
      x: COURT_WIDTH - ftToPx(8),
      y: BASKET_Y + (ballVertical === 'TOP' ? -ftToPx(6) : ftToPx(6))
    };
  }
  
  if (isInZone(ballX, ballY, 'PAINT')) {
    // Post play coverage: Lead on ball-side baseline
    return {
      x: COURT_WIDTH - ftToPx(3), // On baseline
      y: ballY + (ballVertical === 'TOP' ? ftToPx(8) : -ftToPx(8))
    };
  }
  
  // Standard positioning: Ball-side baseline, free throw line extended
  let leadX = COURT_WIDTH - ftToPx(5); // Baseline position
  let leadY;
  
  if (isInZone(ballX, ballY, 'CORNER_LEFT') || isInZone(ballX, ballY, 'CORNER_RIGHT')) {
    // Corner coverage: Lead adjusts to corner
    leadY = ballY < COURT_HEIGHT / 2 ? ftToPx(8) : COURT_HEIGHT - ftToPx(8);
  } else {
    // Normal coverage: Free throw line extended area
    leadY = Math.max(ftToPx(10), Math.min(COURT_HEIGHT - ftToPx(10), 
                    ballY + (ballVertical === 'TOP' ? ftToPx(12) : -ftToPx(12))));
  }
  
  return { x: leadX, y: leadY };
};

// Center positioning for help-side coverage
const getCenterOptimalPosition = (ballX, ballY, ballSide, ballVertical, gameState) => {
  if (gameState.isShotMode) {
    // Shot coverage: Center provides help-side rebound coverage
    return {
      x: COURT_WIDTH - ftToPx(18),
      y: BASKET_Y + (ballVertical === 'TOP' ? ftToPx(8) : -ftToPx(8))
    };
  }
  
  if (isInZone(ballX, ballY, 'BACKCOURT')) {
    // Transition coverage: Center near mid-court
    return {
      x: HALF_COURT_X - ftToPx(5),
      y: COURT_HEIGHT / 2
    };
  }
  
  // Help-side positioning: Opposite side of ball, free throw line extended
  let centerX;
  if (ballSide === 'DEEP_BALL_SIDE') {
    centerX = COURT_WIDTH - ftToPx(25); // Deeper help-side when ball is deep
  } else {
    centerX = COURT_WIDTH - ftToPx(30); // Standard help-side position
  }
  
  // Vertical positioning opposite to ball
  let centerY = ballY > COURT_HEIGHT / 2 ? COURT_HEIGHT * 0.25 : COURT_HEIGHT * 0.75;
  
  return { x: centerX, y: centerY };
};

// Trail positioning for perimeter and transition coverage  
const getTrailOptimalPosition = (ballX, ballY, ballSide, ballVertical, gameState) => {
  if (gameState.isShotMode) {
    // Shot coverage: Trail covers shooter and perimeter
    return {
      x: COURT_WIDTH - ftToPx(28),
      y: ballY + (ballVertical === 'TOP' ? -ftToPx(8) : ftToPx(8))
    };
  }
  
  if (isInZone(ballX, ballY, 'BACKCOURT')) {
    // Backcourt coverage: Trail behind the play
    return {
      x: Math.max(ftToPx(8), ballX - ftToPx(12)),
      y: Math.max(ftToPx(8), Math.min(COURT_HEIGHT - ftToPx(8), ballY))
    };
  }
  
  // Perimeter coverage: Top of key, three-point line area
  let trailX, trailY;
  
  if (ballSide === 'DEEP_BALL_SIDE') {
    // Ball deep: Trail at top of key
    trailX = COURT_WIDTH - ftToPx(35);
    trailY = COURT_HEIGHT / 2;
  } else {
    // Ball on perimeter: Trail adjusts to cover three-point area
    trailX = COURT_WIDTH - ftToPx(32);
    trailY = Math.max(COURT_HEIGHT * 0.2, 
                     Math.min(COURT_HEIGHT * 0.8, 
                             ballY + (ballVertical === 'TOP' ? -ftToPx(15) : ftToPx(15))));
  }
  
  return { x: trailX, y: trailY };
};
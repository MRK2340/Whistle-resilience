// courtUtils.js - Web version
export const COURT_WIDTH = Math.min(window.innerWidth * 0.9, 600);
export const COURT_HEIGHT = (COURT_WIDTH * 50) / 94; // 50x94 ft basketball court ratio
export const COURT_ORIGIN_X = (window.innerWidth - COURT_WIDTH) / 2;
export const COURT_ORIGIN_Y = 80;

// Convert feet to pixels
export const ftToPx = (ft) => (ft / 94) * COURT_WIDTH;

// Court zones
export const HALF_COURT_X = COURT_WIDTH / 2;
export const BASKET_X = COURT_WIDTH;
export const BASKET_Y = COURT_HEIGHT / 2;
export const SHOT_DISTANCE_THRESHOLD = ftToPx(20); // Within 20ft
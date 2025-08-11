// courtUtils.js - Web version
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

// Court zones
export const HALF_COURT_X = COURT_WIDTH / 2;
export const BASKET_X = COURT_WIDTH;
export const BASKET_Y = COURT_HEIGHT / 2;
export const SHOT_DISTANCE_THRESHOLD = ftToPx(20); // Within 20ft
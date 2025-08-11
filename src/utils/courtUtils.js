// courtUtils.js
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const COURT_WIDTH = width * 0.9;
export const COURT_HEIGHT = (COURT_WIDTH * 50) / 94; // 50x94 ft
export const COURT_ORIGIN_X = (width - COURT_WIDTH) / 2;
export const COURT_ORIGIN_Y = 80;

// Convert feet to pixels
export const ftToPx = (ft) => (ft / 94) * COURT_WIDTH;

// Court zones
export const HALF_COURT_X = COURT_WIDTH / 2;
export const BASKET_X = COURT_WIDTH;
export const BASKET_Y = COURT_HEIGHT / 2;
export const SHOT_DISTANCE_THRESHOLD = ftToPx(20); // Within 20ft
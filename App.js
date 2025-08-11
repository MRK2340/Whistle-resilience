import React, { useState, useRef } from 'react';
import { View, Text, PanResponder, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';

// Components
import Court from './src/components/Court';
import ToggleSystem from './src/components/ToggleSystem';
import ShotOverlay from './src/components/ShotOverlay';

// Utils & Constants
import { COURT_WIDTH, COURT_HEIGHT, COURT_ORIGIN_X, COURT_ORIGIN_Y, ftToPx, HALF_COURT_X, BASKET_X, BASKET_Y, SHOT_DISTANCE_THRESHOLD } from './src/utils/courtUtils';
import { LEAD, TRAIL, CENTER } from './src/constants/roles';

// Config
const REF_SIZE = 14;
const BALL_SIZE = 18;

export default function App() {
  const ballX = useSharedValue(COURT_WIDTH / 2);
  const ballY = useSharedValue(COURT_HEIGHT / 2);

  const [isThreePerson, setIsThreePerson] = useState(true);
  const [isShotMode, setIsShotMode] = useState(false);
  const [leadRole, setLeadRole] = useState(LEAD);
  const [trailRole, setTrailRole] = useState(TRAIL);
  const [centerRole, setCenterRole] = useState(CENTER);

  const lastBallX = useRef(ballX.value);

  // --- PanResponder ---
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        let x = gestureState.moveX - COURT_ORIGIN_X;
        let y = gestureState.moveY - COURT_ORIGIN_Y;

        x = Math.max(0, Math.min(x, COURT_WIDTH));
        y = Math.max(0, Math.min(y, COURT_HEIGHT));

        ballX.value = x;
        ballY.value = y;

        // Shot detection
        const dx = x - BASKET_X;
        const dy = y - BASKET_Y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < SHOT_DISTANCE_THRESHOLD && !isShotMode) {
          setIsShotMode(true);
          setTimeout(() => setIsShotMode(false), 1500);
        }

        // Rotation on fast break
        if (lastBallX.current < HALF_COURT_X && x > HALF_COURT_X + 10) {
          // Trigger rotation logic here if desired
        }
        lastBallX.current = x;
      },
    })
  ).current;

  // --- Animated Styles ---
  const getBallStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: ballX.value - BALL_SIZE / 2 }, { translateY: ballY.value - BALL_SIZE / 2 }],
  }));

  const getLeadStyle = useAnimatedStyle(() => {
    const x = isShotMode ? COURT_WIDTH - ftToPx(10) : ballX.value + ftToPx(6);
    const y = isShotMode ? BASKET_Y + ftToPx(4) : Math.max(ftToPx(10), ballY.value - ftToPx(8));
    return { transform: [{ translateX: withSpring(x - REF_SIZE / 2) }, { translateY: withSpring(y - REF_SIZE / 2) }] };
  });

  const getTrailStyle = useAnimatedStyle(() => {
    const x = isShotMode ? COURT_WIDTH - ftToPx(16) : Math.min(ftToPx(30), ballX.value - ftToPx(10));
    const y = isShotMode ? BASKET_Y + ftToPx(12) : Math.max(ftToPx(60), ballY.value + ftToPx(12));
    return { transform: [{ translateX: withSpring(x - REF_SIZE / 2) }, { translateY: withSpring(y - REF_SIZE / 2) }] };
  });

  const getCenterStyle = useAnimatedStyle(() => {
    if (!isThreePerson) return { opacity: 0 };
    const x = isShotMode ? COURT_WIDTH - ftToPx(10) : COURT_WIDTH / 2;
    const y = isShotMode ? BASKET_Y : (ballY.value + Math.max(ftToPx(60), ballY.value + ftToPx(12))) / 2;
    return {
      opacity: withSpring(1),
      transform: [{ translateX: withSpring(x - REF_SIZE / 2) }, { translateY: withSpring(y - REF_SIZE / 2) }],
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏀 RefereeCourt Pro</Text>
      <Text style={styles.subtitle}>Drag ball to train positioning</Text>

      <ToggleSystem isThreePerson={isThreePerson} onToggle={setIsThreePerson} />

      <Court>
        {/* Ball */}
        <Animated.View {...panResponder.panHandlers} style={[styles.ball, getBallStyle]}>
          <Text style={styles.ballText}>🏀</Text>
        </Animated.View>

        {/* Lead */}
        <Animated.View style={[styles.ref, styles.leadRef, getLeadStyle]}>
          <Text style={styles.refText}>L</Text>
        </Animated.View>

        {/* Trail */}
        <Animated.View style={[styles.ref, styles.trailRef, getTrailStyle]}>
          <Text style={styles.refText}>T</Text>
        </Animated.View>

        {/* Center */}
        {isThreePerson && (
          <Animated.View style={[styles.ref, styles.centerRef, getCenterStyle]}>
            <Text style={styles.refText}>C</Text>
          </Animated.View>
        )}

        {/* Shot Overlay */}
        {isShotMode && <ShotOverlay />}
      </Court>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}><View style={[styles.dot, styles.leadDot]} /><Text style={styles.legendText}>Lead</Text></View>
        <View style={styles.legendItem}><View style={[styles.dot, styles.trailDot]} /><Text style={styles.legendText}>Trail</Text></View>
        {isThreePerson && <View style={styles.legendItem}><View style={[styles.dot, styles.centerDot]} /><Text style={styles.legendText}>Center</Text></View>}
      </View>

      <Text style={styles.modeText}>Mode: <Text style={styles.bold}>{isThreePerson ? '3-Person' : '2-Person'}</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8', alignItems: 'center', paddingTop: 40 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a' },
  subtitle: { fontSize: 14, color: '#555', marginVertical: 8 },
  ball: { position: 'absolute', width: BALL_SIZE, height: BALL_SIZE, borderRadius: 9, backgroundColor: '#ff8c00', justifyContent: 'center', alignItems: 'center' },
  ballText: { fontSize: 10, color: '#fff', fontWeight: 'bold' },
  ref: { position: 'absolute', width: REF_SIZE, height: REF_SIZE, borderRadius: 7, justifyContent: 'center', alignItems: 'center' },
  refText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  leadRef: { backgroundColor: '#d32f2f' },
  trailRef: { backgroundColor: '#1976d2' },
  centerRef: { backgroundColor: '#388e3c' },
  legend: { flexDirection: 'row', gap: 15, marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  leadDot: { backgroundColor: '#d32f2f' },
  trailDot: { backgroundColor: '#1976d2' },
  centerDot: { backgroundColor: '#388e3c' },
  legendText: { fontSize: 12, color: '#333' },
  modeText: { marginTop: 10, fontSize: 14, color: '#444' },
  bold: { fontWeight: 'bold' },
});
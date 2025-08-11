// Court.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COURT_WIDTH, COURT_HEIGHT, ftToPx } from '../utils/courtUtils';

export default function Court({ children }) {
  return (
    <View style={styles.courtContainer}>
      <View style={[styles.court, { width: COURT_WIDTH, height: COURT_HEIGHT }]}>
        {/* Half Court Line */}
        <View style={styles.halfCourtLine} />
        {/* Key */}
        <View style={[styles.keyTop, { left: COURT_WIDTH - ftToPx(19), top: ftToPx(14) }]} />
        {/* 3PT Line */}
        <View style={[styles.threePointLine, { left: COURT_WIDTH - ftToPx(23), top: ftToPx(14) }]} />
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  courtContainer: {
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#0a5c0a',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  court: {
    backgroundColor: '#0a5c0a',
    position: 'relative',
  },
  halfCourtLine: {
    position: 'absolute',
    left: COURT_WIDTH / 2 - 1,
    top: 0,
    width: 2,
    height: '100%',
    backgroundColor: '#fff',
  },
  keyTop: {
    position: 'absolute',
    width: ftToPx(12),
    height: 2,
    backgroundColor: '#fff',
  },
  threePointLine: {
    position: 'absolute',
    width: ftToPx(4),
    height: ftToPx(14),
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: ftToPx(20),
  },
});
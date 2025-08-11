// ShotOverlay.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ShotOverlay() {
  return (
    <View style={styles.overlay}>
      <Text style={styles.text}>SHOT!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
});
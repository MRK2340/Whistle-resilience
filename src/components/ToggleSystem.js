// ToggleSystem.js
import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function ToggleSystem({ isThreePerson, onToggle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>2-Person</Text>
      <Switch
        value={isThreePerson}
        onValueChange={onToggle}
        thumbColor={isThreePerson ? '#fff' : '#ccc'}
        trackColor={{ false: '#555', true: '#388e3c' }}
      />
      <Text style={styles.label}>3-Person</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: {
    fontSize: 14,
    marginHorizontal: 8,
    color: '#333',
    fontWeight: '600',
  },
});
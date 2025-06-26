import React, { useState, useRef } from 'react';
import { Pressable, Text, StyleSheet, Animated } from 'react-native';
// import { useHaptic } from '../hooks/useHaptic';

interface ButtonProps {
  title: string;
  onPress: () => void;
  small: boolean;
}


const Button: React.FC<ButtonProps> = ({ title, onPress, small = false }) => {

  const scaleAnim = useRef(new Animated.Value(1)).current;
  // const hapticSelection = useHaptic();
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
    // hapticSelection()
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable onPress={onPress} style={{
      backgroundColor: '#FFA500',
      borderWidth: 0,
      paddingVertical: small ? 8 : 16,
      paddingHorizontal: small ? 16 : 24,
      borderRadius: 32,
    }} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Text style={[styles.text, {
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: small ? 14 : 18,
        }]}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    textAlign: 'center',
  },
});

export default Button;
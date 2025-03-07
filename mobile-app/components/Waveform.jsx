// AudioWave.jsx
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

export default function AudioWave({ isPlaying, color = '#1C3546' }) {
  const barCount = 12;
  const bars = Array.from({ length: barCount }).map(() => useSharedValue(1));


  useEffect(() => {
    bars.forEach((bar) => {
      if (isPlaying) {
        const randomScale = () => 0.25 + Math.random() * 1.8;

        bar.value = withRepeat(
          withSequence(
            withTiming(randomScale(), { duration: 300, easing: Easing.linear }),
            withTiming(randomScale(), { duration: 300, easing: Easing.linear })
          ),
          -1, // infinite
          true // reverse
        );
      } else {
        // back neutral scale 1
        bar.value = withTiming(1, { duration: 500 });
      }
    });
  }, [isPlaying]);

  return (
    <View style={styles.container}>
      {bars.map((barScale, i) => {
        const animatedStyle = useAnimatedStyle(() => {
          return {
            transform: [{ scaleY: barScale.value }],
            backgroundColor: color,
          };
        });
        return <Animated.View key={i} style={[styles.bar, animatedStyle]} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center', // center vertically
    justifyContent: 'center',
    marginTop: 10,
  },
  bar: {
    width: 4,
    height: 15, // baseline height
    marginHorizontal: 3,
    borderRadius: 2,
  },
});

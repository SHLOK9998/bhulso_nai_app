import React, { useRef } from 'react';
import { View, PanResponder, StyleSheet } from 'react-native';
import { router } from 'expo-router';

const TABS = ['dashboard', 'medicines', 'log', 'family', 'settings'];

interface SwipeLayoutProps {
  currentTab: string;
  children: React.ReactNode;
}

export function SwipeLayout({ currentTab, children }: SwipeLayoutProps) {
  const currentIndex = TABS.indexOf(currentTab);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        // Swipe detection:
        // 1. dx is significant (more than 40px)
        // 2. dy is small (less than 30px)
        // 3. dx is much larger than dy to ensure it's a clear horizontal gesture
        return Math.abs(dx) > 40 && Math.abs(dy) < 30 && Math.abs(dx) > Math.abs(dy) * 1.5;
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx } = gestureState;
        if (dx < -60) {
          // Swiped left (finger moved right-to-left) -> go to next tab
          if (currentIndex < TABS.length - 1) {
            const nextTab = TABS[currentIndex + 1];
            router.push(`/(tabs)/${nextTab}` as any);
          }
        } else if (dx > 60) {
          // Swiped right (finger moved left-to-right) -> go to previous tab
          if (currentIndex > 0) {
            const prevTab = TABS[currentIndex - 1];
            router.push(`/(tabs)/${prevTab}` as any);
          }
        }
      },
      onPanResponderTerminate: () => {},
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

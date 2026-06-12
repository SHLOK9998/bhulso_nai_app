import React, { useRef, useEffect } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';

const TABS = ['dashboard', 'medicines', 'log', 'family', 'settings'];
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Persistent in-memory cache of the last visited tab index to determine sliding direction
let lastTabIndex = 0;

interface SwipeLayoutProps {
  currentTab: string;
  children: React.ReactNode;
}

export function SwipeLayout({ currentTab, children }: SwipeLayoutProps) {
  const currentIndex = TABS.indexOf(currentTab);
  const isFocused = useIsFocused();
  
  // Calculate initial visual position based on swipe/navigation direction
  const getInitialTranslateX = () => {
    if (currentIndex > lastTabIndex) {
      return SCREEN_WIDTH; // Incoming tab slides in from the right
    } else if (currentIndex < lastTabIndex) {
      return -SCREEN_WIDTH; // Incoming tab slides in from the left
    }
    return 0; // First load / no tab change
  };

  const translateX = useRef(new Animated.Value(0)).current;

  // Run the entrance animation when the screen gains focus, and reset when it loses focus
  useEffect(() => {
    if (isFocused) {
      // Set the starting offset position depending on direction of navigation
      const startX = getInitialTranslateX();
      translateX.setValue(startX);

      // Slide the screen into its active central position
      Animated.timing(translateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Cache the active index for the next navigation transition
      lastTabIndex = currentIndex;
    } else {
      // Reset position when screen loses focus so it doesn't get stuck in a half-swiped state
      translateX.setValue(0);
    }
  }, [isFocused, currentIndex]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        // Start dragging if user moves more than 15 pixels horizontally and gesture is horizontal
        return Math.abs(dx) > 15 && Math.abs(dy) < 20 && Math.abs(dx) > Math.abs(dy) * 1.5;
      },
      onPanResponderMove: (evt, gestureState) => {
        const { dx } = gestureState;
        // Rubber-band visual limit at absolute boundary tabs
        if (currentIndex === 0 && dx > 0) {
          translateX.setValue(dx * 0.25);
        } else if (currentIndex === TABS.length - 1 && dx < 0) {
          translateX.setValue(dx * 0.25);
        } else {
          translateX.setValue(dx);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx } = gestureState;
        const threshold = SCREEN_WIDTH * 0.24; // ~24% drag threshold to trigger navigation

        if (dx < -threshold && currentIndex < TABS.length - 1) {
          // Swipe Left -> Navigate Forward to Next Tab
          const nextTab = TABS[currentIndex + 1];
          lastTabIndex = currentIndex; // Pre-cache current index before navigation
          router.navigate(`/(tabs)/${nextTab}` as any);
        } else if (dx > threshold && currentIndex > 0) {
          // Swipe Right -> Navigate Backward to Previous Tab
          const prevTab = TABS[currentIndex - 1];
          lastTabIndex = currentIndex; // Pre-cache current index before navigation
          router.navigate(`/(tabs)/${prevTab}` as any);
        } else {
          // Return to original position with a smooth spring
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            friction: 7,
            tension: 50,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          friction: 7,
          tension: 50,
        }).start();
      },
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
    })
  ).current;

  return (
    <Animated.View 
      style={[styles.container, { transform: [{ translateX }] }]} 
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});

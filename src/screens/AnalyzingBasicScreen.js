import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { analyzeBasic } from '../api/index';
import { colors, spacing, fontSize } from '../constants/theme';
import { ANALYZING_TEXTS } from '../constants/config';

const MOCK_API1 = {
  氛围感: { level: '中上' },
  视觉冲击: { level: '中' },
  钩子: '你的展示面有一种低调的质感，感觉背后还藏着东西——完整分析才知道你的人设是什么。',
};

export default function AnalyzingBasicScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [textIndex, setTextIndex] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  useEffect(() => {
    // Cycle analyzing texts every 1.2s
    const interval = setInterval(() => {
      setTextIndex(i => (i + 1) % ANALYZING_TEXTS.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (state.demoMode) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_API1', payload: MOCK_API1 });
        dispatch({ type: 'SET_SESSION', payload: 'demo-session-id' });
        navigation.replace('Basic');
      }, 1800);
      return () => clearTimeout(timer);
    } else {
      analyzeBasic(state.gender, state.images.filter(Boolean))
        .then(data => {
          dispatch({ type: 'SET_SESSION', payload: data.session_id });
          dispatch({ type: 'SET_API1', payload: data.result });
          navigation.replace('Basic');
        })
        .catch(() => {
          Alert.alert('分析失败', '请检查网络连接后重试');
          navigation.goBack();
        });
    }
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.center}>
        <Animated.Text
          style={[styles.brand, { transform: [{ scale: pulseAnim }] }]}
        >
          Magnet
        </Animated.Text>
        <Text style={styles.cycleText}>{ANALYZING_TEXTS[textIndex]}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  brand: {
    fontSize: 52,
    fontWeight: '800',
    color: colors.accent1,
    marginBottom: spacing.lg,
    letterSpacing: 2,
  },
  cycleText: {
    fontSize: fontSize.md,
    color: colors.sub,
    textAlign: 'center',
    lineHeight: 24,
  },
});

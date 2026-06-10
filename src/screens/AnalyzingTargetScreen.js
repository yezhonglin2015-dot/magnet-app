import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { analyzeTarget } from '../api/index';
import { colors, spacing, fontSize } from '../constants/theme';

const CYCLE_TEXTS = [
  '对照你想吸引的类型...',
  '分析求同求异...',
  '计算契合维度...',
  '生成专属建议...',
];

export default function AnalyzingTargetScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [textIndex, setTextIndex] = useState(0);
  const cycleRef = useRef(null);

  useEffect(() => {
    cycleRef.current = setInterval(() => {
      setTextIndex(prev => (prev + 1) % CYCLE_TEXTS.length);
    }, 900);

    analyzeTarget(state.sessionId, state.selectedTypes)
      .then(data => {
        clearInterval(cycleRef.current);
        dispatch({ type: 'SET_API3', payload: data.result });
        dispatch({ type: 'SET_PORTRAITS', payload: data.portraits });
        dispatch({ type: 'SAVE_REPORT' });
        navigation.replace('TResult');
      })
      .catch(() => {
        clearInterval(cycleRef.current);
        Alert.alert('分析失败', '请重试');
        navigation.goBack();
      });
    return () => {
      clearInterval(cycleRef.current);
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e85d8a" style={styles.spinner} />
        <Text style={styles.label}>{CYCLE_TEXTS[textIndex]}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  spinner: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.md,
    color: colors.sub,
    textAlign: 'center',
  },
});

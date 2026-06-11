import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { analyzeBase } from '../api/index';
import { colors, spacing, fontSize } from '../constants/theme';

const CYCLE_TEXTS = [
  '逐张细看你的展示面...',
  '解读7个维度...',
  '提炼它的气质调性...',
  '生成专属建议...',
];

export default function AnalyzingBaseScreen({ navigation }) {
  const { state, dispatch, refreshCredits } = useApp();
  const [textIndex, setTextIndex] = useState(0);
  const intervalRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTextIndex((i) => (i + 1) % CYCLE_TEXTS.length);
    }, 1400);

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    analyzeBase(state.sessionId, state.userId)
      .then((data) => {
        if (doneRef.current) return;
        doneRef.current = true;
        dispatch({ type: 'SET_API2', payload: data.result });
        dispatch({ type: 'SAVE_REPORT' });
        refreshCredits(); // 服务端已扣 1 次，同步真实余额
        navigation.replace('Base');
      })
      .catch(() => {
        if (doneRef.current) return;
        doneRef.current = true;
        refreshCredits(); // 服务端扣费失败会自动退回，拉真实余额
        Alert.alert('网络有点挤', '再试一次就好～放心，这次没有扣次数。');
        navigation.goBack();
      });
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.inner}>
        <Text style={styles.emoji}>✨</Text>
        <Text style={styles.cycleText}>{CYCLE_TEXTS[textIndex]}</Text>
        <Text style={styles.hint}>深度分析中，稍等片刻</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emoji: {
    fontSize: 40,
    marginBottom: spacing.lg,
  },
  cycleText: {
    fontSize: fontSize.lg,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  hint: {
    fontSize: fontSize.sm,
    color: colors.sub,
    textAlign: 'center',
  },
});

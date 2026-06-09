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
import { ANALYZING_TEXTS } from '../constants/config';

const CYCLE_TEXTS = [
  '逐张细看你的展示面...',
  '解读7个维度...',
  '提炼你的人设...',
  '生成专属建议...',
];

const MOCK_API2 = {
  人设: { name: '松弛感生活家', tagline: '你的展示面在说：好好生活比什么都强。' },
  维度: [
    { key: '①第一印象冲击力', level: '中上' },
    { key: '②氛围一致性', level: '中' },
    { key: '③内容丰富度', level: '中上' },
    { key: '④生活气息', level: '强' },
    { key: '⑤生活层次折射', level: '中' },
    { key: '⑥真实自然度', level: '强' },
    { key: '⑦亲和力', level: '中上' },
  ],
  叙事: '你的展示面透着一种不用力的从容，生活气息很真实——这本身就是一种稀缺的质感。如果说有什么可以再进一步，内容的多样性还可以展开，让别人多看到一些你生活的不同侧面。慢慢调，不急，你的展示面已经在帮你说话了。',
  加: ['可以加一些有温度的日常，旅行或者和朋友的瞬间', '试试不同场景的内容，展开生活的不同侧面'],
  减: ['可以少放纯自拍，留些空间给生活场景'],
  复测引导: '下次改版后回来，看看磁力有没有升级。',
};

export default function AnalyzingBaseScreen({ navigation }) {
  const { state, dispatch } = useApp();
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
    if (state.demoMode) {
      const t = setTimeout(() => {
        if (doneRef.current) return;
        doneRef.current = true;
        dispatch({ type: 'SET_API2', payload: MOCK_API2 });
        navigation.replace('Base');
      }, 2200);
      return () => clearTimeout(t);
    }

    analyzeBase(state.sessionId)
      .then((data) => {
        if (doneRef.current) return;
        doneRef.current = true;
        dispatch({ type: 'SET_API2', payload: data.result });
        dispatch({ type: 'SAVE_REPORT' });
        navigation.replace('Base');
      })
      .catch(() => {
        if (doneRef.current) return;
        doneRef.current = true;
        dispatch({ type: 'ADD_CREDITS', payload: 1 });
        Alert.alert('分析失败', '请重试');
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

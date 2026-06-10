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
import { ANALYZING_TEXTS } from '../constants/config';

const CYCLE_TEXTS = [
  '对照你想吸引的类型...',
  '分析求同求异...',
  '计算契合维度...',
  '生成专属建议...',
];

const MOCK_API3 = {
  契合: {
    对路: ['真实自然度很对路，不必调整', '生活气息符合这类人的核心诉求'],
    错位: ['内容层次可以再丰富一点，覆盖更多侧面'],
  },
  翻转: [
    {
      维度: '⑦亲和力',
      说明: '大基础上偏中，但你选的类型往往被适度神秘感吸引，不必刻意拉近距离',
    },
  ],
  加: ['体现品味的生活场景可以更多', '偶尔展示你的兴趣领域'],
  减: ['可以少一些纯自拍，留空间给生活内容'],
  冲突: null,
  叙事:
    '你的展示面和这类人的诉求有不少共鸣——那种真实自然的质感，正是他们在找的。稍微丰富一下内容层次，磁力还能再升级。改完后回来复测，看看效果。',
};

const MOCK_PORTRAITS = [
  {
    type: '清纯微涩',
    text: '清纯微涩的人，往往被干净、自然、有生活气息的男生吸引——但真正让她们安心的，常常是干净里那一点"靠得住"的成熟感。',
  },
];

export default function AnalyzingTargetScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [textIndex, setTextIndex] = useState(0);
  const cycleRef = useRef(null);

  useEffect(() => {
    cycleRef.current = setInterval(() => {
      setTextIndex(prev => (prev + 1) % CYCLE_TEXTS.length);
    }, 900);

    if (state.demoMode) {
      const t = setTimeout(() => {
        clearInterval(cycleRef.current);
        dispatch({ type: 'SET_API3', payload: MOCK_API3 });
        dispatch({ type: 'SET_PORTRAITS', payload: MOCK_PORTRAITS });
        navigation.replace('TResult');
      }, 1800);
      return () => {
        clearInterval(cycleRef.current);
        clearTimeout(t);
      };
    } else {
      analyzeTarget(state.sessionId, state.selectedTypes)
        .then(data => {
          clearInterval(cycleRef.current);
          dispatch({ type: 'SET_API3', payload: data.result });
          dispatch({ type: 'SET_PORTRAITS', payload: data.portraits });
          navigation.replace('TResult');
        })
        .catch(() => {
          clearInterval(cycleRef.current);
          // 若是重选（已有旧 api3），失败时退回消耗的 1 次
          if (state.api3) dispatch({ type: 'ADD_CREDITS', payload: 1 });
          Alert.alert('分析失败', '请重试');
          navigation.goBack();
        });
      return () => {
        clearInterval(cycleRef.current);
      };
    }
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

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize } from '../constants/theme';
import { PRIVACY, TERMS } from '../constants/legal';

// App 内显示隐私政策 / 服务条款（不跳浏览器）。route.params.type: 'privacy' | 'terms'
export default function LegalScreen({ navigation, route }) {
  const doc = route?.params?.type === 'terms' ? TERMS : PRIVACY;
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{doc.title}</Text>
        <Text style={styles.meta}>{doc.meta}</Text>
        {doc.sections.map((s, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.h}>{s.h}</Text>
            <Text style={styles.p}>{s.p}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  backBtn: { paddingTop: spacing.sm, paddingBottom: spacing.xs, alignSelf: 'flex-start' },
  back: { fontSize: 22, color: colors.text },
  title: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text, marginBottom: 4 },
  meta: { fontSize: fontSize.xs, color: colors.sub, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  h: { fontSize: fontSize.md, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  p: { fontSize: fontSize.sm, color: colors.sub, lineHeight: 22 },
});

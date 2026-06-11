import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { colors, grad, spacing, fontSize, radius } from '../constants/theme';
import MeEntry from '../components/MeEntry';

export default function TResultScreen({ navigation }) {
  const { state } = useApp();
  const api3 = state.api3;
  const portraits = state.portraits;
  const selectedTypes = state.selectedTypes || [];

  const duilu = api3?.契合?.对路 || [];
  const cuowei = api3?.契合?.错位 || [];
  const fanzhuan = api3?.翻转 || [];
  const jia = api3?.加 || [];
  const jian = api3?.减 || [];
  const chongtu = api3?.冲突;
  const lueshi = api3?.叙事;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <MeEntry navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Back */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        {/* Portrait section */}
        {portraits && portraits.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>想要吸引的类型</Text>
            {portraits.map((p, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.portraitType}>{p.type}</Text>
                <Text style={styles.body}>{p.text}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 契合诊断 */}
        {(duilu.length > 0 || cuowei.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>契合诊断</Text>
            <View style={styles.card}>
              {duilu.map((item, i) => (
                <View key={`d-${i}`} style={styles.listRow}>
                  <Text style={[styles.dot, { color: colors.good }]}>●</Text>
                  <Text style={[styles.listText, { color: colors.good }]}>{item}</Text>
                </View>
              ))}
              {cuowei.map((item, i) => (
                <View key={`c-${i}`} style={styles.listRow}>
                  <Text style={[styles.dot, { color: colors.accent2 }]}>●</Text>
                  <Text style={[styles.listText, { color: colors.accent2 }]}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 翻转 */}
        {fanzhuan.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>换个角度看</Text>
            {fanzhuan.map((f, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.fanName}>{f.维度}</Text>
                <Text style={styles.body}>{f.说明}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 针对加分 */}
        {jia.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.plusTitle}>✨ 多放一些</Text>
            {jia.map((item, i) => (
              <View key={i} style={styles.listItem}>
                <Text style={styles.plusBullet}>＋</Text>
                <Text style={styles.itemText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 针对先收 */}
        {jian.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.minusTitle}>🍃 少放那些</Text>
            {jian.map((item, i) => (
              <View key={i} style={styles.listItem}>
                <Text style={styles.minusBullet}>－</Text>
                <Text style={styles.itemText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 冲突 */}
        {chongtu && (
          <View style={styles.section}>
            <View style={styles.card}>
              {chongtu.点破 && (
                <Text style={[styles.body, { marginBottom: spacing.sm }]}>{chongtu.点破}</Text>
              )}
              {Array.isArray(chongtu.共同对路) && chongtu.共同对路.map((item, i) => (
                <View key={i} style={styles.listRow}>
                  <Text style={styles.dot}>✓</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
              {chongtu.互斥取舍 && (
                <Text style={[styles.body, { marginTop: spacing.sm, color: colors.sub }]}>
                  {chongtu.互斥取舍}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* 叙事 */}
        {lueshi ? (
          <View style={styles.section}>
            <View style={styles.card}>
              <Text style={styles.body}>{lueshi}</Text>
            </View>
          </View>
        ) : null}

        {/* CTA */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Share')}
          activeOpacity={0.8}
          style={styles.ctaWrapper}
        >
          <LinearGradient
            colors={grad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            <Text style={styles.btnText}>生成分享卡</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  backBtn: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    alignSelf: 'flex-start',
  },
  back: {
    fontSize: 22,
    color: colors.text,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  portraitType: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  body: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 26,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  dot: {
    fontSize: fontSize.sm,
    color: colors.text,
    marginRight: 8,
    marginTop: 2,
    lineHeight: 20,
  },
  listText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text,
    lineHeight: 20,
  },
  fanName: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  plusTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.good,
    marginBottom: spacing.md,
  },
  minusTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.bad,
    marginBottom: spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  plusBullet: {
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.good,
    marginRight: spacing.sm,
    lineHeight: 26,
  },
  minusBullet: {
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.bad,
    marginRight: spacing.sm,
    lineHeight: 26,
  },
  itemText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 26,
  },
  ctaWrapper: {
    marginTop: spacing.sm,
  },
  btn: {
    height: 54,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: fontSize.lg,
  },
});

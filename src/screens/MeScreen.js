import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { useApp } from '../context/AppContext';
import { colors, grad, spacing, fontSize, radius } from '../constants/theme';
import { PRIVACY_URL, TERMS_URL, SUPPORT_EMAIL } from '../constants/config';

export default function MeScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const report = state.savedReport;
  const personaName = report?.api2?.人设?.name || '';
  const version = Constants.expoConfig?.version || '1.0.0';

  function viewReport() {
    if (!report) return;
    dispatch({ type: 'SET_GENDER', payload: report.gender });
    dispatch({ type: 'SET_API2', payload: report.api2 });
    if (report.api3) {
      dispatch({ type: 'SET_API3', payload: report.api3 });
      dispatch({ type: 'SET_PORTRAITS', payload: report.portraits });
      dispatch({ type: 'SET_TYPES', payload: report.selectedTypes });
    }
    navigation.navigate('Base');
  }

  function openUrl(url) {
    Linking.openURL(url).catch(() =>
      Alert.alert('打开失败', '请稍后重试')
    );
  }

  function contact() {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() =>
      Alert.alert('联系我们', SUPPORT_EMAIL)
    );
  }

  function restore() {
    Alert.alert(
      '恢复购买',
      `正式上线后将支持 Apple 购买记录恢复。如有疑问请联系 ${SUPPORT_EMAIL}`
    );
  }

  function clearData() {
    Alert.alert(
      '清除数据',
      '将清除本地保存的报告记录。\n已购买的次数绑定在服务端，不受影响。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '清除',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'CLEAR_SAVED_REPORT' });
            Alert.alert('已清除', '本地报告记录已清空。');
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Back */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>我的</Text>

        {/* 额度 */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>剩余额度</Text>
          <Text style={styles.creditsNum}>{state.credits} 次</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Paywall', { topup: true })}
            style={styles.buyWrapper}
          >
            <LinearGradient
              colors={grad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buyBtn}
            >
              <Text style={styles.buyText}>购买更多</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* 最近报告 */}
        <Text style={styles.groupTitle}>最近报告</Text>
        {report ? (
          <TouchableOpacity activeOpacity={0.85} onPress={viewReport} style={styles.reportCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.reportName}>{personaName || '我的展示面报告'}</Text>
              <Text style={styles.reportSub}>点击查看完整分析</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>还没有报告，去测一次吧</Text>
          </View>
        )}

        {/* 设置/法律 */}
        <Text style={styles.groupTitle}>关于</Text>
        <View style={styles.listCard}>
          <Row label="恢复购买" onPress={restore} />
          <Divider />
          <Row label="联系我们" onPress={contact} />
          <Divider />
          <Row label="隐私政策" onPress={() => openUrl(PRIVACY_URL)} />
          <Divider />
          <Row label="服务条款" onPress={() => openUrl(TERMS_URL)} />
          <Divider />
          <Row label="清除数据" danger onPress={clearData} />
        </View>

        <Text style={styles.version}>Magnet v{version}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, onPress, danger }) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.row}>
      <Text style={[styles.rowLabel, danger && styles.rowDanger]}>{label}</Text>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  backBtn: { paddingTop: spacing.sm, paddingBottom: spacing.xs, alignSelf: 'flex-start' },
  back: { fontSize: 22, color: colors.text },
  pageTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardLabel: { fontSize: fontSize.sm, color: colors.sub },
  creditsNum: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.accent1,
    marginTop: 4,
    marginBottom: spacing.md,
  },
  buyWrapper: {},
  buyBtn: {
    height: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyText: { color: '#fff', fontWeight: '700', fontSize: fontSize.md },
  groupTitle: {
    fontSize: fontSize.sm,
    color: colors.sub,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  reportName: { fontSize: fontSize.md, fontWeight: '700', color: colors.text },
  reportSub: { fontSize: fontSize.xs, color: colors.sub, marginTop: 2 },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  emptyText: { fontSize: fontSize.sm, color: colors.sub },
  listCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  rowLabel: { fontSize: fontSize.md, color: colors.text },
  rowDanger: { color: colors.bad },
  chevron: { fontSize: 22, color: colors.sub },
  divider: { height: 1, backgroundColor: colors.border },
  version: {
    fontSize: fontSize.xs,
    color: colors.sub,
    opacity: 0.5,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

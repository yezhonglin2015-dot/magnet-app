import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { PLANS } from '../constants/config';
import { colors, grad, spacing, fontSize, radius } from '../constants/theme';

export default function PaywallScreen({ navigation, route }) {
  const { state, buy } = useApp();
  const [selectedPlan, setSelectedPlan] = useState(1);
  const [buying, setBuying] = useState(false);

  const topup = route?.params?.topup; // 从「我的」进来=纯充值，只买不触发分析
  const hasCredits = state.credits > 0;
  const navigatingRef = useRef(false);

  // 返回本屏（含分析失败 goBack）时解锁，避免按钮卡死
  useFocusEffect(
    React.useCallback(() => {
      navigatingRef.current = false;
      setBuying(false);
    }, [])
  );

  const handlePress = async () => {
    // 纯充值（从「我的」进来，没有待分析的 session）：只购买，买完回上一页，绝不触发分析
    if (topup) {
      if (buying) return;
      setBuying(true);
      try {
        await buy(PLANS[selectedPlan].sku);
        navigation.goBack();
      } catch (e) {
        Alert.alert('购买未完成', e.message || '请重试');
      } finally {
        setBuying(false);
      }
      return;
    }
    // 解锁分析模式（从初诊进来，有 session）
    if (hasCredits) {
      // 有余额：服务端扣费（analyzeBase 带 user_id）。防连点重复扣费
      if (navigatingRef.current) return;
      navigatingRef.current = true;
      navigation.navigate('AnalyzingBase');
      return;
    }
    if (buying) return;
    setBuying(true);
    try {
      await buy(PLANS[selectedPlan].sku);
      // 购买+服务端验证成功，credits 已到账
      navigation.navigate('AnalyzingBase');
    } catch (e) {
      Alert.alert('购买未完成', e.message || '请重试');
    } finally {
      setBuying(false);
    }
  };

  const buttonLabel = buying
    ? '正在购买…'
    : topup
    ? `购买 ${PLANS[selectedPlan].price}`
    : hasCredits
    ? `使用 1 次 · 解锁完整分析`
    : `购买并解锁 ${PLANS[selectedPlan].price}`;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Back arrow */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>{topup ? '购买次数' : '解锁完整分析'}</Text>

        {/* Credits info */}
        {hasCredits && (
          <View style={styles.creditsCard}>
            <Text style={styles.creditsText}>
              你还有 {state.credits} 次{topup ? '' : '，可直接使用'}
            </Text>
          </View>
        )}

        {/* Plan cards */}
        {PLANS.map((plan, i) => {
          const selected = selectedPlan === i;
          return (
            <TouchableOpacity
              key={i}
              activeOpacity={0.8}
              onPress={() => setSelectedPlan(i)}
              style={[
                styles.planCard,
                selected ? styles.planCardSelected : styles.planCardUnselected,
              ]}
            >
              <View style={styles.planLeft}>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planDesc}>{plan.note}</Text>
              </View>
              {plan.best && (
                <View style={styles.tagBadge}>
                  <Text style={styles.tagText}>最划算</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <View style={styles.spacer} />

        {/* CTA button */}
        <TouchableOpacity activeOpacity={0.85} onPress={handlePress}>
          <LinearGradient
            colors={grad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{buttonLabel}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Legal */}
        <Text style={styles.legal}>一次性购买，不自动续费 · 次数永久有效</Text>

        {/* Restore purchases */}
        <Text
          style={styles.restore}
          onPress={() =>
            Alert.alert(
              '恢复购买',
              '正式上线后将支持 Apple 购买记录恢复。如有疑问请联系 byip803@gmail.com'
            )
          }
        >
          恢复购买
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  back: {
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  backArrow: {
    fontSize: 22,
    color: colors.text,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  creditsCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.good,
  },
  creditsText: {
    fontSize: fontSize.md,
    color: colors.good,
    fontWeight: '600',
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
  },
  planCardSelected: {
    borderColor: colors.accent1,
  },
  planCardUnselected: {
    borderColor: colors.border,
  },
  planLeft: {
    flex: 1,
  },
  planPrice: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  planDesc: {
    fontSize: fontSize.sm,
    color: colors.sub,
  },
  tagBadge: {
    backgroundColor: colors.accent1,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    color: '#fff',
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  spacer: {
    height: spacing.lg,
  },
  button: {
    height: 54,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: fontSize.lg,
  },
  legal: {
    fontSize: fontSize.xs,
    color: colors.sub,
    textAlign: 'center',
  },
  restore: {
    fontSize: 12,
    color: colors.sub,
    textDecorationLine: 'underline',
    textAlign: 'center',
    paddingTop: 12,
  },
});

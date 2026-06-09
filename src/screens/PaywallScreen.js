import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { colors, grad, spacing, fontSize, radius } from '../constants/theme';

const PLANS = [
  { price: '$4.99', desc: '1 次完整分析', credits: 1, tag: null },
  { price: '$9.99', desc: '10 次 · 约 $1 / 次', credits: 10, tag: '最划算' },
  { price: '$29.99', desc: '50 次 · 约 $0.6 / 次', credits: 50, tag: null },
];

export default function PaywallScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [selectedPlan, setSelectedPlan] = useState(1);

  const hasCredits = state.credits > 0;

  const handlePress = () => {
    if (hasCredits) {
      dispatch({ type: 'USE_CREDIT' });
      navigation.navigate('AnalyzingBase');
    } else {
      dispatch({ type: 'ADD_CREDITS', payload: PLANS[selectedPlan].credits });
      dispatch({ type: 'USE_CREDIT' });
      navigation.navigate('AnalyzingBase');
    }
  };

  const buttonLabel = hasCredits
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
        <Text style={styles.title}>解锁完整分析</Text>

        {/* Credits info */}
        {hasCredits && (
          <View style={styles.creditsCard}>
            <Text style={styles.creditsText}>
              你还有 {state.credits} 次，可直接使用
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
                <Text style={styles.planDesc}>{plan.desc}</Text>
              </View>
              {plan.tag && (
                <View style={styles.tagBadge}>
                  <Text style={styles.tagText}>{plan.tag}</Text>
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
});

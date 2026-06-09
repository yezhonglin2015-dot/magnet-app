import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { colors, grad, spacing, fontSize, radius } from '../constants/theme';

export default function WelcomeScreen({ navigation }) {
  const { dispatch } = useApp();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.inner}>
        <View style={styles.centerBlock}>
          <Text style={styles.title}>Magnet</Text>
          <Text style={styles.tagline}>把展示面当作品来分析</Text>
        </View>

        <View style={styles.spacer} />

        <View style={styles.buttonBlock}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Gender')}
          >
            <LinearGradient
              colors={grad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradButton}
            >
              <Text style={styles.gradButtonText}>开始分析</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.demoButton}
            activeOpacity={0.7}
            onPress={() => {
              dispatch({ type: 'SET_DEMO', payload: true });
              navigation.navigate('Gender');
            }}
          >
            <Text style={styles.demoText}>体验 Demo 模式</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
  },
  centerBlock: {
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.hero,
    fontWeight: '800',
    color: colors.accent1,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: fontSize.md,
    color: colors.sub,
    marginTop: spacing.sm,
  },
  spacer: {
    flex: 1,
    maxHeight: 80,
  },
  buttonBlock: {
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  gradButton: {
    height: 54,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: fontSize.lg,
  },
  demoButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  demoText: {
    color: colors.sub,
    fontSize: fontSize.sm,
  },
});

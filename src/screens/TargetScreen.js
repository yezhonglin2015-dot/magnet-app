import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { colors, grad, spacing, fontSize, radius } from '../constants/theme';
import { TYPES } from '../constants/config';
import TypeCard from '../components/TypeCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.md * 2 - spacing.sm) / 2;

export default function TargetScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const gender = state.gender || 'female';
  const types = TYPES[gender] || [];

  const [localSel, setLocalSel] = useState(state.selectedTypes || []);

  function toggleType(type) {
    if (localSel.includes(type)) {
      setLocalSel(prev => prev.filter(t => t !== type));
    } else if (localSel.length >= 2) {
      Alert.alert('最多选 2 个', '别贪心，越聚焦越有力');
    } else {
      setLocalSel(prev => [...prev, type]);
    }
  }

  function handleConfirm() {
    // 已经做过一次针对分析 → 这是重选，要再消耗 1 次
    const isRedo = !!state.api3;
    if (isRedo) {
      if (state.credits <= 0) {
        Alert.alert('重新选择需要 1 次', '换一组类型会重新生成分析，消耗 1 次额度', [
          { text: '再想想', style: 'cancel' },
          { text: '去获取', onPress: () => navigation.navigate('Paywall') },
        ]);
        return;
      }
      Alert.alert('重新选择', '换一组类型会消耗 1 次额度，确定吗？', [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            dispatch({ type: 'USE_CREDIT' });
            dispatch({ type: 'SET_TYPES', payload: localSel });
            navigation.navigate('AnalyzingTarget');
          },
        },
      ]);
      return;
    }
    dispatch({ type: 'SET_TYPES', payload: localSel });
    navigation.navigate('AnalyzingTarget');
  }

  function renderItem({ item }) {
    return (
      <View style={styles.cardWrapper}>
        <TypeCard
          typeName={item}
          gender={gender}
          selected={localSel.includes(item)}
          onPress={() => toggleType(item)}
        />
      </View>
    );
  }

  const disabled = localSel.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleArea}>
        <Text style={styles.title}>想吸引的类型</Text>
        <Text style={styles.sub}>最多选 2 个 · 温馨提示：别贪心，越聚焦越有力</Text>
      </View>

      <FlatList
        data={types}
        keyExtractor={item => item}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={disabled}
          activeOpacity={0.8}
          style={{ opacity: disabled ? 0.35 : 1 }}
        >
          <LinearGradient
            colors={grad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            <Text style={styles.btnText}>看专属分析</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  back: {
    fontSize: 22,
    color: colors.text,
  },
  titleArea: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  sub: {
    fontSize: fontSize.sm,
    color: colors.sub,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
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

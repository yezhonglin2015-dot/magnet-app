import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../context/AppContext';
import SlotUpload from '../components/SlotUpload';
import { colors, grad, spacing, fontSize, radius } from '../constants/theme';

export default function UploadScreen({ navigation }) {
  const { state, dispatch } = useApp();

  const selectedCount = state.images.filter(v => v !== null).length;

  const handleSelect = async (i) => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('需要相册权限', '请在设置里允许访问相册');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      dispatch({ type: 'SET_IMAGE', index: i, payload: result.assets[0].uri });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>上传你的展示面</Text>
        <Text style={styles.sub}>1~3 张截图，越多越准</Text>

        {/* 引导：要截的是整个主页（九宫格），不是单张照片 */}
        <View style={styles.guideCard}>
          <View style={styles.gridDemo}>
            {Array.from({ length: 9 }).map((_, i) => (
              <View key={i} style={styles.gridCell} />
            ))}
          </View>
          <View style={styles.guideTextWrap}>
            <Text style={styles.guideTitle}>截「整个主页」那一屏</Text>
            <Text style={styles.guideDesc}>就是九宫格那一整页，不是单张照片。IG 主页 · 朋友圈 · 小红书都行。</Text>
          </View>
        </View>

        <View style={styles.slots}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.slotWrapper}>
              <SlotUpload
                index={i}
                uri={state.images[i]}
                onSelect={() => handleSelect(i)}
                optional={i > 0}
              />
            </View>
          ))}
        </View>

        <Text style={styles.hint}>已选 {selectedCount} 张{selectedCount === 0 ? '，至少上传 1 张' : ''}</Text>

        <TouchableOpacity
          activeOpacity={selectedCount >= 1 ? 0.8 : 1}
          onPress={selectedCount >= 1 ? () => navigation.navigate('AnalyzingBasic') : undefined}
          style={[styles.btnWrapper, selectedCount < 1 && styles.btnDisabled]}
        >
          <LinearGradient
            colors={grad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            <Text style={styles.btnText}>开始分析</Text>
          </LinearGradient>
        </TouchableOpacity>
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
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  back: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 22,
    color: colors.text,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md / 2,
  },
  sub: {
    fontSize: fontSize.sm,
    color: colors.sub,
    marginBottom: spacing.xs,
  },
  guideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  gridDemo: {
    width: 46,
    height: 46,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  gridCell: {
    width: 14,
    height: 14,
    borderRadius: 2,
    backgroundColor: colors.accent1,
    opacity: 0.55,
  },
  guideTextWrap: {
    flex: 1,
  },
  guideTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  guideDesc: {
    fontSize: fontSize.xs,
    color: colors.sub,
    lineHeight: 18,
  },
  slots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  slotWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  hint: {
    fontSize: fontSize.sm,
    color: colors.sub,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  btnWrapper: {
    marginTop: spacing.md,
  },
  btnDisabled: {
    opacity: 0.35,
  },
  btn: {
    height: 54,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: fontSize.lg,
  },
});

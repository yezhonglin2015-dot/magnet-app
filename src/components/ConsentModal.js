import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, grad, spacing, fontSize, radius } from '../constants/theme';
import { PRIVACY_URL, TERMS_URL } from '../constants/config';

export default function ConsentModal({ onAgree }) {
  return (
    <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
      <View style={styles.card}>
        <Text style={styles.title}>开始前先说一句</Text>

        <Text style={styles.body}>
          Magnet 会请你上传自己的主页截图，把它当成「作品」来分析展示面的气质和磁力，并给温柔的改造建议。
        </Text>
        <Text style={styles.body}>
          我们只看你公开展示的内容，不做人脸识别、不评长相。图片用完即删，只保留一个匿名的设备标识来记录你的次数。
        </Text>

        <View style={styles.linkRow}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => Linking.openURL(PRIVACY_URL)}>
            <Text style={styles.link}>隐私政策</Text>
          </TouchableOpacity>
          <Text style={styles.dot}>·</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => Linking.openURL(TERMS_URL)}>
            <Text style={styles.link}>服务条款</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.age}>点击「同意并继续」即表示你已满 18 岁，并同意以上内容。</Text>

        <TouchableOpacity activeOpacity={0.85} onPress={onAgree}>
          <LinearGradient
            colors={grad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>同意并继续</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  body: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 23,
    marginBottom: spacing.md,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  link: {
    fontSize: fontSize.md,
    color: colors.accent1,
    fontWeight: '600',
  },
  dot: {
    color: colors.sub,
    marginHorizontal: spacing.sm,
  },
  age: {
    fontSize: fontSize.sm,
    color: colors.sub,
    lineHeight: 19,
    marginBottom: spacing.lg,
  },
  button: {
    height: 54,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: fontSize.lg,
  },
});

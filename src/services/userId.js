// 设备级用户 ID：首次启动生成 UUID 存本地，credits 绑它。
// ⚠️ MVP 方案：重装 App 会丢。真跨设备持久要接 Sign in with Apple。
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'magnet_user_id';

function uuid() {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

let cached = null;

export async function getUserId() {
  if (cached) return cached;
  let id = await AsyncStorage.getItem(KEY);
  if (!id) {
    id = uuid();
    await AsyncStorage.setItem(KEY, id);
  }
  cached = id;
  return id;
}

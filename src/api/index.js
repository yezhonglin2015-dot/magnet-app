import { API_BASE } from '../constants/config';

export async function analyzeBasic(gender, imageUris) {
  const form = new FormData();
  form.append('gender', gender);

  // 只上传非空的图片（1~3 张）
  const slots = ['img1', 'img2', 'img3'];
  imageUris.filter(Boolean).forEach((uri, i) => {
    form.append(slots[i], {
      uri,
      name: 'img' + (i + 1) + '.jpg',
      type: 'image/jpeg',
    });
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120000);
  try {
    const res = await fetch(API_BASE + '/analyzeBasic', {
      method: 'POST',
      body: form,
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error('analyzeBasic failed: ' + res.status);
    return res.json();
  } catch (e) {
    clearTimeout(timer);
    if (e.name === 'AbortError') throw new Error('请求超时，请检查网络后重试');
    throw e;
  }
}

export async function analyzeBase(sessionId, userId) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120000);
  try {
    const res = await fetch(API_BASE + '/analyzeBase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // 带 user_id 服务端原子扣 1 次；不带=demo 免费
      body: JSON.stringify({ session_id: sessionId, user_id: userId }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error('analyzeBase failed: ' + res.status);
    return res.json();
  } catch (e) {
    clearTimeout(timer);
    if (e.name === 'AbortError') throw new Error('请求超时，请检查网络后重试');
    throw e;
  }
}

// 购买后验收据，服务端验证并发次数，返回 { credits, added }
export async function verifyPurchase(userId, receipt) {
  const res = await fetch(API_BASE + '/verifyPurchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, receipt }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || '购买验证失败 (' + res.status + ')');
  return data;
}

// 查服务端余额
export async function fetchCredits(userId) {
  const res = await fetch(API_BASE + '/getCredits?user_id=' + encodeURIComponent(userId));
  if (!res.ok) throw new Error('getCredits failed: ' + res.status);
  const data = await res.json();
  return data.credits ?? 0;
}

export async function analyzeTarget(sessionId, types) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120000);
  try {
    const res = await fetch(API_BASE + '/analyzeTarget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, types }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error('analyzeTarget failed: ' + res.status);
    return res.json();
  } catch (e) {
    clearTimeout(timer);
    if (e.name === 'AbortError') throw new Error('请求超时，请检查网络后重试');
    throw e;
  }
}

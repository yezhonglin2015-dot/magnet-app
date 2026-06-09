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
  const timer = setTimeout(() => controller.abort(), 60000);
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

export async function analyzeBase(sessionId) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);
  try {
    const res = await fetch(API_BASE + '/analyzeBase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
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

export async function analyzeTarget(sessionId, types) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);
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

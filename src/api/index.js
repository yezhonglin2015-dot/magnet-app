import { API_BASE } from '../constants/config';

export async function analyzeBasic(gender, imageUris) {
  const form = new FormData();
  form.append('gender', gender);

  const slots = ['img1', 'img2', 'img3'];
  for (let i = 0; i < 3; i++) {
    form.append(slots[i], {
      uri: imageUris[i],
      name: 'img' + (i + 1) + '.jpg',
      type: 'image/jpeg',
    });
  }

  const res = await fetch(API_BASE + '/api/analyze/basic', {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    throw new Error('analyzeBasic failed: ' + res.status);
  }

  return res.json();
}

export async function analyzeBase(sessionId) {
  const res = await fetch(API_BASE + '/api/analyze/base', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId }),
  });

  if (!res.ok) {
    throw new Error('analyzeBase failed: ' + res.status);
  }

  return res.json();
}

export async function analyzeTarget(sessionId, types) {
  const res = await fetch(API_BASE + '/api/analyze/target', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, types }),
  });

  if (!res.ok) {
    throw new Error('analyzeTarget failed: ' + res.status);
  }

  return res.json();
}

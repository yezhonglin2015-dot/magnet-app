export const API_BASE = 'https://us-central1-magnet-app-df7af.cloudfunctions.net';

export const PRIVACY_URL = 'https://yezhonglin2015-dot.github.io/magnet-app/privacy.html';
export const TERMS_URL = 'https://yezhonglin2015-dot.github.io/magnet-app/terms.html';
export const SUPPORT_EMAIL = 'byip803@gmail.com';

// App Store Connect 里建好的 3 个 Consumable（ID 占位符已拍板不重建）
export const PRODUCT_IDS = {
  credits1: 'com.yourapp.magnet.credits1',
  credits10: 'com.yourapp.magnet.credits10',
  credits50: 'com.yourapp.magnet.credits50',
};

export const PLANS = [
  { sku: PRODUCT_IDS.credits1, credits: 1, price: '$4.99', note: '1 次完整分析' },
  { sku: PRODUCT_IDS.credits10, credits: 10, price: '$9.99', note: '10 次 · 约 $1 / 次', best: true },
  { sku: PRODUCT_IDS.credits50, credits: 50, price: '$29.99', note: '50 次 · 约 $0.6 / 次' },
];

export const LEVEL_W = {
  '强': 0.8,
  '中上': 0.65,
  '中': 0.5,
  '偏弱': 0.35,
  '弱': 0.2,
};

export const TYPES = {
  female: ['清纯微涩', '活力洋溢', '成熟知性', '性感妩媚', '精致贵感', '艺术派', '运动派'],
  male: ['活力少年', '坏感痞帅', '高冷禁欲', '成熟智感', '温柔暖感', '艺术派', '运动派'],
};

export const TYPE_IMAGES = {
  female: {
    '清纯微涩': require('../../assets/types/f_qingchun.jpg'),
    '活力洋溢': require('../../assets/types/f_huoli.jpg'),
    '成熟知性': require('../../assets/types/f_zhixing.jpg'),
    '性感妩媚': require('../../assets/types/f_meimei.jpg'),
    '精致贵感': require('../../assets/types/f_guigan.jpg'),
    '艺术派': require('../../assets/types/f_yishu.jpg'),
    '运动派': require('../../assets/types/f_yundong.jpg'),
  },
  male: {
    '活力少年': require('../../assets/types/m_shaonian.jpg'),
    '坏感痞帅': require('../../assets/types/m_paishuai.jpg'),
    '高冷禁欲': require('../../assets/types/m_jinyu.jpg'),
    '成熟智感': require('../../assets/types/m_zhigan.jpg'),
    '温柔暖感': require('../../assets/types/m_nuanwan.jpg'),
    '艺术派': require('../../assets/types/m_yishu.jpg'),
    '运动派': require('../../assets/types/m_yundong.jpg'),
  },
};

export const ANALYZING_TEXTS = [
  '正在解读你的展示面...',
  '读懂它的气质调性...',
  '评估磁力维度...',
  '整理建议中...',
];

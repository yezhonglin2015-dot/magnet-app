export const API_BASE = 'https://us-central1-magnet-app-df7af.cloudfunctions.net';

export const PRIVACY_URL = 'https://yezhonglin2015-dot.github.io/magnet-app/privacy.html';
export const TERMS_URL = 'https://yezhonglin2015-dot.github.io/magnet-app/terms.html';
export const SUPPORT_EMAIL = 'yezhonglin2015@gmail.com';

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

// StoreKit 购买流程（react-native-iap v12 · 老架构稳定版）。
// 流程：buyCredits(sku) → Apple 弹窗付款 → purchaseUpdatedListener 回调
//   → purchase.transactionReceipt 拿 base64 收据 → 后端 verifyPurchase 发次数 → finishTransaction。
// 收据验证在服务端做（Apple legacy verifyReceipt），前端不自己加余额。
import {
  initConnection,
  endConnection,
  getProducts,
  requestPurchase,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
} from 'react-native-iap';
import { verifyPurchase } from '../api';
import { PLANS } from '../constants/config';

let connected = false;
let updateSub = null;
let errorSub = null;

// onCredits(newBalance, added) — 验证成功后回调最新余额
// onError(message) — 购买失败（用户取消不回调）
export async function initIAP(userId, onCredits, onError) {
  if (connected) return;
  try {
    await initConnection();
    connected = true;
  } catch (e) {
    onError?.('无法连接 App Store');
    return;
  }

  updateSub = purchaseUpdatedListener(async (purchase) => {
    try {
      const receipt = purchase.transactionReceipt;
      if (!receipt) throw new Error('拿不到购买凭证');
      const r = await verifyPurchase(userId, receipt);
      await finishTransaction({ purchase, isConsumable: true });
      onCredits?.(r.credits, r.added);
    } catch (e) {
      // 验证失败不 finishTransaction，未完成交易会在下次启动重放，可重试
      onError?.(e.message || '购买验证失败，请重启 App 重试');
    }
  });

  errorSub = purchaseErrorListener((e) => {
    if (e.code === 'E_USER_CANCELLED') return;
    onError?.(e.message || '购买失败，请重试');
  });

  // 预拉商品（Apple 要求先拉到商品才能买）
  try {
    await getProducts({ skus: PLANS.map((p) => p.sku) });
  } catch (e) {
    // 拉不到不阻塞，买时再报
  }
}

export async function buyCredits(sku) {
  await requestPurchase({ sku });
  // 结果走 purchaseUpdatedListener，这里不返回
}

export function teardownIAP() {
  updateSub?.remove();
  errorSub?.remove();
  updateSub = errorSub = null;
  if (connected) {
    endConnection();
    connected = false;
  }
}

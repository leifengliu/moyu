const api = require('../../utils/api');

Page({
  data: {
    coupons: [],
    activeTab: 'UNUSED'
  },

  onLoad() { this.loadCoupons(); },
  onShow() { this.loadCoupons(); },

  async loadCoupons() {
    const app = getApp();
    if (!app.globalData.token) return;
    try {
      const res = await api.get('/api/v1/coupon/list', { status: 'all' });
      this.setData({ coupons: (res.data || []).map(c => ({
        ...c,
        isUsed: c.status === 'USED',
        isExpired: c.status === 'EXPIRED'
      })) });
    } catch (e) {
      this.setData({ coupons: [
        { id:1, name:'新用户专享', discountValue:10, type:'FIXED', minAmount:0, status:'UNUSED', expireTime:'2026-06-30' },
        { id:2, name:'咖啡券', discountValue:5, type:'FIXED', minAmount:0, status:'UNUSED', expireTime:'2026-07-15' },
        { id:3, name:'生日礼券', discountValue:20, type:'FIXED', minAmount:50, status:'USED', expireTime:'2026-05-01' },
      ]});
    }
  },

  onGoBack() { wx.navigateBack(); }
});

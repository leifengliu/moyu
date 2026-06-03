const api = require('../../utils/api');

Page({
  data: {
    balance: 0,
    totalEarned: 0,
    products: [],
    records: []
  },

  onLoad() {
    this.loadData();
  },

  async loadData() {
    try {
      const [infoRes, prodRes, recRes] = await Promise.all([
        api.get('/api/v1/points/info'),
        api.get('/api/v1/points/products'),
        api.get('/api/v1/points/records', { page: 1, size: 10 })
      ]);

      const info = infoRes.data || {};
      this.setData({
        balance: info.balance || 0,
        totalEarned: info.totalEarned || 0,
        products: prodRes.data || [],
        records: recRes.data.records || []
      });
    } catch (e) {
      console.error(e);
    }
  },

  async onRedeem(e) {
    const productId = e.currentTarget.dataset.id;
    try {
      await api.post(`/api/v1/points/redeem/${productId}`);
      wx.showToast({ title: '兑换成功', icon: 'success' });
      this.loadData();
    } catch (e) {
      wx.showToast({ title: '兑换失败', icon: 'none' });
    }
  },

  onGoBack() {
    wx.navigateBack();
  }
});

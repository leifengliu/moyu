const api = require('../../utils/api');

Page({
  data: {
    balance: '0.00',
    totalRecharge: '0.00',
    packages: [],
    transactions: []
  },

  onLoad() {
    this.loadData();
  },

  async loadData() {
    try {
      const [infoRes, pkgRes, txRes] = await Promise.all([
        api.get('/api/v1/wallet/info'),
        api.get('/api/v1/wallet/packages'),
        api.get('/api/v1/wallet/transactions', { page: 1, size: 10 })
      ]);

      const info = infoRes.data || {};
      this.setData({
        balance: (info.balance || 0).toFixed(2),
        totalRecharge: (info.totalRecharge || 0).toFixed(2),
        packages: pkgRes.data || [],
        transactions: txRes.data.records || []
      });
    } catch (e) {
      console.error(e);
    }
  },

  async onRecharge(e) {
    const packageId = e.currentTarget.dataset.id;
    try {
      await api.post('/api/v1/wallet/recharge', { packageId });
      wx.showToast({ title: '充值成功', icon: 'success' });
      this.loadData();
    } catch (e) {
      wx.showToast({ title: '充值失败', icon: 'none' });
    }
  },

  onGoBack() {
    wx.navigateBack();
  }
});

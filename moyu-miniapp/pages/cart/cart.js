const api = require('../../utils/api');

Page({
  data: {
    items: [],
    totalAmount: '0.00',
    totalItems: 0,
    isEmpty: true
  },

  onShow() {
    this.loadCart();
  },

  async loadCart() {
    const app = getApp();
    if (!app.globalData.token) {
      this.setData({ isEmpty: true, items: [], totalAmount: '0.00', totalItems: 0 });
      return;
    }
    try {
      const res = await api.get('/api/v1/cart/list');
      const all = (res.data && res.data.items) || [];
      const checked = all.filter(i => i.checked);
      const totalAmount = checked.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2);
      const totalItems = checked.reduce((s, i) => s + i.quantity, 0);
      this.setData({
        items: checked,
        totalAmount,
        totalItems,
        isEmpty: checked.length === 0
      });
    } catch (e) {
      console.error(e);
    }
  },

  async onCheckToggle(e) {
    const id = e.currentTarget.dataset.id;
    await api.put(`/api/v1/cart/${id}/check`);
    this.loadCart();
  },

  async onMinus(e) {
    const item = e.currentTarget.dataset.item;
    if (item.quantity <= 1) return;
    await api.put(`/api/v1/cart/${item.id}/quantity`, { quantity: item.quantity - 1 });
    this.loadCart();
  },

  async onPlus(e) {
    const item = e.currentTarget.dataset.item;
    await api.put(`/api/v1/cart/${item.id}/quantity`, { quantity: item.quantity + 1 });
    this.loadCart();
  },

  async onRemove(e) {
    const id = e.currentTarget.dataset.id;
    await api.del(`/api/v1/cart/${id}`);
    this.loadCart();
  },

  async onCheckout() {
    const app = getApp();
    if (!app.checkLogin()) return;
    try {
      const res = await api.post('/api/v1/order/submit', {
        payType: 'WALLET',
        remark: ''
      });
      const orderId = res.data.id;
      wx.redirectTo({ url: `/pages/order-detail/order-detail?id=${orderId}` });
    } catch (e) {
      wx.showToast({ title: '下单失败', icon: 'none' });
    }
  },

  onGoMenu() {
    wx.switchTab({ url: '/pages/menu/menu' });
  },

  onGoBack() {
    wx.navigateBack();
  }
});

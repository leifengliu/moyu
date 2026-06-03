const api = require('../../utils/api');

Page({
  data: {
    activeTab: 'all',
    tabs: [
      { id: 'all', name: '全部' },
      { id: 'pending', name: '待付款' },
      { id: 'ready', name: '待取餐' },
      { id: 'completed', name: '已完成' },
      { id: 'refund', name: '售后' }
    ],
    orders: [],
    _anim: true,
    statusMap: {
      pending: '待付款', paid: '已支付', preparing: '制作中',
      ready: '待取餐', completed: '已完成', cancelled: '已取消',
      refunding: '退款中', refunded: '已退款'
    }
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
    this.loadOrders();
    this._replayAnim();
  },

  _replayAnim() {
    this.setData({ _anim: false });
    setTimeout(() => this.setData({ _anim: true }), 60);
  },

  async loadOrders() {
    const app = getApp();
    if (!app.globalData.token) {
      this.setData({ orders: [] });
      return;
    }
    const { activeTab } = this.data;
    let status = activeTab;
    if (status === 'refund') status = 'refunded';
    try {
      const res = await api.get('/api/v1/order/list', { page: 1, size: 50, status });
      this.setData({ orders: res.data.records || [] });
    } catch (e) {
      console.error(e);
    }
  },

  onTabTap(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ activeTab: id }, () => this.loadOrders());
  },

  onOrderTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/order-detail/order-detail?id=${id}` });
  },

  async onReorder(e) {
    const id = e.currentTarget.dataset.id;
    try {
      const res = await api.post(`/api/v1/order/${id}/reorder`);
      wx.showToast({ title: '已加入下单', icon: 'success' });
    } catch (e) {
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  }
});

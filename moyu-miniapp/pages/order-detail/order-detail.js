const api = require('../../utils/api');

Page({
  data: {
    order: {},
    statusConfig: {},
    statusMap: {
      pending: '待付款', paid: '已支付', preparing: '制作中',
      ready: '待取餐', completed: '已完成', cancelled: '已取消',
      refunding: '退款中', refunded: '已退款'
    },
    timeline: []
  },

  onLoad(options) {
    this.loadOrder(options.id);
  },

  async loadOrder(id) {
    try {
      const res = await api.get(`/api/v1/order/${id}`);
      const order = res.data;
      const status = order.status;
      const statusConfig = {
        pending: { text: '待付款', color: '#C9A961', bg: '#F8F6F3', action: '立即支付' },
        paid: { text: '已支付', color: '#C9A961', bg: '#F8F6F3', action: null },
        preparing: { text: '制作中', color: '#C9A961', bg: '#F8F6F3', action: null },
        ready: { text: '待取餐', color: '#C9A961', bg: '#F8F6F3', action: '查看取餐码' },
        completed: { text: '已完成', color: '#1A1A1A', bg: '#E8DED3', action: null }
      };

      const timeline = this.buildTimeline(order);
      this.setData({ order, statusConfig: statusConfig[status] || statusConfig.pending, timeline });
    } catch (e) {
      console.error(e);
    }
  },

  buildTimeline(order) {
    const status = order.status;
    const steps = [
      { label: '订单创建', time: order.createTime || '', active: true },
      { label: '支付成功', time: status !== 'pending' ? order.createTime || '' : '', active: status !== 'pending' },
      { label: '开始制作', time: '', active: status === 'preparing' || status === 'ready' || status === 'completed' },
      { label: '制作完成', time: '', active: status === 'ready' || status === 'completed' },
      { label: '已取餐', time: '', active: status === 'completed' }
    ];
    return steps;
  },

  async onPay() {
    try {
      await api.post(`/api/v1/order/${this.data.order.id}/pay`);
      wx.showToast({ title: '支付成功', icon: 'success' });
      this.loadOrder(this.data.order.id);
    } catch (e) {
      wx.showToast({ title: '支付失败', icon: 'none' });
    }
  },

  async onCancel() {
    try {
      await api.post(`/api/v1/order/${this.data.order.id}/cancel`);
      wx.showToast({ title: '已取消', icon: 'success' });
      this.loadOrder(this.data.order.id);
    } catch (e) {
      wx.showToast({ title: '取消失败', icon: 'none' });
    }
  },

  onGoBack() {
    wx.navigateBack();
  }
});

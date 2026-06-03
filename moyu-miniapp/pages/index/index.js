const api = require('../../utils/api');

Page({
  data: {
    products: [],
    banner: { title: '新会员专享', desc: '注册即送拿铁券', tag: 'EXCLUSIVE OFFER' },
    _anim: true
  },

  onLoad() { this.loadProducts(); },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
    this._replayAnim();
  },

  _replayAnim() {
    this.setData({ _anim: false });
    setTimeout(() => this.setData({ _anim: true }), 60);
  },

  async loadProducts() {
    try {
      const res = await api.get('/api/v1/product/list', { page: 1, size: 10 }, false);
      this.setData({ products: res.data.records || [] });
    } catch (e) { console.error(e); }
  },

  onQuickMenu() { wx.switchTab({ url: '/pages/menu/menu' }); },
  onQuickShop() { wx.switchTab({ url: '/pages/shop/shop' }); },

  onSearchTap() { wx.switchTab({ url: '/pages/menu/menu' }); },

  onProductTap(e) {
    wx.navigateTo({ url: '/pages/product/product?id=' + e.currentTarget.dataset.id });
  }
});

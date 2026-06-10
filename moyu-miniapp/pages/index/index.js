const api = require('../../utils/api');

Page({
  data: {
    banners: [],
    drinks: [],
    merch: [],
    _anim: true
  },

  onLoad() { this.loadHomeData(); },

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

  async loadHomeData() {
    try {
      const res = await api.get('/api/v1/product/home', {}, false);
      if (res.code === 200) {
        const data = res.data;
        const banners = (data.banners || []).map(b => ({
          ...b,
          imageUrl: b.imageUrl && !b.imageUrl.startsWith('http') ? getApp().globalData.baseUrl + b.imageUrl : b.imageUrl
        }));
        const drinks = (data.recommend.drinks || []).map(p => ({
          ...p, imageUrl: p.imageUrl || '/images/drink.png'
        }));
        const merch = (data.recommend.merch || []).map(p => ({
          ...p, imageUrl: p.imageUrl || '/images/clothes-test.png'
        }));
        this.setData({ banners, drinks, merch });
      }
    } catch (e) { console.error(e); }
  },

  onQuickMenu() { wx.switchTab({ url: '/pages/menu/menu' }); },
  onQuickShop() { wx.switchTab({ url: '/pages/shop/shop' }); },

  onSearchTap() { wx.switchTab({ url: '/pages/menu/menu' }); },

  onProductTap(e) {
    wx.navigateTo({ url: '/pages/product/product?id=' + e.currentTarget.dataset.id });
  }
});

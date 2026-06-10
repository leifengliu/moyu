const api = require('../../utils/api');

Page({
  data: {
    products: [],
    cartCount: 0,
    isMember: false,
    keyword: '',
    statusBarHeight: 44,
    capsuleTopGap: 8,
    capsuleHeight: 32,
    capsuleRightOffset: 190,
    _anim: true
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
    this.loadCartCount();
    this.loadProducts();
    this._replayAnim();
  },

  _replayAnim() {
    this.setData({ _anim: false });
    setTimeout(() => this.setData({ _anim: true }), 60);
  },

  onLoad() {
    var sysInfo = wx.getSystemInfoSync();
    var capsule = wx.getMenuButtonBoundingClientRect();
    this.setData({
      statusBarHeight: sysInfo.statusBarHeight,
      capsuleTopGap: capsule.top - sysInfo.statusBarHeight,
      capsuleHeight: capsule.height,
      capsuleRightOffset: sysInfo.windowWidth - capsule.left + 16
    });
    this.loadProducts();
  },

  async loadCartCount() {
    const app = getApp();
    if (!app.globalData.token) return;
    try {
      const res = await api.get('/api/v1/cart/list');
      const items = (res.data && res.data.items) || [];
      const count = items.filter(i => i.checked).reduce((s, i) => s + i.quantity, 0);
      this.setData({ cartCount: count });
    } catch (e) {}
  },

  async loadProducts() {
    try {
      // 加载周边分类商品 (categoryId=7)
      const res = await api.get('/api/v1/product/list', { page: 1, size: 50, categoryId: 7 }, false);
      const products = (res.data.records || []).map(p => ({
        ...p, memberPrice: Math.round(p.basePrice * 0.9),
        imageUrl: p.imageUrl || '/images/clothes-test.png'
      }));
      this.setData({ products: products.length > 0 ? products : [
        { id: 30, name: '咖啡豆', description: '精选阿拉比卡咖啡豆', basePrice: 88, memberPrice: 79, imageUrl: '/images/clothes-test.png', categoryId: 7 },
        { id: 31, name: '品牌T恤', description: '100%纯棉，经典Logo', basePrice: 199, memberPrice: 179, imageUrl: '/images/clothes-test.png', categoryId: 7 },
        { id: 32, name: '帆布袋', description: '环保耐用，时尚百搭', basePrice: 59, memberPrice: 49, imageUrl: '/images/clothes-test.png', categoryId: 7 },
        { id: 33, name: '帽子', description: '棒球帽，刺绣Logo', basePrice: 89, memberPrice: 79, imageUrl: '/images/clothes-test.png', categoryId: 7 },
      ]});
    } catch (e) {
      this.setData({ products: [] });
    }
  },

  async onAddToCart(e) {
    const app = getApp();
    if (!app.checkLogin()) return;
    const item = e.currentTarget.dataset.item;
    // 服饰类商品不需要 size/temp/sugar
    const isCloth = item.categoryId === 7 || (item.categoryId === undefined && item.basePrice >= 50);
    try {
      await api.post('/api/v1/cart/add', {
        productId: item.id, quantity: 1,
        size: isCloth ? '均码' : '中杯',
        temp: isCloth ? '' : '热饮',
        sugar: isCloth ? '' : '标准糖'
      });
      wx.showToast({ title: '已加入购物车', icon: 'success' });
      this.loadCartCount();
    } catch (e) {
      wx.showToast({ title: '添加失败', icon: 'none' });
    }
  },

  onProductTap(e) {
    var id = e.currentTarget.dataset.id;
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({ url: '/pages/product/product?id=' + id + '&img=' + encodeURIComponent(item.imageUrl || '/images/clothes.png') + '&name=' + encodeURIComponent(item.name) + '&price=' + item.basePrice });
  },

  onCartTap() {
    wx.navigateTo({ url: '/pages/cart/cart' });
  }
});

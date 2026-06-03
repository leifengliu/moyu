const api = require('../../utils/api');

Page({
  data: {
    categories: [],
    activeCategory: 'coffee',
    products: [],
    cartCount: 0,
    keyword: '',
    isMember: false,
    _anim: true
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
    this.loadCartCount();
    this._replayAnim();
  },

  _replayAnim() {
    this.setData({ _anim: false });
    setTimeout(() => this.setData({ _anim: true }), 60);
  },

  onLoad() {
    this.loadCategories();
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

  async loadCategories() {
    const res = await api.get('/api/v1/product/categories', {}, false);
    let cats = res.data || [];
    if (cats.length === 0) {
      cats = [
        { id: 1, code: 'coffee', name: '咖啡' },
        { id: 2, code: 'special', name: '特调' },
        { id: 3, code: 'snacks', name: '小食' },
        { id: 4, code: 'drinks', name: '茶饮' },
        { id: 5, code: 'merch', name: '周边' }
      ];
    }
    this.setData({ categories: cats });
  },

  async loadProducts() {
    const { activeCategory, keyword, categories } = this.data;
    const params = { page: 1, size: 50 };
    if (activeCategory) {
      const cat = categories.find(c => c.code === activeCategory);
      if (cat) params.categoryId = cat.id;
    }
    if (keyword) params.keyword = keyword;
    try {
      const res = await api.get('/api/v1/product/list', params, false);
      this.setData({ products: (res.data.records || []).map(p => ({
        ...p, memberPrice: Math.round(p.basePrice * 0.9)
      })) });
    } catch (e) {
      this.setData({ products: [] });
    }
  },

  onCategoryTap(e) {
    const code = e.currentTarget.dataset.code;
    if (code === this.data.activeCategory) return;
    this.setData({ activeCategory: code }, () => this.loadProducts());
  },

  onSearchInput(e) { this.setData({ keyword: e.detail.value }); },
  onSearchConfirm() { this.loadProducts(); },

  async onAddToCart(e) {
    const app = getApp();
    if (!app.checkLogin()) return;
    const item = e.currentTarget.dataset.item;
    try {
      await api.post('/api/v1/cart/add', {
        productId: item.id, quantity: 1,
        size: '中杯', temp: '热饮', sugar: '标准糖'
      });
      wx.showToast({ title: '已加入购物车', icon: 'success' });
      this.loadCartCount();
    } catch (e) {
      wx.showToast({ title: '添加失败', icon: 'none' });
    }
  },

  onProductTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/product/product?id=${id}` });
  },

  onCartTap() {
    wx.navigateTo({ url: '/pages/cart/cart' });
  }
});

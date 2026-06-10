const api = require('../../utils/api');

Page({
  data: {
    groupedProducts: [],
    activeCategory: '',
    scrollToCategory: '',
    cartCount: 0,
    keyword: '',
    isMember: false,
    statusBarHeight: 44,
    capsuleTopGap: 8,
    capsuleHeight: 32,
    capsuleRightOffset: 190,
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
    var sysInfo = wx.getSystemInfoSync();
    var capsule = wx.getMenuButtonBoundingClientRect();
    this.setData({
      statusBarHeight: sysInfo.statusBarHeight,
      capsuleTopGap: capsule.top - sysInfo.statusBarHeight,
      capsuleHeight: capsule.height,
      capsuleRightOffset: sysInfo.windowWidth - capsule.left + 16
    });
    this.loadCategoriesAndProducts();
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

  async loadCategoriesAndProducts() {
    var self = this;
    // 同时加载分类和全部商品
    var [catRes, prodRes] = await Promise.all([
      api.get('/api/v1/product/categories', {}, false),
      api.get('/api/v1/product/list', { page: 1, size: 200 }, false)
    ]);

    var cats = (catRes.data && catRes.data.length) ? catRes.data : [
      { id: 1, code: 'new', name: '新品' },
      { id: 2, code: 'coffee', name: '咖啡' },
      { id: 3, code: 'caffeine-free', name: '零咖' },
      { id: 4, code: 'coconut', name: '椰子水' },
      { id: 5, code: 'sparkling', name: '气泡' },
      { id: 6, code: 'lemon-tea', name: '柠檬茶' }
    ];

    var allProducts = (prodRes.data && prodRes.data.records) ? prodRes.data.records : [];
    allProducts = allProducts.map(function(p) {
      return {
        ...p,
        memberPrice: Math.round(p.basePrice * 0.9),
        imageUrl: p.imageUrl || '/images/drink.png'
      };
    });

    // 按分类分组
    var grouped = cats.map(function(cat) {
      return {
        categoryCode: cat.code,
        categoryName: cat.name,
        products: allProducts.filter(function(p) { return p.categoryId === cat.id; })
      };
    }).filter(function(g) { return g.products.length > 0; });

    self.setData({
      groupedProducts: grouped,
      activeCategory: grouped.length ? grouped[0].categoryCode : ''
    }, function() {
      self._calcSectionTops();
    });
  },

  _calcSectionTops() {
    var self = this;
    var query = this.createSelectorQuery();
    query.selectAll('.cat-section').boundingClientRect();
    query.select('.content').boundingClientRect();
    query.exec(function(res) {
      if (!res[0] || !res[1]) return;
      var contentTop = res[1].top;
      self._sectionTops = res[0].map(function(r) { return r.top - contentTop; });
    });
  },

  onContentScroll(e) {
    if (!this._sectionTops) return;
    if (this._scrollLock) { this._scrollLock = false; return; }
    var scrollTop = e.detail.scrollTop;
    var activeCode = this.data.activeCategory;
    for (var i = this._sectionTops.length - 1; i >= 0; i--) {
      if (scrollTop >= this._sectionTops[i] - 10) {
        var code = this.data.groupedProducts[i].categoryCode;
        if (code !== activeCode) {
          this.setData({ activeCategory: code });
        }
        return;
      }
    }
  },

  onCategoryTap(e) {
    var code = e.currentTarget.dataset.code;
    if (code === this.data.activeCategory && this.data.scrollToCategory === 'cat-' + code) return;
    this._scrollLock = true;
    this.setData({
      activeCategory: code,
      scrollToCategory: 'cat-' + code
    });
  },

  onSearchInput(e) { this.setData({ keyword: e.detail.value }); },
  onSearchConfirm() { this.loadCategoriesAndProducts(); },

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
    wx.navigateTo({ url: '/pages/product/product?id=' + id });
  },

  onCartTap() {
    wx.navigateTo({ url: '/pages/cart/cart' });
  }
});

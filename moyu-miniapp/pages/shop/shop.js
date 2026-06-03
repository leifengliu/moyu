const api = require('../../utils/api');

Page({
  data: {
    products: [],
    cartCount: 0,
    isMember: false,
    keyword: ''
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
    this.loadCartCount();
    this.loadProducts();
  },

  onLoad() { this.loadProducts(); },

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
    // 临时：使用测试图片的周边商品
    this.setData({ products: [
      { id: 101, name: '品牌T恤', description: '100%纯棉，经典Logo', basePrice: 199, memberPrice: 179, imageUrl: '/images/clothes-test.png', detailUrl: '/images/clothes-test-detail.webp' },
      { id: 102, name: '帆布袋', description: '环保耐用，时尚百搭', basePrice: 59, memberPrice: 49, imageUrl: '/images/clothes-test.png', detailUrl: '/images/clothes-test-detail.webp' },
      { id: 103, name: '帽子', description: '棒球帽，刺绣Logo', basePrice: 89, memberPrice: 79, imageUrl: '/images/clothes-test.png', detailUrl: '/images/clothes-test-detail.webp' },
      { id: 104, name: '卫衣', description: '加绒保暖，宽松版型', basePrice: 259, memberPrice: 229, imageUrl: '/images/clothes-test.png', detailUrl: '/images/clothes-test-detail.webp' }
    ] });
  },

  async onAddToCart(e) {
    const app = getApp();
    if (!app.checkLogin()) return;
    const item = e.currentTarget.dataset.item;
    try {
      await api.post('/api/v1/cart/add', { productId: item.id, quantity: 1, size: '中杯', temp: '热饮', sugar: '标准糖' });
      wx.showToast({ title: '已加入购物车', icon: 'success' });
      this.loadCartCount();
    } catch (e) {
      wx.showToast({ title: '添加失败', icon: 'none' });
    }
  },

  onProductTap(e) {
    var id = e.currentTarget.dataset.id;
    var item = e.currentTarget.dataset.item;
    var img = item.detailUrl || item.imageUrl;
    wx.navigateTo({ url: '/pages/product/product?id=' + id + '&img=' + encodeURIComponent(img) + '&name=' + encodeURIComponent(item.name) + '&price=' + item.basePrice });
  },

  onCartTap() {
    wx.navigateTo({ url: '/pages/cart/cart' });
  }
});

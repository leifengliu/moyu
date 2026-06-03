const api = require('../../utils/api');

Page({
  data: {
    product: {},
    specs: [],
    selectedSize: '中杯',
    selectedTemp: '热饮',
    selectedSugar: '标准糖',
    quantity: 1,
    currentPrice: 0,
    sizes: [],
    temps: [],
    sugars: []
  },

  onLoad(options) {
    this.setData({ id: options.id });
    if (options.img) {
      // 从shop页带过来的测试商品，不调接口
      this.setData({
        product: {
          id: options.id,
          name: decodeURIComponent(options.name || ''),
          imageUrl: decodeURIComponent(options.img || ''),
          basePrice: parseFloat(options.price) || 0,
          description: ''
        },
        currentPrice: parseFloat(options.price) || 0,
        sizes: [], temps: [], sugars: []
      });
    } else {
      this.loadProduct();
    }
  },

  async loadProduct() {
    const res = await api.get(`/api/v1/product/${this.data.id}`, {}, false);
    const product = res.data;
    const sizes = this.extractSpec(product.specs, '规格');
    const temps = this.extractSpec(product.specs, '温度');
    const sugars = this.extractSpec(product.specs, '甜度');

    this.setData({ product, specs: product.specs || [], sizes, temps, sugars });
    this.updatePrice();
  },

  extractSpec(specs, type) {
    if (!specs) return [];
    const group = specs.find(s => s.specType === type);
    return group ? group.options : [];
  },

  updatePrice() {
    const { product, selectedSize, sizes } = this.data;
    const sizeOption = sizes.find(s => s.specValue === selectedSize);
    const adjust = sizeOption ? sizeOption.priceAdjust : 0;
    const basePrice = product.basePrice || 0;
    const currentPrice = parseFloat(basePrice) + parseFloat(adjust);
    const totalPrice = (currentPrice * this.data.quantity).toFixed(2);
    this.setData({ currentPrice, totalPrice });
  },

  onSelectSize(e) {
    this.setData({ selectedSize: e.currentTarget.dataset.value }, () => this.updatePrice());
  },

  onSelectTemp(e) {
    this.setData({ selectedTemp: e.currentTarget.dataset.value });
  },

  onSelectSugar(e) {
    this.setData({ selectedSugar: e.currentTarget.dataset.value });
  },

  onMinus() {
    if (this.data.quantity > 1) {
      this.setData({ quantity: this.data.quantity - 1 }, () => this.updatePrice());
    }
  },

  onPlus() {
    this.setData({ quantity: this.data.quantity + 1 }, () => this.updatePrice());
  },

  async onAddToCart() {
    const app = getApp();
    if (!app.checkLogin()) return;
    try {
      await api.post('/api/v1/cart/add', {
        productId: this.data.product.id,
        quantity: this.data.quantity,
        size: this.data.selectedSize,
        temp: this.data.selectedTemp,
        sugar: this.data.selectedSugar
      });
      wx.showToast({ title: '已加入购物车', icon: 'success' });
    } catch (e) {
      wx.showToast({ title: '添加失败', icon: 'none' });
    }
  },

  onGoBack() {
    wx.navigateBack();
  }
});

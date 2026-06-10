const api = require('../../utils/api');

Page({
  data: {
    product: {},
    specs: [],
    selectedSpecs: {},
    quantity: 1,
    currentPrice: 0,
    totalPrice: 0
  },

  onLoad(options) {
    this.setData({ id: options.id });
    if (options.img) {
      this.setData({
        product: {
          id: options.id,
          name: decodeURIComponent(options.name || ''),
          imageUrl: decodeURIComponent(options.img || '/images/clothes.png'),
          images: [decodeURIComponent(options.img || '/images/clothes.png')],
          basePrice: parseFloat(options.price) || 0,
          description: ''
        },
        currentPrice: parseFloat(options.price) || 0,
        totalPrice: parseFloat(options.price) || 0,
        specs: [],
        selectedSpecs: {}
      });
    } else {
      this.loadProduct();
    }
  },

  async loadProduct() {
    var res = await api.get('/api/v1/product/' + this.data.id, {}, false);
    var product = res.data;
    if (!product.images || !product.images.length) {
      product.images = [product.imageUrl || '/images/clothes.png'];
      product.imageUrl = product.images[0];
    }

    var specs = product.specs || [];
    var selectedSpecs = {};
    specs.forEach(function(group) {
      if (group.options && group.options.length > 0) {
        if (group.selectionType === 'MULTI') {
          selectedSpecs[group.specType] = [];
        } else {
          selectedSpecs[group.specType] = group.options[0].specValue;
        }
      }
    });

    this.setData({ product: product, specs: specs, selectedSpecs: selectedSpecs });
    this._markActive();
    this.updatePrice();
  },

  _markActive() {
    var selectedSpecs = this.data.selectedSpecs;
    var specs = this.data.specs.map(function(group) {
      var sel = selectedSpecs[group.specType];
      var options = group.options.map(function(opt) {
        var active = Array.isArray(sel) ? sel.indexOf(opt.specValue) >= 0 : sel === opt.specValue;
        return { ...opt, active: active };
      });
      return { ...group, options: options };
    });
    this.setData({ specs: specs });
  },

  onSpecTap(e) {
    var specType = e.currentTarget.dataset.specType;
    var specValue = e.currentTarget.dataset.specValue;
    var selectionType = e.currentTarget.dataset.selectionType || 'SINGLE';
    var selectedSpecs = this.data.selectedSpecs;

    if (selectionType === 'MULTI') {
      var arr = selectedSpecs[specType] || [];
      var idx = arr.indexOf(specValue);
      if (idx >= 0) {
        arr.splice(idx, 1);
      } else {
        arr.push(specValue);
      }
      selectedSpecs[specType] = arr;
    } else {
      selectedSpecs[specType] = specValue;
    }

    this.setData({ selectedSpecs: selectedSpecs });
    this._markActive();
    this.updatePrice();
  },

  updatePrice() {
    var basePrice = this.data.product.basePrice || 0;
    var adjust = 0;
    var selectedSpecs = this.data.selectedSpecs;
    var specs = this.data.specs;

    specs.forEach(function(group) {
      var sel = selectedSpecs[group.specType];
      (group.options || []).forEach(function(opt) {
        if (Array.isArray(sel)) {
          if (sel.indexOf(opt.specValue) >= 0) {
            adjust += parseFloat(opt.priceAdjust || 0);
          }
        } else if (sel === opt.specValue) {
          adjust += parseFloat(opt.priceAdjust || 0);
        }
      });
    });

    var currentPrice = (parseFloat(basePrice) + adjust).toFixed(2);
    var totalPrice = (currentPrice * this.data.quantity).toFixed(2);
    this.setData({ currentPrice: currentPrice, totalPrice: totalPrice });
  },

  onMinus() {
    if (this.data.quantity > 1) {
      this.setData({ quantity: this.data.quantity - 1 });
      this.updatePrice();
    }
  },

  onPlus() {
    this.setData({ quantity: this.data.quantity + 1 });
    this.updatePrice();
  },

  async onAddToCart() {
    var app = getApp();
    if (!app.checkLogin()) return;
    try {
      await api.post('/api/v1/cart/add', {
        productId: this.data.product.id,
        quantity: this.data.quantity,
        size: this.data.selectedSpecs['规格'] || '',
        temp: this.data.selectedSpecs['温度'] || '',
        sugar: this.data.selectedSpecs['甜度'] || ''
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

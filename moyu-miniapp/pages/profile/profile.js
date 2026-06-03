const api = require('../../utils/api');

Page({
  data: {
    userInfo: null,
    _anim: true,
    stats: [
      { label: '订单', value: '0', path: '/pages/orders/orders' },
      { label: '储值', value: '¥0', path: '/pages/wallet/wallet' },
      { label: '积分', value: '0', path: '/pages/points/points' },
      { label: '优惠券', value: '0', path: '' }
    ],
    isMember: false,
    menuItems: [
      { icon: '/images/profile-orders.svg', label: '我的订单', path: '/pages/orders/orders' },
      { icon: '/images/profile-wallet.svg', label: '储值中心', path: '/pages/wallet/wallet' },
      { icon: '/images/profile-points.svg', label: '积分商城', path: '/pages/points/points' },
      { icon: '/images/profile-benefits.svg', label: '会员福利', path: '/pages/benefits/benefits' },
      { icon: '/images/profile-support.svg', label: '优惠券', path: '/pages/coupons/coupons' },
      { icon: '/images/profile-support.svg', label: '客服中心', path: '/pages/support/support' }
    ]
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 4 });
    }
    this.loadUserData();
    this._replayAnim();
  },

  _replayAnim() {
    this.setData({ _anim: false });
    setTimeout(() => this.setData({ _anim: true }), 60);
  },

  async loadUserData() {
    const app = getApp();
    if (!app.globalData.token) return;
    try {
      const userRes = await api.get('/api/v1/user/info');
      const walletRes = await api.get('/api/v1/wallet/info');
      const pointsRes = await api.get('/api/v1/points/info');

      const wallet = walletRes.data || {};
      const points = pointsRes.data || {};
      const user = userRes.data || {};
      if (user.avatarUrl && !user.avatarUrl.startsWith('http')) {
        user.avatarUrl = getApp().globalData.baseUrl + user.avatarUrl;
      }

      this.setData({
        userInfo: user,
        stats: [
          { label: '订单', value: '5', path: '/pages/orders/orders' },
          { label: '储值', value: '¥' + (wallet.balance || 0).toFixed(0), path: '/pages/wallet/wallet' },
          { label: '积分', value: String(points.balance || 0), path: '/pages/points/points' },
          { label: '优惠券', value: '3', path: '' }
        ]
      });
    } catch (e) {
      console.error(e);
    }
  },

  onProfileTap() {
    if (this.data.userInfo) {
      wx.navigateTo({ url: '/pages/profile-edit/profile-edit' });
    }
  },

  onUpgrade() {
    wx.navigateTo({ url: '/pages/membership/membership' });
  },

  onStatTap(e) {
    const path = e.currentTarget.dataset.path;
    if (!path) return;
    if (path === '/pages/orders/orders') wx.switchTab({ url: path });
    else wx.navigateTo({ url: path });
  },

  onMenuTap(e) {
    const path = e.currentTarget.dataset.path;
    if (!path) return;
    if (path === '/pages/orders/orders') wx.switchTab({ url: path });
    else wx.navigateTo({ url: path });
  },

  async onSignIn() {
    const app = getApp();
    if (!app.checkLogin()) return;
    try {
      const res = await api.post('/api/v1/user/sign-in');
      wx.showToast({ title: `签到成功 +${res.data.points}积分`, icon: 'success' });
      this.loadUserData();
    } catch (e) {
      wx.showToast({ title: '今日已签到', icon: 'none' });
    }
  },

  onLoginTap() {
    wx.navigateTo({ url: '/pages/login/login' });
  }
});

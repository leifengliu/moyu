const api = require('../../utils/api');

Page({
  data: {
    agreed: false,
    showPhonePopup: false,
    phoneDone: false
  },

  onAgreeToggle() {
    this.setData({ agreed: !this.data.agreed });
  },

  // ---- 一键登录 ----
  async onWechatLogin() {
    if (!this.data.agreed) {
      wx.showToast({ title: '请先同意用户协议和隐私政策', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '登录中...' });
    try {
      const loginRes = await wx.login();
      const res = await api.post('/api/v1/user/login/wechat', {
        code: loginRes.code
      }, false);
      wx.setStorageSync('token', res.data.token);
      getApp().globalData.token = res.data.token;
      getApp().fetchUserInfo();
      wx.hideLoading();
      this.setData({ showPhonePopup: true });
    } catch (e) {
      wx.hideLoading();
      wx.showToast({ title: '登录失败', icon: 'none' });
    }
  },

  // ---- 绑定手机号 ----
  async onGetPhoneNumber(e) {
    const { code } = e.detail;
    if (!code) return;
    try {
      await api.post('/api/v1/user/phone', { phoneCode: code });
      this.setData({ phoneDone: true });
      wx.showToast({ title: '手机号已绑定', icon: 'success' });
    } catch (e) {
      wx.showToast({ title: '绑定失败', icon: 'none' });
    }
  },

  onFinishPhone() {
    this.setData({ showPhonePopup: false });
    wx.switchTab({ url: '/pages/index/index' });
  }
});

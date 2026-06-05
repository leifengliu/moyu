App({
  globalData: {
    token: '',
    userInfo: null,
    // baseUrl: 'http://www.gaozhoumoyu.online:8080'
    baseUrl: 'http://127.0.0.1:8080'
  },

  onLaunch() {
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
      this.fetchUserInfo();
    }
  },

  fetchUserInfo() {
    this.request('/api/v1/user/info').then(res => {
      if (res.code === 200) {
        this.globalData.userInfo = res.data;
      }
    }).catch(() => {});
  },

  checkLogin() {
    if (!this.globalData.token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return false;
    }
    return true;
  },

  request(url, options = {}) {
    const { method = 'GET', data = {}, needAuth = true } = options;
    return new Promise((resolve, reject) => {
      const header = { 'Content-Type': 'application/json' };
      if (needAuth && this.globalData.token) {
        header['Authorization'] = 'Bearer ' + this.globalData.token;
      }
      wx.request({
        url: this.globalData.baseUrl + url,
        method,
        data,
        header,
        success(res) {
          if (res.data.code === 401) {
            wx.removeStorageSync('token');
            wx.navigateTo({ url: '/pages/login/login' });
            reject(res.data);
            return;
          }
          resolve(res.data);
        },
        fail(err) {
          wx.showToast({ title: '网络请求失败', icon: 'none' });
          reject(err);
        }
      });
    });
  }
});

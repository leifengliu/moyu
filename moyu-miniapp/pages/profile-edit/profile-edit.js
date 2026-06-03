const api = require('../../utils/api');

Page({
  data: {
    userInfo: {},
    editNickname: '',
    editBirthday: '',
    editGender: '男',
    tempAvatarUrl: ''
  },

  onLoad() {
    var self = this;
    wx.request({
      url: getApp().globalData.baseUrl + '/api/v1/user/info',
      header: { 'Authorization': 'Bearer ' + getApp().globalData.token },
      success: function(res) {
        if (res.data.code === 200) {
          var user = res.data.data || {};
          self.setData({
            userInfo: user,
            editNickname: user.nickname || '',
            editBirthday: user.birthday || ''
          });
        }
      }
    });
  },

  onChooseAvatar(e) {
    var self = this;
    self.setData({ tempAvatarUrl: e.detail.avatarUrl });
    wx.uploadFile({
      url: getApp().globalData.baseUrl + '/api/v1/user/avatar',
      filePath: e.detail.avatarUrl, name: 'file',
      header: { 'Authorization': 'Bearer ' + getApp().globalData.token },
      success: function(res) {
        var data = JSON.parse(res.data);
        if (data.code === 200) {
          var url = data.data;
          self.setData({ 'userInfo.avatarUrl': getApp().globalData.baseUrl + url });
          getApp().fetchUserInfo();
        }
      }
    });
  },

  onNicknameInput(e) { this.setData({ editNickname: e.detail.value }); },
  onBirthdayChange(e) { this.setData({ editBirthday: e.detail.value }); },
  onGenderTap(e) { this.setData({ editGender: e.currentTarget.dataset.gender }); },

  onSave() {
    api.put('/api/v1/user/info', {
      nickname: this.data.editNickname,
      birthday: this.data.editBirthday
    }).then(function() {
      getApp().fetchUserInfo();
      wx.showToast({ title: '已保存', icon: 'success' });
      setTimeout(function() { wx.navigateBack(); }, 800);
    });
  },

  onLogout() {
    wx.showModal({
      title: '退出登录', content: '确定要退出登录吗？',
      success: function(r) {
        if (r.confirm) {
          wx.removeStorageSync('token');
          getApp().globalData.token = '';
          wx.switchTab({ url: '/pages/profile/profile' });
        }
      }
    });
  },

  onGoBack() { wx.navigateBack(); }
});

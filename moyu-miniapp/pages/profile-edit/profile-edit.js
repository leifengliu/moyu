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
          if (user.avatarUrl && !user.avatarUrl.startsWith('http')) {
            user.avatarUrl = getApp().globalData.baseUrl + user.avatarUrl;
          }
          self.setData({
            userInfo: user,
            editNickname: user.nickname || '',
            editBirthday: user.birthday || '',
            editGender: user.gender || '男'
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

  onNicknameInput(e) { this.setData({ editNickname: e.detail.value }); this.debouncedSave(); },
  onBirthdayChange(e) { this.setData({ editBirthday: e.detail.value }); this.onSave(); },
  onGenderTap(e) { this.setData({ editGender: e.currentTarget.dataset.gender }); this.onSave(); },

  debouncedSave() {
    if (this._saveTimer) clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => { this.onSave(); }, 600);
  },

  onSave() {
    var self = this;
    api.put('/api/v1/user/info', {
      nickname: self.data.editNickname,
      birthday: self.data.editBirthday,
      gender: self.data.editGender
    }).then(function() {
      getApp().fetchUserInfo();
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

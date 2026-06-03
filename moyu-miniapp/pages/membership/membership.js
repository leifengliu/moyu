Page({
  data: {
    benefits: [
      '所有饮品享受会员价',
      '每月赠送 2 张优惠券',
      '生日当天免费饮品',
      '积分双倍累积',
      '优先参与新品试饮',
      '专属会员活动'
    ],
    plans: [
      { id: 'monthly', name: '月度会员', price: 29, period: '月', desc: '灵活订阅，随时取消' },
      { id: 'quarterly', name: '季度会员', price: 79, period: '季', desc: '平均每月 ¥26', discount: '节省 ¥8', popular: true },
      { id: 'yearly', name: '年度会员', price: 288, period: '年', desc: '平均每月 ¥24', discount: '节省 ¥60' }
    ]
  },

  onGoBack() { wx.navigateBack(); },
  onSubscribe() { wx.showToast({ title: '订阅成功', icon: 'success' }); }
});

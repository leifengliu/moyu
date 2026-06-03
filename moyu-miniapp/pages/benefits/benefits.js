Page({
  data: {
    items: [
      { icon:'🎂', title:'生日礼物', desc:'生日当天可领取一杯免费饮品' },
      { icon:'📅', title:'每日签到', desc:'每日签到获取积分，连续签到额外奖励' },
      { icon:'💎', title:'推荐奖励', desc:'邀请好友注册，双方各得优惠券' },
      { icon:'⭐', title:'会员折扣', desc:'享受会员专属价格优惠' }
    ]
  },
  onGoBack() { wx.navigateBack(); }
});

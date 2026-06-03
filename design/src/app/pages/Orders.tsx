import { BottomNav } from '../components/BottomNav';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router';

export default function Orders() {
  const [activeTab, setActiveTab] = useState('all');
  
  const tabs = [
    { id: 'all', name: '全部' },
    { id: 'pending', name: '待付款' },
    { id: 'preparing', name: '待取餐' },
    { id: 'completed', name: '已完成' },
    { id: 'refund', name: '售后' },
  ];
  
  const orders = [
    {
      id: '202603250001',
      status: 'completed',
      statusText: '已完成',
      date: '2026-03-25 14:30',
      items: [
        { name: '拿铁咖啡 中杯', quantity: 1, price: 28 },
        { name: '美式咖啡 大杯', quantity: 1, price: 24 },
      ],
      total: 52,
    },
    {
      id: '202603240002',
      status: 'completed',
      statusText: '已完成',
      date: '2026-03-24 10:15',
      items: [
        { name: '卡布奇诺 中杯', quantity: 2, price: 26 },
      ],
      total: 52,
    },
    {
      id: '202603230003',
      status: 'preparing',
      statusText: '待取餐',
      date: '2026-03-23 16:45',
      items: [
        { name: '冰咖啡 大杯', quantity: 1, price: 30 },
        { name: '可颂', quantity: 1, price: 18 },
      ],
      total: 48,
    },
  ];
  
  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);
  
  return (
    <div className="min-h-screen bg-[#F8F6F3] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#E8DED3]">
        <div className="h-11" />
        <div className="px-6 pb-4">
          <h1 className="text-xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'serif' }}>我的订单</h1>
          
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-lg text-sm whitespace-nowrap transition-all border ${
                  activeTab === tab.id 
                    ? 'bg-[#1A1614] text-[#C9A961] border-[#1A1614]' 
                    : 'bg-white text-[#8B8680] border-[#E8DED3]'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Orders List */}
      <div className="px-6 py-6 space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/order/${order.id}`} state={{ 
                items: order.items.map((item, idx) => ({
                  id: idx + 1,
                  name: item.name.split(' ')[0],
                  price: item.price,
                  quantity: item.quantity,
                  size: '中杯',
                  temp: '热饮',
                  sugar: '标准糖'
                })),
                total: order.total,
                status: order.status
              }}>
                <div className="bg-white rounded-lg p-6 border border-[#E8DED3]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-[#8B8680]">订单号: {order.id}</span>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      order.status === 'completed' 
                        ? 'bg-[#E8DED3] text-[#1A1A1A]' 
                        : 'bg-[#C9A961]/10 text-[#C9A961]'
                    }`}>
                      {order.statusText}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <div>
                          <p className="text-sm text-[#1A1A1A]">{item.name}</p>
                          <p className="text-xs text-[#8B8680] mt-1">x{item.quantity}</p>
                        </div>
                        <p className="text-sm text-[#1A1A1A]">¥{item.price}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-[#E8DED3] pt-4 flex items-center justify-between">
                    <span className="text-xs text-[#8B8680]">{order.date}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-[#8B8680]">合计</span>
                      <span className="text-xs text-[#8B8680] ml-2">¥</span>
                      <span className="text-lg text-[#C9A961]">{order.total}</span>
                    </div>
                  </div>
                  
                  {order.status === 'completed' && (
                    <div className="mt-5 flex gap-3">
                      <button 
                        onClick={(e) => e.preventDefault()}
                        className="flex-1 py-3 rounded-lg border border-[#E8DED3] text-sm text-[#8B8680]"
                      >
                        再来一单
                      </button>
                      <button 
                        onClick={(e) => e.preventDefault()}
                        className="flex-1 py-3 rounded-lg bg-[#1A1614] text-[#C9A961] text-sm"
                      >
                        评价
                      </button>
                    </div>
                  )}
                  
                  {order.status === 'preparing' && (
                    <div className="mt-5">
                      <button 
                        onClick={(e) => e.preventDefault()}
                        className="w-full py-3 rounded-lg bg-[#1A1614] text-[#C9A961] text-sm"
                      >
                        查看详情
                      </button>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-sm text-[#8B8680]">暂无订单</p>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
}

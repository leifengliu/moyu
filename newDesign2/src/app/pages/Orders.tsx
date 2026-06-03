import { BottomNav } from '../components/BottomNav';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router';

export default function Orders() {
  const [activeTab, setActiveTab] = useState('all');
  
  const tabs = [
    { id: 'all', name: '全部' },
    { id: 'pending', name: '待付款' },
    { id: 'preparing', name: '制作中' },
    { id: 'completed', name: '已完成' },
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
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#E5E3DF]">
        <div className="h-11" />
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-base tracking-[0.15em] text-[#2C2C2C]">我的订单</h1>
            {/* 预留胶囊空间 */}
            <div className="w-[103px]" />
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 text-xs whitespace-nowrap transition-all border ${
                  activeTab === tab.id
                    ? 'bg-[#4A3428] text-white border-[#4A3428]'
                    : 'bg-white text-[#8B8680] border-[#E5E3DF]'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Orders List */}
      <div className="px-6 py-6 space-y-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
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
                <div className="bg-white p-5 border border-[#E5E3DF] hover:border-[#4A3428] transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] text-[#8B8680] tracking-wide">#{order.id}</span>
                    <span className={`text-[10px] px-3 py-1 ${
                      order.status === 'completed'
                        ? 'bg-[#F5F5F3] text-[#8B8680]'
                        : 'bg-[#4A3428] text-white'
                    }`}>
                      {order.statusText}
                    </span>
                  </div>

                  <div className="space-y-2.5 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <div>
                          <p className="text-sm text-[#2C2C2C]">{item.name}</p>
                          <p className="text-xs text-[#8B8680] mt-0.5">×{item.quantity}</p>
                        </div>
                        <p className="text-sm text-[#2C2C2C]">¥{item.price}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#E5E3DF] pt-4 flex items-center justify-between">
                    <span className="text-xs text-[#8B8680]">{order.date}</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs text-[#8B8680]">合计</span>
                      <span className="text-xs text-[#8B8680]">¥</span>
                      <span className="text-base text-[#4A3428] font-medium">{order.total}</span>
                    </div>
                  </div>

                  {order.status === 'completed' && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={(e) => e.preventDefault()}
                        className="flex-1 py-3 border border-[#E5E3DF] text-xs text-[#2C2C2C]"
                      >
                        再来一单
                      </button>
                      <button
                        onClick={(e) => e.preventDefault()}
                        className="flex-1 py-3 bg-[#4A3428] text-white text-xs"
                      >
                        评价
                      </button>
                    </div>
                  )}

                  {order.status === 'preparing' && (
                    <div className="mt-4">
                      <button
                        onClick={(e) => e.preventDefault()}
                        className="w-full py-3 bg-[#4A3428] text-white text-xs"
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

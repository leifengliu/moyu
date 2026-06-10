import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => { api.stats().then(r => r.code === 200 && setStats(r.data)) }, [])

  const cards = [
    { label: '今日订单', value: stats.todayOrders || 0 },
    { label: '商品总数', value: stats.productCount || 0 },
    { label: '用户总数', value: stats.userCount || 0 },
    { label: '本月营收(元)', value: '¥' + ((stats.monthRevenue || 0) / 100).toFixed(0) },
  ]

  return (
    <div>
      <h2 className="text-lg text-brand font-medium mb-6">仪表盘</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-white border border-border p-6">
            <div className="text-2xl md:text-3xl font-semibold text-brand">{c.value}</div>
            <div className="text-xs text-muted mt-2">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

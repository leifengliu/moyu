import { useEffect, useState } from 'react'
import { api } from '../api'

const STEPS = [
  { key: 'pending', label: '待付款', icon: '💰' },
  { key: 'paid', label: '已支付', icon: '✅' },
  { key: 'preparing', label: '制作中', icon: '☕' },
  { key: 'ready', label: '待取餐', icon: '📦' },
  { key: 'completed', label: '已完成', icon: '🎉' },
]
const STATUS_MAP = { all:'全部', pending:'待付款', paid:'已支付', preparing:'制作中', ready:'待取餐', completed:'已完成' }

export default function Orders() {
  const [status, setStatus] = useState('all')
  const [list, setList] = useState([])

  const load = () => api.getOrders(status).then(r => r.code === 200 && setList(r.data.records || []))
  useEffect(() => { load() }, [status])

  const updateStatus = async (id, s) => { await api.setOrderStatus(id, s); load() }

  const getStepIdx = (s) => STEPS.findIndex(x => x.key === s)

  return (
    <div>
      <h2 className="text-lg text-brand font-medium mb-6">订单管理</h2>

      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(STATUS_MAP).map(([k, v]) => (
          <button key={k} onClick={() => setStatus(k)}
            className={`px-4 py-1.5 text-xs border ${k === status ? 'bg-brand text-white border-brand' : 'bg-white text-muted border-border'}`}>{v}</button>
        ))}
      </div>

      <div className="space-y-4">
        {list.map(o => {
          const stepIdx = getStepIdx(o.status)

          return (
          <div key={o.id} className="bg-white border border-border p-5">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-muted">{o.orderNo}</div>
                <div className="text-xs text-muted/60 mt-0.5">{o.createTime?.substring(0, 16)}</div>
              </div>
              <span className="text-xs px-2.5 py-1 bg-brand text-white">{STATUS_MAP[o.status] || o.status}</span>
            </div>

            {/* Progress Stepper */}
            <div className="flex items-center mb-4 px-2">
              {STEPS.map((step, i) => {
                const done = i < stepIdx
                const active = i === stepIdx
                const isLast = i === STEPS.length - 1
                return (
                  <div key={step.key} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all
                        ${done ? 'bg-brand text-white' : active ? 'bg-gold text-white' : 'bg-border text-muted'}`}>
                        {done ? '✓' : step.icon}
                      </div>
                      <span className={`text-[10px] mt-1 whitespace-nowrap ${done || active ? 'text-brand font-medium' : 'text-muted/50'}`}>{step.label}</span>
                    </div>
                    {!isLast && (
                      <div className={`flex-1 h-0.5 mx-1 -mt-5 ${done ? 'bg-brand' : 'bg-border'}`} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Items */}
            <p className="text-xs text-muted mb-4 bg-warm p-3">
              {(o.items || []).map(i => i.productName + ' ×' + i.quantity).join('，')}
            </p>

            {/* Bottom actions */}
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-brand">¥{o.payAmount || o.totalAmount}</span>
              <div className="space-x-2">
                {o.status === 'paid' && (
                  <button onClick={() => updateStatus(o.id, 'preparing')} className="py-2 px-4 bg-brand text-white text-xs">
                    确认接单
                  </button>
                )}
                {o.status === 'preparing' && (
                  <div className="flex items-center gap-3">
                    {o.pickupCode && <span className="text-sm bg-gold/20 text-brand px-3 py-1 font-mono font-bold text-lg tracking-[0.2em]">{o.pickupCode}</span>}
                    <button onClick={() => updateStatus(o.id, 'ready')} className="py-2 px-4 bg-gold text-white text-xs">
                      制作完成
                    </button>
                  </div>
                )}
                {o.status === 'ready' && (
                  <button onClick={() => updateStatus(o.id, 'completed')} className="py-2 px-4 bg-brand text-white text-xs">
                    确认取餐
                  </button>
                )}
                {o.status === 'completed' && (
                  <span className="text-xs text-muted">已完成</span>
                )}
              </div>
            </div>
          </div>
        )})}
        {list.length === 0 && <div className="text-center text-muted py-16">暂无订单</div>}
      </div>
    </div>
  )
}

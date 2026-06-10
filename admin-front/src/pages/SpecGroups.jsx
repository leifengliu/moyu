import { useEffect, useState } from 'react'
import { api } from '../api'

export default function SpecGroups() {
  const [groups, setGroups] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [gModal, setGModal] = useState(null)
  const [gForm, setGForm] = useState({ name: '', selectionType: 'SINGLE', sortOrder: 0 })
  const [oModal, setOModal] = useState(null)
  const [oForm, setOForm] = useState({ value: '', priceAdjust: 0, sortOrder: 0 })

  const load = () => api.getSpecGroups().then(r => { if (r.code === 200) setGroups(r.data || []) })
  useEffect(() => { load() }, [])

  const active = groups.find(g => g.id === activeId)

  const openGroup = (g) => {
    setGForm(g ? { name: g.name, selectionType: g.selectionType, sortOrder: g.sortOrder } : { name: '', selectionType: 'SINGLE', sortOrder: 0 })
    setGModal(g || {})
  }
  const saveGroup = async () => {
    await api.saveSpecGroup(gModal.id, gForm); setGModal(null); load()
  }
  const delGroup = async (id) => {
    if (!confirm('确定删除?')) return
    await api.delSpecGroup(id)
    if (activeId === id) setActiveId(null)
    load()
  }

  const openOption = (o) => {
    setOForm(o ? { value: o.value, priceAdjust: o.priceAdjust, sortOrder: o.sortOrder } : { value: '', priceAdjust: 0, sortOrder: 0 })
    setOModal(o || {})
  }
  const saveOption = async () => {
    if (oModal.id) {
      await api.updateSpecOption(oModal.id, oForm)
    } else {
      await api.addSpecOption(activeId, oForm)
    }
    setOModal(null); load()
  }
  const delOption = async (id) => { if (!confirm('确定删除?')) return; await api.delSpecOption(id); load() }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-brand font-medium">规格管理</h2>
        <button onClick={() => openGroup(null)} className="py-2 px-4 bg-brand text-white text-sm">+ 新增规格组</button>
      </div>

      <div className="flex gap-6">
        {/* Left: group list */}
        <div className="w-56 bg-white border border-border shrink-0">
          <div className="p-3 border-b border-border text-xs text-muted uppercase tracking-[0.05em]">规格组</div>
          {groups.map(g => (
            <div key={g.id} onClick={() => setActiveId(g.id)}
              className={`p-3 border-b border-border last:border-0 text-sm cursor-pointer flex items-center justify-between ${activeId === g.id ? 'bg-brand/5 text-brand font-medium' : 'text-text hover:bg-warm'}`}>
              <span>{g.name} <span className="text-xs text-muted ml-1">{g.selectionType === 'MULTI' ? '多选' : '单选'}</span></span>
              <span className="flex gap-1">
                <button onClick={e => { e.stopPropagation(); openGroup(g) }} className="text-xs text-brand">改</button>
                <button onClick={e => { e.stopPropagation(); delGroup(g.id) }} className="text-xs text-red-500">删</button>
              </span>
            </div>
          ))}
        </div>

        {/* Right: options */}
        <div className="flex-1 bg-white border border-border">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <span className="text-xs text-muted uppercase tracking-[0.05em]">{active ? active.name + ' - 选项' : '请选择左侧规格组'}</span>
            {active && <button onClick={() => openOption(null)} className="py-1 px-3 bg-brand text-white text-xs">+ 新增选项</button>}
          </div>
          {active && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted">
                  <th className="p-3">选项值</th><th className="p-3">价格调整</th><th className="p-3">排序</th><th className="p-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {(active.options || []).map(o => (
                  <tr key={o.id} className="border-b border-border last:border-0">
                    <td className="p-3">{o.value}</td>
                    <td className="p-3">{o.priceAdjust > 0 ? '+' : ''}{o.priceAdjust}</td>
                    <td className="p-3">{o.sortOrder}</td>
                    <td className="p-3 space-x-2">
                      <button onClick={() => openOption(o)} className="py-1 px-2 bg-brand text-white text-xs">编辑</button>
                      <button onClick={() => delOption(o.id)} className="py-1 px-2 bg-red-500 text-white text-xs">删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Group Modal */}
      {gModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setGModal(null)}>
          <div className="bg-white p-8 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-6">{gModal.id ? '编辑规格组' : '新增规格组'}</h3>
            <label className="block text-xs text-muted mb-1">名称</label>
            <input className="w-full p-2.5 border border-border text-sm bg-warm mb-4" value={gForm.name} onChange={e => setGForm({ ...gForm, name: e.target.value })} />
            <label className="block text-xs text-muted mb-1">选择类型</label>
            <div className="flex gap-3 mb-4">
              {[{ v: 'SINGLE', l: '单选' }, { v: 'MULTI', l: '多选' }].map(t => (
                <button key={t.v} onClick={() => setGForm({ ...gForm, selectionType: t.v })}
                  className={`flex-1 py-3 text-sm border ${gForm.selectionType === t.v ? 'border-brand bg-brand/5 text-brand font-medium' : 'border-border text-muted'}`}>{t.l}</button>
              ))}
            </div>
            <label className="block text-xs text-muted mb-1">排序</label>
            <input className="w-full p-2.5 border border-border text-sm bg-warm mb-4" type="number" value={gForm.sortOrder} onChange={e => setGForm({ ...gForm, sortOrder: parseInt(e.target.value) || 0 })} />
            <div className="flex gap-3 mt-6">
              <button onClick={saveGroup} className="flex-1 py-3 bg-brand text-white text-sm">保存</button>
              <button onClick={() => setGModal(null)} className="flex-1 py-3 bg-warm border border-border text-sm">取消</button>
            </div>
          </div>
        </div>
      )}

      {/* Option Modal */}
      {oModal != null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setOModal(null)}>
          <div className="bg-white p-8 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-6">{oModal.id ? '编辑选项' : '新增选项'}</h3>
            <label className="block text-xs text-muted mb-1">选项值</label>
            <input className="w-full p-2.5 border border-border text-sm bg-warm mb-4" value={oForm.value} onChange={e => setOForm({ ...oForm, value: e.target.value })} />
            <label className="block text-xs text-muted mb-1">价格调整 (正数加价，负数减价)</label>
            <input className="w-full p-2.5 border border-border text-sm bg-warm mb-4" type="number" step="0.01" value={oForm.priceAdjust} onChange={e => setOForm({ ...oForm, priceAdjust: parseFloat(e.target.value) || 0 })} />
            <label className="block text-xs text-muted mb-1">排序</label>
            <input className="w-full p-2.5 border border-border text-sm bg-warm mb-4" type="number" value={oForm.sortOrder} onChange={e => setOForm({ ...oForm, sortOrder: parseInt(e.target.value) || 0 })} />
            <div className="flex gap-3 mt-6">
              <button onClick={saveOption} className="flex-1 py-3 bg-brand text-white text-sm">保存</button>
              <button onClick={() => setOModal(null)} className="flex-1 py-3 bg-warm border border-border text-sm">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

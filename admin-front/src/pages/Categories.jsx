import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Categories() {
  const [list, setList] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', code: '', sortOrder: 0 })

  const load = () => api.getCategories().then(r => r.code === 200 && setList(r.data || []))
  useEffect(() => { load() }, [])

  const open = (c) => { setForm(c ? { ...c } : { name: '', code: '', sortOrder: 0 }); setModal(c || {}) }
  const save = async () => { await api.saveCategory(modal.id, form); setModal(null); load() }
  const del = async (id) => { if (!confirm('确定删除?')) return; await api.delCategory(id); load() }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-brand font-medium">分类管理</h2>
        <button onClick={() => open(null)} className="py-2 px-4 bg-brand text-white text-sm">+ 新增分类</button>
      </div>

      <div className="bg-white border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted uppercase tracking-[0.05em]">
              <th className="p-3">ID</th><th className="p-3">名称</th><th className="p-3">编码</th><th className="p-3">排序</th><th className="p-3">状态</th><th className="p-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map(c => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="p-3">{c.id}</td>
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.code}</td>
                <td className="p-3">{c.sortOrder}</td>
                <td className="p-3"><span className={`px-2 py-0.5 text-xs ${c.status === 1 ? 'bg-brand text-white' : 'bg-border text-muted'}`}>{c.status === 1 ? '启用' : '禁用'}</span></td>
                <td className="p-3 space-x-2">
                  <button onClick={() => open(c)} className="py-1 px-3 bg-brand text-white text-xs">编辑</button>
                  <button onClick={() => del(c.id)} className="py-1 px-3 bg-red-500 text-white text-xs">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModal(null)}>
          <div className="bg-white p-8 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-6">{modal.id ? '编辑分类' : '新增分类'}</h3>
            <label className="block text-xs text-muted mb-1">名称</label>
            <input className="w-full p-2.5 border border-border text-sm bg-warm mb-4" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <label className="block text-xs text-muted mb-1">编码</label>
            <input className="w-full p-2.5 border border-border text-sm bg-warm mb-4" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
            <label className="block text-xs text-muted mb-1">排序</label>
            <input className="w-full p-2.5 border border-border text-sm bg-warm mb-4" type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
            <div className="flex gap-3 mt-6">
              <button onClick={save} className="flex-1 py-3 bg-brand text-white text-sm">保存</button>
              <button onClick={() => setModal(null)} className="flex-1 py-3 bg-warm border border-border text-sm">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

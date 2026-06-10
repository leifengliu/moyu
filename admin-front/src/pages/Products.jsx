import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Products() {
  const [list, setList] = useState([])
  const [categories, setCategories] = useState([])
  const [specGroups, setSpecGroups] = useState([])
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [uploading, setUploading] = useState(false)

  function emptyForm(p) {
    return {
      name: p?.name || '', description: p?.description || '',
      images: p?.images || [],
      imageUrl: p?.imageUrl || '',
      basePrice: p?.basePrice || 0,
      categoryId: p?.categoryId || '',
      specs: p?.specs || [],
      status: p?.status ?? 1,
      sortOrder: p?.sortOrder || 0
    }
  }

  const load = async () => {
    const [prodRes, catRes, specRes] = await Promise.all([
      api.getProducts(), api.getCategories(), api.getSpecGroups()
    ])
    if (prodRes.code === 200) setList(prodRes.data.records || [])
    if (catRes.code === 200) setCategories(catRes.data || [])
    if (specRes.code === 200) setSpecGroups(specRes.data || [])
  }
  useEffect(() => { load() }, [])

  const openModal = (p) => {
    if (p) {
      setForm(emptyForm(p))
    } else {
      setForm({ ...emptyForm(), specs: [] })
    }
    setModal(p || {})
  }

  const save = async () => {
    await api.saveProduct(modal.id, form)
    setModal(null); load()
  }

  const del = async (id) => {
    if (!confirm('确定下架?')) return
    await api.delProduct(id); load()
  }

  // Image upload
  const handleUpload = async (e) => {
    const files = e.target.files
    if (!files.length) return
    setUploading(true)
    const urls = [...form.images]
    for (const file of files) {
      try {
        const res = await api.uploadImage(file)
        if (res.code === 200) urls.push(res.data)
      } catch (err) { alert('上传失败: ' + file.name) }
    }
    setForm({ ...form, images: urls, imageUrl: urls[0] || '' })
    setUploading(false)
  }

  const removeImage = (idx) => {
    const urls = form.images.filter((_, i) => i !== idx)
    setForm({ ...form, images: urls, imageUrl: urls[0] || '' })
  }

  // Spec handling
  const toggleSpecGroup = (group) => {
    const exists = form.specs.find(s => s.specType === group.name)
    if (exists) {
      setForm({ ...form, specs: form.specs.filter(s => s.specType !== group.name) })
    } else {
      const defaults = (group.options || []).map(o => ({
        specType: group.name, specValue: o.value, priceAdjust: o.priceAdjust
      }))
      setForm({ ...form, specs: [...form.specs, ...defaults] })
    }
  }

  const toggleSpecOption = (specType, option) => {
    const exists = form.specs.find(s => s.specType === specType && s.specValue === option.value)
    if (exists) {
      setForm({ ...form, specs: form.specs.filter(s => !(s.specType === specType && s.specValue === option.value)) })
    } else {
      setForm({ ...form, specs: [...form.specs, { specType, specValue: option.value, priceAdjust: option.priceAdjust }] })
    }
  }

  const updateSpecPrice = (specType, specValue, price) => {
    setForm({
      ...form, specs: form.specs.map(s =>
        s.specType === specType && s.specValue === specValue ? { ...s, priceAdjust: parseFloat(price) || 0 } : s
      )
    })
  }

  const activeSpecTypes = form.specs.map(s => s.specType).filter((v, i, a) => a.indexOf(v) === i)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-brand font-medium">商品管理</h2>
        <button onClick={() => openModal(null)} className="py-2 px-4 bg-brand text-white text-sm">+ 添加商品</button>
      </div>

      <div className="bg-white border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted uppercase tracking-[0.05em]">
              <th className="p-3">ID</th><th className="p-3">分类</th><th className="p-3">名称</th><th className="p-3">价格</th><th className="p-3">规格</th><th className="p-3">状态</th><th className="p-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map(p => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.categoryName || '-'}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">¥{p.basePrice}</td>
                <td className="p-3 text-xs text-muted">{(p.specs || []).map(s => s.specValue).join(', ') || '-'}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 text-xs ${p.status === 1 ? 'bg-brand text-white' : 'bg-border text-muted'}`}>{p.status === 1 ? '上架' : '下架'}</span>
                </td>
                <td className="p-3 space-x-2">
                  <button onClick={() => openModal(p)} className="py-1 px-3 bg-brand text-white text-xs">编辑</button>
                  <button onClick={() => del(p.id)} className="py-1 px-3 bg-red-500 text-white text-xs">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModal(null)}>
          <div className="bg-white p-8 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-6">{modal.id ? '编辑商品' : '添加商品'}</h3>

            <label className="block text-xs text-muted mb-1">商品分类</label>
            <select className="w-full p-2.5 border border-border text-sm bg-warm mb-4" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: parseInt(e.target.value) })}>
              <option value="">请选择分类</option>
              {categories.filter(c => c.status !== 0).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <label className="block text-xs text-muted mb-1">名称</label>
            <input className="w-full p-2.5 border border-border text-sm bg-warm mb-4" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

            <label className="block text-xs text-muted mb-1">描述</label>
            <input className="w-full p-2.5 border border-border text-sm bg-warm mb-4" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

            <label className="block text-xs text-muted mb-1">图片</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.images.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} className="w-16 h-16 object-cover border border-border" alt="" />
                  <button onClick={() => removeImage(i)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">×</button>
                </div>
              ))}
            </div>
            <label className="py-2 px-4 bg-brand text-white text-sm cursor-pointer inline-block">{uploading ? '上传中...' : '上传图片'}<input type="file" accept="image/*" className="hidden" onChange={handleUpload} multiple disabled={uploading} /></label>

            <label className="block text-xs text-muted mb-1 mt-4">价格</label>
            <input className="w-full p-2.5 border border-border text-sm bg-warm mb-4" type="number" value={form.basePrice} onChange={e => setForm({ ...form, basePrice: parseFloat(e.target.value) || 0 })} />

            {/* Spec Configurator */}
            <div className="mt-6 border-t border-border pt-4">
              <p className="text-xs text-muted mb-3">规格配置 — 勾选适用的规格组，然后选择具体选项</p>
              {specGroups.map(group => {
                const hasGroup = activeSpecTypes.includes(group.name)
                return (
                  <div key={group.id} className="mb-4 p-3 border border-border">
                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                      <input type="checkbox" checked={hasGroup} onChange={() => toggleSpecGroup(group)} />
                      <span className="text-sm font-medium">{group.name}</span>
                      <span className="text-xs text-muted">({group.selectionType === 'MULTI' ? '多选' : '单选'})</span>
                    </label>
                    {hasGroup && (
                      <div className="pl-6 space-y-2">
                        {(group.options || []).map(opt => {
                          const spec = form.specs.find(s => s.specType === group.name && s.specValue === opt.value)
                          const active = !!spec
                          return (
                            <div key={opt.id} className="flex items-center gap-3">
                              <label className="flex items-center gap-2 cursor-pointer min-w-[80px]">
                                <input type="checkbox" checked={active} onChange={() => toggleSpecOption(group.name, opt)} />
                                <span className="text-sm">{opt.value}</span>
                              </label>
                              {active && (
                                <input type="number" step="0.01" className="w-24 p-1 border border-border text-xs bg-warm" value={spec.priceAdjust}
                                  onChange={e => updateSpecPrice(group.name, opt.value, e.target.value)} placeholder="价格调整" />
                              )}
                              <span className="text-xs text-muted">{opt.priceAdjust !== 0 ? (opt.priceAdjust > 0 ? '+¥' : '-¥') + Math.abs(opt.priceAdjust) : ''}</span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-xs text-muted mb-1">状态</label>
                <select className="w-full p-2.5 border border-border text-sm bg-warm" value={form.status} onChange={e => setForm({ ...form, status: parseInt(e.target.value) })}>
                  <option value={1}>上架</option><option value={0}>下架</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">排序</label>
                <input className="w-full p-2.5 border border-border text-sm bg-warm" type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={save} className="flex-1 py-3 bg-brand text-white text-sm">保存</button>
              <button onClick={() => setModal(null)} className="flex-1 py-3 bg-warm border border-border text-sm">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

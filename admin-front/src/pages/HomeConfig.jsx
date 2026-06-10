import { useEffect, useState } from 'react'
import { api } from '../api'

export default function HomeConfig() {
  const [banners, setBanners] = useState([])
  const [products, setProducts] = useState([])
  const [picks, setPicks] = useState({ drinks: [], merch: [] })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const [bRes, pRes, pickRes] = await Promise.all([
      api.getBanners(), api.getProducts(), api.getHomePicks()
    ])
    if (bRes.code === 200) setBanners(bRes.data || [])
    if (pRes.code === 200) setProducts(pRes.data.records || [])
    if (pickRes.code === 200) setPicks(pickRes.data || { drinks: [], merch: [] })
  }
  useEffect(() => { load() }, [])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await api.uploadImage(file)
      if (res.code === 200) {
        await api.saveBanner(null, { imageUrl: res.data, sortOrder: banners.length + 1 })
        load()
      }
    } catch (err) { alert('上传失败') }
    setUploading(false)
  }

  const delBanner = async (id) => { if (!confirm('确定删除?')) return; await api.delBanner(id); load() }

  const drinks = products.filter(p => [2, 3, 4, 5, 6].includes(p.categoryId))
  const merchs = products.filter(p => p.categoryId === 7)

  const handlePick = (section, index) => (e) => {
    const val = e.target.value
    const newPicks = [...(picks[section] || [])]
    if (val) {
      const pid = parseInt(val)
      newPicks[index] = { productId: pid, productName: products.find(p => p.id === pid)?.name || '' }
    } else {
      newPicks[index] = null
    }
    setPicks({ ...picks, [section]: newPicks.filter(Boolean) })
  }

  const savePicks = async () => {
    setSaving(true)
    const data = {
      drinks: picks.drinks.map(p => p.productId),
      merch: picks.merch.map(p => p.productId)
    }
    await api.saveHomePicks(data)
    setSaving(false)
    load()
  }

  return (
    <div>
      <h2 className="text-lg text-brand font-medium mb-6">首页配置</h2>

      {/* Banner Section */}
      <div className="mb-8">
        <h3 className="text-sm font-medium mb-3">轮播图</h3>
        <div className="flex flex-wrap gap-3 mb-4">
          {banners.map(b => (
            <div key={b.id} className="relative">
              <img src={b.imageUrl} className="w-40 h-24 object-cover border border-border" alt="" />
              <button onClick={() => delBanner(b.id)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">×</button>
            </div>
          ))}
        </div>
        <label className="py-2 px-4 bg-brand text-white text-sm cursor-pointer inline-block">
          {uploading ? '上传中...' : '+ 上传轮播图'}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {/* Home Picks */}
      <div>
        <h3 className="text-sm font-medium mb-3">首页推荐商品</h3>
        <p className="text-xs text-muted mb-4">下拉选择饮品和周边各最多 2 个商品展示在首页</p>

        <div className="grid grid-cols-2 gap-6">
          {/* Drinks */}
          <div className="bg-white border border-border p-4">
            <h4 className="text-sm font-medium mb-3">饮品推荐（最多2个）</h4>
            {[0, 1].map(idx => (
              <div key={idx} className="mb-3">
                <span className="text-xs text-muted block mb-1">#{idx + 1}</span>
                <select className="w-full p-2 border border-border text-sm bg-warm"
                  value={picks.drinks[idx]?.productId || ''}
                  onChange={handlePick('drinks', idx)}>
                  <option value="">-- 请选择 --</option>
                  {drinks.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ¥{p.basePrice}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Merch */}
          <div className="bg-white border border-border p-4">
            <h4 className="text-sm font-medium mb-3">精选周边（最多2个）</h4>
            {[0, 1].map(idx => (
              <div key={idx} className="mb-3">
                <span className="text-xs text-muted block mb-1">#{idx + 1}</span>
                <select className="w-full p-2 border border-border text-sm bg-warm"
                  value={picks.merch[idx]?.productId || ''}
                  onChange={handlePick('merch', idx)}>
                  <option value="">-- 请选择 --</option>
                  {merchs.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ¥{p.basePrice}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <button onClick={savePicks} disabled={saving}
          className="mt-4 py-2 px-6 bg-brand text-white text-sm">{saving ? '保存中...' : '保存推荐'}</button>
      </div>
    </div>
  )
}

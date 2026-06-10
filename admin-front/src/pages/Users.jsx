import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Users() {
  const [list, setList] = useState([])
  const [kw, setKw] = useState('')

  const load = () => api.getUsers(kw).then(r => r.code === 200 && setList(r.data.records || []))

  useEffect(() => { load() }, [])

  return (
    <div>
      <h2 className="text-lg text-brand font-medium mb-6">用户管理</h2>

      <div className="flex gap-3 mb-6">
        <input className="flex-1 p-2.5 border border-border text-sm bg-white outline-none focus:border-brand" placeholder="搜索手机号..." value={kw} onChange={e => setKw(e.target.value)} />
        <button onClick={load} className="py-2.5 px-5 bg-brand text-white text-sm">搜索</button>
      </div>

      <div className="bg-white border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted uppercase tracking-[0.05em]">
              <th className="p-3">ID</th><th className="p-3">昵称</th><th className="p-3">手机号</th><th className="p-3">注册时间</th>
            </tr>
          </thead>
          <tbody>
            {list.map(u => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.nickname || '-'}</td>
                <td className="p-3">{u.phone || '-'}</td>
                <td className="p-3 text-muted">{u.registerTime || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

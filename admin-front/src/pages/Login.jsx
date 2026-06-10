import { useState } from 'react'
import { api, setToken } from '../api'

export default function Login({ onLogin }) {
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!u || !p) { setErr('请输入账号和密码'); return }
    setLoading(true)
    try {
      const res = await api.login(u, p)
      if (res.code === 200) { setToken(res.data.token); onLogin() }
      else setErr(res.message || '登录失败')
    } catch { setErr('网络错误') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm px-4">
      <form onSubmit={submit} className="bg-white border border-border p-10 w-full max-w-sm text-center">
        <h1 className="text-xl text-brand tracking-[0.1em] mb-1 font-medium">MOYU COFFEE</h1>
        <p className="text-xs text-muted mb-8">管理后台</p>
        <input className="block w-full p-3 mb-3 border border-border text-sm bg-warm outline-none focus:border-brand" type="text" placeholder="账号" value={u} onChange={e => setU(e.target.value)} autoComplete="username" />
        <input className="block w-full p-3 mb-4 border border-border text-sm bg-warm outline-none focus:border-brand" type="password" placeholder="密码" value={p} onChange={e => setP(e.target.value)} autoComplete="current-password" />
        <button disabled={loading} className="w-full py-3 bg-brand text-white text-sm font-medium disabled:opacity-50" type="submit">{loading ? '登录中...' : '登 录'}</button>
        {err && <p className="text-red-500 text-xs mt-3">{err}</p>}
      </form>
    </div>
  )
}

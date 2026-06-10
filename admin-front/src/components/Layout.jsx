import { NavLink, Outlet } from 'react-router'
import { setToken } from '../api'

const links = [
  { to: '/', label: '仪表盘', icon: '📊' },
  { to: '/home-config', label: '首页管理', icon: '🏠' },
  { to: '/products', label: '商品管理', icon: '📦' },
  { to: '/categories', label: '分类管理', icon: '🗂' },
  { to: '/spec-groups', label: '规格管理', icon: '⚙' },
  { to: '/orders', label: '订单管理', icon: '📋' },
  { to: '/users', label: '用户管理', icon: '👥' },
]

export default function Layout({ onLogout }) {
  const logout = () => { setToken(''); onLogout() }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex md:flex-col w-56 bg-brand text-white shrink-0">
        <div className="px-6 py-6 border-b border-white/10">
          <h1 className="text-base tracking-[0.1em] font-medium">MOYU COFFEE</h1>
          <p className="text-xs text-white/50 mt-1">管理后台</p>
        </div>
        <nav className="flex-1 py-2">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`
              }>
              <span>{l.icon}</span>{l.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} className="px-6 py-4 text-xs text-white/40 hover:text-white border-t border-white/10 text-left">退出登录</button>
      </aside>

      {/* Mobile topbar */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="md:hidden flex items-center justify-between bg-brand text-white px-4 py-3">
          <span className="text-sm font-medium tracking-[0.05em]">MOYU</span>
          <button onClick={logout} className="text-xs text-white/60">退出</button>
        </header>
        <nav className="md:hidden flex bg-brand text-white/70 text-xs">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) =>
                `flex-1 text-center py-2.5 ${isActive ? 'text-white bg-white/10' : ''}`
              }>{l.label}</NavLink>
          ))}
        </nav>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 bg-warm overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

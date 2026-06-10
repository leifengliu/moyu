import { Routes, Route, Navigate } from 'react-router'
import { useState, useEffect } from 'react'
import { getToken } from './api'
import Login from './pages/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Categories from './pages/Categories'
import SpecGroups from './pages/SpecGroups'
import Orders from './pages/Orders'
import Users from './pages/Users'

export default function App() {
  const [authed, setAuthed] = useState(!!getToken())
  useEffect(() => { setAuthed(!!getToken()) }, [])

  if (!authed) return <Login onLogin={() => setAuthed(true)} />

  return (
    <Routes>
      <Route element={<Layout onLogout={() => setAuthed(false)} />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/spec-groups" element={<SpecGroups />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/users" element={<Users />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

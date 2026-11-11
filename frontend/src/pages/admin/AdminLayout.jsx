import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearToken, getToken } from '../../services/api'

const link = ({ isActive }) =>
  `px-3 py-2 text-sm rounded ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-200'}`

export default function AdminLayout() {
  const navigate = useNavigate()
  if (!getToken()) return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3">
          <span className="mr-4 font-bold text-slate-900">Admin</span>
          <NavLink to="/admin" end className={link}>Produtos</NavLink>
          <NavLink to="/admin/categorias" className={link}>Categorias</NavLink>
          <button
            onClick={() => { clearToken(); navigate('/admin/login') }}
            className="ml-auto text-sm text-slate-600 hover:text-slate-900">Sair</button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6"><Outlet /></main>
    </div>
  )
}

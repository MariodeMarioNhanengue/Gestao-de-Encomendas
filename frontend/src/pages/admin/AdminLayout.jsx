import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearToken, getToken } from '../../services/api'

const link = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-brand-50 text-brand-800' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

export default function AdminLayout() {
  const navigate = useNavigate()
  if (!getToken()) return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2.5">
          <Link to="/admin" aria-label="Mix Center - Painel" className="shrink-0">
            <img src="/logo.png" alt="Mix Center" width="108" height="36"
              style={{ height: 36, width: 'auto', maxWidth: 'none' }} />
          </Link>
          <nav aria-label="Administração" className="flex items-center gap-1">
            <NavLink to="/admin" end className={link}>Produtos</NavLink>
            <NavLink to="/admin/categorias" className={link}>Categorias</NavLink>
          </nav>
          <button onClick={() => { clearToken(); navigate('/admin/login') }}
            className="ml-auto text-sm font-medium text-slate-500 hover:text-slate-900">Sair</button>
        </div>
      </header>
      <main className="page"><Outlet /></main>
    </div>
  )
}
import { useEffect } from 'react'
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Categoria from './pages/Categoria.jsx'
import Produto from './pages/Produto.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminProdutos from './pages/admin/AdminProdutos.jsx'
import AdminProdutoForm from './pages/admin/AdminProdutoForm.jsx'
import AdminCategorias from './pages/admin/AdminCategorias.jsx'

function PublicLayout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname]) // nova página começa no topo
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Outlet />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminProdutos />} />
        <Route path="produtos/novo" element={<AdminProdutoForm />} />
        <Route path="produtos/:id" element={<AdminProdutoForm />} />
        <Route path="categorias" element={<AdminCategorias />} />
      </Route>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:slug" element={<Categoria />} />
        <Route path="/produto/:id" element={<Produto />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}

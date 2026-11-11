import { Routes, Route, Outlet } from 'react-router-dom'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminProdutos from './pages/admin/AdminProdutos.jsx'
import AdminProdutoForm from './pages/admin/AdminProdutoForm.jsx'
import AdminCategorias from './pages/admin/AdminCategorias.jsx'

function PublicLayout() {
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
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}

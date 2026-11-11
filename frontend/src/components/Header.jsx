import { Link, NavLink } from 'react-router-dom'

// Categorias provisórias; na Sprint 2 passam a vir de GET /api/categories
const categorias = [
  { slug: 'telefones', nome: 'Telefones' },
  { slug: 'acessorios-eletronicos', nome: 'Acessórios Eletrónicos' },
  { slug: 'pastas-bolsinhas', nome: 'Pastas (Bolsinhas)' },
]

const pill = ({ isActive }) =>
  `rounded-full px-3 py-1.5 text-sm font-medium transition ${
    isActive ? 'bg-accent-500 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2.5">
        <Link to="/" aria-label="Mix Center - Início" className="shrink-0">
          {/* Altura fixa em px: o logo nunca cresce, mesmo que o Tailwind falhe */}
          <img src="/logo.png" alt="Mix Center" width="120" height="40"
            style={{ height: 40, width: 'auto', maxWidth: 'none' }} />
        </Link>
        <nav aria-label="Categorias" className="flex flex-wrap gap-1">
          {categorias.map((c) => (
            <NavLink key={c.slug} to={`/categoria/${c.slug}`} className={pill}>{c.nome}</NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
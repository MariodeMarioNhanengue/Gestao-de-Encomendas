import { Link, NavLink } from 'react-router-dom'
import { catalogo } from '../services/api'
import { useAsync } from '../hooks/useAsync'

const pill = ({ isActive }) =>
  `whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition ${
    isActive ? 'bg-accent-500 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

export default function Header() {
  const { data: categorias, loading } = useAsync(() => catalogo.categorias(), [])

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-1 px-4 py-2.5">
        <Link to="/" aria-label="Mix Center - Início" className="shrink-0">
          {/* Altura fixa em px: o logo nunca cresce, mesmo que o Tailwind falhe */}
          <img src="/logo.png" alt="Mix Center" width="120" height="40"
            style={{ height: 40, width: 'auto', maxWidth: 'none' }} />
        </Link>
        {/* No telemóvel a lista passa para uma linha própria que se desloca na horizontal */}
        <nav aria-label="Categorias" className="no-scrollbar -mx-4 flex w-[calc(100%+2rem)] gap-1 overflow-x-auto px-4 sm:mx-0 sm:w-auto sm:px-0">
          {loading && [1, 2, 3].map((i) => <span key={i} className="skeleton h-8 w-24 rounded-full" aria-hidden="true" />)}
          {categorias?.map((c) => (
            <NavLink key={c.id} to={`/categoria/${c.slug}`} className={pill}>{c.nome}</NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

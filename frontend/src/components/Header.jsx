import { Link } from 'react-router-dom'

// Categorias provisórias; na Sprint 2 passam a vir de GET /api/categories
const categorias = [
  { slug: 'telefones', nome: 'Telefones' },
  { slug: 'acessorios-eletronicos', nome: 'Acessórios Eletrónicos' },
  { slug: 'pastas-bolsinhas', nome: 'Pastas (Bolsinhas)' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
        <Link to="/" className="text-lg font-bold text-slate-900">Encomendas</Link>
        <nav className="flex flex-wrap gap-4 text-sm text-slate-600">
          {categorias.map((c) => (
            <Link key={c.slug} to={`/categoria/${c.slug}`} className="hover:text-slate-900">
              {c.nome}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

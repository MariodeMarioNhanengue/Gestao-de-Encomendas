import { Link } from 'react-router-dom'
import { catalogo } from '../services/api'
import { useAsync, useTitulo } from '../hooks/useAsync'
import ProductCard from '../components/ProductCard.jsx'
import { Erro, GradeSkeleton, Vazio } from '../components/Estados.jsx'

const POR_CATEGORIA = 4 // pré-visualização na página inicial (RF01)

export default function Home() {
  useTitulo('')
  const { data, loading, erro, recarregar } = useAsync(
    () => Promise.all([catalogo.categorias(), catalogo.produtos()]).then(([categorias, produtos]) => ({ categorias, produtos })),
    [],
  )

  const secoes = (data?.categorias ?? [])
    .map((c) => ({ categoria: c, produtos: data.produtos.filter((p) => p.categoriaId === c.id) }))
    .filter((s) => s.produtos.length > 0)

  return (
    <>
      <section className="bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <h1 className="max-w-2xl text-3xl font-extrabold !text-white sm:text-4xl">
            Telefones, acessórios e pastas, entregues em Maputo e Matola
          </h1>
          <p className="mt-3 max-w-xl text-brand-100">
            Escolha o produto, indique a quantidade e veja logo o valor a pagar.
          </p>
          <a href="#catalogo" className="btn-accent mt-6 !px-5 !py-2.5">Ver produtos</a>
        </div>
      </section>

      <section id="catalogo" className="page space-y-10 py-8">
        {loading && <GradeSkeleton n={4} />}
        {erro && <Erro mensagem={erro.message} onRetry={recarregar} />}
        {!loading && !erro && secoes.length === 0 && (
          <Vazio titulo="Ainda não há produtos disponíveis" texto="Volte em breve, estamos a preparar o catálogo." />
        )}
        {secoes.map(({ categoria, produtos }) => (
          <div key={categoria.id}>
            <div className="mb-3 flex items-end justify-between gap-4">
              <h2 className="text-xl font-bold sm:text-2xl">{categoria.nome}</h2>
              <Link to={`/categoria/${categoria.slug}`} className="link shrink-0 text-sm">Ver todos →</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {produtos.slice(0, POR_CATEGORIA).map((p) => <ProductCard key={p.id} produto={p} />)}
            </div>
          </div>
        ))}
      </section>
    </>
  )
}

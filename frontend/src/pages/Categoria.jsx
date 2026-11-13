import { Link, useParams } from 'react-router-dom'
import { catalogo } from '../services/api'
import { useAsync, useTitulo } from '../hooks/useAsync'
import ProductCard from '../components/ProductCard.jsx'
import { Erro, GradeSkeleton, Vazio } from '../components/Estados.jsx'

export default function Categoria() {
  const { slug } = useParams()
  const { data, loading, erro, recarregar } = useAsync(
    () => Promise.all([catalogo.categorias(), catalogo.produtos(slug)]).then(([categorias, produtos]) => ({
      categoria: categorias.find((c) => c.slug === slug),
      produtos,
    })),
    [slug],
  )
  useTitulo(data?.categoria?.nome)

  if (erro?.status === 404) {
    return (
      <div className="page">
        <Vazio titulo="Categoria não encontrada" texto="Esta categoria não existe ou já não está disponível.">
          <Link to="/" className="btn-primary mt-4">Voltar ao início</Link>
        </Vazio>
      </div>
    )
  }

  return (
    <div className="page">
      <nav aria-label="Localização" className="mb-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-slate-800 hover:underline">Início</Link> <span aria-hidden="true">/</span>{' '}
        <span className="text-slate-700">{data?.categoria?.nome ?? '…'}</span>
      </nav>
      <h1 className="page-title mb-5">{data?.categoria?.nome ?? 'Produtos'}</h1>

      {loading && <GradeSkeleton n={8} />}
      {erro && <Erro mensagem={erro.message} onRetry={recarregar} />}
      {data && data.produtos.length === 0 && (
        <Vazio titulo="Sem produtos nesta categoria" texto="Ainda não há produtos disponíveis aqui.">
          <Link to="/" className="btn-outline mt-4">Ver outras categorias</Link>
        </Vazio>
      )}
      {data && data.produtos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {data.produtos.map((p) => <ProductCard key={p.id} produto={p} />)}
        </div>
      )}
    </div>
  )
}

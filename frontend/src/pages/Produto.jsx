import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { catalogo, formatMZN } from '../services/api'
import { useAsync, useTitulo } from '../hooks/useAsync'
import { calcularSubtotal, validarQuantidade } from '../lib/catalogo'
import ImagemProduto from '../components/ImagemProduto.jsx'
import QuantitySelector from '../components/QuantitySelector.jsx'
import { Erro, Vazio } from '../components/Estados.jsx'

// A encomenda (formulário, BI, zona) chega na Sprint 3. Quando existir, passar a true e ligar ao fluxo.
const ENCOMENDA_ATIVA = false

function Galeria({ imagens, nome }) {
  const [atual, setAtual] = useState(0)
  const lista = imagens?.length ? imagens : [null]
  const foto = lista[Math.min(atual, lista.length - 1)]
  return (
    <div>
      <div className="card aspect-square bg-slate-100">
        <ImagemProduto src={foto?.url} alt={nome} eager className="h-full w-full object-contain" />
      </div>
      {lista.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2" aria-label="Fotos do produto">
          {lista.map((img, i) => (
            <li key={img.id}>
              <button type="button" onClick={() => setAtual(i)} aria-label={`Ver foto ${i + 1}`} aria-current={i === atual}
                className={`block aspect-square w-full overflow-hidden rounded-lg border-2 bg-slate-100 transition ${
                  i === atual ? 'border-accent-500' : 'border-transparent hover:border-slate-300'}`}>
                <ImagemProduto src={img.url} alt="" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Compra({ produto }) {
  const [texto, setTexto] = useState('1')
  const limite = produto.limiteQuantidade
  const { ok, quantidade, erro } = validarQuantidade(texto, limite)
  const subtotal = ok ? calcularSubtotal(produto.preco, quantidade) : null

  if (!produto.disponivel) {
    return <p className="alert-error mt-6 !text-base font-medium">Produto esgotado de momento.</p>
  }

  return (
    <div className="mt-6 space-y-5">
      <div>
        <p className="label mb-1">Quantidade</p>
        <QuantitySelector valor={texto} onChange={setTexto} limite={limite} quantidade={quantidade} invalido={!ok} />
        <p id="qtd-ajuda" role={erro ? 'alert' : undefined}
          className={`mt-2 text-sm ${erro ? 'font-medium text-red-600' : 'text-slate-500'}`}>
          {erro ?? `Máximo de ${limite} ${limite === 1 ? 'unidade' : 'unidades'} por encomenda.`}
        </p>
      </div>

      <dl className="rounded-xl border border-slate-200 bg-slate-50 p-4" aria-live="polite">
        <div className="flex items-baseline justify-between text-sm text-slate-600">
          <dt>Preço unitário</dt><dd>{formatMZN(produto.preco)}</dd>
        </div>
        <div className="mt-1 flex items-baseline justify-between text-sm text-slate-600">
          <dt>Quantidade</dt><dd>{ok ? quantidade : '—'}</dd>
        </div>
        <div className="mt-3 flex items-baseline justify-between border-t border-slate-200 pt-3">
          <dt className="font-semibold text-slate-900">Subtotal</dt>
          <dd className="price text-2xl">{ok ? formatMZN(subtotal) : '—'}</dd>
        </div>
        <p className="mt-2 text-xs text-slate-500">A taxa de entrega é adicionada ao finalizar a encomenda.</p>
      </dl>

      <div>
        <button className="btn-accent w-full !py-3 !text-base" disabled={!ok || !ENCOMENDA_ATIVA}>
          Encomendar
        </button>
        {!ENCOMENDA_ATIVA && <p className="mt-2 text-center text-xs text-slate-500">Encomenda online disponível em breve.</p>}
      </div>
    </div>
  )
}

export default function Produto() {
  const { id } = useParams()
  const { data: produto, loading, erro, recarregar } = useAsync(() => catalogo.produto(id), [id])
  useTitulo(produto?.nome)

  if (erro?.status === 404) {
    return (
      <div className="page">
        <Vazio titulo="Produto não encontrado" texto="Este produto não existe ou já não está disponível.">
          <Link to="/" className="btn-primary mt-4">Voltar ao início</Link>
        </Vazio>
      </div>
    )
  }
  if (erro) return <div className="page"><Erro mensagem={erro.message} onRetry={recarregar} /></div>

  if (loading || !produto) {
    return (
      <div className="page grid gap-8 md:grid-cols-2" aria-hidden="true">
        <div className="skeleton aspect-square rounded-xl" />
        <div className="space-y-4"><div className="skeleton h-4 w-1/3" /><div className="skeleton h-8 w-4/5" /><div className="skeleton h-6 w-1/3" /></div>
      </div>
    )
  }

  return (
    <div className="page">
      <nav aria-label="Localização" className="mb-4 text-sm text-slate-500">
        <Link to="/" className="hover:text-slate-800 hover:underline">Início</Link> <span aria-hidden="true">/</span>{' '}
        <Link to={`/categoria/${produto.categoriaSlug}`} className="hover:text-slate-800 hover:underline">{produto.categoriaNome}</Link>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 md:gap-10">
        {/* key: ao mudar de produto a galeria volta à primeira foto */}
        <Galeria key={produto.id} imagens={produto.imagens} nome={produto.nome} />

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">{produto.categoriaNome}</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{produto.nome}</h1>
          {produto.tipoModelo && <p className="mt-1 text-slate-500">{produto.tipoModelo}</p>}
          <p className="price mt-4 text-3xl">{formatMZN(produto.preco)}</p>

          {/* key: ao mudar de produto a quantidade volta a 1 */}
          <Compra key={produto.id} produto={produto} />

          {produto.descricao && (
            <section className="mt-8 border-t border-slate-200 pt-6">
              <h2 className="text-lg font-semibold">Descrição</h2>
              <p className="mt-2 whitespace-pre-line text-slate-600">{produto.descricao}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { formatMZN } from '../services/api'
import ImagemProduto from './ImagemProduto.jsx'

export default function ProductCard({ produto }) {
  const foto = produto.imagens?.[0]
  return (
    <Link to={`/produto/${produto.id}`}
      className="card group flex flex-col transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-square bg-slate-100">
        <ImagemProduto src={foto?.url} alt={produto.nome}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        {!produto.disponivel && (
          <span className="badge absolute left-2 top-2 bg-slate-900/80 text-white">Esgotado</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-0.5 p-3 sm:p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-500">{produto.categoriaNome}</p>
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 sm:text-base">{produto.nome}</h3>
        {produto.tipoModelo && <p className="line-clamp-1 text-xs text-slate-500">{produto.tipoModelo}</p>}
        <p className="price mt-auto pt-2 text-base sm:text-lg">{formatMZN(produto.preco)}</p>
      </div>
    </Link>
  )
}

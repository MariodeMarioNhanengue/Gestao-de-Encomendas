import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { categoriasAdmin, produtosAdmin, formatMZN } from '../../services/api'

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaId, setCategoriaId] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => { categoriasAdmin.listar().then(setCategorias).catch((e) => setErro(e.message)) }, [])
  const carregar = () => produtosAdmin.listar(categoriaId).then(setProdutos).catch((e) => setErro(e.message))
  useEffect(() => { carregar() }, [categoriaId])

  async function alternar(p) {
    setErro('')
    try { await produtosAdmin.ativar(p.id, !p.ativo); carregar() } catch (err) { setErro(err.message) }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h1 className="page-title">Produtos</h1>
        <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="input !mt-0 !w-auto">
          <option value="">Todas as categorias</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <Link to="/admin/produtos/novo" className="btn-accent ml-auto">+ Novo produto</Link>
      </div>
      {erro && <p className="alert-error mb-3">{erro}</p>}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {produtos.map((p) => {
          const foto = p.imagens.find((i) => i.principal) ?? p.imagens[0]
          return (
            <div key={p.id} className="card">
              {foto
                ? <img src={foto.url} alt={p.nome} className="h-44 w-full object-cover" />
                : <div className="flex h-44 items-center justify-center bg-slate-100 text-sm text-slate-400">Sem foto</div>}
              <div className="space-y-1 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{p.categoriaNome}</p>
                <p className="font-semibold text-slate-900">{p.nome}</p>
                <p><span className="price">{formatMZN(p.preco)}</span> <span className="text-sm text-slate-500">· stock {p.stock}</span></p>
                <div className="flex items-center justify-between pt-2">
                  <Link to={`/admin/produtos/${p.id}`} className="link text-sm">Editar</Link>
                  <button onClick={() => alternar(p)} className={p.ativo ? 'badge-ok' : 'badge-off'}>
                    {p.ativo ? 'Ativo' : 'Inativo'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {produtos.length === 0 && !erro && <p className="text-slate-500">Ainda não há produtos.</p>}
    </div>
  )
}

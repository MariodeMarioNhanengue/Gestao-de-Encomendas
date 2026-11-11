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
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold text-slate-900">Produtos</h1>
        <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}
          className="rounded border bg-white px-3 py-2 text-sm">
          <option value="">Todas as categorias</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <Link to="/admin/produtos/novo" className="ml-auto rounded bg-slate-900 px-4 py-2 text-sm text-white">
          Novo produto
        </Link>
      </div>
      {erro && <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-700">{erro}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {produtos.map((p) => {
          const foto = p.imagens.find((i) => i.principal) ?? p.imagens[0]
          return (
            <div key={p.id} className="overflow-hidden rounded-lg border bg-white">
              {foto
                ? <img src={foto.url} alt={p.nome} className="h-44 w-full object-cover" />
                : <div className="flex h-44 items-center justify-center bg-slate-100 text-sm text-slate-400">Sem foto</div>}
              <div className="space-y-1 p-4">
                <p className="text-xs text-slate-500">{p.categoriaNome}</p>
                <p className="font-medium text-slate-900">{p.nome}</p>
                <p className="text-slate-800">{formatMZN(p.preco)} · stock {p.stock}</p>
                <div className="flex items-center justify-between pt-2 text-sm">
                  <Link to={`/admin/produtos/${p.id}`} className="text-slate-700 underline">Editar</Link>
                  <button onClick={() => alternar(p)}
                    className={p.ativo ? 'text-green-700' : 'text-slate-500'}>
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

import { useEffect, useState } from 'react'
import { categoriasAdmin } from '../../services/api'

export default function AdminCategorias() {
  const [lista, setLista] = useState([])
  const [nome, setNome] = useState('')
  const [erro, setErro] = useState('')

  const carregar = () => categoriasAdmin.listar().then(setLista).catch((e) => setErro(e.message))
  useEffect(() => { carregar() }, [])

  async function criar(e) {
    e.preventDefault()
    setErro('')
    try {
      await categoriasAdmin.criar({ nome, ordem: lista.length + 1 })
      setNome('')
      carregar()
    } catch (err) { setErro(err.message) }
  }

  async function alternar(c) {
    setErro('')
    try { await categoriasAdmin.ativar(c.id, !c.ativa); carregar() } catch (err) { setErro(err.message) }
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-slate-900">Categorias</h1>
      {erro && <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-700">{erro}</p>}
      <form onSubmit={criar} className="mb-6 flex gap-2">
        <input required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nova categoria"
          className="w-full max-w-xs rounded border px-3 py-2" />
        <button className="rounded bg-slate-900 px-4 py-2 text-white">Adicionar</button>
      </form>
      <ul className="divide-y rounded border bg-white">
        {lista.map((c) => (
          <li key={c.id} className="flex items-center justify-between px-4 py-3">
            <span className={c.ativa ? 'text-slate-900' : 'text-slate-400 line-through'}>{c.nome}</span>
            <button onClick={() => alternar(c)} className="text-sm text-slate-600 hover:text-slate-900">
              {c.ativa ? 'Desativar' : 'Ativar'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

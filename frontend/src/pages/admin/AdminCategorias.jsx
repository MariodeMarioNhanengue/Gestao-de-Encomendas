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
      <h1 className="page-title mb-4">Categorias</h1>
      {erro && <p className="alert-error mb-3">{erro}</p>}
      <form onSubmit={criar} className="mb-6 flex max-w-md gap-2">
        <input required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nova categoria" className="input !mt-0" />
        <button className="btn-primary">Adicionar</button>
      </form>
      <ul className="card divide-y divide-slate-100">
        {lista.map((c) => (
          <li key={c.id} className="flex items-center justify-between px-4 py-3">
            <span className={c.ativa ? 'font-medium text-slate-900' : 'text-slate-400 line-through'}>{c.nome}</span>
            <div className="flex items-center gap-3">
              <span className={c.ativa ? 'badge-ok' : 'badge-off'}>{c.ativa ? 'Ativa' : 'Inativa'}</span>
              <button onClick={() => alternar(c)} className="link text-sm">{c.ativa ? 'Desativar' : 'Ativar'}</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

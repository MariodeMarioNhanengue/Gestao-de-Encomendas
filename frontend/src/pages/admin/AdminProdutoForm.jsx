import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { categoriasAdmin, produtosAdmin } from '../../services/api'

const vazio = { categoriaId: '', nome: '', descricao: '', tipoModelo: '', preco: '', stock: 0, quantidadeMaxima: '' }

export default function AdminProdutoForm() {
  const { id } = useParams()
  const editar = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(vazio)
  const [categorias, setCategorias] = useState([])
  const [existentes, setExistentes] = useState([])
  const [novas, setNovas] = useState([])
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    categoriasAdmin.listar().then(setCategorias).catch((e) => setErro(e.message))
    if (editar) {
      produtosAdmin.obter(id).then((p) => {
        setForm({
          categoriaId: p.categoriaId, nome: p.nome, descricao: p.descricao ?? '', tipoModelo: p.tipoModelo ?? '',
          preco: p.preco, stock: p.stock, quantidadeMaxima: p.quantidadeMaxima ?? '',
        })
        setExistentes(p.imagens)
      }).catch((e) => setErro(e.message))
    }
  }, [id])

  const previews = useMemo(() => novas.map((f) => ({ f, url: URL.createObjectURL(f) })), [novas])
  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews])

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setErro('')
    if (!editar && novas.length === 0) { setErro('Adicione pelo menos uma foto do produto'); return }
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => { if (v !== '' && v !== null) fd.append(k, v) })
    novas.forEach((f) => fd.append('imagens', f))
    setLoading(true)
    try {
      if (editar) await produtosAdmin.atualizar(id, fd)
      else await produtosAdmin.criar(fd)
      navigate('/admin')
    } catch (err) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function removerFoto(img) {
    setErro('')
    try { const p = await produtosAdmin.removerFoto(id, img.id); setExistentes(p.imagens) }
    catch (err) { setErro(err.message) }
  }
  async function tornarPrincipal(img) {
    setErro('')
    try { const p = await produtosAdmin.fotoPrincipal(id, img.id); setExistentes(p.imagens) }
    catch (err) { setErro(err.message) }
  }

  return (
    <form onSubmit={submit} className="card max-w-2xl space-y-4 p-6">
      <h1 className="page-title">{editar ? 'Editar produto' : 'Novo produto'}</h1>
      {erro && <p className="alert-error">{erro}</p>}

      <label className="label">Categoria
        <select required value={form.categoriaId} onChange={set('categoriaId')} className="input">
          <option value="">Escolha a categoria</option>
          {categorias.filter((c) => c.ativa || c.id === form.categoriaId)
            .map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
      </label>
      <label className="label">Nome
        <input required maxLength={150} value={form.nome} onChange={set('nome')} className="input" />
      </label>
      <label className="label">Modelo / tipo (opcional)
        <input maxLength={80} value={form.tipoModelo} onChange={set('tipoModelo')} className="input" placeholder="Ex.: Samsung Galaxy A15" />
      </label>
      <label className="label">Descrição
        <textarea rows={3} value={form.descricao} onChange={set('descricao')} className="input" />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="label">Preço (MZN)
          <input required type="number" min="0.01" step="0.01" value={form.preco} onChange={set('preco')} className="input" />
        </label>
        <label className="label">Stock
          <input required type="number" min="0" step="1" value={form.stock} onChange={set('stock')} className="input" />
        </label>
        <label className="label">Máx. por encomenda
          <input type="number" min="1" step="1" value={form.quantidadeMaxima} onChange={set('quantidadeMaxima')} className="input" placeholder="padrão" />
        </label>
      </div>

      {existentes.length > 0 && (
        <div>
          <p className="label mb-2">Fotos atuais</p>
          <div className="flex flex-wrap gap-3">
            {existentes.map((img) => (
              <div key={img.id} className="w-28 text-center text-xs">
                <img src={img.url} alt="" className={`h-28 w-28 rounded-lg object-cover ${img.principal ? 'ring-2 ring-accent-500' : ''}`} />
                {img.principal
                  ? <span className="badge bg-accent-100 text-accent-700">Principal</span>
                  : <button type="button" onClick={() => tornarPrincipal(img)} className="link">Tornar principal</button>}
                <button type="button" onClick={() => removerFoto(img)} className="btn-danger-ghost block w-full">Remover</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="label">
          {editar ? 'Adicionar mais fotos' : 'Fotos do produto'} (JPG, PNG ou WebP, até 5 MB)
          <input type="file" multiple accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setNovas(Array.from(e.target.files))}
            className="mt-1 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:font-semibold file:text-brand-700 hover:file:bg-brand-100" />
        </label>
        {previews.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {previews.map((p, i) => <img key={i} src={p.url} alt="" className="h-28 w-28 rounded-lg object-cover" />)}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button disabled={loading} className="btn-primary">{loading ? 'A guardar...' : 'Guardar'}</button>
        <button type="button" onClick={() => navigate('/admin')} className="btn-outline">Cancelar</button>
      </div>
    </form>
  )
}

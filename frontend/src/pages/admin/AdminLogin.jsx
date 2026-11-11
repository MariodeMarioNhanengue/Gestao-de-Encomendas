import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin, setToken } from '../../services/api'

const IconMail = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
  </svg>
)
const IconLock = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
)
const IconEye = (off) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />
    {off && <path d="M4 4l16 16" />}
  </svg>
)

const destaques = [
  'Gestão de produtos e categorias',
  'Controlo das encomendas dos clientes',
  'Acesso seguro e reservado à equipa',
]

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrar, setMostrar] = useState(false)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const r = await adminLogin(email, password)
      setToken(r.token)
      navigate('/admin')
    } catch (err) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* Painel de marca (só em ecrãs grandes) */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-accent-500 via-accent-400 to-transparent" />

        <p className="relative text-sm font-semibold uppercase tracking-widest text-accent-400">
          Tecnologia · Electricidade · Escritório
        </p>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight !text-white">
            Painel de administração
          </h2>
          <p className="mt-4 text-lg text-brand-100">
            Faça a gestão do catálogo e das encomendas da Mix Center num só lugar.
          </p>
          <ul className="mt-8 space-y-3">
            {destaques.map((d) => (
              <li key={d} className="flex items-center gap-3 text-brand-100">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-white">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
                </span>
                {d}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-brand-200">© {new Date().getFullYear()} Mix Center. Todos os direitos reservados.</p>
      </aside>

      {/* Formulário */}
      <main className="flex items-center justify-center bg-slate-50 px-6 py-12 lg:bg-white">
        <div className="w-full max-w-sm">
          <img src="/logo.png" alt="Mix Center" width="200" height="76"
            className="mx-auto" style={{ height: 76, width: 'auto', maxWidth: 'none' }} />

          <div className="mt-8 text-center">
            <h1 className="text-2xl font-bold text-brand-900">Bem-vindo de volta</h1>
            <p className="mt-1 text-sm text-slate-500">Inicie sessão para aceder ao painel.</p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-5" noValidate={false}>
            {erro && (
              <div role="alert" className="alert-error flex items-start gap-2">
                <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg>
                <span>{erro}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="label">Email</label>
              <div className="relative mt-1">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">{IconMail}</span>
                <input id="email" type="email" required autoComplete="username" autoFocus
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@mixcenter.co.mz" className="input !mt-0 !pl-10" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label">Palavra-passe</label>
              <div className="relative mt-1">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">{IconLock}</span>
                <input id="password" type={mostrar ? 'text' : 'password'} required autoComplete="current-password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" className="input !mt-0 !px-10" />
                <button type="button" onClick={() => setMostrar((v) => !v)}
                  aria-label={mostrar ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-700">
                  {IconEye(mostrar)}
                </button>
              </div>
            </div>

            <button disabled={loading}
              className="btn-primary w-full !py-3 !text-base shadow-sm hover:shadow-md">
              {loading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".3" strokeWidth="3" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}
              {loading ? 'A entrar...' : 'Entrar'}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            Acesso reservado a administradores autorizados.
          </p>
        </div>
      </main>
    </div>
  )
}
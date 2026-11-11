import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin, setToken } from '../../services/api'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Entrar como administrador</h1>
        {erro && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{erro}</p>}
        <label className="block text-sm text-slate-700">Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        <label className="block text-sm text-slate-700">Palavra-passe
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        <button disabled={loading} className="w-full rounded bg-slate-900 py-2 text-white disabled:opacity-50">
          {loading ? 'A entrar...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}

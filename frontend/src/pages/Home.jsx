import { useEffect, useState } from 'react'
import { ping } from '../services/api'

export default function Home() {
  const [estado, setEstado] = useState('a verificar...')

  useEffect(() => {
    ping().then(() => setEstado('ligado')).catch(() => setEstado('indisponível'))
  }, [])

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Sprint 0 concluída</h1>
      <p className="mt-2 text-slate-600">
        Backend: <span className="font-medium">{estado}</span>. O catálogo público chega na Sprint 2.
      </p>
    </section>
  )
}

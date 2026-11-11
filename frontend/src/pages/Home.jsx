import { useEffect, useState } from 'react'
import { ping } from '../services/api'

export default function Home() {
  const [estado, setEstado] = useState('a verificar')

  useEffect(() => {
    ping().then(() => setEstado('ligado')).catch(() => setEstado('indisponível'))
  }, [])

  const ok = estado === 'ligado'
  return (
    <>
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="text-3xl font-extrabold !text-white sm:text-4xl">
            Telefones, acessórios e pastas, entregues em Maputo e Matola
          </h1>
          <p className="mt-3 max-w-xl text-brand-100">
            Escolha o produto, indique a quantidade e faça a sua encomenda em poucos passos.
          </p>
          <span className={`mt-6 ${ok ? 'badge-ok' : 'badge bg-white/20 text-white'}`}>
            Servidor: {estado}
          </span>
        </div>
      </section>
      <section className="page">
        <p className="text-slate-600">O catálogo de produtos chega na Sprint 2.</p>
      </section>
    </>
  )
}

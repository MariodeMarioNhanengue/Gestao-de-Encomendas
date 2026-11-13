/** Peças reutilizáveis de estado: carregamento, erro e vazio. */

export function GradeSkeleton({ n = 4 }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="card">
          <div className="skeleton aspect-square" />
          <div className="space-y-2 p-4">
            <div className="skeleton h-3 w-1/3" />
            <div className="skeleton h-4 w-4/5" />
            <div className="skeleton h-5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function Erro({ mensagem, onRetry }) {
  return (
    <div role="alert" className="card mx-auto max-w-md p-6 text-center">
      <p className="font-semibold text-slate-900">Não foi possível carregar</p>
      <p className="mt-1 text-sm text-slate-600">{mensagem}</p>
      {onRetry && <button onClick={onRetry} className="btn-primary mt-4">Tentar novamente</button>}
    </div>
  )
}

export function Vazio({ titulo, texto, children }) {
  return (
    <div className="card mx-auto max-w-md p-8 text-center">
      <p className="font-semibold text-slate-900">{titulo}</p>
      {texto && <p className="mt-1 text-sm text-slate-600">{texto}</p>}
      {children}
    </div>
  )
}

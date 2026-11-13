import { useCallback, useEffect, useState } from 'react'

/** Corre uma função assíncrona quando as dependências mudam. Devolve { loading, data, erro, recarregar }. */
export function useAsync(fn, deps) {
  const [estado, setEstado] = useState({ loading: true, data: null, erro: null })
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let vivo = true
    setEstado((s) => ({ ...s, loading: true, erro: null }))
    fn()
      .then((data) => vivo && setEstado({ loading: false, data, erro: null }))
      .catch((erro) => vivo && setEstado({ loading: false, data: null, erro }))
    return () => { vivo = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tentativa])

  const recarregar = useCallback(() => setTentativa((t) => t + 1), [])
  return { ...estado, recarregar }
}

/** Atualiza o título do separador do browser. */
export function useTitulo(titulo) {
  useEffect(() => {
    const anterior = document.title
    document.title = titulo ? `${titulo} | Mix Center` : 'Mix Center'
    return () => { document.title = anterior }
  }, [titulo])
}

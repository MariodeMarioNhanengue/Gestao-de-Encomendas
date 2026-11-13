import { useEffect, useState } from 'react'

/** Imagem com carregamento diferido e substituto quando não existe ou falha (RNF03). */
export default function ImagemProduto({ src, alt, className = '', eager = false }) {
  const [falhou, setFalhou] = useState(false)
  useEffect(() => { setFalhou(false) }, [src])

  if (!src || falhou) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 text-slate-300 ${className}`} role="img" aria-label={alt}>
        <svg viewBox="0 0 24 24" className="h-1/3 w-1/3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="m21 16-5-5-8 8" />
        </svg>
      </div>
    )
  }
  return (
    <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async"
      onError={() => setFalhou(true)} className={className} />
  )
}

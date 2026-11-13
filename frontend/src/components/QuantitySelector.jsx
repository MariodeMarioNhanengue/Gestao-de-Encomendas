/** Seletor de quantidade: botões − / + e campo numérico. O valor é guardado como texto pelo pai. */
export default function QuantitySelector({ valor, onChange, limite, quantidade, invalido }) {
  const menos = () => onChange(String(Math.min(limite, Math.max(1, (quantidade || 1) - 1))))
  const mais = () => onChange(String(Math.min(limite, (quantidade || 0) + 1)))

  return (
    <div className="inline-flex items-stretch overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm">
      <button type="button" onClick={menos} disabled={invalido ? false : quantidade <= 1}
        aria-label="Diminuir quantidade"
        className="w-11 text-xl font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-white">−</button>
      <input value={valor} inputMode="numeric" autoComplete="off" aria-label="Quantidade"
        aria-invalid={invalido} aria-describedby="qtd-ajuda"
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
        onBlur={() => { if (valor === '') onChange('1') }}
        className="w-16 border-x border-slate-300 py-2 text-center text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500" />
      <button type="button" onClick={mais} disabled={!invalido && quantidade >= limite}
        aria-label="Aumentar quantidade"
        className="w-11 text-xl font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-white">+</button>
    </div>
  )
}

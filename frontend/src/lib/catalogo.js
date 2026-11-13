/** Cálculo e validação de quantidade (RN16, RF23, RF24). O servidor volta a validar e a calcular (RN14). */

/** Subtotal = preço × quantidade, calculado em cêntimos para evitar erros de vírgula flutuante. */
export function calcularSubtotal(preco, quantidade) {
  const centimos = Math.round((Number(preco) || 0) * 100)
  return (centimos * quantidade) / 100
}

/**
 * Valida o texto escrito pelo cliente: inteiro >= 1 e <= limite.
 * Devolve { ok, quantidade, erro }.
 */
export function validarQuantidade(texto, limite) {
  const t = String(texto ?? '').trim()
  if (!/^\d+$/.test(t)) return { ok: false, quantidade: 0, erro: 'Indique uma quantidade (número inteiro).' }
  const quantidade = Number(t)
  if (quantidade < 1) return { ok: false, quantidade, erro: 'A quantidade mínima é 1.' }
  if (quantidade > limite) {
    return {
      ok: false,
      quantidade,
      erro: limite === 1
        ? 'Só é possível encomendar 1 unidade deste produto.'
        : `Só é possível encomendar até ${limite} unidades deste produto.`,
    }
  }
  return { ok: true, quantidade, erro: null }
}

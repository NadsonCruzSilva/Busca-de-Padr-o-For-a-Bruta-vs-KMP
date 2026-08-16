// ============================================================
// Motor de busca de padrão (Força Bruta e KMP) orientado a trace.
// Gera uma sequência de passos ("trace") para animação passo a passo.
// ============================================================

export type Algorithm = 'brute' | 'kmp'

export type StepEvent =
  | 'compare' // comparação bem-sucedida (match)
  | 'mismatch' // comparação com falha
  | 'shift' // Força Bruta: reinicia/retrocede (j = 0, i volta)
  | 'found' // ocorrência completa do padrão
  | 'lps-consult' // KMP: consulta a tabela LPS
  | 'j-update' // KMP: j = LPS[j - 1] (i não retrocede)
  | 'advance' // KMP: j = 0, avança i
  | 'done' // fim da busca

export interface SimStep {
  event: StepEvent
  /** posição atual no texto */
  i: number
  /** posição atual no padrão */
  j: number
  /** alinhamento (deslocamento) atual: offset = i - j */
  offset: number
  /** caractere do texto sendo comparado (nulo fora de uma comparação) */
  textChar: string | null
  /** caractere do padrão sendo comparado (nulo fora de uma comparação) */
  patternChar: string | null
  /** resultado da comparação */
  result: 'match' | 'mismatch' | null
  /** contador acumulado de comparações */
  comparisons: number
  /** índice consultado na tabela LPS */
  lpsIndex?: number
  /** valor lido da tabela LPS */
  lpsValue?: number
  /** novo valor de j após o ajuste */
  newJ?: number
  /** posição da ocorrência encontrada */
  foundAt?: number
  /** mensagem curta em pt-BR para exibição */
  note?: string
}

export interface Trace {
  algorithm: Algorithm
  text: string
  pattern: string
  lps: number[]
  steps: SimStep[]
  comparisons: number
  found: number[]
}

/**
 * Tabela LPS (Longest Proper Prefix which is also Suffix).
 * lps[i] = maior tamanho de um prefixo próprio de P[0..i]
 * que também é sufixo de P[0..i].
 */
export function calculaLPS(pattern: string): number[] {
  const m = pattern.length
  const lps = new Array<number>(m).fill(0)
  let len = 0
  let i = 1
  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++
      lps[i] = len
      i++
    } else if (len > 0) {
      len = lps[len - 1]
    } else {
      lps[i] = 0
      i++
    }
  }
  return lps
}

/**
 * Gera o trace de execução do algoritmo selecionado sobre text/pattern.
 * Ambos os algoritmos usam a mesma representação (i no texto, j no padrão,
 * offset = i - j), o que deixa a única diferença explícita:
 *   Força Bruta: em falha, j volta a 0 e i retrocede (offset + 1).
 *   KMP:         em falha, i não retrocede; j = LPS[j - 1].
 */
export function generateTrace(
  algorithm: Algorithm,
  text: string,
  pattern: string,
): Trace {
  const n = text.length
  const m = pattern.length
  const lps = algorithm === 'kmp' ? calculaLPS(pattern) : []
  const steps: SimStep[] = []
  const found: number[] = []
  let comparisons = 0

  const push = (step: Omit<SimStep, 'comparisons'>) =>
    steps.push({ ...step, comparisons })

  if (m === 0 || m > n) {
    push({
      event: 'done',
      i: 0,
      j: 0,
      offset: 0,
      textChar: null,
      patternChar: null,
      result: null,
      note: 'Padrão vazio ou maior que o texto',
    })
    return { algorithm, text, pattern, lps, steps, comparisons, found }
  }

  let i = 0
  let j = 0

  if (algorithm === 'kmp') {
    while (i < n) {
      if (text[i] === pattern[j]) {
        comparisons++
        push({
          event: 'compare',
          i,
          j,
          offset: i - j,
          textChar: text[i],
          patternChar: pattern[j],
          result: 'match',
        })
        i++
        j++
        if (j === m) {
          const at = i - m
          found.push(at)
          push({
            event: 'found',
            i,
            j,
            offset: at,
            textChar: null,
            patternChar: null,
            result: null,
            foundAt: at,
            note: `Ocorrência em T[${at}..${at + m - 1}]`,
          })
          const next = lps[j - 1]
          push({
            event: 'lps-consult',
            i,
            j,
            offset: at,
            textChar: null,
            patternChar: null,
            result: null,
            lpsIndex: j - 1,
            lpsValue: next,
            newJ: next,
            note: `Consultar LPS[${j - 1}] = ${next} (reutilizar sobreposição)`,
          })
          j = next
        }
      } else {
        comparisons++
        push({
          event: 'mismatch',
          i,
          j,
          offset: i - j,
          textChar: text[i],
          patternChar: pattern[j],
          result: 'mismatch',
          note: 'Falha',
        })
        if (j > 0) {
          const next = lps[j - 1]
          push({
            event: 'lps-consult',
            i,
            j,
            offset: i - j,
            textChar: null,
            patternChar: null,
            result: null,
            lpsIndex: j - 1,
            lpsValue: next,
            newJ: next,
            note: `Consultar LPS[${j - 1}] = ${next}`,
          })
          j = next
          push({
            event: 'j-update',
            i,
            j,
            offset: i - j,
            textChar: null,
            patternChar: null,
            result: null,
            newJ: j,
            note: 'i não retrocede; j = LPS[j − 1]',
          })
        } else {
          push({
            event: 'advance',
            i,
            j,
            offset: i - j,
            textChar: null,
            patternChar: null,
            result: null,
            note: 'j = 0 → avança i',
          })
          i++
        }
      }
    }
  } else {
    while (i - j <= n - m) {
      if (text[i] === pattern[j]) {
        comparisons++
        push({
          event: 'compare',
          i,
          j,
          offset: i - j,
          textChar: text[i],
          patternChar: pattern[j],
          result: 'match',
        })
        i++
        j++
        if (j === m) {
          const at = i - m
          found.push(at)
          push({
            event: 'found',
            i,
            j,
            offset: at,
            textChar: null,
            patternChar: null,
            result: null,
            foundAt: at,
            note: `Ocorrência em T[${at}..${at + m - 1}]`,
          })
          const next = at + 1
          push({
            event: 'shift',
            i: next,
            j: 0,
            offset: next,
            textChar: null,
            patternChar: null,
            result: null,
            note: 'Reinicia: j = 0, i = offset + 1',
          })
          i = next
          j = 0
        }
      } else {
        comparisons++
        push({
          event: 'mismatch',
          i,
          j,
          offset: i - j,
          textChar: text[i],
          patternChar: pattern[j],
          result: 'mismatch',
          note: 'Falha',
        })
        const next = i - j + 1
        push({
          event: 'shift',
          i: next,
          j: 0,
          offset: next,
          textChar: null,
          patternChar: null,
          result: null,
          note: 'Retrocede: j = 0, i volta para offset + 1',
        })
        i = next
        j = 0
      }
    }
  }

  push({
    event: 'done',
    i: Math.min(i, n),
    j: j,
    offset: Math.min(i - j, Math.max(n - m, 0)),
    textChar: null,
    patternChar: null,
    result: null,
    note: found.length
      ? `Busca concluída: ${found.length} ocorrência${found.length > 1 ? 's' : ''} · ${comparisons} comparações`
      : `Busca concluída: nenhuma ocorrência · ${comparisons} comparações`,
  })

  return { algorithm, text, pattern, lps, steps, comparisons, found }
}

/** Comparações totais previstas pela teoria (sem gerar o trace completo). */
export function theoreticalBruteComparisons(
  n: number,
  m: number,
): { best: number; average: number; worst: number } {
  return {
    best: n - m + 1,
    average: 2 * n, // aproximação para alfabeto grande/textos naturais
    worst: (n - m + 1) * m,
  }
}

export function theoreticalKmpComparisons(n: number, m: number): number {
  return n + m
}

export const MAX_TEXT_LEN = 60
export const MAX_PATTERN_LEN = 40
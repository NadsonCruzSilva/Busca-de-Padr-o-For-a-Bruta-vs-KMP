// ============================================================
// DADOS EXPERIMENTAIS — ANÁLISE EMPÍRICA
// ============================================================
// IMPORTANTE: estes dados são DEMONSTRATIVOS (DADOS DEMONSTRATIVOS).
// Eles foram gerados a partir das fórmulas teóricas dos algoritmos
// (comparações) e de valores plausíveis de tempo, APENAS para que os
// gráficos e tabelas possam ser exibidos. NÃO representam medições reais.
//
// Para substituir pelos resultados reais da sua bateria de experimentos
// (Java, System.nanoTime, múltiplas execuções, aquecimento, descarte de
// extremos), edite apenas as estruturas abaixo mantendo o formato.
// O restante do site consome este arquivo automaticamente.
// ============================================================

export interface BenchPoint {
  /** tamanho do texto */
  n: number
  /** tamanho do padrão */
  m: number
  /** Força Bruta */
  brute: {
    /** número de comparações */
    comparisons: number
    /** tempo em milissegundos */
    timeMs: number
  }
  /** KMP */
  kmp: {
    comparisons: number
    timeMs: number
  }
}

export interface BenchSet {
  id: 'melhor' | 'aleatorio' | 'portugues' | 'adversario'
  label: string
  short: string
  description: string
  /** padrão utilizado nos testes */
  patternNote: string
  points: BenchPoint[]
}

/** true enquanto os dados forem demonstrativos (não medidos). */
export const isDemoData = true
export const demoNotice =
  'DADOS DEMONSTRATIVOS — gerados a partir das fórmulas teóricas. Substitua por resultados reais medidos em Java (System.nanoTime), sem alterar a estrutura do arquivo.'

function e(x: number): number {
  return Number(x.toPrecision(4))
}

// ---------- Texto aleatório (caso médio da Força Bruta) ----------
// Preditiva: FB ≈ 2n comparações; KMP ≈ n + m.
// m = 100 em todos os tamanhos (busca de um "palavrão" de 100 letras).
const mNat = 100

// ---------- Caso adversário ----------
// texto a^n e padrão a^(m-1)b → pior caso da Força Bruta:
// comparacoesFB = (n − m + 1) · m ; comparacoesKMP = n + m.
// m = n/2 maximiza o produto para a Força Bruta.
function adversarial(
  n: number,
): { bruteComparisons: number; kmpComparisons: number } {
  const m = Math.floor(n / 2)
  const bruteComparisons = (n - m + 1) * m
  const kmpComparisons = n + m
  return { bruteComparisons, kmpComparisons }
}

// Tempos demonstrativos plausíveis (ms). Escalas escolhidas para
// refletir o comportamento assintótico previsto — não são medições.
function demoTime(comparisons: number, perMillionNs: number): number {
  // perMillionNs ≈ ns por 10^6 comparações (ordem de grandeza plausível)
  return (comparisons * perMillionNs) / 1e6
}

export const benchmarkSets: BenchSet[] = [
  {
    id: 'melhor',
    label: 'Melhor caso',
    short: 'melhor caso',
    description:
      'Texto sem o primeiro caractere do padrão: a Força Bruta falha já na 1ª comparação de cada deslocamento — Θ(n) comparações no total.',
    patternNote: 'padrão fixo de m = 100; texto sem o caractere inicial do padrão',
    points: [10_000, 100_000, 1_000_000, 10_000_000].map((n) => {
      const bruteCmp = n - mNat + 1
      const kmpCmp = n + mNat
      return {
        n,
        m: mNat,
        brute: {
          comparisons: e(bruteCmp),
          timeMs: e(demoTime(bruteCmp, 2)),
        },
        kmp: {
          comparisons: e(kmpCmp),
          timeMs: e(demoTime(kmpCmp, 3)),
        },
      }
    }),
  },
  {
    id: 'aleatorio',
    label: 'Texto aleatório',
    short: 'aleatório',
    description:
      'Texto gerado com alfabeto de 4 símbolos (A, B, C, D), semente fixa. Aproximadamente o caso médio da Força Bruta.',
    patternNote: 'padrão fixo de m = 100, gerado aleatoriamente',
    points: [10_000, 100_000, 1_000_000, 10_000_000].map((n) => {
      const bruteCmp = 2 * n
      const kmpCmp = n + mNat
      return {
        n,
        m: mNat,
        brute: {
          comparisons: e(bruteCmp),
          timeMs: e(demoTime(bruteCmp, 3)),
        },
        kmp: {
          comparisons: e(kmpCmp),
          timeMs: e(demoTime(kmpCmp, 3)),
        },
      }
    }),
  },
  {
    id: 'portugues',
    label: 'Texto em português',
    short: 'português',
    description:
      'Texto natural em português. A Força Bruta costuma ser competitiva: poucas comparações por deslocamento, média próxima de Θ(n).',
    patternNote: 'palavra comum, m = 100 (padrão fixo)',
    points: [10_000, 100_000, 1_000_000, 10_000_000].map((n) => {
      const bruteCmp = 2 * n
      const kmpCmp = n + mNat
      return {
        n,
        m: mNat,
        brute: {
          comparisons: e(bruteCmp),
          timeMs: e(demoTime(bruteCmp, 3)),
        },
        kmp: {
          comparisons: e(kmpCmp),
          timeMs: e(demoTime(kmpCmp, 3)),
        },
      }
    }),
  },
  {
    id: 'adversario',
    label: 'Caso adversário',
    short: 'adversário',
    description:
      'Texto "aaaa…a" e padrão "aaa…ab" (m = n/2). Pior caso da Força Bruta: Θ(n·m). Cenário onde a garantia linear do KMP aparece.',
    patternNote: 'padrão a^(m−1)b com m = n/2',
    points: [10_000, 100_000, 1_000_000, 10_000_000].map((n) => {
      const m = Math.floor(n / 2)
      const { bruteComparisons, kmpComparisons } = adversarial(n)
      return {
        n,
        m,
        brute: {
          comparisons: e(bruteComparisons),
          // tempo demonstrativo mais alto por comparação (mismatch longos)
          timeMs: e(demoTime(bruteComparisons, 6)),
        },
        kmp: {
          comparisons: e(kmpComparisons),
          timeMs: e(demoTime(kmpComparisons, 3)),
        },
      }
    }),
  },
]

export function getBenchSet(
  id: BenchSet['id'],
): BenchSet {
  return benchmarkSets.find((s) => s.id === id) ?? benchmarkSets[0]
}
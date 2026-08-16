import type { ReactNode } from 'react'
import { Panel, Slide } from '../atoms'

const REFS: { n: string; text: ReactNode }[] = [
  {
    n: '[1]',
    text: (
      <>
        <span className="a">CORMEN, T. H. et al.</span> <em>Algoritmos: Teoria e
        Prática</em>. 3. ed. Rio de Janeiro: Elsevier, 2012. (Capítulo sobre
        casamento de padrões: algoritmo de Knuth-Morris-Pratt.)
      </>
    ),
  },
  {
    n: '[2]',
    text: (
      <>
        <span className="a">SEDGEWICK, R.; WAYNE, K.</span> <em>Algorithms</em>. 4. ed.
        Addison-Wesley, 2011. (Substring search.)
      </>
    ),
  },
  {
    n: '[3]',
    text: (
      <>
        <span className="a">KNUTH, D. E.; MORRIS, J. H.; PRATT, V. R.</span>{' '}
        <em>Fast Pattern Matching in Strings</em>. SIAM Journal on Computing, v. 6,
        n. 2, p. 323–350, 1977. (Artigo original do algoritmo KMP.)
      </>
    ),
  },
]

export function ReferenciasSlide() {
  return (
    <Slide
      num="18"
      section="Referências"
      title="Referências"
      subtitle="Base teórica consultada para a elaboração deste trabalho."
    >
      <div className="grid grid-2">
        <Panel title="Bibliografia">
          <div className="refs">
            {REFS.map((r) => (
              <div className="ref" key={r.n}>
                <span className="n">{r.n}</span>
                <div>{r.text}</div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="grid" style={{ alignContent: 'start' }}>
          <Panel title="Material do curso">
            <ul className="clean">
              <li>Slides e material de apoio da disciplina Técnicas de Programação Avançadas (IFES).</li>
              <li>Descrição do Trabalho Prático 01 — Análise de Algoritmos (AVA Cefor/Ifes).</li>
              <li>Exemplo de apresentação fornecido (Bubble Sort).</li>
            </ul>
          </Panel>

          <div className="note">
            Conteúdo elaborado com base no material disponibilizado no ambiente da
            disciplina; terminologia e conclusões preservadas do material sobre o
            algoritmo KMP.
          </div>
        </div>
      </div>
    </Slide>
  )
}
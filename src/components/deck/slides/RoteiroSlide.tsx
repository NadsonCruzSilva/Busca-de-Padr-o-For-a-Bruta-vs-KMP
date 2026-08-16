import { Panel, Slide } from '../atoms'

export function RoteiroSlide() {
  const secoes = [
    ['03', 'Introdução', 'o problema, o contexto e a relevância'],
    ['04', 'Força Bruta · Descrição', 'funcionamento, código comentado e animação interativa'],
    ['07', 'Força Bruta · Análise', 'custo linha a linha, notações O, Ω e Θ, experimentos'],
    ['09', 'KMP · Descrição', 'ideia central, tabela LPS, código comentado e animação'],
    ['14', 'KMP · Análise', 'custo linha a linha, notações O, Ω e Θ, experimentos'],
    ['16', 'Discussão e conclusão', 'teoria × prática e a ideia central do KMP'],
  ]

  return (
    <Slide
      num="02"
      section="Roteiro"
      title="Visão geral da apresentação"
      subtitle="10 minutos no total, divididos igualmente entre os dois algoritmos."
    >
      <div className="grid grid-2">
        <Panel title="Roteiro da apresentação">
          <div className="track-plan">
            {secoes.map(([n, t, d]) => (
              <div className="row" key={n}>
                <span className="n">{n}</span>
                <span className="t">
                  <strong>{t}</strong>
                  <span className="muted"> — {d}</span>
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <div className="grid" style={{ alignContent: 'start' }}>
          <Panel title="Divisão da apresentação oral">
            <div className="speaker-box" style={{ marginBottom: '0.6rem' }}>
              <div className="who">José Carlos</div>
              <div className="what">Força Bruta — desloca, compara e repete do zero a cada falha.</div>
            </div>
            <div className="speaker-box">
              <div className="who">Nadson</div>
              <div className="what">
                KMP — pré-processa o padrão com a tabela LPS e reaproveita as comparações.
              </div>
            </div>
          </Panel>

          <div className="note">
            Apresentação única de ≈ 10 minutos seguindo o roteiro acima. A navegação é
            feita com as setas <kbd>←</kbd> <kbd>→</kbd>; o índice completo fica em{' '}
            <kbd>O</kbd>.
          </div>
        </div>
      </div>
    </Slide>
  )
}
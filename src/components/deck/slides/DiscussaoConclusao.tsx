import { Panel, Slide, Theta } from '../atoms'

export function DiscussaoSlide() {
  return (
    <Slide
      num="16"
      section="Discussão"
      title="Teoria × prática"
      subtitle="A ordem assintótica prevê o crescimento; a constante e a entrada decidem o resto."
    >
      <div className="grid grid-2">
        <div className="grid" style={{ alignContent: 'start' }}>
          <Panel title="Força Bruta">
            <ul className="clean">
              <li>Implementação simples e direta.</li>
              <li>Baixo uso de memória: O(1) auxiliar.</li>
              <li>Bom desempenho em entradas pequenas ou favoráveis.</li>
              <li>Comportamento ruim em entradas adversárias (aⁿ / aᵐ⁻¹b).</li>
            </ul>
          </Panel>

          <Panel title="KMP">
            <ul className="clean">
              <li>Exige pré-processamento do padrão (<Theta>m</Theta>).</li>
              <li>Memória auxiliar O(m) — a tabela LPS.</li>
              <li>Garantia <Theta>n + m</Theta> em todos os casos.</li>
              <li>Evita comparações repetidas reutilizando o prefixo.</li>
            </ul>
          </Panel>
        </div>

        <div className="grid" style={{ alignContent: 'start' }}>
          <Panel title="Onde a teoria e a prática se encontram">
            <p className="muted no-margin">
              Um algoritmo <strong style={{ color: 'var(--text)' }}>assintoticamente
              melhor</strong> não necessariamente é mais rápido em todas as entradas
              pequenas — a constante do KMP (pré-processamento + indireção) pode superar
              o ganho quando n é pequeno.
            </p>
            <div className="note mt-2">
              Em <strong>textos naturais</strong>, a Força Bruta costuma falhar já no
              primeiro caractere e se comporta como ≈ <Theta>n</Theta>: por isso ela segue
              competitiva em editores e ferramentas de busca.
            </div>
            <div className="note warn mt-2">
              Não conclua que “KMP é sempre mais rápido”. O ganho aparece quando há{' '}
              <strong>padrões repetitivos</strong> — e aí a garantia <Theta>n + m</Theta> do KMP é
              decisiva.
            </div>
          </Panel>

          <Panel title="Resumo">
            <table className="data">
              <tbody>
                <tr>
                  <td>Entradas pequenas / naturais</td>
                  <td>Força Bruta competitiva (≈ <Theta>n</Theta>)</td>
                </tr>
                <tr>
                  <td>Entradas repetitivas / adversárias</td>
                  <td>
                    Força Bruta Θ(nm) · KMP <Theta>n + m</Theta>
                  </td>
                </tr>
                <tr>
                  <td>Garantia de pior caso</td>
                  <td>Só o KMP a oferece</td>
                </tr>
              </tbody>
            </table>
          </Panel>
        </div>
      </div>
    </Slide>
  )
}

export function ConclusaoSlide() {
  return (
    <Slide
      num="17"
      section="Conclusão"
      title="Conclusão"
      subtitle="A ideia central que deve ficar na memória."
    >
      <div className="grid grid-2">
        <div className="grid" style={{ alignContent: 'start' }}>
          <div className="flow">
            <div className="flow-step">
              <span className="ph">comparação</span>
              <span>caracteres do texto × padrão</span>
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-step">
              <span className="ph">mismatch</span>
              <span>falha em T[i] ≠ P[j]</span>
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-step">
              <span className="ph">LPS</span>
              <span>consulta LPS[j − 1]</span>
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-step">
              <span className="ph">ajuste de j</span>
              <span>j = LPS[j − 1]</span>
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-step current">
              <span className="ph">i não retrocede</span>
              <span>texto percorrido de frente</span>
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-step current">
              <span className="ph">menos comparações</span>
              <span>reaproveita o que já se sabe</span>
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-step match">
              <span className="ph"><Theta>n + m</Theta></span>
              <span>garantia linear</span>
            </div>
          </div>
        </div>

        <div className="grid" style={{ alignContent: 'start' }}>
          <Panel title="Síntese">
            <p className="muted no-margin">
              O <strong style={{ color: 'var(--text)' }}>KMP</strong> utiliza a tabela{' '}
              <strong style={{ color: 'var(--text)' }}>LPS</strong> para reaproveitar
              informações obtidas durante a busca.
            </p>
            <ul className="clean mt-1">
              <li>Construção da LPS: <Theta>m</Theta>.</li>
              <li>Busca: <Theta>n</Theta>.</li>
              <li>Total: <strong><Theta>n + m</Theta></strong>.</li>
            </ul>
            <p className="small muted mt-1">
              A análise empírica verifica como essa vantagem teórica aparece na prática
              — e em quais entradas ela realmente se materializa.
            </p>
          </Panel>

          <Panel title="Comparação final">
            <div className="grid grid-2" style={{ gap: '0.6rem' }}>
              <div className="speaker-box" style={{ textAlign: 'center' }}>
                <div className="who">FORÇA BRUTA</div>
                <div className="big-num" style={{ fontSize: '2.4rem' }}>
                  <Theta>nm</Theta>
                </div>
                <div className="small muted">no pior caso</div>
                <div className="small faint">mais simples</div>
              </div>
              <div className="speaker-box" style={{ textAlign: 'center', borderColor: 'var(--accent-line)' }}>
                <div className="who" style={{ color: 'var(--accent)' }}>KMP</div>
                <div className="big-num" style={{ fontSize: '2.4rem', color: 'var(--accent)' }}>
                  <Theta>n+m</Theta>
                </div>
                <div className="small muted">garantia linear</div>
                <div className="small faint">mais sofisticado</div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </Slide>
  )
}
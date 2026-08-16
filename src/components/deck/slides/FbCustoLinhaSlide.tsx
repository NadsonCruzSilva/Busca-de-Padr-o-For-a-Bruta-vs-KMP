import { Slide } from '../atoms'

export function FbCustoLinhaSlide() {
  return (
    <Slide
      num="07"
      section="Força Bruta · Análise matemática"
      title="Custo Linha a Linha — Pior Caso"
      subtitle='TEXTO E PADRÃO COM REPETIÇÕES (ex: T="aaaa...", P="aaab")'
      className="slide-wide"
    >
      <table className="data mt-2" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Linha</th>
            <th>Instrução</th>
            <th>Repetições</th>
            <th style={{ textAlign: 'right' }}>Custo total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="mono dim">L4</td>
            <td className="mono">
              <span style={{ color: '#569CD6' }}>int</span> n = T.length(), m = P.length();
            </td>
            <td>1 atribuição, executada uma vez</td>
            <td className="mono" style={{ color: '#F87171', textAlign: 'right', fontWeight: 'bold' }}>1</td>
          </tr>
          <tr>
            <td className="mono dim">L7</td>
            <td className="mono">
              <span style={{ color: '#C586C0' }}>for</span> (<span style={{ color: '#569CD6' }}>int</span> i = <span style={{ color: '#B5CEA8' }}>0</span>; i &lt;= n - m; i++)
            </td>
            <td>1 inicialização + (n-m+2) testes + (n-m+1) incrementos</td>
            <td className="mono" style={{ color: '#F87171', textAlign: 'right', fontWeight: 'bold' }}>2(n - m) + 4</td>
          </tr>
          <tr>
            <td className="mono dim">L8</td>
            <td className="mono">
              <span style={{ color: '#569CD6' }}>int</span> j = <span style={{ color: '#B5CEA8' }}>0</span>;
            </td>
            <td>1 inicialização por deslocamento</td>
            <td className="mono" style={{ color: '#F87171', textAlign: 'right', fontWeight: 'bold' }}>n - m + 1</td>
          </tr>
          <tr>
            <td className="mono dim">L11</td>
            <td className="mono">
              <span style={{ color: '#C586C0' }}>while</span> (j &lt; m &amp;&amp; T.charAt(i + j) == P.charAt(j))
            </td>
            <td>no pior caso, m avaliações de condição por deslocamento</td>
            <td className="mono" style={{ color: '#F87171', textAlign: 'right', fontWeight: 'bold' }}>m(n - m + 1)</td>
          </tr>
          <tr>
            <td className="mono dim">L12</td>
            <td className="mono">
              j++; <span className="dim">// caracteres coincidem</span>
            </td>
            <td>(m-1) coincidências antes da falha em cada deslocamento</td>
            <td className="mono" style={{ color: '#F87171', textAlign: 'right', fontWeight: 'bold' }}>(m - 1)(n - m + 1)</td>
          </tr>
          <tr>
            <td className="mono dim">L15</td>
            <td className="mono">
              <span style={{ color: '#C586C0' }}>if</span> (j == m) <span style={{ color: '#C586C0' }}>return</span> i;
            </td>
            <td>1 teste no fim de cada deslocamento (nunca entra no if no pior caso)</td>
            <td className="mono" style={{ color: '#F87171', textAlign: 'right', fontWeight: 'bold' }}>n - m + 1</td>
          </tr>
          <tr>
            <td className="mono dim">L21</td>
            <td className="mono">
              <span style={{ color: '#C586C0' }}>return</span> -<span style={{ color: '#B5CEA8' }}>1</span>;
            </td>
            <td>1 instrução executada no final</td>
            <td className="mono" style={{ color: '#F87171', textAlign: 'right', fontWeight: 'bold' }}>1</td>
          </tr>
        </tbody>
      </table>
      <div className="note mt-2" style={{ textAlign: 'center' }}>
        <strong>Total ≈ 2m(n − m)</strong> — que domina o crescimento assintótico para <strong className="mono">O(n·m)</strong>. O laço interno (L11–L12) é onde o tempo quadrático é gasto.
      </div>
    </Slide>
  )
}

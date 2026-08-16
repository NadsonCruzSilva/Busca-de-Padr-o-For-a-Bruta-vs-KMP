import { Slide } from '../atoms'

export function KmpCustoLinhaSlide() {
  return (
    <Slide
      num="14"
      section="KMP · Análise matemática"
      title="Custo Linha a Linha — Pior Caso"
      subtitle="FALHAS SUCESSIVAS MAS SEM RETROCESSO NO TEXTO"
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
            <td className="mono dim">L53-L56</td>
            <td className="mono">
              <span style={{ color: '#569CD6' }}>int</span>[] lps = calculaLPS(P); <span style={{ color: '#569CD6' }}>int</span> i = <span style={{ color: '#B5CEA8' }}>0</span>, j = <span style={{ color: '#B5CEA8' }}>0</span>;
            </td>
            <td>Pré-processamento (alocação e construção da tabela LPS)</td>
            <td className="mono" style={{ color: '#F87171', textAlign: 'right', fontWeight: 'bold' }}>Θ(m)</td>
          </tr>
          <tr>
            <td className="mono dim">L58</td>
            <td className="mono">
              <span style={{ color: '#C586C0' }}>while</span> (i &lt; n)
            </td>
            <td>Avaliado exatamente n vezes (pois i nunca retrocede)</td>
            <td className="mono" style={{ color: '#F87171', textAlign: 'right', fontWeight: 'bold' }}>n</td>
          </tr>
          <tr>
            <td className="mono dim">L60</td>
            <td className="mono">
              <span style={{ color: '#C586C0' }}>if</span> (T.charAt(i) == P.charAt(j))
            </td>
            <td>No máximo 1 comparação que dá &quot;true&quot; por incremento de i, mas pode dar &quot;false&quot; (falhas)</td>
            <td className="mono" style={{ color: '#F87171', textAlign: 'right', fontWeight: 'bold' }}>&le; 2n</td>
          </tr>
          <tr>
            <td className="mono dim">L61-L62</td>
            <td className="mono">
              i++; j++;
            </td>
            <td>Avançam juntos nas coincidências (no máximo n vezes no total)</td>
            <td className="mono" style={{ color: '#F87171', textAlign: 'right', fontWeight: 'bold' }}>&le; n</td>
          </tr>
          <tr>
            <td className="mono dim">L66-L67</td>
            <td className="mono">
              <span style={{ color: '#C586C0' }}>if</span> (j == m) <span style={{ color: '#C586C0' }}>return</span> i - j;
            </td>
            <td>Verificação de ocorrência a cada iteração</td>
            <td className="mono" style={{ color: '#F87171', textAlign: 'right', fontWeight: 'bold' }}>&le; 2n</td>
          </tr>
          <tr>
            <td className="mono dim">L70-L74</td>
            <td className="mono">
              <span style={{ color: '#C586C0' }}>else if</span> (j &gt; <span style={{ color: '#B5CEA8' }}>0</span>) j = lps[j - <span style={{ color: '#B5CEA8' }}>1</span>]; <span style={{ color: '#C586C0' }}>else</span> i++;
            </td>
            <td>O recuo de j é limitado por quantas vezes j foi incrementado. Amortizado:</td>
            <td className="mono" style={{ color: '#F87171', textAlign: 'right', fontWeight: 'bold' }}>&le; n</td>
          </tr>
        </tbody>
      </table>
      <div className="note mt-2" style={{ textAlign: 'center' }}>
        <strong>Total ≤ C₁n + C₂m</strong> — o que prova a complexidade <strong className="mono">O(n + m)</strong>. A mágica do KMP é que o limite do bloco <span className="mono">else if</span> (recuo de <span className="mono">j</span>) nunca excede o total de incrementos feitos em L62, graças à <strong>análise amortizada</strong>.
      </div>
    </Slide>
  )
}

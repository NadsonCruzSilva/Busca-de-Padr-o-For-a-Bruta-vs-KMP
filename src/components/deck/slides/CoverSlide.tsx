import { Slide } from '../atoms'

export const META = {
  titulo: 'Busca de Padrão: Força Bruta vs KMP',
  subtitulo: 'Análise de algoritmos de busca de padrões',
  disciplina: 'Técnicas de Programação Avançadas',
  instituicao: 'IFES',
  professor: 'Rafael Vargas / Mesquita',
  alunos: 'José Carlos Ceccon, Nadson da Cruz Silva',
  semestre: '8º Semestre',
}

export function CoverSlide() {
  return (
    <Slide num="01" section="Trabalho 01 · Análise de Algoritmos" title="Capa">
      <div className="cover">
        <div className="pre">{META.disciplina}</div>
        <h1>
          Busca de Padrão: <span className="alt">Força Bruta</span> vs{' '}
          <span className="alt">KMP</span>
        </h1>
        <p className="sub">{META.subtitulo}</p>
        <div className="cover-meta">
          <div className="m">
            <span className="k">Disciplina</span>
            {META.disciplina}
          </div>
          <div className="m">
            <span className="k">Instituição</span>
            {META.instituicao}
          </div>
          <div className="m">
            <span className="k">Professor</span>
            {META.professor}
          </div>
          <div className="m">
            <span className="k">Alunos</span>
            {META.alunos}
          </div>
          <div className="m">
            <span className="k">Semestre</span>
            {META.semestre}
          </div>
        </div>
      </div>
    </Slide>
  )
}
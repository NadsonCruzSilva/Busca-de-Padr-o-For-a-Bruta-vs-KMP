import type { ReactNode } from 'react'
import { CoverSlide } from './slides/CoverSlide'
import { RoteiroSlide } from './slides/RoteiroSlide'
import { IntroducaoSlide } from './slides/IntroducaoSlide'
import {
  ForcaBrutaSlide,
  KmpIdeiaSlide,
  RepetidasSlide,
} from './slides/DescricaoSlide'
import { FbCodigoSlide } from './slides/FbCodigoSlide'
import { FbAnimacaoSlide } from './slides/FbAnimacaoSlide'
import { FbCustoLinhaSlide } from './slides/FbCustoLinhaSlide'
import { FbAnaliseMatSlide } from './slides/FbAnaliseMatSlide'
import { FbEmpiricaSlide } from './slides/FbEmpiricaSlide'
import { LpsSlide } from './slides/LpsSlide'
import { KmpCodigoSlide } from './slides/KmpCodigoSlide'
import { KmpAnimacaoSlide } from './slides/KmpAnimacaoSlide'
import { KmpCustoLinhaSlide } from './slides/KmpCustoLinhaSlide'
import { AnaliseMatSlide } from './slides/AnaliseMatSlide'
import { KmpEmpiricaSlide } from './slides/KmpEmpiricaSlide'
import {
  ConclusaoSlide,
  DiscussaoSlide,
} from './slides/DiscussaoConclusao'
import { ReferenciasSlide } from './slides/ReferenciasSlide'

export interface SlideDef {
  id: string
  num: string
  section: string
  label: string
  element: ReactNode
}

// Ordem da apresentação oral única (~10 min), estruturada por algoritmo:
// cada um com Descrição → Código → Animação → Custo Linha a Linha → Análise matemática → Análise empírica.
export const SLIDES: SlideDef[] = [
  {
    id: 'capa',
    num: '01',
    section: 'Capa',
    label: 'Capa',
    element: <CoverSlide />,
  },
  {
    id: 'roteiro',
    num: '02',
    section: 'Roteiro',
    label: 'Roteiro',
    element: <RoteiroSlide />,
  },
  {
    id: 'introducao',
    num: '03',
    section: 'Introdução',
    label: 'Introdução',
    element: <IntroducaoSlide />,
  },
  {
    id: 'fb-descricao',
    num: '04',
    section: 'Força Bruta · Descrição',
    label: 'FB — Descrição',
    element: <ForcaBrutaSlide />,
  },
  {
    id: 'fb-codigo',
    num: '05',
    section: 'Força Bruta · Descrição',
    label: 'FB — Código',
    element: <FbCodigoSlide />,
  },
  {
    id: 'fb-animacao',
    num: '06',
    section: 'Força Bruta · Descrição',
    label: 'FB — Animação',
    element: <FbAnimacaoSlide />,
  },
  {
    id: 'fb-custo-linha',
    num: '07',
    section: 'Força Bruta · Análise matemática',
    label: 'FB — Custo Linha',
    element: <FbCustoLinhaSlide />,
  },
  {
    id: 'fb-matematica',
    num: '08',
    section: 'Força Bruta · Análise matemática',
    label: 'FB — Análise matemática',
    element: <FbAnaliseMatSlide />,
  },
  {
    id: 'fb-empirica',
    num: '09',
    section: 'Força Bruta · Análise empírica',
    label: 'FB — Análise empírica',
    element: <FbEmpiricaSlide />,
  },
  {
    id: 'kmp-ideia',
    num: '10',
    section: 'KMP · Descrição',
    label: 'KMP — ideia central',
    element: <KmpIdeiaSlide />,
  },
  {
    id: 'kmp-repetidas',
    num: '11',
    section: 'KMP · Descrição',
    label: 'KMP — comparações repetidas',
    element: <RepetidasSlide />,
  },
  {
    id: 'kmp-lps',
    num: '12',
    section: 'KMP · Descrição',
    label: 'KMP — tabela LPS',
    element: <LpsSlide />,
  },
  {
    id: 'kmp-codigo',
    num: '13',
    section: 'KMP · Descrição',
    label: 'KMP — Código',
    element: <KmpCodigoSlide />,
  },
  {
    id: 'kmp-animacao',
    num: '14',
    section: 'KMP · Descrição',
    label: 'KMP — Animação',
    element: <KmpAnimacaoSlide />,
  },
  {
    id: 'kmp-custo-linha',
    num: '15',
    section: 'KMP · Análise matemática',
    label: 'KMP — Custo Linha',
    element: <KmpCustoLinhaSlide />,
  },
  {
    id: 'kmp-matematica',
    num: '16',
    section: 'KMP · Análise matemática',
    label: 'KMP — Análise matemática',
    element: <AnaliseMatSlide />,
  },
  {
    id: 'kmp-empirica',
    num: '17',
    section: 'KMP · Análise empírica',
    label: 'KMP — Análise empírica',
    element: <KmpEmpiricaSlide />,
  },
  {
    id: 'discussao',
    num: '18',
    section: 'Discussão',
    label: 'Discussão',
    element: <DiscussaoSlide />,
  },
  {
    id: 'conclusao',
    num: '19',
    section: 'Conclusão',
    label: 'Conclusão',
    element: <ConclusaoSlide />,
  },
  {
    id: 'referencias',
    num: '20',
    section: 'Referências',
    label: 'Referências',
    element: <ReferenciasSlide />,
  },
]
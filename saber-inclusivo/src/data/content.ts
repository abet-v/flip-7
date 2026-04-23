export const HOTMART = {
  pei: 'https://pay.hotmart.com/G103732674S?off=jughvxi7&hotfeature=51',
  cienciaConcordanciaPEI: 'https://pay.hotmart.com/N103626040X?off=ovjv9qez&hotfeature=51',
  manualMediador: 'https://pay.hotmart.com/D103626750N?off=ljk1bmds&hotfeature=51',
  diarioBordoMediador: 'https://pay.hotmart.com/S103626471J?off=95th3ei0&hotfeature=51',
  guiaPratico: 'https://pay.hotmart.com/F103625747D?off=ehodclq4&hotfeature=51',
  fichaMatricula: 'https://pay.hotmart.com/B103626554V?off=nn5pgtxx&hotfeature=51',
  manualDefasagem: 'https://pay.hotmart.com/N103626596W?off=7ktjr9fx&hotfeature=51',
  acompanhamentoCurriculo: 'https://pay.hotmart.com/Y103625910R?off=dcom8you&hotfeature=51',
  fichaRelato: 'https://pay.hotmart.com/Y103626707B?off=7ilk9kh5&hotfeature=51',
  termoAdaptacao: 'https://pay.hotmart.com/A103626780H?off=eents1kp&hotfeature=51',
} as const

export type MaterialKey = keyof typeof HOTMART

export const brand = {
  name: 'Saber Inclusivo',
  tagline: 'Coleção Saber Inclusivo',
}

export const hero = {
  kicker: 'Coleção Saber Inclusivo',
  title: 'Inclusão escolar não se sustenta no improviso.',
  subtitle:
    'Ela exige organização, registro e clareza de processos. A Coleção Saber Inclusivo foi criada a partir da prática real da coordenação pedagógica e da gestão escolar, para apoiar professores, mediadores e gestores na construção de uma inclusão que funciona na rotina da escola — e não só no papel.',
  pitch:
    'Aqui você não encontra apostilas soltas. Você encontra documentos estruturantes, pensados para planejar, registrar, formalizar e proteger o trabalho pedagógico.',
  primaryCta: { label: 'Comprar agora', href: HOTMART.pei },
  secondaryCta: { label: 'Ver a coleção', href: '#colecao' },
}

export const forWhom = {
  title: 'Para quem é este material?',
  intro: 'Este material é indicado para:',
  items: [
    'Professores regentes',
    'Coordenadores pedagógicos',
    'Profissionais do AEE',
    'Mediadores e auxiliares escolares',
    'Direção escolar',
    'Escolas que precisam padronizar processos de inclusão',
    'Instituições que desejam trabalhar a inclusão com método e clareza',
    'Profissionais que buscam segurança pedagógica e jurídica',
    'Famílias que desejam compreender o processo escolar e atuar em parceria com a escola',
  ],
}

export const problem = {
  title: 'O problema que as escolas vivem',
  lead: 'Mesmo com boa intenção, muitas escolas enfrentam:',
  pains: [
    'Falta de clareza sobre papéis e responsabilidades',
    'PEIs frágeis ou desconectados da prática',
    'Registros inconsistentes ou inexistentes',
    'Mediadores inseguros',
    'Professores sobrecarregados',
    'Famílias desalinhadas do processo',
  ],
  resultTitle: 'O resultado é conhecido:',
  results: ['Conflitos', 'Desgaste emocional', 'Insegurança pedagógica', 'Risco institucional'],
}

export const trust = {
  title: 'Por que confiar no Saber Inclusivo?',
  lead:
    'Cada material é elaborado com técnica, cuidado e responsabilidade, com base nas legislações educacionais (LBI, ECA, BNCC, Decreto 7.611 e LGPD) e na prática real da escola.',
  pillars: [
    {
      title: 'Base legal sólida',
      body:
        'Ancorado em LBI, ECA, BNCC, Decreto 7.611 e LGPD — protege o trabalho pedagógico e a instituição.',
    },
    {
      title: 'Prática real da escola',
      body:
        'Considera a rotina pedagógica, os desafios cotidianos e o alinhamento entre escola e família.',
    },
    {
      title: 'Ferramentas profissionais',
      body:
        'Não são modelos genéricos: são instrumentos para organizar, padronizar e dar segurança ao processo.',
    },
  ],
}

export type Material = {
  key: MaterialKey
  icon:
    | 'FileText'
    | 'ShieldCheck'
    | 'ClipboardList'
    | 'UserCheck'
    | 'BookOpen'
    | 'NotebookPen'
    | 'Briefcase'
    | 'Compass'
    | 'Users'
    | 'LineChart'
  title: string
  summary: string
}

export const collection: { title: string; lead: string; items: Material[] } = {
  title: 'O que você recebe na coleção',
  lead:
    'Uma biblioteca profissional pronta para uso — cada documento foi pensado para uma etapa concreta da rotina inclusiva.',
  items: [
    {
      key: 'pei',
      icon: 'FileText',
      title: 'PEI — O Planejamento que Inclui',
      summary:
        'Planejamento individualizado alinhado à BNCC, com estratégias pedagógicas, adaptações curriculares e avaliação acessível.',
    },
    {
      key: 'termoAdaptacao',
      icon: 'ShieldCheck',
      title: 'Termo de Ciência e Concordância — Adaptação Curricular',
      summary:
        'Documento essencial para formalizar adaptações com clareza, transparência e segurança institucional.',
    },
    {
      key: 'cienciaConcordanciaPEI',
      icon: 'UserCheck',
      title: 'Ciência e Concordância do PEI — Orientações Individualizadas',
      summary:
        'Registro das demandas específicas do estudante e corresponsabilização da família no processo.',
    },
    {
      key: 'manualMediador',
      icon: 'Briefcase',
      title: 'Manual do Mediador Escolar',
      summary:
        'Define atribuições, limites e protocolos de atuação do mediador no cotidiano da escola.',
    },
    {
      key: 'diarioBordoMediador',
      icon: 'NotebookPen',
      title: 'Diário de Bordo do Mediador Escolar',
      summary:
        'Instrumento de registro diário que garante continuidade pedagógica e proteção do trabalho realizado.',
    },
    {
      key: 'acompanhamentoCurriculo',
      icon: 'LineChart',
      title: 'Caderno de Gestão Inclusiva',
      summary:
        'Ferramentas e protocolos para estruturar a inclusão como política institucional da escola.',
    },
    {
      key: 'guiaPratico',
      icon: 'BookOpen',
      title: 'Guia Prático de Educação Inclusiva e Especial',
      summary:
        'Orientações claras para transformar adaptações em inclusão real na sala de aula.',
    },
    {
      key: 'fichaRelato',
      icon: 'ClipboardList',
      title: 'Manual de Uso — Ficha de Relato Docente',
      summary:
        'Padronização ética e objetiva dos registros do professor em sala e na comunicação com a coordenação.',
    },
    {
      key: 'manualDefasagem',
      icon: 'Users',
      title: 'Termo de Ciência sobre Defasagem de Aprendizagem',
      summary:
        'Documento orientador para alinhamento de expectativas e compromisso da família no processo.',
    },
  ],
}

export type PriceCard = {
  kind: 'full' | 'combo'
  badge?: string
  title: string
  subtitle?: string
  bullets: string[]
  crossedPrice?: string
  price: string
  cta: { label: string; href: string }
  highlight?: boolean
}

export const pricing: { title: string; lead: string; cards: PriceCard[] } = {
  title: 'Adquirir a Coleção Saber Inclusivo',
  lead:
    'Você pode escolher a forma que melhor atende à sua realidade: coleção completa, combos estratégicos ou materiais avulsos.',
  cards: [
    {
      kind: 'full',
      badge: 'Mais completo',
      title: 'Coleção completa',
      subtitle: '9 materiais profissionais',
      bullets: [
        'Todos os 9 documentos da coleção',
        'Cobertura total da rotina inclusiva',
        'Ideal para escolas e equipes pedagógicas',
      ],
      crossedPrice: 'R$ 332,10',
      price: 'R$ 219,90',
      cta: { label: 'Quero a coleção', href: HOTMART.pei },
      highlight: true,
    },
    {
      kind: 'combo',
      title: 'Combo Professor Seguro',
      subtitle: '3 materiais',
      bullets: [
        'PEI — O Planejamento que Inclui',
        'Manual de Uso — Ficha de Relato Docente',
        'Ciência e Concordância do PEI',
      ],
      crossedPrice: 'R$ 110,70',
      price: 'R$ 89,90',
      cta: { label: 'Quero este combo', href: HOTMART.pei },
    },
    {
      kind: 'combo',
      title: 'Combo Mediador Preparado',
      subtitle: '3 materiais',
      bullets: [
        'Manual do Mediador Escolar',
        'Diário de Bordo do Mediador',
        'Guia Prático de Educação Inclusiva',
      ],
      crossedPrice: 'R$ 110,70',
      price: 'R$ 89,90',
      cta: { label: 'Quero este combo', href: HOTMART.manualMediador },
    },
    {
      kind: 'combo',
      title: 'Combo Gestão Blindada',
      subtitle: '3 materiais',
      bullets: [
        'Caderno de Gestão Inclusiva',
        'Termo de Ciência e Concordância — Adaptação Curricular',
        'Termo de Ciência sobre Defasagem e Compromisso da Família',
      ],
      price: 'R$ 94,90',
      cta: { label: 'Quero este combo', href: HOTMART.termoAdaptacao },
    },
  ],
}

export const benefits = {
  title: 'O que muda na rotina da escola e da família?',
  more: [
    'Mais segurança pedagógica nas decisões e práticas',
    'Mais proteção jurídica por meio de registros claros',
    'Mais organização dos processos de inclusão',
    'Equipe alinhada, orientada e segura',
    'Professores mais confiantes na condução da inclusão',
    'Famílias mais informadas e em parceria com a escola',
    'Alunos efetivamente incluídos no cotidiano escolar',
  ],
  less: [
    'Menos improviso nas intervenções pedagógicas',
    'Menos falhas na comunicação entre escola e família',
    'Menos registros inconsistentes ou ausentes',
    'Menos insegurança jurídica e institucional',
  ],
}

export const guarantee = {
  title: 'Garantia incondicional de 7 dias',
  body:
    'Seu dinheiro de volta, sem perguntas, até 7 dias após a compra. O risco é todo nosso.',
}

export const faq = {
  title: 'Perguntas frequentes',
  items: [
    {
      q: 'Para quem é esse produto?',
      a:
        'Estes materiais foram desenvolvidos para apoiar profissionais que lidam diariamente com os desafios da inclusão escolar — coordenadores, professores, mediadores, auxiliares de inclusão, psicopedagogos e equipes pedagógicas — e também famílias que desejam compreender o processo escolar e atuar em parceria com a escola, com clareza, orientação e responsabilidade.',
    },
    {
      q: "Como funciona o 'Prazo de Garantia'?",
      a:
        'O Prazo de Garantia é o período que você tem para pedir o reembolso integral do valor pago pela sua compra, caso o produto não seja satisfatório. Após a solicitação, o valor é devolvido na mesma forma de pagamento utilizada.',
    },
    {
      q: 'O que é e como funciona o Certificado de Conclusão digital?',
      a:
        'Alguns cursos online oferecem um certificado digital de conclusão. Alunos podem emitir esse certificado ao final do curso ou entrando em contato com a autora. Esses certificados podem ser compartilhados em redes sociais como o LinkedIn e inseridos em informações curriculares.',
    },
    {
      q: 'Como acessar o produto?',
      a:
        'Você receberá o acesso por email. O conteúdo será acessado ou baixado através de um computador, celular, tablet ou outro dispositivo digital. Você também pode acessar o produto comprado entrando em sua conta na Hotmart, acessando o menu lateral em "Minha conta" e clicando em "Minhas compras".',
    },
    {
      q: 'Como faço para comprar?',
      a:
        'Clique no botão "Comprar" do material desejado. Você será direcionado ao checkout seguro da Hotmart para concluir a compra. Lembre-se de que nem todos os materiais estarão sempre disponíveis — é possível que a produtora esteja preparando um novo conteúdo.',
    },
  ],
}

export const footer = {
  copyright: '© 2026 Saber Inclusivo — Todos os direitos reservados.',
  note:
    'Materiais elaborados com base em LBI (Lei nº 13.146/2015), ECA, BNCC, Decreto 7.611 e LGPD.',
}

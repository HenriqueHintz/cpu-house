import {
  DatabaseBackup,
  GraduationCap,
  LifeBuoy,
  Network,
  Server,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

export const WHATSAPP = 'https://api.whatsapp.com/send?phone=5571981797556&text&app_absent=0';

export interface Service {
  id: string;
  icon: LucideIcon;
  title: string;
  short: string;
  long: string;
  href: string;
}

export const SERVICES: Service[] = [
  {
    id: 'conectividade',
    icon: Network,
    title: 'Conectividade',
    short: 'Consultoria e implementação de redes físicas: Ethernet, DSL, fibra óptica, Wi-Fi e VPNs.',
    long: 'Consultoria e implementação de conectividade entre redes físicas: Ethernet, DSL, fibra óptica, Wi-Fi, VPNs e outras.',
    href: '/servicos#conectividade',
  },
  {
    id: 'seguranca',
    icon: ShieldCheck,
    title: 'Segurança',
    short: 'Firewall e IDS formando uma camada de proteção eficaz para sua rede.',
    long: 'Nossa solução de segurança utiliza firewall e IDS para proporcionar uma camada de proteção eficaz para a sua rede.',
    href: '/produtos/proxy',
  },
  {
    id: 'servidores',
    icon: Server,
    title: 'Servidores',
    short: 'Especificação e instalação de servidores para domínio, arquivos, e-mail e sistemas.',
    long: 'Especificamos e instalamos servidores para as mais diversas necessidades: domínio, armazenamento de arquivos, e-mails, sistemas e outros.',
    href: '/produtos/samba_ad',
  },
  {
    id: 'suporte-proativo',
    icon: LifeBuoy,
    title: 'Suporte Pró-ativo',
    short: 'Manutenções preventivas em estações e servidores para evitar paradas repentinas.',
    long: 'Faça manutenções preventivas em seu parque de estações de trabalho e servidores e evite problemas com paradas repentinas.',
    href: '/servicos/preventivas',
  },
  {
    id: 'treinamento',
    icon: GraduationCap,
    title: 'Treinamento',
    short: 'Capacitação nas nossas soluções e preparação para certificações GNU/Linux.',
    long: 'Fornecemos treinamento para o uso de nossas soluções e preparação para exames de certificações básicas em GNU/Linux.',
    href: '/servicos#treinamento',
  },
  {
    id: 'backup',
    icon: DatabaseBackup,
    title: 'Estratégia de Backup',
    short: 'Gestão da informação com rotinas sólidas de backup e restauração.',
    long: 'Otimize a gestão da informação, separando o que é verdadeiramente importante e mantendo uma rotina sólida de backup e restauração.',
    href: '/servicos#backup',
  },
];

export interface Solution {
  id: string;
  kind: 'seguranca' | 'backup' | 'ecidade';
  tag: string;
  title: string;
  text: string;
  tech?: string[];
  href: string;
  external?: boolean;
}

export const SOLUTIONS: Solution[] = [
  {
    id: 'seguranca-corporativa',
    kind: 'seguranca',
    tag: 'Segurança Corporativa',
    title: 'Controle de acesso à web',
    text: 'Acesso consciente aos recursos computacionais é fundamental para a produtividade da sua equipe. Tenha controle do que pode ser acessado: sites da Internet, compartilhamentos ou serviços de rede. Bloqueie sites indevidos, priorize a banda necessária para cada serviço e otimize a velocidade de navegação.',
    tech: ['Squid', 'SquidGuard', 'DansGuardian'],
    href: '/produtos/proxy',
  },
  {
    id: 'backup-nuvem',
    kind: 'backup',
    tag: 'Backup em Nuvem',
    title: 'Seus dados disponíveis e íntegros',
    text: 'Não fique vulnerável a calamidades e reveses. Com o backup em nuvem você garante a disponibilidade e a integridade das suas informações de forma segura e simplificada, com criptografia e de acordo com a LGPD. E tudo isso de forma transparente.',
    tech: ['Criptografia', 'LGPD'],
    href: '/contato',
  },
  {
    id: 'e-cidade',
    kind: 'ecidade',
    tag: 'E-Cidade',
    title: 'Gestão integrada de municípios',
    text: 'O e-cidade informatiza a gestão dos municípios brasileiros de forma integrada, contemplando Prefeitura, Câmara, autarquias, fundações e outros entes. Além da economia de recursos, oferece liberdade de escolha de fornecedores e garantia de continuidade, por ser software público apoiado pelo Ministério do Planejamento.',
    tech: ['Software público'],
    href: 'https://ecidade.softwarepublico.org/',
    external: true,
  },
];

export const PRODUCTS = [
  {
    title: 'E-mail Institucional',
    text: 'Solução completa e segura de e-mail institucional, com anti-spam, antivírus e criptografia.',
    href: '/produtos/mailhost',
    tag: 'Mailhost',
  },
  {
    title: 'Proxy / Controle Web',
    text: 'Aceleração, controle e monitoramento do acesso à web, com filtragem de conteúdo indesejável.',
    href: '/produtos/proxy',
    tag: 'Proxy',
  },
  {
    title: 'Samba4 AD',
    text: 'Gerência completa de usuários e serviços de rede, sem custo de licenças.',
    href: '/produtos/samba_ad',
    tag: 'Samba4 AD',
  },
];

export const TEAM = [
  { name: 'Cristiano Furtado', role: 'Chief Executive Officer (CEO)', photo: '/images/team-cristiano-furtado.jpg' },
  { name: 'Davi Furtado', role: 'Analista de Suporte', photo: '/images/team-davi-furtado.jpg' },
  { name: 'Moisés Dantas', role: 'Analista de Suporte', photo: '/images/team-moises-dantas.jpg' },
].map((m) => ({
  ...m,
  linkedin: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${m.name} CPU House`)}`,
}));

export const STATS = [
  { label: 'Desde', to: 2007, suffix: '', note: 'fundação em 1º de março' },
  { label: 'Anos de experiência', to: 18, suffix: '+', note: 'Lauro de Freitas, Bahia' },
  { label: 'Open source', to: 100, suffix: '%', note: 'tecnologias consagradas' },
];

export const TIMELINE = [
  {
    year: '2007',
    text: 'Fundação em 1º de março, como empresa do comércio varejista de equipamentos e suprimentos de informática.',
  },
  {
    year: '2014',
    text: 'A consultoria em gestão, o suporte técnico e a prestação de serviços de TI passam a ser a atividade principal.',
  },
  {
    year: '2018',
    text: 'Início dos serviços em modalidade SaaS em nuvem para empresas do setor de TI e clientes corporativos.',
  },
  { year: 'Hoje', text: null },
];

export const OPEN_SOURCE = [
  'ASL (membro ativo)',
  'Open Invention Network (associada)',
  'Fedora Brasil',
  'Fedora Educacional',
  'Ekaaty Linux',
  'Sacix (telecentros)',
  'Suporte Linux',
];

export const SOCIAL_PROJECTS = ['Casa Brasil', 'Texto Livre (FALE/UFMG)', 'Clube da Leitura'];

export const CRIANCAS_HACKERS = [
  { label: 'Site do projeto', href: 'https://raulhc.cc/Projetos/CriancasHacker' },
  {
    label: 'Matéria no G1',
    href: 'http://g1.globo.com/bahia/noticia/2015/10/criancas-hackers-desmontam-e-criam-objetos-tecnologicos-em-projeto-na-ba.html',
  },
  {
    label: 'Programa Aprovado (Rede Bahia)',
    href: 'http://gshow.globo.com/Rede-Bahia/Aprovado/noticia/2016/05/projeto-criancas-hackers-une-tecnologia-e-diversao.html',
  },
  { label: 'Vídeo da DeVry', href: 'https://www.youtube.com/watch?v=A-nK1aGsR90' },
];

export const PREVENTIVA_ASSETS = [
  'Hardwares utilizados e disponíveis',
  'Histórico de manutenção do hardware',
  'Sistemas operacionais instalados',
  'Atualizações de segurança e otimização aplicadas',
  'Softwares e licenças instalados e em uso',
  'Controle do acesso aos dispositivos',
  'Definições e agendamento de rotinas de backup',
];

export const INVENTARIO_BENEFITS = [
  'Preventivas previamente agendadas, com seu acompanhamento',
  'Checklist online, automático ou feito por nossos técnicos',
  'Acesso exclusivo, seguro e intransferível ao inventário e aos relatórios',
  'Check-in, check-out, relocação, desativação ou reserva de dispositivos',
  'Controle online das licenças de software em uso',
  'Controle primário da atribuição e reserva de escopos IP na rede',
  'Abertura e controle de chamados pela Área do Cliente',
  'Avaliação de cada atendimento prestado via web',
];

export const PROXY_ADVANTAGES = [
  { title: 'Economia de banda', text: 'Menos consumo do plano de acesso à Internet contratado.' },
  { title: 'Controle de acesso', text: 'Controle das informações acessadas pelos funcionários.' },
  { title: 'Anonimato e segurança', text: 'Acesso conciliado à Internet, preservando o anonimato e a segurança dos usuários.' },
  { title: 'Resposta mais rápida', text: 'Cache reduz o tempo de acesso a grandes volumes de informação já consultados.' },
  { title: 'Política de uso aceitável', text: 'Imposição de uma política de acesso aceitável a determinado conteúdo.' },
  { title: 'Menos carga administrativa', text: 'Alívio das sobrecargas administrativas de recursos da rede.' },
];

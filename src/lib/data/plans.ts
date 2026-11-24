export type MailhostTier = 'starter' | 'standard' | 'advanced' | 'hosted';
export type MailhostCellState = 'included' | 'excluded';

export interface MailhostFeatureRow {
  feature: string;
  values: Record<MailhostTier, MailhostCellState>;
}

export interface MailhostCategorySpec {
  title: string;
  rows: MailhostFeatureRow[];
}

export const MAILHOST_COLUMNS = ['Starter', 'Standard', 'Advanced', 'Hosted'] as const;

export const MAILHOST_INTEGRATION_CHIPS = [
  'Active Directory',
  'OpenLDAP',
  'Samba',
  'Radius',
  'ERPs',
  'CMS',
] as const;

export const MAILHOST_CATEGORIES: MailhostCategorySpec[] = [
  {
    title: 'Autenticação',
    rows: [
      {
        feature: 'Alta performance',
        values: { starter: 'included', standard: 'included', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Domínios Locais e Remotos',
        values: { starter: 'included', standard: 'included', advanced: 'included', hosted: 'excluded' },
      },
      {
        feature: 'Autenticação SMTP/IMAP',
        values: { starter: 'included', standard: 'included', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Autenticação Local',
        values: { starter: 'included', standard: 'included', advanced: 'included', hosted: 'excluded' },
      },
      {
        feature: 'Autenticação em LDAP ou Active Directory',
        values: { starter: 'excluded', standard: 'included', advanced: 'included', hosted: 'excluded' },
      },
      {
        feature: 'Autenticação em Radius',
        values: { starter: 'excluded', standard: 'excluded', advanced: 'included', hosted: 'excluded' },
      },
      {
        feature: 'Criptografia SSL/TLS',
        values: { starter: 'included', standard: 'included', advanced: 'included', hosted: 'included' },
      },
    ],
  },
  {
    title: 'Segurança & Anti-spam',
    rows: [
      {
        feature: 'Caixas postais para SPAM e Vírus',
        values: { starter: 'excluded', standard: 'included', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Suporte para antivírus',
        values: { starter: 'excluded', standard: 'included', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Filtragem de SPAM',
        values: { starter: 'included', standard: 'included', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Proteção de Relay',
        values: { starter: 'included', standard: 'included', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Lista negra de servidores',
        values: { starter: 'included', standard: 'included', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Lista negra de SPAM',
        values: { starter: 'included', standard: 'included', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Listas RBL Real Time Blackhole',
        values: { starter: 'excluded', standard: 'excluded', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Suporte para DomainKeys (DKIM)',
        values: { starter: 'included', standard: 'included', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Suporte para Sender Policy Framework (SPF)',
        values: { starter: 'included', standard: 'included', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Lista cinza (Greylisting)',
        values: { starter: 'excluded', standard: 'excluded', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Lista branca (Whitelist)',
        values: { starter: 'excluded', standard: 'included', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Servidores confiáveis (Whitehosting)',
        values: { starter: 'excluded', standard: 'included', advanced: 'included', hosted: 'included' },
      },
    ],
  },
  {
    title: 'Filtros',
    rows: [
      {
        feature: 'Cota de disco para caixas postais',
        values: { starter: 'included', standard: 'included', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Limite de envio por intervalo de tempo',
        values: { starter: 'included', standard: 'included', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Limites de acesso por data e hora',
        values: { starter: 'excluded', standard: 'excluded', advanced: 'included', hosted: 'excluded' },
      },
      {
        feature: 'Filtros de controle de conteúdo',
        values: { starter: 'excluded', standard: 'excluded', advanced: 'included', hosted: 'excluded' },
      },
      {
        feature: 'Filtros automáticos de mensagens (SIEVE)',
        values: { starter: 'excluded', standard: 'excluded', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Filtragem de servidores por FQDN',
        values: { starter: 'excluded', standard: 'excluded', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Filtragem de servidores por domínio',
        values: { starter: 'excluded', standard: 'excluded', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Filtragem de servidores por país',
        values: { starter: 'excluded', standard: 'excluded', advanced: 'included', hosted: 'excluded' },
      },
      {
        feature: 'Controle de acesso flexível por IP',
        values: { starter: 'excluded', standard: 'included', advanced: 'included', hosted: 'excluded' },
      },
      {
        feature: 'Filtros de acesso baseados no endereço',
        values: { starter: 'excluded', standard: 'included', advanced: 'included', hosted: 'excluded' },
      },
      {
        feature: 'Filtros de acesso baseados no usuário',
        values: { starter: 'excluded', standard: 'included', advanced: 'included', hosted: 'excluded' },
      },
    ],
  },
  {
    title: 'Acesso & Groupware',
    rows: [
      {
        feature: 'Download e redistribuição de E-mails Remotos',
        values: { starter: 'excluded', standard: 'excluded', advanced: 'included', hosted: 'excluded' },
      },
      {
        feature: 'Arquivamento de Mensagens',
        values: { starter: 'excluded', standard: 'included', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Suporte para Lixeira',
        values: { starter: 'excluded', standard: 'included', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Acesso via clientes IMAP/POP',
        values: { starter: 'included', standard: 'included', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Suporte para dispositivos móveis',
        values: { starter: 'included', standard: 'included', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Acesso via Webmail',
        values: { starter: 'excluded', standard: 'included', advanced: 'included', hosted: 'included' },
      },
      {
        feature: 'Suporte Groupware (Agenda, Contatos, etc)',
        values: { starter: 'excluded', standard: 'excluded', advanced: 'included', hosted: 'excluded' },
      },
    ],
  },
];

export type SambaTier = 'starter' | 'standard' | 'advanced';
export type SambaCellState = 'included' | 'excluded' | 'optional';

export interface SambaFeatureRow {
  feature: string;
  match: RegExp;
  values: Record<SambaTier, SambaCellState>;
}

export const SAMBA_COLUMNS = ['Starter', 'Standard', 'Advanced'] as const;

export const SAMBA_AD_ROWS: SambaFeatureRow[] = [
  {
    feature: 'Gerenciamento centralizado do domínio',
    match: /Gerenciamento centralizado do domínio/i,
    values: { starter: 'included', standard: 'included', advanced: 'included' },
  },
  {
    feature: 'Usuários, Grupos de Segurança, Listas de Distribuição, Contatos',
    match: /Usuários, Grupos de Segurança, Listas de Distribuição, Contatos/i,
    values: { starter: 'included', standard: 'included', advanced: 'included' },
  },
  {
    feature: 'Múltiplas Unidades Organizacionais (OUs)',
    match: /Múltiplas Unidades Organizacionais \(OUs\)/i,
    values: { starter: 'included', standard: 'included', advanced: 'included' },
  },
  {
    feature: 'Compartilhamento de arquivos entre Windows®, Linux e OS-X® (CIFS)',
    match: /Compartilhamento de arquivos entre Windows.*Linux e OS-X.*\(CIFS\)/i,
    values: { starter: 'included', standard: 'included', advanced: 'included' },
  },
  {
    feature: 'Compatibilidade com sistemas operacionais Windows® legados',
    match: /Compatibilidade com sistemas operacionais Windows.*legados/i,
    values: { starter: 'included', standard: 'included', advanced: 'included' },
  },
  {
    feature: 'Gerência de Impressoras',
    match: /Gerência de Impressoras/i,
    values: { starter: 'excluded', standard: 'included', advanced: 'included' },
  },
  {
    feature: 'Permissões de acesso e modificação para Usuários e Grupos (ACLs)',
    match: /Permissões de acesso e modificação para Usuários e Grupos \(ACLs\)/i,
    values: { starter: 'excluded', standard: 'included', advanced: 'included' },
  },
  {
    feature: 'Políticas de Grupo (GPO)',
    match: /Políticas de Grupo \(GPO\)/i,
    values: { starter: 'excluded', standard: 'included', advanced: 'included' },
  },
  {
    feature: 'Autenticação transparente Single Sign-On (SSO)',
    match: /Autenticação transparente Single Sign-On \(SSO\)/i,
    values: { starter: 'excluded', standard: 'included', advanced: 'included' },
  },
  {
    feature: 'Antivírus com quarentena integrado ao servidor de arquivos',
    match: /Antiv[ií]rus com quarentena integrado ao servidor de arquivos/i,
    values: { starter: 'excluded', standard: 'included', advanced: 'included' },
  },
  {
    feature: 'Suporte para autenticação Kerberos para Radius',
    match: /Suporte para autenticação Kerberos para Radius/i,
    values: { starter: 'excluded', standard: 'excluded', advanced: 'included' },
  },
  {
    feature: 'Gerenciamento de Desktop Inteligente',
    match: /Gerenciamento de Desktop Inteligente/i,
    values: { starter: 'excluded', standard: 'excluded', advanced: 'included' },
  },
  {
    feature: 'Distribuição automatizada de software',
    match: /Distribuição automatizada de software/i,
    values: { starter: 'excluded', standard: 'excluded', advanced: 'included' },
  },
  {
    feature: 'Suporte para integração com nuvem privada Owncloud',
    match: /Suporte para integração com nuvem privada Owncloud/i,
    values: { starter: 'excluded', standard: 'excluded', advanced: 'included' },
  },
  {
    feature: 'Suporte para integração com serviço mensageiro XMPP',
    match: /Suporte para integração com serviço mensageiro XMPP/i,
    values: { starter: 'excluded', standard: 'excluded', advanced: 'included' },
  },
  {
    feature: 'Gerência do Catálogo Global',
    match: /Gerência do Catálogo Global/i,
    values: { starter: 'excluded', standard: 'optional', advanced: 'included' },
  },
  {
    feature: 'Delegação de tarefas administrativas',
    match: /Delegação de tarefas administrativas/i,
    values: { starter: 'excluded', standard: 'optional', advanced: 'included' },
  },
  {
    feature: 'Replicação automática entre servidores',
    match: /Replicação automática entre servidores/i,
    values: { starter: 'excluded', standard: 'optional', advanced: 'included' },
  },
  {
    feature: 'Administração Avançada através das ferramentas RSAT***',
    match: /Administração Avançada através das ferramentas RSAT/i,
    values: { starter: 'excluded', standard: 'optional', advanced: 'optional' },
  },
  {
    feature: 'Suporte à interface de acesso ADSI',
    match: /Suporte à interface de acesso ADSI/i,
    values: { starter: 'excluded', standard: 'excluded', advanced: 'excluded' },
  },
];

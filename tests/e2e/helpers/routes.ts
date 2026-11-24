export const CORE_ROUTES = [
  '/',
  '/empresa',
  '/servicos/preventivas',
  '/produtos/proxy',
  '/produtos/mailhost',
  '/produtos/samba_ad',
] as const;

export const SUPPORTING_ROUTES = [
  '/servicos',
  '/solucoes',
  '/contato',
  '/faq',
  '/termos',
  '/privacidade',
] as const;

export const ALL_ROUTES = [...CORE_ROUTES, ...SUPPORTING_ROUTES] as const;

export const TRAILING_SLASH_ROUTES = [
  '/empresa/',
  '/servicos/',
  '/servicos/preventivas/',
  '/solucoes/',
  '/produtos/proxy/',
  '/produtos/mailhost/',
  '/produtos/samba_ad/',
  '/contato/',
  '/faq/',
  '/termos/',
  '/privacidade/',
] as const;

export const SUPORTE_URL = 'https://suporte.cpuhouse.com.br';
export const WHATSAPP_PHONE = '5571981797556';
export const WHATSAPP_CONSULTA_REGEX = /api\.whatsapp\.com\/send\?phone=5571981797556|wa\.me\/5571981797556/i;

export const EXPECTED_OFFICES = {
  ba: {
    city: 'Lauro de Freitas',
    state: 'BA',
    street: 'Estrada do Coco, 3207',
    complement: 'Sala 11',
    cep: '42700-000',
    phonePrimary: '(71) 98179-7556',
    phoneSecondary: '(71) 98782-2230',
    mapUrlPart: 'goo.gl/vzMn17',
  },
  mg: {
    city: 'Sete Lagoas',
    state: 'MG',
    street: 'Rua Dr. Gabriel Passos, 355',
    cep: '35700-403',
    phonePrimary: '(31) 99214-1411',
    mapUrlPart: 'bit.ly/2HMX21R',
  },
} as const;

export const FORBIDDEN_LEGACY_TEXTS = [
  '© 2007 - 2018',
  '2007 - 2018',
  '2016 ©',
  'É vedada a cópia',
  'Windows Server 2012',
  'WINDOWS® SERVER 2012',
  'R$2.671,65',
  '2.671,65',
  '31/05/2017',
  'COEM / 5 CALS',
  'Valor para pagamento à vista',
  'Informe seu usuário e senha',
  'servicedesk.cpuhouse.com.br',
  'otrs/customer.pl',
  'Sed magna ornare ultricies',
  'In vestibulum massa',
  'Acelere o rendimento no trabalho',
  'Vamos lá!',
  'mais de 12 anos',
  '12 anos de mercado',
  'CONSULTE',
] as const;

export const FORBIDDEN_TYPOS = [
  'Open Inventation Network',
  "Área do Cliente'",
  'todos os atendimento ',
  'consciliado',
  'extruturas',
  'regras de de filtro',
  'à calamidades',
  'toda as informações',
  'Active Diretory',
] as const;

export const FORBIDDEN_SEO_DOMAIN = 'cpuhouse.com.br';

export function getExpectedSiteOrigin(baseURL?: string): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || baseURL;
  if (!raw) {
    throw new Error('Expected NEXT_PUBLIC_SITE_URL or Playwright baseURL to be defined');
  }
  return new URL(raw).origin;
}

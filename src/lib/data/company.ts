export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface OfficePhone {
  display: string;
  tel: string;
  e164: string;
  isWhatsApp?: boolean;
}

export interface OfficeLocation {
  id: 'ba';
  name: string;
  streetAddress: string;
  city: string;
  state: 'BA';
  postalCode: string;
  country: 'BR';
  mapUrl: string;
  geo: {
    latitude: number;
    longitude: number;
  };
  phones: OfficePhone[];
}

export interface SocialLink {
  id: 'facebook' | 'suporte-linux' | 'criancas-hackers';
  label: string;
  href: string;
  sameAs?: boolean;
}

export const COMPANY = {
  name: 'CPU House',
  fullName: 'CPU House — Consultoria e Soluções em TI',
  foundingDate: '2007-03-01',
  foundingYear: 2007,
  tagline:
    'Consultoria e soluções corporativas em TI com tecnologias open source consagradas desde 2007.',
  shortDescription:
    'Consultoria e soluções corporativas em TI com foco em servidores, segurança, backup em nuvem e suporte pró-ativo com software livre e conformidade LGPD.',
  logo: {
    src: '/images/logo-cpuhouse.jpg',
    alt: 'CPU House — Consultoria e Soluções em TI',
    width: 1024,
    height: 1024,
  },
  whatsappUrl: 'https://api.whatsapp.com/send?phone=5571981797556&text&app_absent=0',
  quote: {
    text: 'Criatividade é mais importante que conhecimento.',
    author: 'Albert Einstein',
  },
} as const;

export const NAV_ITEMS: NavItem[] = [
  { label: 'Serviços', href: '/servicos' },
  { label: 'Soluções', href: '/solucoes' },
  { label: 'Empresa', href: '/empresa' },
  { label: 'Contato', href: '/contato' },
];

export const FOOTER_NAV_LINKS: NavItem[] = [
  { label: 'Serviços', href: '/servicos' },
  { label: 'Soluções', href: '/solucoes' },
  { label: 'Empresa', href: '/empresa' },
  { label: 'Contato', href: '/contato' },
];

export const FOOTER_SUPPORT_LEGAL_LINKS: NavItem[] = [
  { label: 'Suporte', href: 'https://suporte.cpuhouse.com.br', external: true },
  { label: 'FAQ', href: '/faq' },
  { label: 'Termos', href: '/termos' },
  { label: 'Política de Privacidade (LGPD)', href: '/privacidade' },
];

export const OFFICES: OfficeLocation[] = [
  {
    id: 'ba',
    name: 'Lauro de Freitas, BA',
    streetAddress: 'Estrada do Coco, 3207, Sala 11',
    city: 'Lauro de Freitas',
    state: 'BA',
    postalCode: '42700-000',
    country: 'BR',
    mapUrl:
      'https://maps.here.com/directions/drive/mylocation/Cpuhouse-Consultoria-e-Solu%C3%A7%C3%B5es-em-TI:-12.892448,-38.326471?map=-12.89814,-38.31428,14,normal&fb_locale=pt_BR',
    geo: {
      latitude: -12.892448,
      longitude: -38.326471,
    },
    phones: [
      {
        display: '(71) 98179-7556',
        tel: 'tel:+5571981797556',
        e164: '+55-71-98179-7556',
        isWhatsApp: true,
      },
      {
        display: '(71) 98782-2230',
        tel: 'tel:+5571987822230',
        e164: '+55-71-98782-2230',
      },
    ],
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'facebook',
    label: 'Facebook /cpuhouse',
    href: 'https://www.facebook.com/cpuhouse',
    sameAs: true,
  },
  {
    id: 'suporte-linux',
    label: 'Suporte Linux',
    href: 'https://www.facebook.com/suportelinux/',
    sameAs: true,
  },
  {
    id: 'criancas-hackers',
    label: 'Crianças Hackers',
    href: 'https://raulhc.cc/Projetos/CriancasHacker',
  },
];

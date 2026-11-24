# DESIGN.md — Especificação do Design System CPU House

## 1. Identidade & Estrela Guia Criativa (Creative North Star)
- **Marca:** CPU House — Consultoria e Soluções em TI (Desde 2007 · BA & MG)
- **Tom de Voz:** Técnico, sóbrio, consultivo e objetivo em português do Brasil (B2B). Transmite estabilidade, segurança, conformidade com a LGPD e competência técnica sem exageros comerciais, jargão vazio ou emojis.
- **Arquétipo Visual:** Minimalismo Corporativo Técnico (referências: Linear, Vercel, Stripe, Cloudflare).
- **Princípio Fundamental:** "A interface deve operar como uma documentação de engenharia e infraestrutura de alta confiança: superfícies limpas, bordas precisas e contenção cromática — concentrando a ousadia visual na cena isométrica vetorial 3D do Hero e mantendo todo o restante silencioso e legível."

## 2. Paleta de Cores Semânticas (Formato HSL / CSS Variables)
Valores definidos em `:root` (Modo Claro único, `color-scheme: light`), expostos ao Tailwind v4 via `@theme inline`. Os valores hexadecimais exatos abaixo preservam fidelidade cromática e contraste WCAG 2.1 AA/AAA verificado.

### Tokens (`:root`)
| Token | Hex | HSL | Uso Semântico & Regra de Contraste |
|---|---|---|---|
| `--background` | `#F7F8FA` | `hsl(220, 23%, 97%)` | Fundo primário da aplicação |
| `--surface` (`--card`) | `#FFFFFF` | `hsl(0, 0%, 100%)` | Seções alternadas, cards, tabelas |
| `--surface-elevated` | `#FFFFFF` | `hsl(0, 0%, 100%)` | Navbar fixa, mockups, cabeçalho sticky |
| `--foreground` (`--card-foreground`) | `#0F172A` | `hsl(222, 47%, 11%)` | Texto principal (`16.80:1` em `#F7F8FA`, `17.85:1` em `#FFFFFF`) |
| `--muted` | `#EFF2F6` | `hsl(214, 28%, 95%)` | Fundos sutis de badges, chips e hover em linhas |
| `--muted-foreground` | `#475569` | `hsl(215, 19%, 35%)` | Texto secundário, legendas e metadados (`7.13:1` em `#F7F8FA`, `7.58:1` em `#FFFFFF` — substitui `#64748B`, que falha AA em `4.48:1` sobre `#F7F8FA`) |
| `--brand` (`--primary`) | `#0B4F6C` | `hsl(198, 82%, 23%)` | Cor única de marca para botões primários e preenchimentos (`8.41:1` em `#F7F8FA`) |
| `--brand-hover` | `#093E56` | `hsl(199, 81%, 19%)` | Hover de botão primário (`11.44:1` com texto `#FFFFFF`) |
| `--brand-foreground` (`--primary-foreground`) | `#FFFFFF` | `hsl(0, 0%, 100%)` | Texto sobre `--brand` (`8.94:1`) |
| `--brand-ink` | `#0B4F6C` | `hsl(198, 82%, 23%)` | Links, ícones e texto em cor da marca sobre fundo claro (`8.41:1`) |
| `--secondary` | `#EFF2F6` | `hsl(214, 28%, 95%)` | Fundos de ação secundária |
| `--secondary-foreground` | `#0F172A` | `hsl(222, 47%, 11%)` | Texto de botão secundário |
| `--accent` | `#22B8CF` | `hsl(188, 72%, 47%)` | **USO RESTRITO:** apenas LEDs do Hero 3D, traços vetoriais, CTA sobre bloco escuro (`CtaBlock`) e detalhes decorativos. **PROIBIDO como texto pequeno ou anel de foco sobre fundo claro** (`2.24:1` falha WCAG AA) |
| `--accent-foreground` | `#0B1120` | `hsl(223, 49%, 8%)` | Texto sobre `--accent` (`7.91:1`) |
| `--destructive` | `#DC2626` | `hsl(0, 72%, 51%)` | Ícones/estados de exclusão ou erro (`4.54:1` em `#F7F8FA`) |
| `--destructive-foreground` | `#FFFFFF` | `hsl(0, 0%, 100%)` | Texto sobre `--destructive` |
| `--border` | `#E2E8F0` | `hsl(214, 32%, 91%)` | Bordas estruturais de `1px` e divisores de tabela |
| `--ring` | `#0B4F6C` | `hsl(198, 82%, 23%)` | Anel `:focus-visible` acessível (`8.41:1` — atende WCAG 2.1 SC 1.4.11) |

## 3. Tipografia & Escala de Tipos
- **Fonte Display (Títulos H1–H3):** `Manrope` via `next/font/google` (`--font-manrope`, `display: 'swap'`), mapeada para `--font-display`, com `text-wrap: balance` e `tracking: -0.025em` a `-0.03em`.
- **Fonte Corpo (Leitura):** `Inter` via `next/font/google` (`--font-inter`, `display: 'swap'`), mapeada para `--font-sans`.
- **Fonte Técnica (Telemetria & Metadados):** `JetBrains Mono` via `next/font/google` (`--font-jetbrains-mono`, `display: 'swap'`), mapeada para `--font-mono`. **Uso restrito** a rótulos técnicos, escopos IP e contadores (`tabular-nums`). Nunca usar em corpo de texto.
- **Escala Tipográfica:**
  - `Display / Hero H1`: `clamp(2.25rem, 4vw, 3.25rem)` (36px–52px) | Weight: `600` | Line-height: `1.12` | Tracking: `-0.025em`
  - `H1 (Página Interna)`: `clamp(1.875rem, 3vw, 2.5rem)` (30px–40px) | Weight: `600` | Line-height: `1.18` | Tracking: `-0.02em`
  - `H2 (Seção)`: `clamp(1.5rem, 2.5vw, 2rem)` (24px–32px) | Weight: `600` | Line-height: `1.25` | Tracking: `-0.015em`
  - `H3 (Card / Subseção)`: `1.125rem`–`1.25rem` (18px–20px) | Weight: `600` | Line-height: `1.35` | Tracking: `-0.01em`
  - `Body Lead (Hero / Intro)`: `1.125rem` (18px) | Weight: `400` | Line-height: `1.6` | Medida máxima `65ch`
  - `Body Regular`: `1rem` (16px) | Weight: `400` | Line-height: `1.6`
  - `Body Small / Tabela`: `0.875rem` (14px) | Weight: `400` / `500` | Line-height: `1.5`
  - `Technical Label / Eyebrow`: `0.75rem` (12px) | Font: `var(--font-mono)` | Weight: `500` | Line-height: `1.4` | Tracking: `+0.06em`

## 4. Espaçamento & Grid
- **Escala Base:** Múltiplos estritos de `4px`/`8px` (`4, 8, 12, 16, 24, 32, 48, 64, 96, 120, 140, 160px`).
- **Container Global:** `max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8`.
- **Ritmo de Seções (`Section`):**
  - `spacing="default"`: `py-20 md:py-[120px] lg:py-[140px]` (atende à faixa obrigatória de `120px–160px` no desktop).
  - `spacing="hero"`: `pt-28 pb-20 md:pt-36 md:pb-[120px]` (compensa a Navbar fixa de `72px`).
  - `spacing="compact"`: `py-14 md:py-20` (cabeçalhos de páginas internas e blocos de apoio).
- **Gaps e Densidade:** `gap-6` (24px) em grids de cards; `gap-3` / `gap-4` (12–16px) em grupos de botões/badges; células de tabela comparativa em `py-3 px-4`.
- **Responsividade:** Mobile-first validado em `375px`, `768px` e `1440px` com `scrollWidth <= innerWidth`.

## 5. Raios de Borda (Border Radii)
Padronização consistente na faixa `12px–16px` para superfícies estruturais:
- `radius-sm` (`8px` / `rounded-lg`): Botões, inputs, chips técnicos.
- `radius-md` (`12px` / `rounded-xl`): Cards padrão, containers de tabela comparativa, painéis de conteúdo.
- `radius-lg` (`16px` / `rounded-2xl`): Quadros em destaque, banner dark de CTA final, moldura de galeria/mockup de navegador e cena do Hero.
- `radius-full` (`9999px` / `rounded-full`): Emblema circular do logo, avatares circulares da equipe, pílulas de selos de confiança e botão flutuante discreto do WhatsApp.

## 6. Elevação & Sombras
Hierarquia por contraste de superfície e bordas de `1px solid var(--border)`, com sombras contidas:
- `shadow-xs`: `0 1px 2px 0 rgba(15, 23, 42, 0.04)` — botões e chips.
- `shadow-card`: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 8px 24px -12px rgba(15, 23, 42, 0.08)` — cards elevados e mockups de navegador.
- `shadow-nav`: `0 1px 0 0 var(--border)` + `backdrop-blur-md` translúcido (`bg-background/85`).
- `glow-led` (exclusivo da cena Hero 3D): brilho SVG contido nos LEDs e pacotes de rede em `#22B8CF` (`rgba(34, 184, 207, 0.25)`), sem efeito neon em texto ou cards.

## 7. Especificação de Componentes Atômicos
- **Ícones:** Exclusivamente `lucide-react` com `strokeWidth={1.5}` em todo o site.
- **Botão Primário:** `h-11 px-5 rounded-lg bg-brand text-brand-foreground hover:bg-brand-hover font-medium transition-colors duration-150 cursor-pointer` + anel `:focus-visible`.
- **Botão Secundário:** `h-11 px-5 rounded-lg border border-border bg-surface text-foreground hover:bg-muted font-medium transition-colors duration-150 cursor-pointer`.
- **Card (`variant="service"`):** Fundo `bg-surface`, borda `border border-border rounded-xl p-6`, filete superior ou lateral na cor da marca (`border-t-2 border-t-brand`) e elevação sutil `+2px` no hover (`hover:-translate-y-0.5 transition-transform duration-200`).
- **PricingTable:** Cabeçalho `thead` com `sticky top-[72px]` no desktop (`lg:overflow-visible`) e `overflow-x-auto` no mobile (`< lg`); linhas `hover:bg-muted/50`; categorias recolhíveis via `<button aria-expanded>` com transição Motion (`reducedMotion="user"`); 3 estados com ícone + texto/rótulo acessível + legenda (`included` / `optional` / `excluded`).
- **TeamCard:** Retrato circular `w-28 h-28` (`112px`) com `rounded-full object-cover object-top grayscale group-hover:grayscale-0 transition-[filter] duration-300`; monograma vetorial limpo quando `photoSrc` estiver ausente.
- **Logo Badge (`logo-cpuhouse.jpg`):** Contêiner circular `rounded-full overflow-hidden bg-white border border-border` com `scale-[1.06]` para recortar a margem `#F7F7F7` do JPG e preservar nitidez.
- **WhatsAppFloat:** Discreto no canto inferior direito usando tokens da marca (`bg-brand text-brand-foreground hover:bg-brand-hover`), sem introduzir uma segunda cor de destaque.

## 8. Princípios Anti-AI-Slop
- **Estritamente proibido:** gradientes arco-íris ou roxos genéricos, efeitos neon, fundos "cyber hacker", emojis na UI, bancos de imagem genéricos, glassmorphism exagerado em cards, mais de uma cor de destaque, formulário de login no site, conteúdo comentado/oculto do site de 2018, texto `"© 2007 - 2018"`, lorem ipsum.
- **Métricas sempre contextualizadas:** `Desde 2007` (experiência contínua), `2 estados atendidos` (Bahia e Minas Gerais), `100% open source` (tecnologias livres consagradas).
- **Movimento com propósito:** Lenis + GSAP `ScrollTrigger` e Motion (`fade-up 16px`, `400–600ms`, `ease-out`) respeitando integralmente `prefers-reduced-motion: reduce`.

## 9. Portão de Auto-Crítica
Antes de considerar qualquer entrega ou alteração de interface concluída:
1. Verificar contraste WCAG 2.1 AA (`>= 4.5:1` texto normal, `>= 3:1` texto grande/bordas/foco) no modo claro via `@axe-core/playwright`.
2. Confirmar ausência de overflow horizontal (`scrollWidth <= innerWidth`) em `375px`, `768px` e `1440px`.
3. Confirmar navegação por teclado (`Tab`), anel `:focus-visible` visível, hierarquia única de `<h1>` -> `<h2>` -> `<h3>` e `alt` em todas as imagens.
4. Validar `prefers-reduced-motion: reduce` (cena Hero estática, Lenis desativado, `MotionConfig reducedMotion="user"`, nenhum conteúdo preso com `opacity: 0`).
5. Conferir que nenhuma cor foi "hardcoded" fora dos tokens semânticos definidos na Seção 2.

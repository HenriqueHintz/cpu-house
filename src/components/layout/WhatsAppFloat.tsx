import { MessageCircle } from 'lucide-react';
import { COMPANY } from '@/lib/data/company';

export function WhatsAppFloat() {
  return (
    <a
      href={COMPANY.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar com a CPU House pelo WhatsApp"
      title="Atendimento via WhatsApp"
      className="fixed right-5 bottom-5 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg ring-1 ring-white/20 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <MessageCircle className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
      <span className="sr-only">Atendimento via WhatsApp</span>
    </a>
  );
}

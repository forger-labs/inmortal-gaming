import { WhatsAppIcon } from "@shared/icons";
import Link from "next/link";

import { BUSINESS_WHATSAPP } from "@/constants";

const messageText = [
  "*INMORTAL GAMING — SOPORTE*",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "Hola, necesito ayuda",
]
  .filter(Boolean)
  .join("\n");

export default function WhatsAppFloat() {
  return (
    <Link
      href={`https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(messageText)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[10%] right-[5%] inline-flex items-center gap-2 rounded-full bg-neon-green px-4
    py-4 font-body text-sm font-semibold text-black transition-all duration-200
    hover:bg-neon-green/90 hover:shadow-[0_0_20px] hover:shadow-neon-green/50"
    >
      <WhatsAppIcon className="h-8 w-8" title="WhatsApp" />
    </Link>
  );
}

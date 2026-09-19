import { EmailIcon, UserIcon, WalletIcon } from "@shared/icons";
import type { OrderEntity, UserEntity } from "@shared/types";

export default function ClientHeader({
  order,
  user,
}: {
  order: OrderEntity;
  user: UserEntity | null;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-xl border border-white/5 bg-bg-primary/60 p-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
          <UserIcon className="h-3.5 w-3.5 text-neon-primary" />
          Cliente
        </span>
        <span className="font-mono text-sm font-semibold text-text-primary">
          {user ? `Usuario ${user?.username} - ID #${user.id}` : "Invitado"}
        </span>
      </div>

      {user && (
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
            <EmailIcon className="h-3.5 w-3.5 text-neon-primary" />
            Email
          </span>
          <span className="font-mono text-sm font-semibold text-text-primary">
            {user?.email}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
          Telefono de contacto
        </span>
        <span className="font-mono text-sm font-semibold text-text-primary">
          {order.phone_number ?? (user?.phone_number || "No registrado")}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
          <WalletIcon className="h-3.5 w-3.5 text-neon-primary" />
          Metodo de pago
        </span>
        <span className="font-mono text-sm font-semibold text-text-primary">
          {order.payment_method || "No especificado"}
        </span>
      </div>
    </div>
  );
}

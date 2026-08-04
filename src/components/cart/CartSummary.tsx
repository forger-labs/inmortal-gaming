import { WhatsAppIcon } from "@/components/icons";

export function CartSummary() {
  const subtotal = 319.49;
  const tax = 25.56;
  const total = 345.05;
  const itemCount = 3;

  return (
    <aside className="lg:col-span-4">
      <div className="sticky top-24 rounded-lg bg-bg-elevated p-6 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        {/* Title */}
        <h2 className="flex items-center gap-2 pb-3 font-display text-2xl font-semibold text-text-primary">
          <svg
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-6 w-6 text-neon-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .036.008.07.024.1.18.365.558.641 1.035.775.419.118.845.177 1.268.177h9.846c.423 0 .85-.059 1.268-.177.477-.134.855-.41 1.035-.775a.3.3 0 00.024-.1V8.625c0-.621-.504-1.125-1.125-1.125H6.75z"
            />
          </svg>
          Transmission Summary
        </h2>

        {/* Line items */}
        <div className="mt-6 flex flex-col gap-3 font-mono text-sm">
          <div className="flex justify-between text-text-secondary">
            <span>Subtotal ({itemCount} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>System Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>Shipping</span>
            <span className="text-neon-green">FREE</span>
          </div>

          {/* Divider + Total */}
          <div className="my-2 pt-3">
            <div className="flex items-end justify-between">
              <span className="font-display text-xl font-semibold text-text-primary">
                Total Signal
              </span>
              <span className="font-mono text-2xl font-bold text-neon-primary text-glow">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Promo Code */}
        <div className="mt-6">
          <label
            htmlFor="promo-code"
            className="mb-1 block font-label text-[13px] font-semibold uppercase tracking-wider text-text-secondary"
          >
            Neural Promo Code
          </label>
          <div className="flex gap-2">
            <input
              id="promo-code"
              type="text"
              placeholder="ENTER_CODE"
              className="w-full rounded bg-bg-surface-hover px-3 py-2 font-mono text-sm uppercase text-neon-primary placeholder:text-text-muted transition-all focus:outline-none focus:shadow-[0_0_8px_rgba(0,240,255,0.3)]"
            />
            <button
              type="button"
              className="rounded border border-neon-primary px-5 py-2 font-label text-[13px] font-semibold uppercase tracking-wider text-neon-primary transition-colors hover:bg-neon-primary/10"
            >
              APPLY
            </button>
          </div>
        </div>

        {/* Message Preview */}
        <div className="mt-6 rounded bg-bg-primary p-4">
          <p className="mb-2 flex items-center gap-1.5 font-mono text-xs text-text-secondary">
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-3.5 w-3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Message Preview:
          </p>
          <div className="border-l-2 border-neon-green pl-4">
            <p className="font-mono text-xs italic leading-relaxed text-text-muted">
              &ldquo;Initiating order sequence for 1x HDS-X99-CYAN, 2x
              KB-NEON-V2. Total: $345.05. Awaiting confirmation.&rdquo;
            </p>
          </div>
        </div>

        {/* WhatsApp Button */}
        <button
          type="button"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-neon-green py-3 font-display text-lg font-semibold text-black shadow-[0_0_15px_rgba(0,255,136,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(0,255,136,0.6)]"
        >
          <WhatsAppIcon className="h-6 w-6" title="WhatsApp" />
          Send via WhatsApp
        </button>

        <p className="mt-2 text-center font-body text-xs text-text-muted">
          Direct connection to Operator
        </p>
      </div>
    </aside>
  );
}

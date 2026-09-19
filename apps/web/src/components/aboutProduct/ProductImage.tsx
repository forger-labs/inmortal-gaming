import Image from "next/image";

const MOCK_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAanlW-VmCfBLAZN5yaOD-iQILxY29NHzZCANXBABAY0ca8FkkpjIVZAJ6evAzFOswm0lOeH9CUzoWUO23NSDXvyN4_k_L7GvNKtbStfBnA7hCgcAVHyokfSzP3jiAJhjNAzMRRc20uKpmDyKu6goPiFRWSTLLSpX43NKvFinADAcj7HOdAjr8qKj9OkaV9uXscmoYfZgrNFF9A-x7kHcyyVWZQUJSyVd7UeEyi4t7YWOCyq_55aho0";

export function ProductImage() {
  return (
    <div>
      {/* Main image */}
      <div className="relative overflow-hidden rounded-lg border border-white/10 bg-bg-surface group">
        {/* Cyan overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-neon-primary/5 mix-blend-overlay" />

        <Image
          src={MOCK_IMAGE}
          alt="CyberDeck Pro V9 - futuristic cyberpunk gaming hardware"
          width={600}
          height={600}
          className="aspect-square w-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <span className="rounded px-2 py-1 border border-neon-purple/50 bg-neon-purple/20 text-neon-purple font-semibold text-[13px] uppercase tracking-wider backdrop-blur-sm shadow-[0_0_8px_rgba(123,45,255,0.3)]">
            Premium
          </span>
          <span className="rounded px-2 py-1 border border-neon-green/50 bg-neon-green/10 text-neon-green font-semibold text-[13px] uppercase tracking-wider backdrop-blur-sm">
            IN STOCK
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-4 flex gap-4">
        <div className="h-20 w-20 cursor-pointer rounded border border-neon-primary bg-bg-surface relative overflow-hidden shadow-[0_0_8px_rgba(0,240,255,0.3)]">
          <div className="absolute inset-0 bg-neon-primary/20 mix-blend-overlay" />
        </div>
        <div className="h-20 w-20 cursor-pointer rounded border border-white/10 bg-bg-surface opacity-70 hover:opacity-100 hover:border-neon-primary/50 transition-colors" />
        <div className="h-20 w-20 cursor-pointer rounded border border-white/10 bg-bg-surface opacity-70 hover:opacity-100 hover:border-neon-primary/50 transition-colors" />
      </div>
    </div>
  );
}

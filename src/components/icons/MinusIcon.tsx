interface MinusIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

export function MinusIcon({ title, ...props }: MinusIconProps) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      {title && <title>{title}</title>}
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
}

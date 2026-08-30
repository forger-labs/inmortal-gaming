interface DeactivateIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

export function DeactivateIcon({ title, ...props }: DeactivateIconProps) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      {title && <title>{title}</title>}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 12h4.5" />
    </svg>
  );
}

interface PlusIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

export function PlusIcon({ title, ...props }: PlusIconProps) {
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
    </svg>
  );
}

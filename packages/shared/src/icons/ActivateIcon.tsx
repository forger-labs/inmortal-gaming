interface ActivateIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

export function ActivateIcon({ title, ...props }: ActivateIconProps) {
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
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 10.5v3l2.25 1.5L13.5 12 11.25 10.5 9 10.5zM15 8.25c1.5.9 2.25 2.1 2.25 3.75S16.5 14.85 15 15.75"
      />
    </svg>
  );
}

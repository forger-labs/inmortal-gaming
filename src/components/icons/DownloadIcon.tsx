interface DownloadIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

export function DownloadIcon({ title, ...props }: DownloadIconProps) {
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
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75V3m0 9.75l-3.75-3.75M12 12.75l3.75-3.75"
      />
    </svg>
  );
}

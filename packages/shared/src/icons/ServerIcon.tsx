interface ServerIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

export function ServerIcon({ title, ...props }: ServerIconProps) {
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
        d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.75 5.1a3 3 0 012.4-1.35h7.7a3 3 0 012.4 1.35l2.1 3.45a4.5 4.5 0 01.9 2.7M6.75 17.25h.008v.008H6.75v-.008zm3.75 0h.008v.008H10.5v-.008zM6.75 11.25h.008v.008H6.75v-.008zm3.75 0h.008v.008H10.5v-.008z"
      />
    </svg>
  );
}

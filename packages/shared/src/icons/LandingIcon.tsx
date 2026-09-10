interface LandingIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

export function LandingIcon({ title, ...props }: LandingIconProps) {
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
        d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h17.25c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125H3.375A1.125 1.125 0 012.25 8.625v-1.5zM2.25 14.25c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125H3.375A1.125 1.125 0 012.25 15.75v-1.5zM3.375 19.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5a1.125 1.125 0 00-1.125-1.125H3.375A1.125 1.125 0 002.25 16.875v1.5c0 .621.504 1.125 1.125 1.125z"
      />
    </svg>
  );
}

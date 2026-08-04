interface ProductsIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

export function ProductsIcon({ title, ...props }: ProductsIconProps) {
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
        d="M21 7.5l-9-5.25L3 7.5m18 0v9.75L12 21.75m0-13.5L3 16.5m9-5.25l9 5.25m-9-5.25v13.5"
      />
    </svg>
  );
}

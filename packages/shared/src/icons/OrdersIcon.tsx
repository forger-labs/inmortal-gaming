interface OrdersIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

export function OrdersIcon({ title, ...props }: OrdersIconProps) {
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
        d="M9 12h3.75H15m-7.5-3h12.75m-9.75 6h9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

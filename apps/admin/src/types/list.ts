import type { ReactNode } from "react";

export interface PaginationProps {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  ariaLabel?: string;
}

export interface ListHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
  children?: ReactNode;
}

export interface TableEmptyStateProps {
  colSpan: number;
  title?: string;
  description: string;
  icon?: ReactNode;
}

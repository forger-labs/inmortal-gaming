import type { ComponentPropsWithoutRef } from "react";

export interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

export interface FormSubmitButtonProps
  extends ComponentPropsWithoutRef<"button"> {
  submitting?: boolean;
  isEdit?: boolean;
  loadingLabel?: string;
  createLabel?: string;
  editLabel?: string;
}

export interface CancelButtonProps extends ComponentPropsWithoutRef<"button"> {
  label?: string;
}

export interface DangerButtonProps extends ComponentPropsWithoutRef<"button"> {
  submitting?: boolean;
  loadingLabel?: string;
  label?: string;
}

export interface FormInputProps extends ComponentPropsWithoutRef<"input"> {
  hasError?: boolean;
}

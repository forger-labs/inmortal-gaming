import { forwardRef } from "react";

import type { FormInputProps } from "@/types/forms";

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className = "", hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-md border bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/50 focus:outline-none focus:ring-1 ${
          hasError
            ? "border-neon-pink focus:border-neon-pink focus:ring-neon-pink"
            : "border-white/10 focus:border-neon-primary focus:ring-neon-primary"
        } ${className}`}
        {...props}
      />
    );
  },
);

FormInput.displayName = "FormInput";

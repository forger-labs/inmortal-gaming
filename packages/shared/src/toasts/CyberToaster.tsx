"use client";

import type { ComponentProps } from "react";
import { Toaster } from "react-hot-toast";

export type CyberToasterProps = ComponentProps<typeof Toaster>;

export function CyberToaster({
  position = "top-right",
  gutter = 12,
  containerStyle,
  toastOptions,
  ...props
}: CyberToasterProps) {
  return (
    <Toaster
      position={position}
      gutter={gutter}
      containerStyle={{
        zIndex: 9999,
        ...containerStyle,
      }}
      toastOptions={{
        // Evita que react-hot-toast aplique estilos default que compitan con .cyber-toast
        className: "",
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
        },
        ...toastOptions,
      }}
      {...props}
    />
  );
}

import toast from "react-hot-toast";

import type { CyberToastType } from "./CyberToastItem";
import { CyberToastItem } from "./CyberToastItem";

export type { CyberToastType };

export interface CyberToastOptions {
  duration?: number;
  typingSpeed?: number;
}

export function cyberToast(
  header: string,
  message: string,
  type: CyberToastType = "success",
  options?: CyberToastOptions,
) {
  const typingSpeed = options?.typingSpeed ?? 30;
  const baseDuration = options?.duration ?? 4000;
  const totalDuration = baseDuration + message.length * typingSpeed;

  toast.custom(
    (t) => (
      <CyberToastItem
        toastInstance={t}
        header={header}
        message={message}
        type={type}
        baseDuration={baseDuration}
        typingSpeed={typingSpeed}
      />
    ),
    {
      // Permitimos que el componente gestione la expiración con soporte de pausa
      duration: totalDuration + 1000,
    },
  );
}

export function cyberSuccess(
  message: string,
  header = "[SYSTEM SUCCESS]",
  options?: CyberToastOptions,
) {
  cyberToast(header, message, "success", options);
}

export function cyberError(
  message: string,
  header = "[CRITICAL ERROR]",
  options?: CyberToastOptions,
) {
  cyberToast(header, message, "error", options);
}

export function cyberInfo(
  message: string,
  header = "[SYSTEM NOTIFICATION]",
  options?: CyberToastOptions,
) {
  cyberToast(header, message, "info", options);
}

export function cyberWarning(
  message: string,
  header = "[SYSTEM WARNNING]",
  options?: CyberToastOptions,
) {
  cyberToast(header, message, "warning", options);
}

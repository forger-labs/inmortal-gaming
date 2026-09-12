import toast from "react-hot-toast";

import type { CyberToastOptions, CyberToastType } from "../types/toast";
import { CyberToastItem } from "./CyberToastItem";
import "./toasts.css";

export function cyberToast(
  header = "[SYSTEM]",
  message = "",
  type: CyberToastType = "success",
  options?: CyberToastOptions,
) {
  const safeHeader = header ?? "[SYSTEM]";
  const safeMessage = message ?? "";
  const typingSpeed = options?.typingSpeed ?? 30;
  const baseDuration = options?.duration ?? 4000;
  const totalDuration = baseDuration + safeMessage.length * typingSpeed;

  toast.custom(
    (t) => (
      <CyberToastItem
        toastInstance={t}
        header={safeHeader}
        message={safeMessage}
        type={type}
        baseDuration={baseDuration}
        typingSpeed={typingSpeed}
      />
    ),
    {
      // Permitimos que el componente gestione la expiracion con soporte de pausa
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
  header = "[SYSTEM WARNING]",
  options?: CyberToastOptions,
) {
  cyberToast(header, message, "warning", options);
}

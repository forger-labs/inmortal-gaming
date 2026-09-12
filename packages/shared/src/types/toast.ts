import type { Toast } from "react-hot-toast";

export type CyberToastType =
  | "success"
  | "error"
  | "loading"
  | "info"
  | "warning";

export interface CyberToastItemProps {
  toastInstance: Toast;
  header: string;
  message: string;
  type?: CyberToastType;
  baseDuration?: number;
  typingSpeed?: number;
}

export interface CyberToastOptions {
  duration?: number;
  typingSpeed?: number;
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { Toast } from "react-hot-toast";
import toast from "react-hot-toast";

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

export function CyberToastItem({
  toastInstance,
  header,
  message,
  type = "success",
  baseDuration = 4000,
  typingSpeed = 30,
}: CyberToastItemProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [isMicroGlitch, setIsMicroGlitch] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const containerRef = useRef<HTMLButtonElement>(null);
  const remainingTimeRef = useRef<number>(
    baseDuration + message.length * typingSpeed,
  );
  const activeStartRef = useRef<number>(0);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalDuration = baseDuration + message.length * typingSpeed;

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    setIsTypingDone(false);

    const interval = setInterval(() => {
      index++;
      setDisplayedText(message.slice(0, index));

      if (Math.random() < 0.08) {
        setIsMicroGlitch(true);
        setTimeout(() => setIsMicroGlitch(false), 80);
      }

      if (index >= message.length) {
        clearInterval(interval);
        setIsTypingDone(true);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [message, typingSpeed]);

  // Manejo de duración y hover pause interactivo
  useEffect(() => {
    activeStartRef.current = performance.now();
    dismissTimerRef.current = setTimeout(() => {
      toast.dismiss(toastInstance.id);
    }, totalDuration);

    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  }, [toastInstance.id, totalDuration]);

  const handleMouseEnter = () => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
    }
    const elapsed = performance.now() - activeStartRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    activeStartRef.current = performance.now();
    dismissTimerRef.current = setTimeout(() => {
      toast.dismiss(toastInstance.id);
    }, remainingTimeRef.current);
  };

  const handleClick = () => {
    toast.dismiss(toastInstance.id);
  };

  return (
    <button
      type="button"
      ref={containerRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-state={toastInstance.visible ? "open" : "closed"}
      className={`cyber-toast text-left ${type} ${isTypingDone ? "typing-done" : ""} ${
        isMicroGlitch ? "micro-glitch" : ""
      } ${isPaused ? "paused" : ""}`}
    >
      <div className="glitch-layer" data-text={displayedText} />
      <div className="cyber-toast-header">{header}</div>
      <div className="cyber-toast-body">
        <span className="text-content">{displayedText}</span>
        <span className="cursor" />
      </div>
      <div
        className="cyber-toast-progress"
        style={{
          animationDuration: `${totalDuration}ms`,
        }}
      />
    </button>
  );
}

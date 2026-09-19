"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import "./toasts.css";

import type { CyberToastItemProps } from "../types/toast";

export function CyberToastItem({
  toastInstance,
  header = "[SYSTEM]",
  message = "",
  type = "success",
  baseDuration = 4000,
  typingSpeed = 30,
}: CyberToastItemProps) {
  const safeMessage = message ?? "";
  const safeHeader = header ?? "[SYSTEM]";

  const [displayedText, setDisplayedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [isMicroGlitch, setIsMicroGlitch] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const containerRef = useRef<HTMLButtonElement>(null);
  const remainingTimeRef = useRef<number>(
    baseDuration + safeMessage.length * typingSpeed,
  );
  const activeStartRef = useRef<number>(0);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalDuration = baseDuration + safeMessage.length * typingSpeed;

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    setIsTypingDone(false);

    const interval = setInterval(() => {
      index++;
      setDisplayedText(safeMessage.slice(0, index));

      if (Math.random() < 0.08) {
        setIsMicroGlitch(true);
        setTimeout(() => setIsMicroGlitch(false), 80);
      }

      if (index >= safeMessage.length) {
        clearInterval(interval);
        setIsTypingDone(true);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [safeMessage, typingSpeed]);

  // Manejo de duracion y hover pause interactivo
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

  const isVisible = toastInstance.visible;

  return (
    <button
      type="button"
      ref={containerRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-state={isVisible ? "open" : "closed"}
      className={`cyber-toast text-left ${type} ${
        isVisible ? "visible" : "exiting"
      } ${isTypingDone ? "typing-done" : ""} ${
        isMicroGlitch ? "micro-glitch" : ""
      } ${isPaused ? "paused" : ""}`}
    >
      <div className="glitch-layer" data-text={displayedText} />
      <div className="cyber-toast-header">{safeHeader}</div>
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

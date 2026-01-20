"use client";

import { ReactNode, useEffect, useState } from "react";

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  speed?: number;
  delay?: number;
}

export function FloatingElement({
  children,
  className = "",
  amplitude = 10,
  speed = 3,
  delay = 0,
}: FloatingElementProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const y = Math.sin((elapsed + delay) * speed) * amplitude;
      setOffset(y);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [amplitude, speed, delay]);

  return (
    <div
      className={className}
      style={{
        transform: `translateY(${offset}px)`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

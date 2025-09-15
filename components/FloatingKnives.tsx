"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const knives = [
  {
    id: 1,
    svg: (
      <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.5 2L15 8.5L11.5 12L5 5.5L8.5 2Z" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5"/>
        <path d="M11.5 12L15 15.5L14 22L9.5 17.5L11.5 12Z" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5"/>
      </svg>
    ),
    initialX: Math.random() * 80 + 10,
    initialY: Math.random() * 80 + 10,
  },
  {
    id: 2,
    svg: (
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 2L16 14L14 21L2 9L4 2Z" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5"/>
        <path d="M16 14L20 18L18 22L14 18L16 14Z" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5"/>
      </svg>
    ),
    initialX: Math.random() * 80 + 10,
    initialY: Math.random() * 80 + 10,
  },
  {
    id: 3,
    svg: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L20 10L10 20L2 12L12 2Z" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5"/>
        <path d="M20 10L22 12L21 22L11 21L20 10Z" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5"/>
      </svg>
    ),
    initialX: Math.random() * 80 + 10,
    initialY: Math.random() * 80 + 10,
  },
];

export function FloatingKnives() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {knives.map((knife) => (
        <motion.div
          key={knife.id}
          className="absolute w-screen h-full"
          initial={{
            x: `${knife.initialX}vw`,
            y: `${knife.initialY}vh`,
            rotate: Math.random() * 360,
          }}
          animate={{
            x: `calc(${knife.initialX}vw + ${(mousePosition.x / window.innerWidth) * 30 - 15}px)`,
            y: `calc(${knife.initialY}vh + ${(mousePosition.y / window.innerHeight) * 30 - 15}px)`,
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 50,
            rotate: {
              repeat: Infinity,
              duration: 3 + Math.random() * 2,
              ease: "easeInOut",
            },
          }}
        >
          {knife.svg}
        </motion.div>
      ))}
    </div>
  );
}
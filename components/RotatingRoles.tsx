"use client";

import { useEffect, useState } from "react";

const roles = [
  "an analyst",
  "a problem solver",
  "a thriller detective",
  "a crochet enthusiast",
];

export default function RotatingRoles() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let swap: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setVisible(false);
      swap = setTimeout(() => {
        setIndex((i) => (i + 1) % roles.length);
        setVisible(true);
      }, 300);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(swap);
    };
  }, []);

  return (
    <p className="mt-4 font-display text-2xl">
      <span className="sr-only">
        I am an analyst, a problem solver, a thriller detective and a crochet
        enthusiast
      </span>
      I am{" "}
      <span
        aria-hidden
        className={`inline-block italic text-blush-deep transition-[opacity,transform] duration-300 ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
        }`}
      >
        {roles[index]}
      </span>
    </p>
  );
}

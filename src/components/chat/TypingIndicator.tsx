"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Three pulsing dots shown while the concierge composes a reply. */
export default function TypingIndicator() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex" aria-label="The concierge is typing">
      <div className="bg-ink-700/70 flex items-center gap-1.5 rounded-2xl rounded-bl-sm px-4 py-3.5">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="bg-gold-400/80 block h-1.5 w-1.5 rounded-full"
            animate={
              reduceMotion ? { opacity: 0.6 } : { opacity: [0.3, 1, 0.3] }
            }
            transition={{
              duration: 1.1,
              repeat: Infinity,
              delay: index * 0.18,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

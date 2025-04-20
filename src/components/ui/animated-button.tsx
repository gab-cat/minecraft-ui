"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { motion } from "framer-motion";
import { forwardRef } from "react";

interface AnimatedButtonProps extends ButtonProps {
  hoverScale?: number;
}

export const AnimatedButton = forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps
>(({ children, className, hoverScale = 1.03, ...props }, ref) => {
  return (
    <motion.div
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Button ref={ref} className={className} {...props}>
        {children}
      </Button>
    </motion.div>
  );
});

AnimatedButton.displayName = "AnimatedButton";

"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isFirstMount, setIsFirstMount] = useState(true);

  useEffect(() => {
    // Set first mount to false after component mounts
    setIsFirstMount(false);
  }, []);

  const variants = {
    hidden: { opacity: 0, x: -20 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  // Skip animation on first render to prevent animation on initial page load
  if (isFirstMount) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}

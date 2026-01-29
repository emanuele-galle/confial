"use client";

import { motion, PanInfo, useDragControls } from "framer-motion";
import { useEffect } from "react";

interface SwipeableSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function SwipeableSidebar({
  isOpen,
  onClose,
  children,
}: SwipeableSidebarProps) {
  const dragControls = useDragControls();

  // Close sidebar on escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleDragEnd = (_event: any, info: PanInfo) => {
    // If dragged more than 100px to the left, close sidebar
    if (info.offset.x < -100) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
      />

      {/* Swipeable Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        exit={{ x: -280 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        drag="x"
        dragControls={dragControls}
        dragConstraints={{ left: -280, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        className="fixed inset-y-0 left-0 z-50 w-70 lg:hidden"
        style={{ width: 280 }}
      >
        {children}
      </motion.aside>
    </>
  );
}

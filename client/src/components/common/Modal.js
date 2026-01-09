import React, { useEffect, useRef } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { glassStyles, borderRadius, spacing, shadows } from "../../constants/horizonTheme";

/**
 * Modal component for overlays, dropdowns, and dialogs
 * Standardized glass effect and positioning
 */
export default function Modal({
  children,
  isOpen,
  onClose,
  position = "absolute", // absolute, fixed
  style = {},
  overlayStyle = {},
  ...props
}) {
  const { isMobile } = useResponsive();
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const defaultStyle = {
    position,
    zIndex: 1000,
    ...glassStyles.base,
    borderRadius: borderRadius.lg,
    padding: isMobile ? spacing.md : spacing.lg,
    maxHeight: "75vh",
    overflow: "auto",
    ...style,
  };

  return (
    <>
      {position === "fixed" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            zIndex: 999,
            ...overlayStyle,
          }}
          onClick={onClose}
        />
      )}
      <div ref={modalRef} style={defaultStyle} {...props}>
        {children}
      </div>
    </>
  );
}


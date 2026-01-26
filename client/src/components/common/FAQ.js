import React, { useState } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { colors, spacing, typography, plainCardStyles, borderRadius } from "../../constants/horizonTheme";
import Icon from "./Icon";

/**
 * Reusable FAQ Component
 * 
 * @param {Array} items - Array of FAQ items, each with { question: string, answer: string }
 * @param {string} title - Optional header title for the FAQ section
 * 
 * @example
 * <FAQ
 *   title="Frequently Asked Questions"
 *   items={[
 *     { question: "What is this?", answer: "This is an answer." },
 *     { question: "How does it work?", answer: "It works like this." }
 *   ]}
 * />
 * 
 * Features:
 * - Expandable/collapsible questions
 * - Accordion style (only one open at a time)
 * - Smooth animations
 * - Responsive design
 * - Reusable on any page
 */
export default function FAQ({ items = [], title }) {
  const { isMobile } = useResponsive();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1000px",
        display: "flex",
        flexDirection: "column",
        gap: spacing.lg,
      }}
    >
      {title && (
        <div
          style={{
            textAlign: "center",
            marginBottom: spacing['2xl'],
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? typography.fontSize['2xl'] : typography.fontSize['4xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              margin: 0,
              fontFamily: typography.fontFamily.display,
              letterSpacing: typography.letterSpacing.tight,
            }}
          >
            {title}
          </h2>
        </div>
      )}
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        
        return (
          <div
            key={index}
            style={{
              ...plainCardStyles.base,
              borderRadius: borderRadius.lg,
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => toggleQuestion(index)}
              style={{
                width: "100%",
                padding: isMobile ? spacing.lg : spacing.xl,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: spacing.md,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                outline: "none",
              }}
            >
              <h3
                style={{
                  fontSize: isMobile ? typography.fontSize.base : typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  margin: 0,
                  flex: 1,
                  fontFamily: typography.fontFamily.heading,
                  letterSpacing: typography.letterSpacing.tight,
                }}
              >
                {item.question}
              </h3>
              <div
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "24px",
                }}
              >
                <Icon 
                  name="chevronDown" 
                  size={20} 
                  color={colors.text.secondary}
                />
              </div>
            </button>
            
            {isOpen && (
              <div
                style={{
                  padding: isMobile ? `0 ${spacing.lg} ${spacing.lg}` : `0 ${spacing.xl} ${spacing.xl}`,
                  borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
                  animation: "fadeIn 0.3s ease",
                }}
              >
                <p
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.text.secondary,
                    lineHeight: 1.8,
                    margin: 0,
                    paddingTop: spacing.md,
                  }}
                >
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

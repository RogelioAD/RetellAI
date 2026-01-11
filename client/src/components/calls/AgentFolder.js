import React, { useState, useMemo, useEffect } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import CallCard from "./CallCard";
import Button from "../common/Button";
import { extractCallId, extractCreatedAt } from "../../utils/callDataTransformers";
import { colors, spacing, typography, borderRadius } from "../../constants/horizonTheme";

// Collapsible folder component for grouping calls by agent with Horizon UI styling
export default function AgentFolder({ agentName, calls, defaultOpen = false }) {
  const { isMobile } = useResponsive();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [displayLimit, setDisplayLimit] = useState(20);
  
  const INITIAL_DISPLAY_LIMIT = 20;
  const LOAD_MORE_INCREMENT = 20;

  useEffect(() => {
    setDisplayLimit(INITIAL_DISPLAY_LIMIT);
  }, [calls.length]);

  // Sorts calls by date (newest first) within this agent folder
  const sortedCalls = useMemo(() => {
    return [...calls].sort((a, b) => {
      const mappingA = a.mapping || {};
      const callA = a.call || a;
      const mappingB = b.mapping || {};
      const callB = b.call || b;
      
      const dateA = new Date(extractCreatedAt(callA, mappingA)).getTime();
      const dateB = new Date(extractCreatedAt(callB, mappingB)).getTime();
      
      return dateB - dateA;
    });
  }, [calls]);

  const displayedCalls = sortedCalls.slice(0, displayLimit);
  const hasMoreCalls = sortedCalls.length > displayLimit;
  const remainingCount = sortedCalls.length - displayLimit;

  // Handles "Load More" button click to display more calls
  const handleLoadMore = () => {
    setDisplayLimit(prev => prev + LOAD_MORE_INCREMENT);
  };

  return (
    <div style={{ 
      marginBottom: isMobile ? spacing.lg : spacing.xl, 
      borderRadius: borderRadius.xl, 
      overflow: "hidden",
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      backdropFilter: "blur(40px) saturate(180%)",
      WebkitBackdropFilter: "blur(40px) saturate(180%)",
      border: "1px solid rgba(255, 255, 255, 0.18)",
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
      transition: "all 0.3s ease",
    }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: isMobile ? `${spacing.lg} ${spacing.xl}` : `${spacing.xl} ${spacing['2xl']}`,
          background: isOpen ? "rgba(99, 102, 241, 0.15)" : "transparent",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: typography.fontWeight.semibold,
          userSelect: "none",
          minHeight: "44px",
          transition: "all 0.3s ease",
        }}
      >
        <span style={{ 
          fontSize: isMobile ? typography.fontSize.base : typography.fontSize.lg,
          wordBreak: "break-word",
          flex: 1,
          minWidth: 0,
          color: colors.text.primary,
          fontWeight: typography.fontWeight.bold,
        }}>
          {agentName} ({calls.length} {calls.length === 1 ? 'call' : 'calls'})
        </span>
        <span style={{ 
          marginLeft: isMobile ? spacing.md : spacing.lg,
          flexShrink: 0,
          color: colors.brand[500],
          transition: "transform 0.2s ease",
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </div>
      
      {isOpen && (
        <div style={{ 
          padding: isMobile ? spacing.sm : spacing.md,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px) saturate(150%)",
          WebkitBackdropFilter: "blur(20px) saturate(150%)",
          borderTop: "1px solid rgba(255, 255, 255, 0.15)",
          transition: "all 0.3s ease",
        }}>
          {displayedCalls.map((item, index) => {
            const mapping = item.mapping || {};
            const call = item.call || item;
            const callId = extractCallId(call, mapping, index);
            const createdAt = extractCreatedAt(call, mapping);
            const hasError = item.error || (call === null && item.error);
            const errorMessage = item.error || (call === null ? "Call not found in Retell" : null);
            const isDeleted = item.isDeleted || false;

            return (
              <CallCard
                key={mapping.id || callId || index}
                call={call}
                mapping={mapping}
                createdAt={createdAt}
                hasError={hasError}
                errorMessage={errorMessage}
                callId={callId}
                isAdmin={true}
                isDeleted={isDeleted}
              />
            );
          })}
          
          {hasMoreCalls && (
            <div style={{ padding: spacing.sm }}>
              <Button
                onClick={handleLoadMore}
                variant="outline"
                fullWidth
              >
                Load More ({remainingCount} more {remainingCount === 1 ? 'call' : 'calls'})
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

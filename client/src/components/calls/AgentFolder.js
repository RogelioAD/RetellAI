import React, { useState, useMemo, useEffect } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import CallCard from "./CallCard";
import { extractCallId, extractCreatedAt } from "../../utils/callDataTransformers";

/**
 * Collapsible folder component for grouping calls by agent with responsive design
 */
export default function AgentFolder({ agentName, calls, defaultOpen = false }) {
  const { isMobile } = useResponsive();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [displayLimit, setDisplayLimit] = useState(20); // Show first 20 calls initially
  
  const INITIAL_DISPLAY_LIMIT = 20;
  const LOAD_MORE_INCREMENT = 20;

  // Reset display limit when calls change (e.g., when filters change)
  useEffect(() => {
    setDisplayLimit(INITIAL_DISPLAY_LIMIT);
  }, [calls.length]);

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

  const handleLoadMore = () => {
    setDisplayLimit(prev => prev + LOAD_MORE_INCREMENT);
  };

  return (
    <div style={{ 
      marginBottom: isMobile ? 16 : 20, 
      border: "1px solid rgba(255, 255, 255, 0.1)", 
      borderRadius: 12, 
      overflow: "hidden",
      background: "rgba(255, 255, 255, 0.06)",
      backdropFilter: "blur(20px)",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
    }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: isMobile ? "14px 18px" : "18px 24px",
          background: isOpen ? "rgba(255, 255, 255, 0.08)" : "transparent",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 500,
          userSelect: "none",
          minHeight: "44px",
          touchAction: "manipulation",
          transition: "all 0.2s ease"
        }}
      >
        <span style={{ 
          fontSize: isMobile ? "0.95em" : "1.05em",
          wordBreak: "break-word",
          flex: 1,
          minWidth: 0,
          color: "#f4f4f5"
        }}>
          {agentName} ({calls.length} {calls.length === 1 ? 'call' : 'calls'})
        </span>
        <span style={{ 
          fontSize: isMobile ? "1em" : "1.1em", 
          color: isOpen ? "rgba(255, 105, 180, 1)" : "rgba(255, 105, 180, 0.7)",
          marginLeft: isMobile ? 12 : 16,
          flexShrink: 0,
          transition: "all 0.2s ease"
        }}>
          {isOpen ? "▼" : "▶"}
        </span>
      </div>
      
      {isOpen && (
        <div style={{ padding: isMobile ? "4px" : "8px" }}>
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
            <button
              onClick={handleLoadMore}
              style={{
                width: "100%",
                padding: isMobile ? "12px 16px" : "14px 20px",
                marginTop: "8px",
                fontSize: isMobile ? "13px" : "14px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                color: "#d4d4d8",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 400,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 50%, rgba(240, 147, 251, 0.2) 100%)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.25)";
                e.target.style.color = "#fff";
                e.target.style.fontWeight = 500;
                e.target.style.transform = "translateY(-1px) scale(1.01)";
                e.target.style.boxShadow = "0 8px 24px rgba(102, 126, 234, 0.3)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.target.style.color = "#d4d4d8";
                e.target.style.fontWeight = 400;
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.2)";
              }}
            >
              Load More ({remainingCount} more {remainingCount === 1 ? 'call' : 'calls'})
            </button>
          )}
        </div>
      )}
    </div>
  );
}


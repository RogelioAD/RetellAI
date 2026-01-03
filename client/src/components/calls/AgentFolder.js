import React, { useState, useMemo } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import CallCard from "./CallCard";
import { extractCallId, extractCreatedAt } from "../../utils/callDataTransformers";

/**
 * Collapsible folder component for grouping calls by agent with responsive design
 */
export default function AgentFolder({ agentName, calls, defaultOpen = false }) {
  const { isMobile } = useResponsive();
  const [isOpen, setIsOpen] = useState(defaultOpen);

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

  return (
    <div style={{ 
      marginBottom: isMobile ? 16 : 20, 
      border: "1px solid rgba(255, 255, 255, 0.2)", 
      borderRadius: 16, 
      overflow: "hidden",
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.75) 100%)",
      backdropFilter: "blur(20px)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: isMobile ? "14px 18px" : "18px 24px",
          background: isOpen ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)" : "transparent",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 600,
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
          color: "#111827"
        }}>
          📁 {agentName} ({calls.length} {calls.length === 1 ? 'call' : 'calls'})
        </span>
        <span style={{ 
          fontSize: isMobile ? "1em" : "1.1em", 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginLeft: isMobile ? 12 : 16,
          flexShrink: 0,
          transition: "transform 0.2s ease"
        }}>
          {isOpen ? "▼" : "▶"}
        </span>
      </div>
      
      {isOpen && (
        <div style={{ padding: isMobile ? "4px" : "8px" }}>
          {sortedCalls.map((item, index) => {
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
        </div>
      )}
    </div>
  );
}


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
      marginBottom: isMobile ? 12 : 16, 
      border: "1px solid #ddd", 
      borderRadius: 8, 
      overflow: "hidden" 
    }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: isMobile ? "10px 12px" : "12px 16px",
          backgroundColor: "#f5f5f5",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "bold",
          userSelect: "none",
          minHeight: "44px", // Touch-friendly
          touchAction: "manipulation" // Prevent double-tap zoom
        }}
      >
        <span style={{ 
          fontSize: isMobile ? "0.9em" : "1em",
          wordBreak: "break-word",
          flex: 1,
          minWidth: 0
        }}>
          📁 {agentName} ({calls.length} {calls.length === 1 ? 'call' : 'calls'})
        </span>
        <span style={{ 
          fontSize: isMobile ? "0.85em" : "0.9em", 
          color: "#666",
          marginLeft: isMobile ? 8 : 12,
          flexShrink: 0
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


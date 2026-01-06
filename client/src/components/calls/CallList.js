import React, { useMemo, useState, useEffect } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { groupCallsByAgent, extractCallId, extractCreatedAt } from "../../utils/callDataTransformers";
import CallCard from "./CallCard";
import AgentFolder from "./AgentFolder";

/**
 * Main component for displaying a list of calls
 * Supports both grouped (by agent) and ungrouped views
 */
export default function CallList({ items, groupByAgent = false }) {
  const { isMobile } = useResponsive();
  const [displayLimit, setDisplayLimit] = useState(50); // Show first 50 calls initially
  
  const INITIAL_DISPLAY_LIMIT = 50;
  const LOAD_MORE_INCREMENT = 50;

  // Reset display limit when items change (e.g., when filters change)
  useEffect(() => {
    setDisplayLimit(INITIAL_DISPLAY_LIMIT);
  }, [items.length]);

  const groupedCalls = useMemo(() => {
    if (!groupByAgent || !items || items.length === 0) {
      return null;
    }
    return groupCallsByAgent(items);
  }, [items, groupByAgent]);

  const displayedItems = items.slice(0, displayLimit);
  const hasMoreItems = items.length > displayLimit;
  const remainingCount = items.length - displayLimit;

  const handleLoadMore = () => {
    setDisplayLimit(prev => prev + LOAD_MORE_INCREMENT);
  };

  if (!items || items.length === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "48px 24px",
        color: "#71717a",
        fontSize: "15px"
      }}>
        No calls yet.
      </div>
    );
  }

  // If grouping is enabled, render grouped view
  if (groupByAgent && groupedCalls) {
    return (
      <div>
        {groupedCalls.map((group) => (
          <AgentFolder 
            key={group.agentName} 
            agentName={group.agentName} 
            calls={group.calls}
            defaultOpen={false}
          />
        ))}
      </div>
    );
  }

  // Render ungrouped list
  return (
    <div>
      {displayedItems.map((item, index) => {
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
            isAdmin={false}
            isDeleted={isDeleted}
          />
        );
      })}
      
      {hasMoreItems && (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <button
            onClick={handleLoadMore}
            style={{
              padding: isMobile ? "12px 24px" : "14px 32px",
              fontSize: isMobile ? "14px" : "15px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              color: "#d4d4d8",
              borderRadius: "12px",
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
              e.target.style.transform = "translateY(-1px) scale(1.02)";
              e.target.style.boxShadow = "0 12px 40px rgba(102, 126, 234, 0.35)";
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
        </div>
      )}
    </div>
  );
}


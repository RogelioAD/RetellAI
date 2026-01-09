import React, { useMemo, useState, useEffect } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { groupCallsByAgent, extractCallId, extractCreatedAt } from "../../utils/callDataTransformers";
import CallCard from "./CallCard";
import AgentFolder from "./AgentFolder";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import { spacing } from "../../constants/horizonTheme";

/**
 * Main component for displaying a list of calls with Horizon UI styling
 * Supports both grouped (by agent) and ungrouped views
 */
export default function CallList({ items, groupByAgent = false }) {
  const { isMobile } = useResponsive();
  const [displayLimit, setDisplayLimit] = useState(50);
  
  const INITIAL_DISPLAY_LIMIT = 50;
  const LOAD_MORE_INCREMENT = 50;

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
      <EmptyState message="No calls yet." />
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
        <div style={{ marginTop: spacing.xl, display: "flex", justifyContent: "center" }}>
          <Button
            onClick={handleLoadMore}
            variant="outline"
            style={{
              padding: isMobile ? `${spacing.md} ${spacing['2xl']}` : `${spacing.lg} ${spacing['3xl']}`,
            }}
          >
            Load More ({remainingCount} more {remainingCount === 1 ? 'call' : 'calls'})
          </Button>
        </div>
      )}
    </div>
  );
}

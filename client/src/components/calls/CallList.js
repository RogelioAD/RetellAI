import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { groupCallsByAgent, extractCallId, extractCreatedAt } from "../../utils/callDataTransformers";
import CallCard from "./CallCard";
import AgentFolder from "./AgentFolder";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import { spacing } from "../../constants/horizonTheme";

const INITIAL_DISPLAY_LIMIT = 50;
const LOAD_MORE_INCREMENT = 50;

// Main component for displaying a list of calls - supports both grouped (by agent) and ungrouped views
function CallList({ items, groupByAgent = false }) {
  const { isMobile } = useResponsive();
  const [displayLimit, setDisplayLimit] = useState(INITIAL_DISPLAY_LIMIT);

  useEffect(() => {
    setDisplayLimit(INITIAL_DISPLAY_LIMIT);
  }, [items?.length]);

  const handleLoadMore = useCallback(() => {
    setDisplayLimit((prev) => prev + LOAD_MORE_INCREMENT);
  }, []);

  const groupedCalls = useMemo(() => {
    if (!groupByAgent || !items || items.length === 0) return null;
    return groupCallsByAgent(items);
  }, [items, groupByAgent]);

  const sortedItems = useMemo(() => {
    if (groupByAgent || !items || items.length === 0) return items;
    return [...items].sort((a, b) => {
      const mappingA = a.mapping || {};
      const callA = a.call || a;
      const mappingB = b.mapping || {};
      const callB = b.call || b;
      const dateA = callA?.created_at || callA?.createdAt || callA?.start_timestamp || mappingA?.createdAt || new Date().toISOString();
      const dateB = callB?.created_at || callB?.createdAt || callB?.start_timestamp || mappingB?.createdAt || new Date().toISOString();
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }, [items, groupByAgent]);

  const displayedItems = useMemo(
    () => sortedItems.slice(0, displayLimit),
    [sortedItems, displayLimit]
  );
  const hasMoreItems = sortedItems.length > displayLimit;
  const remainingCount = sortedItems.length - displayLimit;

  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon="phone"
        message="No calls yet"
        description="Call transcripts will appear here once your voice AI handles incoming or outgoing calls."
      />
    );
  }

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

export default React.memo(CallList);

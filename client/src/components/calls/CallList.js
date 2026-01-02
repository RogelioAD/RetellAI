import React, { useMemo } from "react";
import { groupCallsByAgent, extractCallId, extractCreatedAt } from "../../utils/callDataTransformers";
import CallCard from "./CallCard";
import AgentFolder from "./AgentFolder";

/**
 * Main component for displaying a list of calls
 * Supports both grouped (by agent) and ungrouped views
 */
export default function CallList({ items, groupByAgent = false }) {
  const groupedCalls = useMemo(() => {
    if (!groupByAgent || !items || items.length === 0) {
      return null;
    }
    return groupCallsByAgent(items);
  }, [items, groupByAgent]);

  if (!items || items.length === 0) {
    return <div>No calls yet.</div>;
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
      {items.map((item, index) => {
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
    </div>
  );
}


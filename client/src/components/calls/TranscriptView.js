import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { formatTime } from "../../utils/dateFormatters";

/**
 * Component for displaying call transcript utterances with responsive design
 */
export default function TranscriptView({ utterances }) {
  const { isMobile } = useResponsive();

  return (
    <div style={{ 
      borderRadius: 8,
      padding: isMobile ? 12 : 16
    }}>
      {utterances.map((utterance, index) => {
        const role = utterance.role || utterance.speaker || utterance.type || 
                    (utterance.agent_id ? 'agent' : 'customer');
        const isAgent = role.toLowerCase() === 'agent' || role.toLowerCase() === 'assistant' || utterance.agent_id;
        const speaker = isAgent ? 'Agent' : 'Customer';
        const content = utterance.content || utterance.text || utterance.message || utterance.transcript || '';
        const timestamp = utterance.timestamp || utterance.time || utterance.created_at;

        return (
          <div
            key={index}
            style={{
              marginBottom: isMobile ? 12 : 16,
              padding: isMobile ? 12 : 14,
              background: isAgent ? "rgba(99, 102, 241, 0.1)" : "rgba(255, 255, 255, 0.04)",
              borderRadius: 8,
              borderLeft: `3px solid ${isAgent ? "#6366f1" : "rgba(255, 255, 255, 0.2)"}`,
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          >
            <div style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              marginBottom: 8,
              gap: isMobile ? 4 : 0
            }}>
              <div style={{
                fontWeight: 500,
                color: isAgent ? "#a5b4fc" : "rgba(255, 255, 255, 0.9)",
                fontSize: isMobile ? "0.9em" : "0.95em"
              }}>
                {speaker}
              </div>
              {timestamp && (
                <div style={{
                  fontSize: isMobile ? "0.75em" : "0.8em",
                  color: "rgba(255, 255, 255, 0.6)"
                }}>
                  {formatTime(timestamp)}
                </div>
              )}
            </div>
            <div style={{
              color: "#ffffff",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontSize: isMobile ? "0.9em" : "1em"
            }}>
              {content}
            </div>
          </div>
        );
      })}
    </div>
  );
}


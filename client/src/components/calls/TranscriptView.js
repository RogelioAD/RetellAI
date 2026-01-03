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
              background: isAgent ? "rgba(102, 126, 234, 0.08)" : "rgba(255, 255, 255, 0.03)",
              borderRadius: 8,
              borderLeft: `3px solid ${isAgent ? "#667eea" : "#71717a"}`,
              border: "1px solid rgba(255, 255, 255, 0.06)"
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
                color: isAgent ? "#818cf8" : "#d4d4d8",
                fontSize: isMobile ? "0.9em" : "0.95em"
              }}>
                {speaker}
              </div>
              {timestamp && (
                <div style={{
                  fontSize: isMobile ? "0.75em" : "0.8em",
                  color: "#71717a"
                }}>
                  {formatTime(timestamp)}
                </div>
              )}
            </div>
            <div style={{
              color: "#e4e4e7",
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


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
      backgroundColor: "#f9f9f9",
      borderRadius: 4,
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
              padding: isMobile ? 10 : 12,
              backgroundColor: isAgent ? "#e3f2fd" : "#f5f5f5",
              borderRadius: 6,
              borderLeft: `4px solid ${isAgent ? "#2196f3" : "#757575"}`
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
                fontWeight: "bold",
                color: isAgent ? "#1976d2" : "#424242",
                fontSize: isMobile ? "0.9em" : "0.95em"
              }}>
                {speaker}
              </div>
              {timestamp && (
                <div style={{
                  fontSize: isMobile ? "0.75em" : "0.8em",
                  color: "#666"
                }}>
                  {formatTime(timestamp)}
                </div>
              )}
            </div>
            <div style={{
              color: "#333",
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


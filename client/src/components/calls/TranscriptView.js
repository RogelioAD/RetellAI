import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { formatTime } from "../../utils/dateFormatters";
import { colors, spacing, typography, borderRadius } from "../../constants/horizonTheme";

// Component for displaying call transcript utterances with Horizon UI styling
export default function TranscriptView({ utterances }) {
  const { isMobile } = useResponsive();

  return (
    <div style={{ 
      borderRadius: borderRadius.md,
      padding: isMobile ? spacing.md : spacing.lg,
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
              marginBottom: isMobile ? spacing.md : spacing.lg,
              padding: isMobile ? spacing.md : spacing.lg,
              background: isAgent ? `${colors.brand[500]}08` : colors.gray[50],
              borderRadius: borderRadius.md,
              borderLeft: `3px solid ${isAgent ? colors.brand[500] : colors.gray[300]}`,
              border: `1px solid ${isAgent ? colors.brand[200] : colors.gray[100]}`,
            }}
          >
            <div style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              marginBottom: spacing.sm,
              gap: isMobile ? spacing.xs : 0,
            }}>
              <div style={{
                fontWeight: typography.fontWeight.bold,
                color: isAgent ? colors.brand[500] : colors.text.primary,
                fontSize: typography.fontSize.sm,
              }}>
                {speaker}
              </div>
              {timestamp && (
                <div style={{
                  fontSize: typography.fontSize.xs,
                  color: colors.text.primary,
                  fontWeight: typography.fontWeight.medium,
                }}>
                  {formatTime(timestamp)}
                </div>
              )}
            </div>
            <div style={{
              color: colors.text.primary,
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
            }}>
              {content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

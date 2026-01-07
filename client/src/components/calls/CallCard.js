import React, { useState } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { 
  extractCreatedAt, 
  extractTranscriptData,
  extractPhoneNumber,
  extractCallDuration,
  extractRecordingUrl,
  formatDuration
} from "../../utils/callDataTransformers";
import { formatFullDate } from "../../utils/dateFormatters";
import TranscriptView from "./TranscriptView";
import Card from "../common/Card";
import Icon from "../common/Icon";
import { colors, spacing, typography, borderRadius } from "../../constants/horizonTheme";

/**
 * Card component for displaying a single call transcript with Horizon UI styling
 */
export default function CallCard({ 
  call, 
  mapping = {}, 
  createdAt, 
  hasError = false, 
  errorMessage = null, 
  isAdmin = false, 
  isDeleted = false 
}) {
  const { isMobile } = useResponsive();
  const [isExpanded, setIsExpanded] = useState(false);
  const { transcript, utterances } = extractTranscriptData(call);
  
  const finalCreatedAt = createdAt || extractCreatedAt(call, mapping);
  const phoneNumber = extractPhoneNumber(call);
  const durationSeconds = extractCallDuration(call);
  const recordingUrl = extractRecordingUrl(call);

  return (
    <Card
      padding="0"
      style={{
        marginBottom: isMobile ? spacing.md : spacing.lg,
        border: hasError ? `1px solid ${colors.error}` : undefined,
        backgroundColor: hasError ? `${colors.error}08` : colors.background.card,
      }}
    >
      {/* Collapsible Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: isMobile ? `${spacing.lg} ${spacing.xl}` : `${spacing.xl} ${spacing['2xl']}`,
          background: isExpanded ? colors.gray[50] : "transparent",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: isExpanded ? `1px solid ${colors.gray[100]}` : "none",
          userSelect: "none",
          minHeight: "44px",
          transition: "all 0.2s ease",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            fontSize: typography.fontSize.xs, 
            color: colors.text.tertiary, 
            marginBottom: spacing.xs,
            fontWeight: typography.fontWeight.semibold,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}>
            Call Transcript
          </div>
          <div style={{ 
            fontSize: isMobile ? typography.fontSize.base : typography.fontSize.lg, 
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.primary,
            wordBreak: "break-word",
            marginBottom: spacing.xs,
          }}>
            {formatFullDate(finalCreatedAt)}
          </div>
          {(phoneNumber || durationSeconds !== null) && (
            <div style={{ 
              fontSize: typography.fontSize.sm, 
              color: colors.text.secondary, 
              display: "flex",
              flexWrap: "wrap",
              gap: isMobile ? spacing.md : spacing.lg,
              alignItems: "center",
            }}>
              {phoneNumber && (
                <span style={{ display: "flex", alignItems: "center", gap: spacing.xs }}>
                  <Icon name="phone" size={14} color={colors.text.secondary} />
                  {phoneNumber}
                </span>
              )}
              {durationSeconds !== null && (
                <span style={{ display: "flex", alignItems: "center", gap: spacing.xs }}>
                  ⏱️ {formatDuration(durationSeconds)}
                </span>
              )}
            </div>
          )}
        </div>
        <div style={{ 
          marginLeft: isMobile ? spacing.md : spacing.xl,
          flexShrink: 0,
          color: colors.brand[500],
          transition: "transform 0.2s ease",
          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div style={{ padding: isMobile ? spacing.lg : spacing['2xl'] }}>
          {/* Call Info and Recording */}
          {call && !hasError && (
            <div style={{
              marginBottom: isMobile ? spacing.lg : spacing.xl,
              padding: isMobile ? spacing.lg : spacing.xl,
              background: colors.gray[50],
              borderRadius: borderRadius.lg,
              border: `1px solid ${colors.gray[100]}`,
            }}>
              <div style={{ 
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: spacing.lg,
                alignItems: isMobile ? "flex-start" : "center",
                justifyContent: "space-between",
              }}>
                <div style={{ 
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? spacing.xs : spacing.lg,
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                }}>
                  <div>
                    <strong style={{ color: colors.text.primary, fontWeight: typography.fontWeight.semibold }}>Phone:</strong> {phoneNumber || "N/A"}
                  </div>
                  <div>
                    <strong style={{ color: colors.text.primary, fontWeight: typography.fontWeight.semibold }}>Duration:</strong> {durationSeconds !== null && durationSeconds !== undefined ? formatDuration(durationSeconds) : "N/A"}
                  </div>
                </div>
                {recordingUrl ? (
                  <div style={{
                    width: isMobile ? "100%" : "auto",
                    minWidth: isMobile ? "100%" : "300px",
                  }}>
                    <audio
                      controls
                      src={recordingUrl}
                      style={{
                        width: "100%",
                        height: isMobile ? "36px" : "40px",
                        borderRadius: borderRadius.md,
                      }}
                      preload="metadata"
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : (
                  <span style={{ fontSize: typography.fontSize.sm, color: colors.text.tertiary }}>
                    No recording available
                  </span>
                )}
              </div>
            </div>
          )}
          
          {hasError && (
            <div style={{ 
              color: colors.error, 
              padding: isMobile ? spacing.md : spacing.lg, 
              background: `${colors.error}08`,
              borderRadius: borderRadius.md,
              border: `1px solid ${colors.error}`,
              marginBottom: isMobile ? spacing.md : spacing.lg,
              fontSize: typography.fontSize.sm,
            }}>
              <strong>⚠️ Status:</strong> {errorMessage}
              {(isDeleted || (errorMessage && errorMessage.includes("404"))) && (
                <div style={{ fontSize: typography.fontSize.xs, marginTop: spacing.xs, color: colors.text.secondary }}>
                  This call may have been deleted from Retell or the call ID is invalid.
                </div>
              )}
            </div>
          )}

          {/* Transcript Display */}
          {call && !hasError && (
            <div>
              {utterances && Array.isArray(utterances) && utterances.length > 0 ? (
                <TranscriptView utterances={utterances} />
              ) : transcript ? (
                <div style={{ 
                  whiteSpace: "pre-wrap", 
                  lineHeight: "1.6",
                  color: colors.text.primary,
                  fontSize: typography.fontSize.sm,
                  wordBreak: "break-word",
                  padding: spacing.lg,
                  backgroundColor: colors.gray[50],
                  borderRadius: borderRadius.md,
                }}>
                  {typeof transcript === 'string' ? transcript : JSON.stringify(transcript, null, 2)}
                </div>
              ) : (
                <div style={{ 
                  color: colors.text.tertiary, 
                  fontStyle: "italic",
                  padding: isMobile ? spacing.lg : spacing.xl,
                  textAlign: "center",
                  fontSize: typography.fontSize.sm,
                }}>
                  No transcript available for this call
                </div>
              )}
            </div>
          )}

          {!call && !hasError && (
            <div style={{ 
              color: colors.text.tertiary, 
              fontStyle: "italic", 
              padding: isMobile ? spacing.lg : spacing.xl,
              textAlign: "center",
              fontSize: typography.fontSize.sm,
            }}>
              No call details available
            </div>
          )}

          {/* Full JSON details for admin */}
          {isAdmin && call && (
            <details style={{ marginTop: isMobile ? spacing.lg : spacing.xl }}>
              <summary style={{ 
                cursor: "pointer", 
                padding: `${spacing.md} ${spacing.lg}`,
                background: colors.gray[50],
                borderRadius: borderRadius.md,
                fontWeight: typography.fontWeight.medium,
                color: colors.text.secondary,
                fontSize: typography.fontSize.sm,
                border: `1px solid ${colors.gray[100]}`,
              }}>
                View Full Call Data (JSON)
              </summary>
              <pre style={{ 
                whiteSpace: "pre-wrap", 
                fontSize: typography.fontSize.xs,
                background: colors.gray[50],
                color: colors.text.primary,
                padding: isMobile ? spacing.md : spacing.lg,
                borderRadius: borderRadius.md,
                marginTop: spacing.sm,
                maxHeight: isMobile ? "300px" : "400px",
                overflow: "auto",
                wordBreak: "break-word",
                border: `1px solid ${colors.gray[100]}`,
              }}>
                {JSON.stringify(call, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
    </Card>
  );
}

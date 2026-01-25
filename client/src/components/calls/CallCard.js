import React, { useState, useMemo } from "react";
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
import Alert from "../common/Alert";
import { colors, spacing, typography, borderRadius } from "../../constants/horizonTheme";

// Displays a single call transcript in a collapsible card with metadata and recording player
function CallCard({ 
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

  const { transcript, utterances } = useMemo(() => extractTranscriptData(call), [call]);
  const finalCreatedAt = useMemo(() => createdAt || extractCreatedAt(call, mapping), [createdAt, call, mapping]);
  const phoneNumber = useMemo(() => extractPhoneNumber(call), [call]);
  const durationSeconds = useMemo(() => extractCallDuration(call), [call]);
  const recordingUrl = useMemo(() => extractRecordingUrl(call), [call]);

  return (
    <Card
      padding="0"
      variant={hasError ? "solid" : "glass"}
      hover={!hasError}
      style={{
        marginBottom: isMobile ? spacing.md : spacing.lg,
        ...(hasError && {
          border: `1px solid ${colors.error}`,
          backgroundColor: `${colors.error}08`,
          boxShadow: `0 8px 32px 0 rgba(227, 26, 26, 0.2)`,
        }),
        borderRadius: borderRadius['2xl'],
        overflow: "hidden",
      }}
    >
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
          borderTopLeftRadius: borderRadius['2xl'],
          borderTopRightRadius: borderRadius['2xl'],
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            fontSize: typography.fontSize.xs, 
            color: colors.text.primary, 
            marginBottom: spacing.xs,
            fontWeight: typography.fontWeight.bold,
            textTransform: "uppercase",
            letterSpacing: typography.letterSpacing.wider,
            fontFamily: typography.fontFamily.heading,
          }}>
            Call Transcript
          </div>
          <div style={{ 
            fontSize: isMobile ? typography.fontSize.base : typography.fontSize.lg, 
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            wordBreak: "break-word",
            marginBottom: spacing.xs,
            fontFamily: typography.fontFamily.heading,
            letterSpacing: typography.letterSpacing.tight,
          }}>
            {formatFullDate(finalCreatedAt)}
          </div>
          {(phoneNumber || durationSeconds !== null) && (
            <div style={{ 
              fontSize: typography.fontSize.sm, 
              color: colors.text.primary, 
              fontWeight: typography.fontWeight.semibold,
              display: "flex",
              flexWrap: "wrap",
              gap: isMobile ? spacing.md : spacing.lg,
              alignItems: "center",
            }}>
              {phoneNumber && (
                <span style={{ display: "flex", alignItems: "center", gap: spacing.xs }}>
                  <Icon name="phone" size={14} color={colors.text.primary} />
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

      {isExpanded && (
        <div style={{ 
          padding: isMobile ? spacing.lg : spacing['2xl'],
          borderBottomLeftRadius: borderRadius.xl,
          borderBottomRightRadius: borderRadius.xl,
          overflow: "hidden",
        }}>
          {call && !hasError && (
            <div style={{
              marginBottom: isMobile ? spacing.lg : spacing.xl,
              padding: isMobile ? spacing.lg : spacing.xl,
              background: colors.gray[50],
              borderRadius: borderRadius['2xl'],
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
                    <strong style={{ color: colors.text.primary, fontWeight: typography.fontWeight.bold }}>Phone:</strong> {phoneNumber || "N/A"}
                  </div>
                  <div>
                    <strong style={{ color: colors.text.primary, fontWeight: typography.fontWeight.bold }}>Duration:</strong> {durationSeconds !== null && durationSeconds !== undefined ? formatDuration(durationSeconds) : "N/A"}
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
                  <span style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, fontWeight: typography.fontWeight.medium }}>
                    No recording available
                  </span>
                )}
              </div>
            </div>
          )}
          
          {hasError && (
            <Alert variant="error" style={{ marginBottom: isMobile ? spacing.md : spacing.lg }}>
              <strong>⚠️ Status:</strong> {errorMessage}
              {(isDeleted || (errorMessage && errorMessage.includes("404"))) && (
                <div style={{ fontSize: typography.fontSize.xs, marginTop: spacing.xs }}>
                  This call may have been deleted from Retell or the call ID is invalid.
                </div>
              )}
            </Alert>
          )}

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
                  fontWeight: typography.fontWeight.medium,
                  wordBreak: "break-word",
                  padding: spacing.lg,
                  backgroundColor: colors.gray[50],
                  borderRadius: borderRadius['2xl'],
                }}>
                  {typeof transcript === 'string' ? transcript : JSON.stringify(transcript, null, 2)}
                </div>
              ) : (
                <div style={{ 
                  color: colors.text.primary, 
                  fontStyle: "italic",
                  fontWeight: typography.fontWeight.semibold,
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
              color: colors.text.primary, 
              fontStyle: "italic",
              fontWeight: typography.fontWeight.semibold,
              padding: isMobile ? spacing.lg : spacing.xl,
              textAlign: "center",
              fontSize: typography.fontSize.sm,
            }}>
              No call details available
            </div>
          )}

          {isAdmin && call && (
            <details style={{ marginTop: isMobile ? spacing.lg : spacing.xl }}>
              <summary style={{ 
                cursor: "pointer", 
                padding: `${spacing.md} ${spacing.lg}`,
                background: colors.gray[50],
                borderRadius: borderRadius['2xl'],
                fontWeight: typography.fontWeight.bold,
                color: '#1B2559',
                fontSize: typography.fontSize.sm,
                border: `1px solid ${colors.gray[100]}`,
              }}>
                View Full Call Data (JSON)
              </summary>
              <pre style={{ 
                whiteSpace: "pre-wrap", 
                fontSize: typography.fontSize.xs,
                background: colors.gray[50],
                color: '#1B2559',
                fontWeight: typography.fontWeight.medium,
                padding: isMobile ? spacing.md : spacing.lg,
                borderRadius: borderRadius['2xl'],
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

export default React.memo(CallCard);

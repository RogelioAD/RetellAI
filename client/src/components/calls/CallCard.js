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
import Button from "../common/Button";
import { cardStyles, gradients } from "../../constants/styles";

/**
 * Card component for displaying a single call transcript with responsive design
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
  
  // Debug: Log call structure for first call (remove in production)
  React.useEffect(() => {
    if (call && isAdmin && Object.keys(call).length > 0) {
      console.log('Call data structure:', {
        phoneNumber,
        durationSeconds,
        recordingUrl,
        callKeys: Object.keys(call),
        sampleCall: call
      });
    }
  }, [call, isAdmin, phoneNumber, durationSeconds, recordingUrl]);
  
  const handleRecordingClick = () => {
    if (recordingUrl) {
      window.open(recordingUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      style={{
        ...(hasError ? cardStyles.error : cardStyles.container),
        marginBottom: isMobile ? 12 : 16
      }}
      onMouseEnter={(e) => {
        if (!hasError) {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
        }
      }}
      onMouseLeave={(e) => {
        if (!hasError) {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
        }
      }}
    >
      {/* Collapsible Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: isMobile ? "16px 20px" : "20px 24px",
          background: isExpanded ? "rgba(102, 126, 234, 0.08)" : "transparent",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: isExpanded ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
          userSelect: "none",
          minHeight: "44px",
          touchAction: "manipulation",
          transition: "all 0.2s ease"
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            fontSize: isMobile ? "0.75em" : "0.8em", 
            color: "#71717a", 
            marginBottom: 6,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            Call Transcript
          </div>
          <div style={{ 
            fontSize: isMobile ? "1em" : "1.15em", 
            fontWeight: 500,
            color: "#f4f4f5",
            wordBreak: "break-word"
          }}>
            {formatFullDate(finalCreatedAt)}
          </div>
          {(phoneNumber || durationSeconds !== null) && (
            <div style={{ 
              fontSize: isMobile ? "0.8em" : "0.85em", 
              color: "#a1a1aa", 
              marginTop: 8,
              display: "flex",
              flexWrap: "wrap",
              gap: isMobile ? "12px" : "16px"
            }}>
              {phoneNumber && (
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ opacity: 0.7 }}>📞</span> {phoneNumber}
                </span>
              )}
              {durationSeconds !== null && (
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ opacity: 0.7 }}>⏱️</span> {formatDuration(durationSeconds)}
                </span>
              )}
            </div>
          )}
        </div>
        <div style={{ 
          fontSize: isMobile ? "1.1em" : "1.3em", 
          background: gradients.button,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginLeft: isMobile ? 12 : 20,
          flexShrink: 0,
          transition: "transform 0.2s ease"
        }}>
          {isExpanded ? "▼" : "▶"}
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div style={{ padding: isMobile ? "12px" : "20px" }}>
          {/* Call Info and Recording Button */}
          {call && !hasError && (
            <div style={{ 
              marginBottom: isMobile ? 16 : 20,
              padding: isMobile ? 14 : 16,
              background: "rgba(102, 126, 234, 0.06)",
              borderRadius: 10,
              border: "1px solid rgba(102, 126, 234, 0.15)",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              gap: isMobile ? "12px" : "16px"
            }}>
              <div style={{ 
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? "4px" : "12px",
                fontSize: isMobile ? "0.85em" : "0.9em",
                color: "#d4d4d8"
              }}>
                <div>
                  <strong style={{ color: "#a1a1aa" }}>Phone:</strong> {phoneNumber || "N/A"}
                </div>
                <div>
                  <strong style={{ color: "#a1a1aa" }}>Duration:</strong> {durationSeconds !== null && durationSeconds !== undefined ? formatDuration(durationSeconds) : "N/A"}
                </div>
              </div>
              {recordingUrl ? (
                <Button
                  onClick={handleRecordingClick}
                  style={{
                    background: "linear-gradient(135deg, rgba(79, 172, 254, 0.2) 0%, rgba(0, 242, 254, 0.2) 100%)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(79, 172, 254, 0.3)",
                    color: "#fff",
                    fontSize: isMobile ? "0.85em" : "0.9em",
                    padding: isMobile ? "10px 16px" : "10px 20px",
                    fontWeight: 500,
                    boxShadow: "0 8px 32px rgba(79, 172, 254, 0.25), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
                  }}
                >
                  🎵 Play Recording
                </Button>
              ) : (
                <span style={{ fontSize: isMobile ? "0.85em" : "0.9em", color: "#71717a" }}>
                  No recording available
                </span>
              )}
            </div>
          )}
          
          {hasError && (
            <div style={{ 
              color: "#fca5a5", 
              padding: isMobile ? 12 : 14, 
              background: "rgba(239, 68, 68, 0.08)",
              borderRadius: 8,
              border: "1px solid rgba(239, 68, 68, 0.2)",
              marginBottom: isMobile ? 12 : 16,
              fontSize: isMobile ? "0.9em" : "1em"
            }}>
              <strong>⚠️ Status:</strong> {errorMessage}
              {(isDeleted || (errorMessage && errorMessage.includes("404"))) && (
                <div style={{ fontSize: isMobile ? "0.85em" : "0.9em", marginTop: 4, color: "#a1a1aa" }}>
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
                  color: "#d4d4d8",
                  fontSize: isMobile ? "0.9em" : "1em",
                  wordBreak: "break-word"
                }}>
                  {typeof transcript === 'string' ? transcript : JSON.stringify(transcript, null, 2)}
                </div>
              ) : (
                <div style={{ 
                  color: "#71717a", 
                  fontStyle: "italic",
                  padding: isMobile ? 16 : 20,
                  textAlign: "center",
                  fontSize: isMobile ? "0.9em" : "1em"
                }}>
                  No transcript available for this call
                </div>
              )}
            </div>
          )}

          {!call && !hasError && (
            <div style={{ 
              color: "#71717a", 
              fontStyle: "italic", 
              padding: isMobile ? 16 : 20,
              textAlign: "center",
              fontSize: isMobile ? "0.9em" : "1em"
            }}>
              No call details available
            </div>
          )}

          {/* Full JSON details for admin */}
          {isAdmin && call && (
            <details style={{ marginTop: isMobile ? 16 : 20 }}>
              <summary style={{ 
                cursor: "pointer", 
                padding: isMobile ? "10px 12px" : "8px 12px",
                background: "rgba(255, 255, 255, 0.04)",
                borderRadius: 8,
                fontWeight: 500,
                color: "#a1a1aa",
                fontSize: isMobile ? "0.9em" : "1em",
                touchAction: "manipulation",
                border: "1px solid rgba(255, 255, 255, 0.08)"
              }}>
                View Full Call Data (JSON)
              </summary>
              <pre style={{ 
                whiteSpace: "pre-wrap", 
                fontSize: isMobile ? "0.75em" : "0.85em",
                background: "rgba(0, 0, 0, 0.3)",
                color: "#d4d4d8",
                padding: isMobile ? 10 : 12,
                borderRadius: 8,
                marginTop: 8,
                maxHeight: isMobile ? "300px" : "400px",
                overflow: "auto",
                wordBreak: "break-word",
                border: "1px solid rgba(255, 255, 255, 0.08)"
              }}>
                {JSON.stringify(call, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}


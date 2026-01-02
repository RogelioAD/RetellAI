import React, { useState } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { 
  extractCallId, 
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
import { cardStyles } from "../../constants/styles";

/**
 * Card component for displaying a single call transcript with responsive design
 */
export default function CallCard({ 
  call, 
  mapping = {}, 
  createdAt, 
  hasError = false, 
  errorMessage = null, 
  callId, 
  isAdmin = false, 
  isDeleted = false 
}) {
  const { isMobile } = useResponsive();
  const [isExpanded, setIsExpanded] = useState(false);
  const { transcript, utterances } = extractTranscriptData(call);
  
  const finalCallId = callId || extractCallId(call, mapping);
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
    >
      {/* Collapsible Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: isMobile ? "12px 16px" : "16px 20px",
          backgroundColor: isExpanded ? "#f5f5f5" : "#fafafa",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: isExpanded ? "2px solid #e0e0e0" : "none",
          userSelect: "none",
          minHeight: "44px", // Touch-friendly
          touchAction: "manipulation" // Prevent double-tap zoom
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            fontSize: isMobile ? "0.8em" : "0.85em", 
            color: "#666", 
            marginBottom: 4 
          }}>
            Call Transcript
          </div>
          <div style={{ 
            fontSize: isMobile ? "0.95em" : "1.1em", 
            fontWeight: "bold",
            color: "#333",
            wordBreak: "break-word"
          }}>
            {formatFullDate(finalCreatedAt)}
          </div>
          {(phoneNumber || durationSeconds !== null) && (
            <div style={{ 
              fontSize: isMobile ? "0.75em" : "0.8em", 
              color: "#666", 
              marginTop: 4,
              display: "flex",
              flexWrap: "wrap",
              gap: isMobile ? "8px" : "12px"
            }}>
              {phoneNumber && (
                <span>📞 {phoneNumber}</span>
              )}
              {durationSeconds !== null && (
                <span>⏱️ {formatDuration(durationSeconds)}</span>
              )}
            </div>
          )}
        </div>
        <div style={{ 
          fontSize: isMobile ? "1em" : "1.2em", 
          color: "#666",
          marginLeft: isMobile ? 8 : 16,
          flexShrink: 0
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
              marginBottom: isMobile ? 12 : 16,
              padding: isMobile ? 10 : 12,
              backgroundColor: "#f0f7ff",
              borderRadius: 4,
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              gap: isMobile ? "8px" : "12px"
            }}>
              <div style={{ 
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? "4px" : "12px",
                fontSize: isMobile ? "0.85em" : "0.9em"
              }}>
                <div>
                  <strong style={{ color: "#666" }}>Phone:</strong> {phoneNumber || "N/A"}
                </div>
                <div>
                  <strong style={{ color: "#666" }}>Duration:</strong> {durationSeconds !== null && durationSeconds !== undefined ? formatDuration(durationSeconds) : "N/A"}
                </div>
              </div>
              {recordingUrl ? (
                <Button
                  onClick={handleRecordingClick}
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    fontSize: isMobile ? "0.85em" : "0.9em",
                    padding: isMobile ? "8px 12px" : "8px 16px"
                  }}
                >
                  🎵 Play Recording
                </Button>
              ) : (
                <span style={{ fontSize: isMobile ? "0.85em" : "0.9em", color: "#999" }}>
                  No recording available
                </span>
              )}
            </div>
          )}
          
          {hasError && (
            <div style={{ 
              color: "#856404", 
              padding: isMobile ? 10 : 12, 
              backgroundColor: "#fff3cd",
              borderRadius: 4,
              marginBottom: isMobile ? 12 : 16,
              fontSize: isMobile ? "0.9em" : "1em"
            }}>
              <strong>⚠️ Status:</strong> {errorMessage}
              {(isDeleted || (errorMessage && errorMessage.includes("404"))) && (
                <div style={{ fontSize: isMobile ? "0.85em" : "0.9em", marginTop: 4 }}>
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
                  color: "#333",
                  fontSize: isMobile ? "0.9em" : "1em",
                  wordBreak: "break-word"
                }}>
                  {typeof transcript === 'string' ? transcript : JSON.stringify(transcript, null, 2)}
                </div>
              ) : (
                <div style={{ 
                  color: "#666", 
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
              color: "#666", 
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
                backgroundColor: "#f9f9f9",
                borderRadius: 4,
                fontWeight: "bold",
                color: "#555",
                fontSize: isMobile ? "0.9em" : "1em",
                touchAction: "manipulation"
              }}>
                View Full Call Data (JSON)
              </summary>
              <pre style={{ 
                whiteSpace: "pre-wrap", 
                fontSize: isMobile ? "0.75em" : "0.85em",
                backgroundColor: "#f5f5f5",
                padding: isMobile ? 10 : 12,
                borderRadius: 4,
                marginTop: 8,
                maxHeight: isMobile ? "300px" : "400px",
                overflow: "auto",
                wordBreak: "break-word"
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


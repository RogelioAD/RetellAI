import React, { useState, useEffect, useRef } from "react";
import { useResponsive } from "../../../hooks/useResponsive";
import { colors, spacing, typography, borderRadius } from "../../../constants/horizonTheme";
import Icon from "../../common/Icon";

// Patient Journey component showing one patient from call to completed visit
export default function PatientJourney() {
  const { isMobile } = useResponsive();
  const [visibleSteps, setVisibleSteps] = useState(new Set());
  const stepRefs = useRef([]);

  const stepPalette = {
    blue: "#3B82F6",
    purple: "#8B5CF6",
    pink: "#EC4899",
    lavender: "#A78BFA",
  };

  const hexToRgb = (hex) => {
    if (!hex || typeof hex !== "string") return "139, 92, 246";
    const h = hex.replace("#", "");
    if (h.length === 6) {
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      return `${r}, ${g}, ${b}`;
    }
    if (h.length === 3) {
      const r = parseInt(h[0] + h[0], 16);
      const g = parseInt(h[1] + h[1], 16);
      const b = parseInt(h[2] + h[2], 16);
      return `${r}, ${g}, ${b}`;
    }
    return "139, 92, 246";
  };
  const getGlow = (color) => {
    const rgb = hexToRgb(color);
    return `0 0 32px 6px rgba(${rgb}, 0.22), 0 0 56px 12px rgba(${rgb}, 0.12)`;
  };

  const steps = [
    {
      number: 1,
      time: "8:15 AM",
      title: "Receptionist answers call",
      description: "Sarah calls to schedule a follow-up appointment with her cardiologist after completing her heart catheter procedure. The AI receptionist answers instantly—no hold, no voicemail. A friendly greeting, then straight to helping her book.",
      status: "ANSWERED ✓",
      conversation: {
        ai: "Good morning! Thank you for calling. How can I help you today?",
        patient: "Hi, I had a heart catheter procedure last week and need to schedule my follow-up with Dr. Martinez.",
        aiResponse: "I can help with that. Let me look up your information and find available times for your follow-up with Dr. Martinez. We have availability next Tuesday at 2 PM. Would that work?",
      },
      icon: "phone",
      color: stepPalette.blue,
      imageryLabel: "Call answered",
    },
    {
      number: 2,
      time: "8:16 AM",
      title: "Look up patient info in CRM",
      description: "The system looks up Sarah in the CRM—existing patient, contact details, and history. It shows her recent heart catheter procedure and previous appointments with Dr. Martinez. Everything the receptionist needs is right there. No digging through files or asking her to repeat herself.",
      crmData: {
        name: "Sarah",
        phone: "(555) 234-5678",
        procedure: "Heart Catheter (completed)",
        doctor: "Dr. Martinez",
        appointmentDate: "Follow-up: Next Tuesday, 2:00 PM",
        source: "Phone • 8:15 AM",
      },
      icon: "search",
      color: stepPalette.purple,
      imageryLabel: "Patient found",
    },
    {
      number: 3,
      time: "8:17 AM",
      title: "Book into calendar",
      description: "Sarah confirms the time. The AI checks Dr. Martinez's availability, finds the slot, and books the follow-up appointment into the calendar. Instant confirmation—no waiting, no back-and-forth.",
      calendar: {
        date: "Next Tuesday",
        time: "2:00 PM",
        procedure: "Follow-up appointment",
        followUp: "Post heart catheter procedure",
        doctor: "Dr. Martinez",
      },
      icon: "calendar",
      color: stepPalette.lavender,
      imageryLabel: "Booked ✓",
    },
    {
      number: 4,
      time: "24hrs before",
      title: "Call reminder 24hrs prior",
      description: "The day before her follow-up appointment, Sarah gets an automated reminder call from City Medical. She can confirm, reschedule, or cancel during the call. No surprises, fewer no-shows.",
      callReminder: {
        caller: "City Medical",
        label: "Reminder · 24hrs prior",
        script: "Hi Sarah! Reminder: your follow-up appointment with Dr. Martinez is tomorrow at 2 PM. Please arrive 15 minutes early. Press 1 to confirm, 2 to reschedule, or 3 to cancel.",
      },
      messages: [
        {
          type: "reminder",
          sent: true,
          content: "Hi Sarah! Reminder: your follow-up appointment with Dr. Martinez is tomorrow at 2 PM. Please arrive 15 minutes early. Press 1 to confirm, 2 to reschedule, or 3 to cancel.",
        },
      ],
      icon: "phone",
      color: stepPalette.pink,
      imageryLabel: "Reminder call",
    },
    {
      number: 5,
      time: "Visit day",
      title: "Patient visit complete",
      description: "Sarah arrives, checks in, and has her follow-up appointment with Dr. Martinez to review her heart catheter results. The visit is marked complete in the system. Care delivered, journey closed—seamlessly.",
      status: "VISIT COMPLETE ✓",
      visitComplete: {
        patient: "Sarah",
        procedure: "Follow-up appointment",
        date: "Tuesday",
        doctor: "Dr. Martinez",
      },
      icon: "check",
      color: stepPalette.blue,
      imageryLabel: "Complete ✓",
    },
    {
      number: 6,
      time: "After visit",
      title: "5-Star Reviews",
      description: "Sarah leaves a glowing 5-star review on Google, praising the seamless experience from booking to appointment. Her positive feedback joins hundreds of others, building trust and attracting new patients.",
      reviews: {
        rating: 5,
        totalReviews: 200,
        businessName: "City Medical Center",
      },
      icon: "check",
      color: stepPalette.lavender,
      imageryLabel: "5 Stars",
    },
  ];

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observers = stepRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleSteps((prev) => new Set([...prev, index]));
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: "0px 0px -100px 0px",
        }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  const renderImageryCard = (step) => {
    const glow = getGlow(step.color);
    // Special rendering for step 6 (reviews)
    if (step.reviews) {
      return (
        <div
          key={`img-${step.number}`}
          style={{
            flex: "0 0 auto",
            minHeight: isMobile ? "200px" : "280px",
            borderRadius: borderRadius["2xl"],
            background: colors.background.card,
            border: `2px solid ${colors.gray[200]}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: spacing["2xl"],
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
            boxShadow: `${glow}, 0 4px 16px rgba(0, 0, 0, 0.08)`,
          }}
        >
          {/* Google-style review mockup */}
          <div style={{ width: "100%", maxWidth: "280px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: spacing.sm, marginBottom: spacing.lg }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ fontSize: typography.fontSize["3xl"], color: "#F59E0B" }}>★</span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: "center", marginBottom: spacing.md }}>
              <div style={{ fontSize: typography.fontSize["2xl"], fontWeight: typography.fontWeight.extrabold, color: colors.text.primary, marginBottom: spacing.xs }}>
                {step.reviews.rating}.0
              </div>
              <div style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                {step.reviews.totalReviews} Google reviews
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: spacing.sm, marginTop: spacing.lg, paddingTop: spacing.lg, borderTop: `1px solid ${colors.gray[200]}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: spacing.xs }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: colors.gray[200], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>S</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: spacing.xs }}>
                    <span style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>Sarah C.</span>
                    <div style={{ display: "flex", gap: 1 }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ fontSize: typography.fontSize.xs, color: "#F59E0B" }}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default imagery card for other steps
    return (
      <div
        key={`img-${step.number}`}
        style={{
          flex: "0 0 auto",
          minHeight: isMobile ? "200px" : "280px",
          borderRadius: borderRadius["2xl"],
          background: `linear-gradient(135deg, ${step.color}22 0%, ${step.color}08 100%)`,
          border: `2px solid ${step.color}30`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: spacing["2xl"],
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
          boxShadow: glow,
        }}
      >
        <div
          style={{
            width: isMobile ? 80 : 120,
            height: isMobile ? 80 : 120,
            borderRadius: "50%",
            backgroundColor: step.color,
            color: colors.text.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isMobile ? typography.fontSize["3xl"] : typography.fontSize["4xl"],
            fontWeight: typography.fontWeight.extrabold,
            boxShadow: `0 12px 32px ${step.color}40`,
            marginBottom: spacing.lg,
            zIndex: 2,
          }}
        >
          {step.number}
        </div>
        <Icon name={step.icon} size={isMobile ? 48 : 64} color={step.color} strokeWidth="2.5" />
        <div
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.bold,
            color: colors.text.secondary,
            marginTop: spacing.md,
            textAlign: "center",
          }}
        >
          {step.imageryLabel || step.time}
        </div>
        {step.imageryLabel && step.time !== step.imageryLabel && (
          <div
            style={{
              fontSize: typography.fontSize.xs,
              color: colors.text.muted,
              marginTop: spacing.xs,
              textAlign: "center",
            }}
          >
            {step.time}
          </div>
        )}
      </div>
    );
  };

  const renderStepHeader = (step) => (
    <div key={`header-${step.number}`} style={{ flex: "1 1 50%", minWidth: 0, display: "flex", flexDirection: "column", gap: spacing.xl, alignItems: "flex-start", alignSelf: "stretch" }}>
      {/* Step icon first */}
      <div
        style={{
          width: isMobile ? 72 : 96,
          height: isMobile ? 72 : 96,
          borderRadius: "50%",
          backgroundColor: step.color,
          color: colors.text.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isMobile ? typography.fontSize["2xl"] : typography.fontSize["3xl"],
          fontWeight: typography.fontWeight.extrabold,
          boxShadow: `0 12px 32px ${step.color}40`,
          flexShrink: 0,
        }}
      >
        {step.number}
      </div>
      <div>
        <div
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.bold,
            color: colors.text.secondary,
            marginBottom: spacing.sm,
          }}
        >
          Step {step.number} · {step.time}
        </div>
        <h3
          style={{
            fontSize: isMobile ? typography.fontSize.xl : typography.fontSize["2xl"],
            fontWeight: typography.fontWeight.extrabold,
            color: colors.text.primary,
            margin: 0,
            marginBottom: spacing.lg,
            fontFamily: typography.fontFamily.display,
          }}
        >
          {step.title}
        </h3>
        <p
          style={{
            fontSize: typography.fontSize.base,
            color: colors.text.secondary,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {step.description}
        </p>
      </div>
    </div>
  );

  const glowStyle = (step) => ({ boxShadow: getGlow(step.color) });

  const renderDetailCards = (step) => (
    <div key={`details-${step.number}`} style={{ display: "flex", flexDirection: "column", gap: spacing.lg, flex: 1, minWidth: 0 }}>
      {step.status && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: spacing.sm,
            padding: spacing.md,
            backgroundColor: `${step.color}15`,
            borderRadius: borderRadius.lg,
            border: `2px solid ${step.color}30`,
            ...glowStyle(step),
          }}
        >
          <Icon name={step.icon} size={24} color={step.color} strokeWidth="2.5" />
          <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: step.color }}>
            {step.status}
          </span>
        </div>
      )}

      {step.conversation && (
        <div
          style={{
            padding: spacing.lg,
            backgroundColor: colors.gray[50],
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.gray[200]}`,
            ...glowStyle(step),
          }}
        >
          <div
            style={{
              marginBottom: spacing.md,
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.secondary,
              textTransform: "uppercase",
              letterSpacing: typography.letterSpacing.wider,
            }}
          >
            Receptionist
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: spacing.md }}>
            <div>
              <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, color: colors.brand[600], marginBottom: spacing.xs }}>AI:</div>
              <div style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, lineHeight: 1.5 }}>"{step.conversation.ai}"</div>
            </div>
            <div>
              <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, color: colors.text.secondary, marginBottom: spacing.xs }}>Sarah:</div>
              <div style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, lineHeight: 1.5 }}>"{step.conversation.patient}"</div>
            </div>
            {step.conversation.aiResponse && (
              <div>
                <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, color: colors.brand[600], marginBottom: spacing.xs }}>AI:</div>
                <div style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, lineHeight: 1.5 }}>"{step.conversation.aiResponse}"</div>
              </div>
            )}
          </div>
        </div>
      )}

      {step.crmData && (
        <div
          style={{
            padding: spacing.lg,
            backgroundColor: `${colors.brand[500]}08`,
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.brand[200]}`,
            ...glowStyle(step),
          }}
        >
          <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.text.secondary, textTransform: "uppercase", letterSpacing: typography.letterSpacing.wider, marginBottom: spacing.md }}>Patient info · CRM lookup</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: spacing.sm, fontSize: typography.fontSize.sm }}>
            <div><strong style={{ color: colors.text.primary }}>Patient Name:</strong> <span style={{ color: colors.text.secondary }}>{step.crmData.name}</span></div>
            <div><strong style={{ color: colors.text.primary }}>Phone:</strong> <span style={{ color: colors.text.secondary }}>{step.crmData.phone}</span></div>
            <div><strong style={{ color: colors.text.primary }}>Procedure:</strong> <span style={{ color: colors.text.secondary }}>{step.crmData.procedure}</span></div>
            <div><strong style={{ color: colors.text.primary }}>Doctor:</strong> <span style={{ color: colors.text.secondary }}>{step.crmData.doctor}</span></div>
            <div><strong style={{ color: colors.text.primary }}>Appointment:</strong> <span style={{ color: colors.text.secondary }}>{step.crmData.appointmentDate}</span></div>
            <div><strong style={{ color: colors.text.primary }}>Source:</strong> <span style={{ color: colors.text.secondary }}>{step.crmData.source}</span></div>
          </div>
        </div>
      )}

      {step.calendar && (
        <div style={{ padding: spacing.lg, backgroundColor: colors.gray[50], borderRadius: borderRadius.lg, border: `1px solid ${colors.gray[200]}`, ...glowStyle(step) }}>
          <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.text.secondary, textTransform: "uppercase", letterSpacing: typography.letterSpacing.wider, marginBottom: spacing.md }}>Appointment Booked ✓</div>
          <div style={{ display: "flex", flexDirection: "column", gap: spacing.sm, fontSize: typography.fontSize.sm }}>
            <div><strong style={{ color: colors.text.primary }}>{step.calendar.procedure}</strong></div>
            <div style={{ color: colors.text.secondary }}>{step.calendar.date} · {step.calendar.time}</div>
            <div style={{ color: colors.text.secondary, marginTop: spacing.sm }}>{step.calendar.followUp} with {step.calendar.doctor}</div>
          </div>
        </div>
      )}

      {step.messages &&
        step.messages.map((msg, idx) => (
          <div key={idx} style={{ padding: spacing.lg, backgroundColor: colors.gray[50], borderRadius: borderRadius.lg, border: `1px solid ${colors.gray[200]}`, ...glowStyle(step) }}>
            <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.text.secondary, textTransform: "uppercase", letterSpacing: typography.letterSpacing.wider, marginBottom: spacing.sm }}>
              {msg.type === "confirmation" ? "Appointment Confirmation" : "24h Reminder"}
              {msg.sent && " · Sent ✓"}
              {msg.scheduled && " · Scheduled"}
            </div>
            <div style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, lineHeight: 1.5, fontStyle: "italic" }}>"{msg.content}"</div>
          </div>
        ))}

      {step.visitComplete && (
        <div
          style={{
            padding: spacing.lg,
            backgroundColor: `${colors.success}12`,
            borderRadius: borderRadius.lg,
            border: `2px solid ${colors.success}30`,
            ...glowStyle(step),
          }}
        >
          <div
            style={{
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.secondary,
              textTransform: "uppercase",
              letterSpacing: typography.letterSpacing.wider,
              marginBottom: spacing.md,
            }}
          >
            Visit complete ✓
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: spacing.sm, fontSize: typography.fontSize.sm }}>
            <div><strong style={{ color: colors.text.primary }}>{step.visitComplete.patient}</strong> · {step.visitComplete.procedure}</div>
            <div style={{ color: colors.text.secondary }}>{step.visitComplete.date} · {step.visitComplete.doctor}</div>
          </div>
        </div>
      )}

      {step.noShowAlert && (
        <div style={{ padding: spacing.lg, backgroundColor: `${colors.warning}15`, borderRadius: borderRadius.lg, border: `2px solid ${colors.warning}30`, ...glowStyle(step) }}>
          <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.text.secondary, textTransform: "uppercase", letterSpacing: typography.letterSpacing.wider, marginBottom: spacing.md }}>NO-SHOW ALERT</div>
          <div style={{ display: "flex", flexDirection: "column", gap: spacing.xs, fontSize: typography.fontSize.sm, marginBottom: spacing.md }}>
            <div><strong style={{ color: colors.text.primary }}>{step.noShowAlert.date}</strong></div>
            <div style={{ color: colors.text.secondary }}>{step.noShowAlert.patient}</div>
            <div style={{ color: colors.text.secondary }}>{step.noShowAlert.procedure}</div>
            <div style={{ color: colors.warning, fontWeight: typography.fontWeight.bold }}>{step.noShowAlert.status}</div>
          </div>
          <div style={{ marginTop: spacing.md, paddingTop: spacing.md, borderTop: `1px solid ${colors.gray[200]}` }}>
            <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.text.secondary, marginBottom: spacing.sm }}>Recovery Sequence</div>
            {step.recoverySequence.map((seq, idx) => (
              <div key={idx} style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, marginBottom: spacing.xs, paddingLeft: spacing.md, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: colors.brand[500] }}>→</span>
                {seq}
              </div>
            ))}
          </div>
        </div>
      )}

      {step.rescheduled && (
        <div style={{ padding: spacing.lg, backgroundColor: `${colors.success}15`, borderRadius: borderRadius.lg, border: `2px solid ${colors.success}30`, ...glowStyle(step) }}>
          <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.text.secondary, textTransform: "uppercase", letterSpacing: typography.letterSpacing.wider, marginBottom: spacing.md }}>Appointment Rescheduled ✓</div>
          <div style={{ display: "flex", flexDirection: "column", gap: spacing.sm, fontSize: typography.fontSize.sm }}>
            <div><strong style={{ color: colors.text.primary }}>{step.rescheduled.date}</strong></div>
            <div style={{ color: colors.text.secondary }}>{step.rescheduled.procedure}</div>
            <div style={{ color: colors.text.secondary }}>Follow-up: {step.rescheduled.followUp} with {step.rescheduled.doctor}</div>
          </div>
        </div>
      )}

      {step.reviews && (
        <div
          style={{
            padding: spacing.lg,
            backgroundColor: colors.background.card,
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.gray[200]}`,
            boxShadow: `${getGlow(step.color)}, 0 2px 8px rgba(0, 0, 0, 0.08)`,
          }}
        >
          <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.text.secondary, textTransform: "uppercase", letterSpacing: typography.letterSpacing.wider, marginBottom: spacing.md }}>Google Reviews</div>
          <div style={{ display: "flex", flexDirection: "column", gap: spacing.md }}>
            <div style={{ display: "flex", alignItems: "center", gap: spacing.md }}>
              <div style={{ display: "flex", alignItems: "center", gap: spacing.xs }}>
                {[...Array(step.reviews.rating)].map((_, i) => (
                  <span key={i} style={{ fontSize: typography.fontSize["2xl"], color: "#F59E0B" }}>★</span>
                ))}
              </div>
              <div style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>
                {step.reviews.rating}.0
              </div>
              <div style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                ({step.reviews.totalReviews} reviews)
              </div>
            </div>
            <div style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
              {step.reviews.businessName}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: spacing.sm, marginTop: spacing.sm, paddingTop: spacing.md, borderTop: `1px solid ${colors.gray[200]}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: spacing.sm }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: colors.gray[200], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: typography.fontSize.lg, color: colors.text.secondary }}>S</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: spacing.xs, marginBottom: spacing.xs }}>
                    <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>Sarah C.</span>
                    <div style={{ display: "flex", gap: 2 }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ fontSize: typography.fontSize.xs, color: "#F59E0B" }}>★</span>
                      ))}
                    </div>
                    <span style={{ fontSize: typography.fontSize.xs, color: colors.text.muted }}>2 days ago</span>
                  </div>
                  <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, margin: 0, lineHeight: 1.5 }}>
                    "The entire experience was seamless! From booking my follow-up to the appointment itself, everything was handled professionally. Dr. Martinez was wonderful and the staff made me feel so comfortable."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep1SingleCard = (step) => {
    if (step.number !== 1 || !step.conversation) return null;
    const glow = getGlow(step.color);
    return (
      <div
        key="step1-single-card"
        style={{
          flex: "1 1 50%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          padding: spacing["2xl"],
          borderRadius: borderRadius["2xl"],
          background: colors.background.card,
          border: `2px solid ${colors.gray[200]}`,
          boxShadow: `${glow}, 0 4px 16px rgba(0, 0, 0, 0.08)`,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: spacing.xl, flex: 1, minHeight: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.sm }}>
            <div
              style={{
                width: isMobile ? 56 : 72,
                height: isMobile ? 56 : 72,
                borderRadius: "50%",
                backgroundColor: step.color,
                color: colors.text.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="phone" size={isMobile ? 28 : 36} color={colors.text.white} strokeWidth="2.5" />
            </div>
            <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: step.color }}>
              Answered in 2 seconds
            </span>
          </div>
          <div
            style={{
              flex: 1,
              padding: spacing.lg,
              backgroundColor: colors.gray[50],
              borderRadius: borderRadius.lg,
              border: `1px solid ${colors.gray[200]}`,
              display: "flex",
              flexDirection: "column",
              gap: spacing.md,
            }}
          >
            <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.text.secondary, textTransform: "uppercase", letterSpacing: typography.letterSpacing.wider }}>
              Conversation
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: spacing.md }}>
              <div>
                <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, color: colors.brand[600], marginBottom: spacing.xs }}>AI:</div>
                <div style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, lineHeight: 1.5 }}>"{step.conversation.ai}"</div>
              </div>
              <div>
                <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, color: colors.text.secondary, marginBottom: spacing.xs }}>Sarah:</div>
                <div style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, lineHeight: 1.5 }}>"{step.conversation.patient}"</div>
              </div>
              {step.conversation.aiResponse && (
                <div>
                  <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, color: colors.brand[600], marginBottom: spacing.xs }}>AI:</div>
                  <div style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, lineHeight: 1.5 }}>"{step.conversation.aiResponse}"</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep2SingleCard = (step) => {
    if (step.number !== 2 || !step.crmData) return null;
    const glow = getGlow(step.color);
    const d = step.crmData;
    const sectionStyle = {
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      border: `1px solid ${colors.gray[200]}`,
      backgroundColor: colors.gray[50],
      display: "flex",
      flexDirection: "column",
      gap: spacing.sm,
    };
    const labelStyle = {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.secondary,
      textTransform: "uppercase",
      letterSpacing: typography.letterSpacing.wider,
      marginBottom: spacing.xs,
    };
    const rowStyle = { fontSize: typography.fontSize.sm };
    return (
      <div
        key="step2-single-card"
        style={{
          flex: "1 1 50%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          padding: spacing["2xl"],
          borderRadius: borderRadius["2xl"],
          background: colors.background.card,
          border: `2px solid ${colors.gray[200]}`,
          boxShadow: `${glow}, 0 4px 16px rgba(0, 0, 0, 0.08)`,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: spacing.xl, flex: 1, minHeight: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.sm }}>
            <div
              style={{
                width: isMobile ? 56 : 72,
                height: isMobile ? 56 : 72,
                borderRadius: "50%",
                backgroundColor: step.color,
                color: colors.text.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="search" size={isMobile ? 28 : 36} color={colors.text.white} strokeWidth="2.5" />
            </div>
            <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: step.color }}>
              Patient found
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: spacing.lg, flex: 1, minHeight: 0 }}>
            <div style={sectionStyle}>
              <div style={labelStyle}>Patient</div>
              <div style={rowStyle}><strong style={{ color: colors.text.primary }}>Name:</strong> <span style={{ color: colors.text.secondary }}>{d.name}</span></div>
              <div style={rowStyle}><strong style={{ color: colors.text.primary }}>Phone:</strong> <span style={{ color: colors.text.secondary }}>{d.phone}</span></div>
            </div>
            <div style={sectionStyle}>
              <div style={labelStyle}>Care</div>
              <div style={rowStyle}><strong style={{ color: colors.text.primary }}>Procedure:</strong> <span style={{ color: colors.text.secondary }}>{d.procedure}</span></div>
              <div style={rowStyle}><strong style={{ color: colors.text.primary }}>Doctor:</strong> <span style={{ color: colors.text.secondary }}>{d.doctor}</span></div>
            </div>
            <div style={sectionStyle}>
              <div style={labelStyle}>Booking</div>
              <div style={rowStyle}><strong style={{ color: colors.text.primary }}>Appointment:</strong> <span style={{ color: colors.text.secondary }}>{d.appointmentDate}</span></div>
              <div style={rowStyle}><strong style={{ color: colors.text.primary }}>Source:</strong> <span style={{ color: colors.text.secondary }}>{d.source}</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep3SingleCard = (step) => {
    if (step.number !== 3 || !step.calendar) return null;
    const glow = getGlow(step.color);
    const cal = step.calendar;
    const dayHeaders = ["S", "M", "T", "W", "T", "F", "S"];
    const dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
    const highlightedDate = 19;
    return (
      <div
        key="step3-single-card"
        style={{
          flex: "1 1 50%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          padding: spacing["2xl"],
          borderRadius: borderRadius["2xl"],
          background: colors.background.card,
          border: `2px solid ${colors.gray[200]}`,
          boxShadow: `${glow}, 0 4px 16px rgba(0, 0, 0, 0.08)`,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: spacing.xl, flex: 1, minHeight: 0 }}>
          <div
            style={{
              padding: spacing.lg,
              borderRadius: borderRadius.lg,
              border: `2px solid ${colors.gray[200]}`,
              backgroundColor: colors.gray[50],
              display: "flex",
              flexDirection: "column",
              gap: spacing.md,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.xs }}>
              <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>November</span>
              <Icon name="calendar" size={20} color={step.color} strokeWidth="2.5" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: spacing.xs, textAlign: "center", fontSize: typography.fontSize.xs, color: colors.text.secondary, fontWeight: typography.fontWeight.semibold }}>
              {dayHeaders.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: spacing.xs, textAlign: "center", fontSize: typography.fontSize.sm }}>
              {dates.map((d) => (
                <span
                  key={d}
                  style={{
                    padding: spacing.xs,
                    borderRadius: borderRadius.sm,
                    fontWeight: d === highlightedDate ? typography.fontWeight.bold : typography.fontWeight.normal,
                    color: d === highlightedDate ? colors.text.white : colors.text.primary,
                    backgroundColor: d === highlightedDate ? step.color : "transparent",
                  }}
                >
                  {d}
                </span>
              ))}
            </div>
            <div style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, textAlign: "center", marginTop: spacing.xs }}>
              {cal.date} · {cal.time}
            </div>
          </div>
          <div
            style={{
              padding: spacing.lg,
              borderRadius: borderRadius.lg,
              border: `2px solid ${step.color}30`,
              backgroundColor: `${step.color}10`,
              display: "flex",
              flexDirection: "column",
              gap: spacing.sm,
            }}
          >
            <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: step.color, textTransform: "uppercase", letterSpacing: typography.letterSpacing.wider }}>
              Appointment booked ✓
            </div>
            <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>{cal.procedure}</div>
            <div style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>{cal.date} · {cal.time}</div>
            <div style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>{cal.followUp} with {cal.doctor}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep4SingleCard = (step) => {
    if (step.number !== 4) return null;
    const glow = getGlow(step.color);
    const call = step.callReminder || {
      caller: "City Medical",
      label: "Reminder · 24hrs prior",
      script: "Hi Sarah! Reminder: your follow-up appointment with Dr. Martinez is tomorrow at 2 PM. Please arrive 15 minutes early. Press 1 to confirm, 2 to reschedule, or 3 to cancel.",
    };
    return (
      <div
        key="step4-single-card"
        style={{
          flex: "1 1 50%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          padding: spacing["2xl"],
          borderRadius: borderRadius["2xl"],
          background: colors.background.card,
          border: `2px solid ${colors.gray[200]}`,
          boxShadow: `${glow}, 0 4px 16px rgba(0, 0, 0, 0.08)`,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: spacing.xl, flex: 1, minHeight: 0 }}>
          {/* Imagery: Incoming call mock */}
          <div
            style={{
              padding: spacing["2xl"],
              borderRadius: borderRadius.lg,
              background: `linear-gradient(180deg, ${step.color}12 0%, ${step.color}06 100%)`,
              border: `2px solid ${step.color}30`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: spacing.lg,
            }}
          >
            <div
              style={{
                width: isMobile ? 72 : 88,
                height: isMobile ? 72 : 88,
                borderRadius: "50%",
                backgroundColor: step.color,
                color: colors.text.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: `0 8px 24px ${step.color}40`,
              }}
            >
              <Icon name="phone" size={isMobile ? 36 : 44} color={colors.text.white} strokeWidth="2.5" />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.xs }}>{call.caller}</div>
              <div style={{ fontSize: typography.fontSize.sm, color: step.color, fontWeight: typography.fontWeight.semibold }}>{call.label}</div>
            </div>
            <div style={{ display: "flex", gap: spacing.md }}>
              <span
                style={{
                  padding: `${spacing.md} ${spacing.xl}`,
                  borderRadius: borderRadius.lg,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.white,
                  backgroundColor: step.color,
                }}
              >
                Answer
              </span>
              <span
                style={{
                  padding: `${spacing.md} ${spacing.xl}`,
                  borderRadius: borderRadius.lg,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.secondary,
                  backgroundColor: colors.gray[200],
                }}
              >
                Decline
              </span>
            </div>
          </div>
          {/* Detail: Call script / reminder message */}
          <div
            style={{
              padding: spacing.lg,
              borderRadius: borderRadius.lg,
              border: `1px solid ${colors.gray[200]}`,
              backgroundColor: colors.gray[50],
              display: "flex",
              flexDirection: "column",
              gap: spacing.md,
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.text.secondary, textTransform: "uppercase", letterSpacing: typography.letterSpacing.wider }}>
              On the call
            </div>
            <p style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, lineHeight: 1.6, margin: 0 }}>
              "{call.script}"
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.sm }}>
              <span style={{ padding: `${spacing.xs} ${spacing.md}`, borderRadius: borderRadius.sm, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, color: step.color, backgroundColor: `${step.color}18`, border: `1px solid ${step.color}40` }}>1 · Confirm</span>
              <span style={{ padding: `${spacing.xs} ${spacing.md}`, borderRadius: borderRadius.sm, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, color: step.color, backgroundColor: `${step.color}18`, border: `1px solid ${step.color}40` }}>2 · Reschedule</span>
              <span style={{ padding: `${spacing.xs} ${spacing.md}`, borderRadius: borderRadius.sm, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, color: step.color, backgroundColor: `${step.color}18`, border: `1px solid ${step.color}40` }}>3 · Cancel</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep5SingleCard = (step) => {
    if (step.number !== 5 || !step.visitComplete) return null;
    const glow = getGlow(step.color);
    const v = step.visitComplete;
    return (
      <div
        key="step5-single-card"
        style={{
          flex: "1 1 50%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          padding: spacing["2xl"],
          borderRadius: borderRadius["2xl"],
          background: colors.background.card,
          border: `2px solid ${colors.gray[200]}`,
          boxShadow: `${glow}, 0 4px 16px rgba(0, 0, 0, 0.08)`,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: spacing.xl, flex: 1, minHeight: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.sm }}>
            <div
              style={{
                width: isMobile ? 56 : 72,
                height: isMobile ? 56 : 72,
                borderRadius: "50%",
                backgroundColor: step.color,
                color: colors.text.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="check" size={isMobile ? 28 : 36} color={colors.text.white} strokeWidth="2.5" />
            </div>
            <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: step.color }}>
              Complete ✓
            </span>
          </div>
          <div
            style={{
              padding: spacing.lg,
              borderRadius: borderRadius.lg,
              border: `1px solid ${colors.gray[200]}`,
              backgroundColor: colors.gray[50],
              display: "flex",
              flexDirection: "column",
              gap: spacing.md,
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.text.secondary, textTransform: "uppercase", letterSpacing: typography.letterSpacing.wider }}>
              Visit complete ✓
            </div>
            <div style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, lineHeight: 1.5 }}>
              <strong>{v.patient}</strong> · {v.procedure}
            </div>
            <div style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
              {v.date} · {v.doctor}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep6SingleCard = (step) => {
    if (step.number !== 6 || !step.reviews) return null;
    const glow = getGlow(step.color);
    const r = step.reviews;
    const starColor = step.color;
    return (
      <div
        key="step6-single-card"
        style={{
          flex: "1 1 50%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          padding: spacing["2xl"],
          borderRadius: borderRadius["2xl"],
          background: colors.background.card,
          border: `2px solid ${colors.gray[200]}`,
          boxShadow: `${glow}, 0 4px 16px rgba(0, 0, 0, 0.08)`,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: spacing.xl, flex: 1, minHeight: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.sm }}>
            <div
              style={{
                width: isMobile ? 56 : 72,
                height: isMobile ? 56 : 72,
                borderRadius: "50%",
                backgroundColor: step.color,
                color: colors.text.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="check" size={isMobile ? 28 : 36} color={colors.text.white} strokeWidth="2.5" />
            </div>
            <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: step.color }}>
              5 Stars
            </span>
          </div>
          <div
            style={{
              padding: spacing.lg,
              borderRadius: borderRadius.lg,
              border: `1px solid ${colors.gray[200]}`,
              backgroundColor: colors.gray[50],
              display: "flex",
              flexDirection: "column",
              gap: spacing.md,
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: spacing.sm, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ fontSize: typography.fontSize.xl, color: starColor }}>★</span>
                ))}
              </div>
              <span style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>{r.rating}.0</span>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>{r.totalReviews} Google reviews</span>
            </div>
            <div style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>{r.businessName}</div>
            <div style={{ paddingTop: spacing.md, marginTop: spacing.sm, borderTop: `1px solid ${colors.gray[200]}`, display: "flex", flexDirection: "column", gap: spacing.sm }}>
              <div style={{ display: "flex", alignItems: "center", gap: spacing.xs }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: colors.gray[200], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>S</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: spacing.xs, flexWrap: "wrap" }}>
                  <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>Sarah C.</span>
                  <div style={{ display: "flex", gap: 1 }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ fontSize: typography.fontSize.xs, color: starColor }}>★</span>
                    ))}
                  </div>
                  <span style={{ fontSize: typography.fontSize.xs, color: colors.text.muted }}>2 days ago</span>
                </div>
              </div>
              <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, margin: 0, lineHeight: 1.5 }}>
                "The entire experience was seamless! From booking my follow-up to the appointment itself, everything was handled professionally. Dr. Martinez was wonderful and the staff made me feel so comfortable."
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderImageryAndDetails = (step) => {
    if (step.number === 1) {
      return renderStep1SingleCard(step);
    }
    if (step.number === 2) {
      return renderStep2SingleCard(step);
    }
    if (step.number === 3) {
      return renderStep3SingleCard(step);
    }
    if (step.number === 4) {
      return renderStep4SingleCard(step);
    }
    if (step.number === 5) {
      return renderStep5SingleCard(step);
    }
    if (step.number === 6) {
      return renderStep6SingleCard(step);
    }
    return (
      <div
        key={`imagery-details-${step.number}`}
        style={{
          flex: "1 1 50%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: spacing.lg,
          alignSelf: "stretch",
          minHeight: 0,
        }}
      >
        {renderImageryCard(step)}
        {renderDetailCards(step)}
      </div>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        minWidth: 0,
        maxWidth: "100%",
        marginTop: spacing["5xl"],
        marginBottom: spacing["5xl"],
        position: "relative",
      }}
    >
      {/* Section header */}
      <div
        style={{
          width: "100%",
          paddingLeft: isMobile ? spacing.xl : "8%",
          paddingRight: isMobile ? spacing.xl : "8%",
          paddingTop: spacing["5xl"],
          paddingBottom: spacing["5xl"],
          marginBottom: spacing["4xl"],
          background: `linear-gradient(180deg, ${colors.gray[50]} 0%, rgba(255,255,255,0.6) 100%)`,
          borderTop: `3px solid ${colors.brand[400]}`,
          borderBottom: `1px solid ${colors.gray[200]}`,
          textAlign: "center",
          boxSizing: "border-box",
          position: "relative",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
      >
        <div style={{ position: "relative", display: "inline-block", marginBottom: spacing["2xl"], textAlign: "center" }}>
          <h2
            style={{
              fontSize: isMobile ? typography.fontSize["3xl"] : typography.fontSize["5xl"],
              fontWeight: typography.fontWeight.extrabold,
              color: colors.text.primary,
              margin: 0,
              paddingBottom: 20,
              fontFamily: typography.fontFamily.display,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              lineHeight: 1.15,
              transform: "scaleY(1.08)",
              transformOrigin: "center",
              display: "inline-block",
              textAlign: "center",
            }}
          >
            The Journey
          </h2>
          <span
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 80,
              height: 4,
              borderRadius: 2,
              background: `linear-gradient(90deg, transparent, ${colors.brand[500]}, transparent)`,
            }}
          />
        </div>
        <p
          style={{
            fontSize: isMobile ? typography.fontSize.lg : typography.fontSize["2xl"],
            color: colors.text.secondary,
            margin: 0,
            maxWidth: "100%",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: isMobile ? 0 : "10%",
            paddingRight: isMobile ? 0 : "10%",
            lineHeight: 1.6,
            fontWeight: typography.fontWeight.medium,
            letterSpacing: "0.02em",
          }}
        >
          Follow one patient from phone call to completed appointment—see how every system works together seamlessly.
        </p>
      </div>

      {/* Steps with alternating layout */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing["4xl"],
        }}
      >
        {steps.map((step, index) => {
          const isVisible = visibleSteps.has(index);
          const headerFirst = index % 2 === 0; // Steps 1, 3, 5: header left, imagery+details right. Steps 2, 4, 6: imagery+details left, header right
          const slideFromLeft = headerFirst;
          
          return (
            <div
              key={step.number}
              ref={(el) => (stepRefs.current[index] = el)}
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: spacing["2xl"],
                alignItems: isMobile ? "stretch" : "stretch",
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translateX(0)"
                  : slideFromLeft
                  ? "translateX(-100px)"
                  : "translateX(100px)",
                transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
              }}
            >
              {isMobile ? (
                <>
                  {renderStepHeader(step)}
                  {renderImageryAndDetails(step)}
                </>
              ) : headerFirst ? (
                <>
                  {renderStepHeader(step)}
                  {renderImageryAndDetails(step)}
                </>
              ) : (
                <>
                  {renderImageryAndDetails(step)}
                  {renderStepHeader(step)}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

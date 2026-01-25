import React from "react";
import { useResponsive } from "../hooks/useResponsive";
import LandingHeader from "../components/layout/LandingHeader";
import SMSUseCases from "../components/landing/SMSUseCases";
import { BookingCalendar } from "../components/booking";
import FAQ from "../components/common/FAQ";
import { colors, spacing, typography } from "../constants/horizonTheme";
import "../index.css";

export default function SMS() {
  const { isMobile } = useResponsive();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor: colors.background.main,
      }}
    >
      {/* Header - fixed overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          pointerEvents: "none",
        }}
      >
        <LandingHeader />
      </div>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: isMobile ? "120px" : "140px",
          paddingBottom: spacing["5xl"],
          paddingLeft: isMobile ? spacing.xl : spacing["4xl"],
          paddingRight: isMobile ? spacing.xl : spacing["4xl"],
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* SMS Use Cases Section */}
        <SMSUseCases />

        {/* Inquiry Form */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: spacing["5xl"],
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: spacing["4xl"],
              width: "100%",
              maxWidth: "1200px",
            }}
          >
            <h2
              style={{
                fontSize: isMobile ? typography.fontSize["2xl"] : typography.fontSize["4xl"],
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                margin: 0,
                marginBottom: spacing.lg,
                fontFamily: typography.fontFamily.display,
                letterSpacing: typography.letterSpacing.tight,
              }}
            >
              Talk to the Team
            </h2>
          </div>
          <BookingCalendar
            onBookingSelect={(booking) => {
              console.log("Booking selected:", booking);
            }}
          />
        </div>

        {/* FAQ Section */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: spacing["5xl"],
          }}
        >
          <FAQ
            items={[
              {
                question: "What is SMS AI?",
                answer: "SMS AI delivers instant, context-aware responses to customer inquiries via text message. It provides real-time support, keeps customers informed, and ensures consistent communication across all channels.",
              },
              {
                question: "What can SMS AI do?",
                answer: "SMS AI can send appointment reminders, order updates, promotional messages, and handle customer service inquiries. It can also respond to incoming texts with intelligent, context-aware answers.",
              },
              {
                question: "How does SMS AI integrate with my systems?",
                answer: "Our SMS AI integrates seamlessly with your calendar, CRM, e-commerce platform, and other business systems. It can send automated messages based on events, schedules, or customer actions.",
              },
              {
                question: "Can customers reply to SMS messages?",
                answer: "Yes! Customers can reply to any SMS message, and the AI will respond intelligently based on the context. It can answer questions, process requests, and escalate to human agents when needed.",
              },
              {
                question: "Is SMS AI compliant with regulations?",
                answer: "Yes, our SMS AI is fully compliant with TCPA, CAN-SPAM, and other relevant regulations. We handle opt-ins, opt-outs, and consent management automatically.",
              },
            ]}
          />
        </div>
      </main>
    </div>
  );
}

import React from "react";
import { useResponsive } from "../hooks/useResponsive";
import LandingHeader from "../components/layout/LandingHeader";
import VoiceUseCases from "../components/landing/VoiceUseCases";
import { BookingCalendar } from "../components/booking";
import FAQ from "../components/common/FAQ";
import { colors, spacing, typography } from "../constants/horizonTheme";
import "../index.css";

export default function Voice() {
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
        {/* Voice Use Cases Section */}
        <VoiceUseCases />

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
                question: "How does voice AI work?",
                answer: "Our voice AI uses advanced natural language processing to handle customer calls with human-like conversations. It can answer questions, provide information, and assist customers 24/7 without human intervention.",
              },
              {
                question: "What can voice AI do?",
                answer: "Voice AI can handle customer service inquiries, qualify leads, schedule appointments, process payments, and more. It integrates with your existing systems and can transfer complex calls to human agents when needed.",
              },
              {
                question: "How quickly can I get started?",
                answer: "You can go live in minutes. No hardware or IT tickets required. Simply connect your phone number, configure your agent, and start taking calls.",
              },
              {
                question: "Does it work with my phone system?",
                answer: "Yes! Our voice AI works with any carrier including Verizon, AT&T, T-Mobile, Comcast, or VoIP systems. It integrates seamlessly with your existing infrastructure.",
              },
              {
                question: "What if a customer needs to speak to a human?",
                answer: "The AI can seamlessly transfer calls to your team when needed. You can configure transfer rules based on call complexity, customer requests, or specific keywords.",
              },
            ]}
          />
        </div>
      </main>
    </div>
  );
}

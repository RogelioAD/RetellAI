import React from "react";
import { useResponsive } from "../hooks/useResponsive";
import LandingHeader from "../components/layout/LandingHeader";
import { BookingCalendar } from "../components/booking";
import FAQ from "../components/common/FAQ";
import { colors, spacing, typography } from "../constants/horizonTheme";
import "../index.css";

// Talk to Sales page - dedicated page with form and FAQs
export default function TalkToSales() {
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

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: isMobile ? "120px" : "140px",
          paddingBottom: spacing['5xl'],
          paddingLeft: isMobile ? spacing.xl : spacing['4xl'],
          paddingRight: isMobile ? spacing.xl : spacing['4xl'],
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Header Section */}
        <div
          id="talk-to-sales-header"
          style={{
            textAlign: "center",
            marginBottom: spacing['5xl'],
            width: "100%",
            scrollMarginTop: isMobile ? "120px" : "140px",
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? typography.fontSize['3xl'] : typography.fontSize['5xl'],
              fontWeight: typography.fontWeight.extrabold,
              color: colors.text.primary,
              margin: 0,
              marginBottom: spacing.lg,
              lineHeight: 1.2,
              fontFamily: typography.fontFamily.display,
              letterSpacing: typography.letterSpacing.tight,
            }}
          >
            Talk to our Team
          </h1>
          <p
            style={{
              fontSize: isMobile ? typography.fontSize.lg : typography.fontSize['2xl'],
              color: colors.text.secondary,
              margin: 0,
              maxWidth: "800px",
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.7,
              fontWeight: typography.fontWeight.medium,
              letterSpacing: typography.letterSpacing.normal,
            }}
          >
            Schedule a personalized demo with our team to discover how Quantum Consulting can transform your customer communications and streamline your operations.
          </p>
        </div>

        {/* Booking Form */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: spacing['5xl'],
          }}
        >
          <BookingCalendar
            onBookingSelect={(booking) => {
              console.log('Booking selected:', booking);
            }}
          />
        </div>

        {/* FAQ Section */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FAQ
            items={[
              {
                question: "What is Quantum Consulting?",
                answer: "Quantum Consulting provides AI-powered communication solutions including intelligent voice and SMS services to help businesses enhance customer interactions and streamline operations."
              },
              {
                question: "How does the voice AI work?",
                answer: "Our voice AI uses advanced natural language processing to handle customer calls with human-like conversations. It can answer questions, provide information, and assist customers 24/7 without human intervention."
              },
              {
                question: "What are the benefits of SMS AI?",
                answer: "SMS AI delivers instant, context-aware responses to customer inquiries. It provides real-time support, keeps customers informed, and ensures consistent communication across all channels."
              },
              {
                question: "How do I get started?",
                answer: "Fill out the form above to request a demo. Our team will reach out to discuss how we can help transform your customer communication."
              },
              {
                question: "Do I have to sign a contract?",
                answer: "It's a fraction of the cost of an in-house receptionist, yet it works 24/7 and never takes a lunch break."
              }
            ]}
          />
        </div>
      </main>
    </div>
  );
}

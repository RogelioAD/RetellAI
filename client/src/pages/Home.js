import React from "react";
import { useResponsive } from "../hooks/useResponsive";
import LandingHeader from "../components/layout/LandingHeader";
import VideoHero from "../components/landing/VideoHero";
import PageIntro from "../components/landing/PageIntro";
import { BookingCalendar } from "../components/booking";
import FAQ from "../components/common/FAQ";
import FeatureCards from "../components/common/FeatureCards";
import PatientJourney from "../components/landing/PatientJourney";
import { colors, spacing, typography } from "../constants/horizonTheme";
import "../index.css";

// Landing page component
export default function Home() {
  const { isMobile } = useResponsive();
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor: colors.background.card,
        overflowX: "hidden",
        width: "100%",
        maxWidth: "100%",
      }}
    >
      {/* Video Hero Section */}
      <VideoHero />

      {/* Header - fixed overlay on top of the image */}
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

      {/* Main Content with white background */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile 
            ? `${spacing['4xl']} ${spacing.xl} ${spacing['5xl']}` 
            : `${spacing['5xl']} ${spacing['4xl']}`,
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          backgroundColor: colors.background.card,
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Page Intro Section */}
        <PageIntro />

        {/* Feature Cards Section */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: spacing['5xl'],
          }}
        >
          <FeatureCards />
        </div>

        {/* Patient Journey Section */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: spacing['5xl'],
          }}
        >
          <PatientJourney />
        </div>

        {/* Booking Calendar */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: spacing['5xl'],
          }}
        >
          {/* Header Section */}
          <div
            style={{
              textAlign: "center",
              marginBottom: spacing['4xl'],
              width: "100%",
              maxWidth: "1200px",
            }}
          >
            <h2
              style={{
                fontSize: isMobile ? typography.fontSize['2xl'] : typography.fontSize['4xl'],
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
            marginTop: spacing['5xl'],
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

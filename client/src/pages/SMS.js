import React from "react";
import { useResponsive } from "../hooks/useResponsive";
import LandingHeader from "../components/layout/LandingHeader";
import SMSUseCases from "../components/landing/SMSUseCases";
import GoogleFormWrapper from "../components/booking/GoogleFormWrapper";
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
                textTransform: "uppercase",
              }}
            >
              Talk to the Team
            </h2>
          </div>
          <GoogleFormWrapper />
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
            title="Frequently Asked Questions"
            items={[
              {
                question: "What is an AI Receptionist and how is it different from an IVR system?",
                answer: "An IVR is the old \"press 1 for sales, press 2 for support\" system which is robotic and frustrating. An AI receptionist is a voice agent that listens, understands, and takes action — just like a real person on the other end of the line. Callers speak naturally and the AI handles their request accordingly — booking appointments, answering questions, transferring calls. No menus. No repeating yourself. And if someone wants to speak to a human, they only have to ask once — not three times."
              },
              {
                question: "Can the AI integrate into our existing systems?",
                answer: "Yes. Our team works directly with you to connect the AI receptionist to your existing CRM — we support hundreds of CRM integrations. Whether you're a medical office using AdvancedMD, a dentist on Dentrix, an HVAC company on ServiceTitan, or a barbershop using Booksy."
              },
              {
                question: "Can we customize the AI receptionist to fit our business needs?",
                answer: "Yes. Our consultants work with you to tailor everything to your liking — how the receptionist sounds (male or female voice, accent preferences) and how it handles requests unique to your industry."
              },
              {
                question: "Is the AI HIPAA compliant?",
                answer: "Yes. Our AI receptionist is fully HIPAA compliant. All data — including call recordings and transcripts — is encrypted in transit and at rest. We provide a Business Associate Agreement (BAA) to healthcare clients and maintain detailed audit trails for every interaction."
              },
              {
                question: "How many calls can it handle at once?",
                answer: "Unlimited. Whether it's 2 calls or 200, every caller gets answered immediately. No hold times means happier customers."
              },
              {
                question: "What happens when the agent doesn't know the answer to a question asked by a customer?",
                answer: "It transfers the call directly to your line. The AI briefs you on what the customer needs so you can jump right in without asking them to repeat themselves."
              },
              {
                question: "Can the AI speak multiple languages?",
                answer: "Yes. The AI can speak 30+ languages — Spanish, Portuguese, French, Arabic, and many more."
              },
              {
                question: "Can I keep my existing phone number?",
                answer: "Yes. The AI receptionist works with your current phone number — no need to change it."
              },
              {
                question: "Can the AI make or receive phone calls?",
                answer: "Yes. It can take inbound calls from customers — answering questions, booking appointments, providing quotes — and make outbound calls for appointment confirmations, form submission follow-ups, and canceled appointment rescheduling."
              },
              {
                question: "Can the AI detect voicemail?",
                answer: "Yes. The AI knows when it hits voicemail and can either hang up or leave a message automatically."
              },
              {
                question: "Can we access call transcripts?",
                answer: "Yes. We provide you with login credentials so you can review call transcripts and analytics anytime."
              },
              {
                question: "Will the AI still work if my internet goes down?",
                answer: "The AI receptionist works independently of your internet connection. Your customers always get answered 24/7."
              }
            ]}
          />
        </div>
      </main>
    </div>
  );
}

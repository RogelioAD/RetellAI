import React from "react";
import { Circle } from "lucide-react";
import { useResponsive } from "../../../hooks/useResponsive";
import { spacing } from "../../../constants/horizonTheme";
import "../../../index.css";

export default function VideoHero() {
  const { isMobile } = useResponsive();

  // Reserve space for sticky navbar so hero text is not covered (mobile: clear nav fully)
  const navbarReserve = isMobile ? 128 : 140;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        height: isMobile ? "auto" : "85vh",
        minHeight: isMobile ? "120vh" : "680px",
        maxHeight: isMobile ? "none" : "none",
        position: "relative",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        <source src="/colorfulVid.mp4" type="video/mp4" />
      </video>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.52)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: isMobile ? 0 : "50%",
            transform: isMobile ? "none" : "translateX(-50%)",
            width: "100%",
            maxWidth: isMobile ? "100%" : "100%",
            paddingLeft: isMobile ? spacing['3xl'] : "8%",
            paddingRight: isMobile ? spacing['3xl'] : "8%",
            ...(isMobile ? { top: 0, bottom: 0, paddingTop: navbarReserve, paddingBottom: spacing['2xl'] } : { bottom: 0, paddingTop: navbarReserve, paddingBottom: spacing['2xl'] }),
            boxSizing: "border-box",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "center" : "center",
            justifyContent: isMobile ? "flex-start" : "space-between",
            gap: isMobile ? spacing.md : spacing['2xl'],
            overflowY: "hidden",
          }}
        >
          <div
            className="hero-headline-block"
            style={{
              flex: isMobile ? "none" : "1",
              maxWidth: isMobile ? "100%" : "50%",
              padding: 0,
              textAlign: isMobile ? "center" : "left",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              ...(isMobile && { gap: spacing.md }),
            }}
          >
            <h1 className="hero-headline">
              Stop paying <span className="hero-accent">$35,000</span> a year for someone who takes lunch breaks, sick days, and can only answer one call at a time
            </h1>
            <p className="hero-subhead" style={{ marginTop: 0 }}>
              Missed calls cost businesses <span className="hero-accent">$25,000+</span> a month. Our AI receptionist works <span className="hero-accent">24/7</span> for a <span className="hero-accent">fraction of the cost</span>
            </p>
          </div>

          <div
            className="hero-keypoints-wrapper"
            style={{
              flex: isMobile ? "none" : "1",
              maxWidth: isMobile ? "100%" : "48%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: isMobile ? undefined : "center",
              ...(isMobile && { gap: spacing.md }),
            }}
          >
            <div
              className="hero-keypoints"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: isMobile ? spacing.md : undefined,
                textAlign: isMobile ? "center" : "left",
              }}
            >
            <div className="hero-keypoint-row hero-keypoint-row--1" style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "center" : "center", gap: isMobile ? spacing.sm : spacing.xl, minWidth: isMobile ? undefined : "280px" }}>
              <span className="hero-keypoint-num hero-keypoint-num--1" aria-hidden>
                <span className="hero-keypoint-num-ring" aria-hidden><Circle size={isMobile ? 56 : 100} strokeWidth={1.5} /></span>
                <span className="hero-keypoint-num-digit">1</span>
              </span>
              <div className="hero-keypoint-text" style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                <span className="hero-keypoint-title">Never Miss A Customer Ready To{"\u00A0"}Pay</span>
                <span className="hero-keypoint-body">6 out of 10 phone calls to small businesses go unanswered</span>
              </div>
            </div>
            <div className="hero-keypoint-row hero-keypoint-row--2" style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "center" : "center", gap: isMobile ? spacing.sm : spacing.xl, minWidth: isMobile ? undefined : "280px" }}>
              <span className="hero-keypoint-num hero-keypoint-num--2" aria-hidden>
                <span className="hero-keypoint-num-ring" aria-hidden><Circle size={isMobile ? 56 : 100} strokeWidth={1.5} /></span>
                <span className="hero-keypoint-num-digit">2</span>
              </span>
              <div className="hero-keypoint-text" style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                <span className="hero-keypoint-title">The First Business To Answer Gets The{"\u00A0"}Job</span>
                <span className="hero-keypoint-body">85% of callers don't call back after their first attempt</span>
              </div>
            </div>
            <div className="hero-keypoint-row hero-keypoint-row--3" style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "center" : "center", gap: isMobile ? spacing.sm : spacing.xl, minWidth: isMobile ? undefined : "280px" }}>
              <span className="hero-keypoint-num hero-keypoint-num--3" aria-hidden>
                <span className="hero-keypoint-num-ring" aria-hidden><Circle size={isMobile ? 56 : 100} strokeWidth={1.5} /></span>
                <span className="hero-keypoint-num-digit">3</span>
              </span>
              <div className="hero-keypoint-text" style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                <span className="hero-keypoint-title">Never Put A Customer On{"\u00A0"}Hold</span>
                <span className="hero-keypoint-body">33% of consumers won't wait on hold for customer service</span>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

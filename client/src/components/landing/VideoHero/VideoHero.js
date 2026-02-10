import React, { useRef, useLayoutEffect, useState } from "react";
import { Circle } from "lucide-react";
import { useResponsive } from "../../../hooks/useResponsive";
import { spacing, glassStyles, borderRadius } from "../../../constants/horizonTheme";
import "../../../index.css";

export default function VideoHero() {
  const { isMobile } = useResponsive();
  const leftBlockRef = useRef(null);
  const [glassHeight, setGlassHeight] = useState(null);

  // Match glass div height to left side: use wrapper height so both are exactly equal (desktop only)
  useLayoutEffect(() => {
    if (isMobile) {
      setGlassHeight(null);
      return;
    }
    const el = leftBlockRef.current;
    if (!el) return;
    const update = () => setGlassHeight(Math.floor(el.getBoundingClientRect().height));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile]);

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
          {isMobile ? (
            <>
              <div
                ref={leftBlockRef}
                className="hero-headline-block"
                style={{
                  flex: "none",
                  maxWidth: "100%",
                  padding: 0,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: spacing.md,
                }}
              >
                <h1 className="hero-headline">
                  Stop paying <span className="hero-accent">$35,000</span> a year for someone who takes lunch breaks, sick days, and can only answer one call at a time.
                </h1>
                <p className="hero-subhead" style={{ marginTop: 0 }}>
                  Missed calls cost businesses <span className="hero-accent">$25,000+</span> a month. Our AI receptionist works <span className="hero-accent">24/7</span> for a <span className="hero-accent">fraction of the cost</span>.
                </p>
              </div>
              <div
                style={{
                  flex: "none",
                  maxWidth: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: borderRadius.xl,
                  padding: spacing.lg,
                  boxSizing: "border-box",
                  ...glassStyles.base,
                }}
              >
                <div className="hero-keypoints" style={{ flex: 1, display: "flex", flexDirection: "column", gap: spacing.md, textAlign: "center" }}>
                  {[1, 2, 3].map((num) => (
                    <div key={num} className={`hero-keypoint-row hero-keypoint-row--${num}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.sm }}>
                      <span className={`hero-keypoint-num hero-keypoint-num--${num}`} aria-hidden>
                        <span className="hero-keypoint-num-ring" aria-hidden><Circle size={56} strokeWidth={1.5} /></span>
                        <span className="hero-keypoint-num-digit">{num}</span>
                      </span>
                      <div className="hero-keypoint-text" style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                        <span className="hero-keypoint-title">
                          {num === 1 && "Never Miss A Customer Ready To\u00A0Pay"}
                          {num === 2 && "The First Business To Answer Gets The\u00A0Job"}
                          {num === 3 && "Never Put A Customer On\u00A0Hold"}
                        </span>
                        <span className="hero-keypoint-body">
                          {num === 1 && "6 out of 10 phone calls to small businesses go unanswered."}
                          {num === 2 && "85% of callers don't call back after their first attempt."}
                          {num === 3 && "33% of consumers won't wait on hold for customer service."}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "stretch",
              justifyContent: "space-between",
              gap: spacing['2xl'],
              minHeight: 0,
              ...(glassHeight != null && { height: glassHeight }),
            }}
          >
          <div
            ref={leftBlockRef}
            className="hero-headline-block"
            style={{
              flex: 1,
              maxWidth: "50%",
              padding: 0,
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h1 className="hero-headline">
              Stop paying <span className="hero-accent">$35,000</span> a year for someone who takes lunch breaks, sick days, and can only answer one call at a time.
            </h1>
            <p className="hero-subhead" style={{ marginTop: 0 }}>
              Missed calls cost businesses <span className="hero-accent">$25,000+</span> a month. Our AI receptionist works <span className="hero-accent">24/7</span> for a <span className="hero-accent">fraction of the cost</span>.
            </p>
          </div>

          <div
            style={{
              flex: 1,
              maxWidth: "48%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              overflow: "hidden",
              borderRadius: borderRadius.xl,
              padding: spacing.md,
              boxSizing: "border-box",
              ...glassStyles.base,
            }}
          >
            <div
              className="hero-keypoints"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                ...(isMobile && { gap: spacing.md }),
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
                <span className="hero-keypoint-body">6 out of 10 phone calls to small businesses go unanswered.</span>
              </div>
            </div>
            <div className="hero-keypoint-row hero-keypoint-row--2" style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "center" : "center", gap: isMobile ? spacing.sm : spacing.xl, minWidth: isMobile ? undefined : "280px" }}>
              <span className="hero-keypoint-num hero-keypoint-num--2" aria-hidden>
                <span className="hero-keypoint-num-ring" aria-hidden><Circle size={isMobile ? 56 : 100} strokeWidth={1.5} /></span>
                <span className="hero-keypoint-num-digit">2</span>
              </span>
              <div className="hero-keypoint-text" style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                <span className="hero-keypoint-title">The First Business To Answer Gets The{"\u00A0"}Job</span>
                <span className="hero-keypoint-body">85% of callers don't call back after their first attempt.</span>
              </div>
            </div>
            <div className="hero-keypoint-row hero-keypoint-row--3" style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "center" : "center", gap: isMobile ? spacing.sm : spacing.xl, minWidth: isMobile ? undefined : "280px" }}>
              <span className="hero-keypoint-num hero-keypoint-num--3" aria-hidden>
                <span className="hero-keypoint-num-ring" aria-hidden><Circle size={isMobile ? 56 : 100} strokeWidth={1.5} /></span>
                <span className="hero-keypoint-num-digit">3</span>
              </span>
              <div className="hero-keypoint-text" style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                <span className="hero-keypoint-title">Never Put A Customer On{"\u00A0"}Hold</span>
                <span className="hero-keypoint-body">33% of consumers won't wait on hold for customer service.</span>
              </div>
            </div>
            </div>
          </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

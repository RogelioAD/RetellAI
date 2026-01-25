import React, { useState } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import Button from "../common/Button";
import { colors, spacing, typography, plainCardStyles, borderRadius } from "../../constants/horizonTheme";

// Booking form component - simplified form for contact/demo requests
export default function BookingCalendar({ onBookingSelect }) {
  const { isMobile } = useResponsive();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    website: "",
    useCase: "",
    countryCode: "+1",
    phoneNumber: "",
  });

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";
      const response = await fetch(`${API_BASE}/api/submit-booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          phone: `${formData.countryCode}${formData.phoneNumber}`
        }),
      });

      if (!response.ok) {
        // Try to extract error message from response
        let errorMessage = "Failed to submit booking";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      setSubmitStatus("success");
      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        website: "",
        useCase: "",
        countryCode: "+1",
        phoneNumber: "",
      });

      if (onBookingSelect) {
        onBookingSelect({ success: true });
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setSubmitStatus(error.message || "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Country codes for phone number
  const countryCodes = [
    { code: "+1", country: "US/CA", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+33", country: "FR", flag: "🇫🇷" },
    { code: "+49", country: "DE", flag: "🇩🇪" },
    { code: "+39", country: "IT", flag: "🇮🇹" },
    { code: "+34", country: "ES", flag: "🇪🇸" },
    { code: "+81", country: "JP", flag: "🇯🇵" },
    { code: "+86", country: "CN", flag: "🇨🇳" },
    { code: "+61", country: "AU", flag: "🇦🇺" },
    { code: "+91", country: "IN", flag: "🇮🇳" },
    { code: "+55", country: "BR", flag: "🇧🇷" },
    { code: "+52", country: "MX", flag: "🇲🇽" },
  ];

  return (
    <div
      style={{
        ...plainCardStyles.base,
        borderRadius: borderRadius['2xl'],
        padding: isMobile ? `${spacing['3xl']} ${spacing.xl}` : `${spacing['3xl']} ${spacing['3xl']}`,
        maxWidth: isMobile ? "100%" : "560px",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        border: `2px solid ${colors.gray[100]}`,
        transition: 'all 0.3s ease',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: spacing.lg }}
      >
          {/* Your name */}
          <div>
            <label style={{ display: "block", fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.text.primary, marginBottom: spacing.sm, fontFamily: typography.fontFamily.heading, letterSpacing: typography.letterSpacing.tight }}>
              Your name <span style={{ color: colors.error }}>*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              style={{
                width: "100%",
                padding: `${spacing.md} ${spacing.lg}`,
                borderRadius: borderRadius.md,
                border: `1px solid ${colors.gray[200]}`,
                backgroundColor: colors.background.card,
                color: colors.text.primary,
                fontSize: typography.fontSize.base,
              }}
            />
          </div>

          {/* Email address */}
          <div>
            <label style={{ display: "block", fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.text.primary, marginBottom: spacing.sm, fontFamily: typography.fontFamily.heading, letterSpacing: typography.letterSpacing.tight }}>
              Email address <span style={{ color: colors.error }}>*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleFormChange("email", e.target.value)}
              style={{
                width: "100%",
                padding: `${spacing.md} ${spacing.lg}`,
                borderRadius: borderRadius.md,
                border: `1px solid ${colors.gray[200]}`,
                backgroundColor: colors.background.card,
                color: colors.text.primary,
                fontSize: typography.fontSize.base,
              }}
            />
          </div>

          {/* Company */}
          <div>
            <label style={{ display: "block", fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.text.primary, marginBottom: spacing.sm, fontFamily: typography.fontFamily.heading, letterSpacing: typography.letterSpacing.tight }}>
              Company <span style={{ color: colors.error }}>*</span>
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => handleFormChange("company", e.target.value)}
              style={{
                width: "100%",
                padding: `${spacing.md} ${spacing.lg}`,
                borderRadius: borderRadius.md,
                border: `1px solid ${colors.gray[200]}`,
                backgroundColor: colors.background.card,
                color: colors.text.primary,
                fontSize: typography.fontSize.base,
              }}
            />
          </div>

          {/* Company website */}
          <div>
            <label style={{ display: "block", fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.text.primary, marginBottom: spacing.sm, fontFamily: typography.fontFamily.heading, letterSpacing: typography.letterSpacing.tight }}>
              Link of your company website <span style={{ color: colors.error }}>*</span>
            </label>
            <input
              type="text"
              required
              value={formData.website}
              onChange={(e) => handleFormChange("website", e.target.value)}
              placeholder="example.com"
              style={{
                width: "100%",
                padding: `${spacing.md} ${spacing.lg}`,
                borderRadius: borderRadius.md,
                border: `1px solid ${colors.gray[200]}`,
                backgroundColor: colors.background.card,
                color: colors.text.primary,
                fontSize: typography.fontSize.base,
              }}
            />
          </div>

          {/* Use case */}
          <div>
            <label style={{ display: "block", fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.text.primary, marginBottom: spacing.sm, fontFamily: typography.fontFamily.heading, letterSpacing: typography.letterSpacing.tight }}>
              How do you want to use our services at Quantum Consulting for the business you have <span style={{ color: colors.error }}>*</span>
            </label>
            <textarea
              required
              value={formData.useCase}
              onChange={(e) => handleFormChange("useCase", e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: `${spacing.md} ${spacing.lg}`,
                borderRadius: borderRadius.lg,
                border: `2px solid ${colors.gray[200]}`,
                backgroundColor: colors.background.card,
                color: colors.text.primary,
                fontSize: typography.fontSize.base,
                fontFamily: "inherit",
                resize: "vertical",
                transition: 'all 0.2s ease',
              }}
            />
          </div>

          {/* Phone number with country code */}
          <div>
            <label style={{ display: "block", fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.text.primary, marginBottom: spacing.sm, fontFamily: typography.fontFamily.heading, letterSpacing: typography.letterSpacing.tight }}>
              Phone number
            </label>
            <div style={{ display: "flex", gap: spacing.sm, alignItems: "center" }}>
              <select
                value={formData.countryCode}
                onChange={(e) => handleFormChange("countryCode", e.target.value)}
                style={{
                  padding: `${spacing.md} ${isMobile ? spacing.sm : spacing.md}`,
                  borderRadius: borderRadius.lg,
                  border: `2px solid ${colors.gray[200]}`,
                  backgroundColor: colors.background.card,
                  color: colors.text.primary,
                  fontSize: isMobile ? typography.fontSize.sm : typography.fontSize.base,
                  cursor: "pointer",
                  outline: "none",
                  transition: 'all 0.2s ease',
                  minWidth: isMobile ? "80px" : "auto",
                  maxWidth: isMobile ? "100px" : "none",
                }}
              >
                {countryCodes.map(cc => (
                  <option key={cc.code} value={cc.code}>
                    {isMobile ? cc.code : `${cc.flag} ${cc.code}`}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleFormChange("phoneNumber", e.target.value)}
                placeholder="Phone number"
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: `${spacing.md} ${spacing.lg}`,
                  borderRadius: borderRadius.md,
                  border: `1px solid ${colors.gray[200]}`,
                  backgroundColor: colors.background.card,
                  color: colors.text.primary,
                  fontSize: typography.fontSize.base,
                }}
              />
            </div>
          </div>

          {/* Submit status message */}
          {submitStatus === "success" && (
            <div style={{
              padding: spacing.md,
              borderRadius: borderRadius.md,
              backgroundColor: colors.success + "20",
              color: colors.success,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
            }}>
              Thank you! Your request has been submitted successfully.
            </div>
          )}

          {submitStatus && submitStatus !== "success" && (
            <div style={{
              padding: spacing.md,
              borderRadius: borderRadius.md,
              backgroundColor: colors.error + "20",
              color: colors.error,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
            }}>
              {submitStatus === "error" 
                ? "Failed to submit request. Please try again." 
                : submitStatus}
            </div>
          )}

          {/* Submit button */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: spacing.md, marginTop: spacing.lg }}>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              style={{
                minWidth: "auto",
                padding: `${spacing.md} ${spacing.xl}`,
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
    </div>
  );
}

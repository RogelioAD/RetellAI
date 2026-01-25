import { sendBookingEmail } from "../services/emailService.js";

// Handle booking form submission and send email
export async function submitBooking(req, res, next) {
  try {
    console.log("Booking submission received:", {
      origin: req.headers.origin,
      body: { ...req.body, useCase: req.body.useCase?.substring(0, 50) + "..." }
    });

    const {
      name,
      email,
      company,
      website,
      useCase,
      phone,
    } = req.body;

    // Validate required fields
    if (!name || !email || !company || !website || !useCase) {
      console.warn("Missing required fields:", { name: !!name, email: !!email, company: !!company, website: !!website, useCase: !!useCase });
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // Send email in background so we never hang the request (avoids 502 when SMTP times out)
    const payload = { name, email, company, website, useCase, phone };
    sendBookingEmail(payload)
      .then(() => console.log("Booking email sent successfully for:", email))
      .catch((err) => console.error("Booking email failed (request already succeeded):", err.message));

    // Return immediately with success — user gets 200, CORS headers included
    res.json({
      success: true,
      message: "Booking request submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting booking:", error);
    res.status(500).json({
      error: error.message || "Failed to submit booking request",
    });
  }
}

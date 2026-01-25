import { sendBookingEmail } from "../services/emailService.js";

// Handle booking form submission and send email
export async function submitBooking(req, res, next) {
  try {
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
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // Send email
    await sendBookingEmail({
      name,
      email,
      company,
      website,
      useCase,
      phone,
    });

    res.json({
      success: true,
      message: "Booking request submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting booking:", error);
    res.status(500).json({
      error: "Failed to submit booking request",
    });
  }
}

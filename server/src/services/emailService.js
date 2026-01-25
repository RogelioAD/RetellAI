import nodemailer from "nodemailer";

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // Use environment variables for email configuration
  // For production, you'll need to set these in your .env file:
  // EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send booking form submission email
export async function sendBookingEmail(formData) {
  try {
    const transporter = createTransporter();
    
    // Get recipient email from environment or use a default
    const recipientEmail = process.env.BOOKING_EMAIL || process.env.EMAIL_USER;
    
    if (!recipientEmail) {
      console.error("No recipient email configured. Set BOOKING_EMAIL or EMAIL_USER in environment variables.");
      throw new Error("Email configuration missing");
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: recipientEmail,
      replyTo: formData.email, // Set reply-to to the form submitter's email
      subject: `New Booking Request from ${formData.name}`,
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Company:</strong> ${formData.company}</p>
        <p><strong>Website:</strong> ${formData.website}</p>
        <p><strong>Phone:</strong> ${formData.phone || "Not provided"}</p>
        <h3>Use Case:</h3>
        <p>${formData.useCase}</p>
      `,
      text: `
        New Booking Request
        
        Name: ${formData.name}
        Email: ${formData.email}
        Company: ${formData.company}
        Website: ${formData.website}
        Phone: ${formData.phone || "Not provided"}
        
        Use Case:
        ${formData.useCase}
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

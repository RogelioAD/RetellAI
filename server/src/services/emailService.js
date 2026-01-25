import nodemailer from "nodemailer";
import dns from "dns";
import { promisify } from "util";

const dnsLookup = promisify(dns.lookup);

// Create reusable transporter object using SMTP transport
const createTransporter = async () => {
  // Use environment variables for email configuration
  // For production, you'll need to set these in your .env file:
  // EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM
  const emailHost = process.env.EMAIL_HOST || "smtp.gmail.com";
  const emailPort = parseInt(process.env.EMAIL_PORT || "587");
  
  // Try to resolve DNS first to catch EBADNAME errors early
  try {
    await dnsLookup(emailHost);
    console.log(`DNS resolution successful for ${emailHost}`);
  } catch (dnsError) {
    console.error(`DNS resolution failed for ${emailHost}:`, dnsError.message);
    // Continue anyway - sometimes DNS fails but connection works
  }
  
  // For Gmail, use the service option which handles DNS better
  if (emailHost.includes('gmail.com')) {
    console.log(`Using Gmail service configuration`);
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Connection timeout settings
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
    });
  }
  
  // For other email providers, use SMTP configuration
  const transporterConfig = {
    host: emailHost,
    port: emailPort,
    secure: emailPort === 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // TLS options
    tls: {
      rejectUnauthorized: false, // Accept self-signed certificates if needed
    },
    // Connection timeout settings
    connectionTimeout: 15000, // 15 seconds
    greetingTimeout: 15000,
    socketTimeout: 15000,
    requireTLS: false,
  };

  console.log(`Creating SMTP transporter for ${emailHost}:${emailPort}`);
  return nodemailer.createTransport(transporterConfig);
};

// Send booking form submission email
export async function sendBookingEmail(formData) {
  let transporter;
  
  try {
    // Validate email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email credentials missing. EMAIL_USER and EMAIL_PASS must be set.");
      throw new Error("Email configuration missing: EMAIL_USER and EMAIL_PASS required");
    }

    transporter = await createTransporter();
    
    // Verify connection before sending
    try {
      await transporter.verify();
      console.log("Email server connection verified");
    } catch (verifyError) {
      console.error("Email server verification failed:", verifyError.message);
      // Continue anyway - sometimes verification fails but sending works
    }
    
    // Get recipient email from environment or use a default
    const recipientEmail = process.env.BOOKING_EMAIL || process.env.EMAIL_USER;
    
    if (!recipientEmail) {
      console.error("No recipient email configured. Set BOOKING_EMAIL or EMAIL_USER in environment variables.");
      throw new Error("Email configuration missing: recipient email not set");
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
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    // Enhanced error logging
    if (error.code === 'EBADNAME' || error.code === 'ENOTFOUND') {
      console.error("DNS resolution error for email host:", error.hostname || process.env.EMAIL_HOST);
      console.error("Error details:", {
        code: error.code,
        errno: error.errno,
        syscall: error.syscall,
        hostname: error.hostname,
        message: error.message
      });
      throw new Error(`Cannot resolve email server hostname. Check EMAIL_HOST environment variable. Original error: ${error.message}`);
    } else if (error.code === 'EAUTH') {
      console.error("Email authentication failed. Check EMAIL_USER and EMAIL_PASS.");
      throw new Error("Email authentication failed. Check your email credentials.");
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.error("Email server connection failed:", error.message);
      throw new Error(`Cannot connect to email server. Check EMAIL_HOST and EMAIL_PORT. Original error: ${error.message}`);
    } else {
      console.error("Error sending email:", {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      throw error;
    }
  } finally {
    // Close transporter connection
    if (transporter) {
      transporter.close();
    }
  }
}

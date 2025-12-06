import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

/**
 * Email Service - Handles sending RFPs to vendors via SMTP
 */

let transporter = null;

/**
 * Initialize email transporter (lazy initialization)
 */
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      secure: config.email.smtp.port === 465,
      auth: {
        user: config.email.smtp.user,
        pass: config.email.smtp.pass,
      },
    });
  }
  return transporter;
}

/**
 * Send RFP to vendor(s) via email
 * @param {Object} rfp - RFP object with details
 * @param {Array} vendors - Array of vendor objects with contact_email
 * @returns {Promise<Object>} Results of email sending
 */
export async function sendRFP(rfp, vendors) {
  if (!vendors || vendors.length === 0) {
    throw new Error('No vendors provided');
  }

  const results = [];

  for (const vendor of vendors) {
    try {
      // Build email content
      const itemsList = rfp.items.map(item => 
        `- ${item.name} (Qty: ${item.qty}${item.specs ? `, Specs: ${item.specs}` : ''})`
      ).join('\n');

      const emailContent = `
Dear ${vendor.contact_person || vendor.name},

We are requesting a proposal for the following procurement:

Title: ${rfp.title}
Description: ${rfp.description}

Items Required:
${itemsList}

Budget: ${rfp.budget ? `$${rfp.budget}` : 'Not specified'}
Delivery Deadline: ${rfp.delivery_deadline ? new Date(rfp.delivery_deadline).toLocaleDateString() : 'Not specified'}
Payment Terms: ${rfp.payment_terms}

Please reply to this email with your proposal including:
- Line item pricing
- Total cost
- Delivery timeframe
- Warranty information
- Any additional terms

RFP Reference: ${rfp._id}

Best regards,
Procurement Team
      `.trim();

      // Send email
      const transport = getTransporter();
      const info = await transport.sendMail({
        from: config.email.from,
        to: vendor.contact_email,
        subject: `RFP: ${rfp.title}`,
        text: emailContent,
      });

      results.push({
        vendor: vendor.name,
        email: vendor.contact_email,
        success: true,
        messageId: info.messageId,
      });

      console.log(`✓ RFP sent to ${vendor.name} (${vendor.contact_email})`);
    } catch (error) {
      console.error(`✗ Failed to send RFP to ${vendor.name}:`, error.message);
      results.push({
        vendor: vendor.name,
        email: vendor.contact_email,
        success: false,
        error: error.message,
      });
    }

    // Add delay to respect Mailtrap rate limit (1 email/second on free tier)
    if (vendors.indexOf(vendor) < vendors.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  return {
    totalSent: results.filter(r => r.success).length,
    totalFailed: results.filter(r => !r.success).length,
    details: results,
  };
}

/**
 * Test email configuration
 * @returns {Promise<boolean>} True if configuration is valid
 */
export async function testEmailConfig() {
  try {
    const transport = getTransporter();
    await transport.verify();
    return true;
  } catch (error) {
    console.error('Email configuration test failed:', error);
    return false;
  }
}

import { simpleParser } from 'mailparser';

/**
 * Email Parser Utility
 * Helper functions for parsing email content
 */

/**
 * Parse raw email to extract text content
 * @param {string|Buffer} rawEmail - Raw email content
 * @returns {Promise<Object>} Parsed email with from, subject, text
 */
export async function parseEmail(rawEmail) {
  try {
    const parsed = await simpleParser(rawEmail);
    
    return {
      from: parsed.from?.text || '',
      to: parsed.to?.text || '',
      subject: parsed.subject || '',
      text: parsed.text || '',
      html: parsed.html || '',
      date: parsed.date,
      attachments: parsed.attachments?.map(att => ({
        filename: att.filename,
        contentType: att.contentType,
        size: att.size,
      })) || [],
    };
  } catch (error) {
    console.error('Email parsing error:', error);
    throw new Error('Failed to parse email');
  }
}

/**
 * Extract RFP reference from email subject or body
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @returns {string|null} RFP ID if found
 */
export function extractRFPReference(subject, body) {
  const refPattern = /RFP Reference:\s*([a-f0-9]{24})/i;
  
  let match = subject.match(refPattern);
  if (match) return match[1];
  
  match = body.match(refPattern);
  if (match) return match[1];
  
  return null;
}

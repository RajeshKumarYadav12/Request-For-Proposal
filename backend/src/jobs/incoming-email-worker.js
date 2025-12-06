import Imap from "imap";
import { simpleParser } from "mailparser";
import { config } from "../config/index.js";
import * as aiService from "../services/ai.service.js";
import Proposal from "../models/proposal.model.js";
import Vendor from "../models/vendor.model.js";
import { extractRFPReference } from "../utils/email-parser.js";

let imap = null;

/**
 * Initialize IMAP connection
 */
function initializeImap() {
  if (!config.imap.host || !config.imap.user) {
    console.log("IMAP not configured, skipping email worker");
    return null;
  }

  return new Imap({
    user: config.imap.user,
    password: config.imap.pass,
    host: config.imap.host,
    port: config.imap.port,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
  });
}

/**
 * Process incoming email
 */
async function processEmail(emailBuffer) {
  try {
    const parsed = await simpleParser(emailBuffer);

    // Extract RFP reference
    const rfpId = extractRFPReference(parsed.subject, parsed.text);
    if (!rfpId) {
      console.log("No RFP reference found in email");
      return;
    }

    // Find vendor by email
    const fromEmail = parsed.from?.value?.[0]?.address;
    const vendor = await Vendor.findOne({ contact_email: fromEmail });
    if (!vendor) {
      console.log(`Unknown vendor: ${fromEmail}`);
      return;
    }

    // Parse proposal using AI
    const proposalData = await aiService.parseVendorProposal(parsed.text);

    // Create proposal
    const proposal = new Proposal({
      rfpId,
      vendorId: vendor._id,
      ...proposalData,
    });

    await proposal.save();
    console.log(`✓ Proposal created from ${vendor.name}`);
  } catch (error) {
    console.error("Error processing email:", error);
  }
}

/**
 * Start email worker
 * In production, this would continuously poll IMAP
 * For demo, this is a stub that can be triggered manually
 */
export function startEmailWorker() {
  console.log("Email worker stub initialized");
  console.log("Use POST /api/rfps/email/webhook to simulate incoming emails");

  // Uncomment below for real IMAP implementation
  /*
  imap = initializeImap();
  if (!imap) return;

  imap.once('ready', () => {
    console.log('✓ IMAP connection ready');
    
    imap.openBox('INBOX', false, (err, box) => {
      if (err) throw err;
      
      // Listen for new emails
      imap.on('mail', (numNewMsgs) => {
        console.log(`${numNewMsgs} new email(s)`);
        fetchNewEmails();
      });
    });
  });

  imap.once('error', (err) => {
    console.error('IMAP error:', err);
  });

  imap.connect();
  */
}

/**
 * Stop email worker
 */
export function stopEmailWorker() {
  if (imap) {
    imap.end();
    console.log("Email worker stopped");
  }
}

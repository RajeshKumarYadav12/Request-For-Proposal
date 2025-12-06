import RFP from '../models/rfp.model.js';
import Proposal from '../models/proposal.model.js';
import * as aiService from './ai.service.js';

/**
 * RFP Service - Business logic for RFP management
 */

/**
 * Create RFP from natural language or structured data
 */
export async function createRFP(data) {
  let rfpData;

  if (data.nl_text) {
    // Parse natural language to structured RFP
    rfpData = await aiService.parseNaturalLanguageToRFP(data.nl_text);
  } else {
    // Use provided structured data
    rfpData = data;
  }

  const rfp = new RFP(rfpData);
  await rfp.save();
  return rfp;
}

/**
 * Get all RFPs
 */
export async function getAllRFPs() {
  return await RFP.find().sort({ createdAt: -1 }).populate('sentTo');
}

/**
 * Get RFP by ID with proposals
 */
export async function getRFPById(id) {
  const rfp = await RFP.findById(id).populate('sentTo');
  if (!rfp) {
    throw new Error('RFP not found');
  }

  const proposals = await Proposal.find({ rfpId: id }).populate('vendorId');
  
  return {
    rfp,
    proposals,
  };
}

/**
 * Update RFP
 */
export async function updateRFP(id, updates) {
  return await RFP.findByIdAndUpdate(id, updates, { new: true });
}

/**
 * Delete RFP
 */
export async function deleteRFP(id) {
  // Also delete associated proposals
  await Proposal.deleteMany({ rfpId: id });
  return await RFP.findByIdAndDelete(id);
}

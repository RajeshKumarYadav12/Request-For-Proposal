import * as rfpService from "../services/rfp.service.js";
import * as emailService from "../services/email.service.js";
import * as aiService from "../services/ai.service.js";
import Vendor from "../models/vendor.model.js";
import RFP from "../models/rfp.model.js";
import Proposal from "../models/proposal.model.js";

export async function createRFP(req, res, next) {
  try {
    const rfp = await rfpService.createRFP(req.body);
    res.status(201).json({
      success: true,
      data: rfp,
    });
  } catch (error) {
    next(error);
  }
}

/*
 Get all RFPs
 GET /api/rfps
 */
export async function getAllRFPs(req, res, next) {
  try {
    const rfps = await rfpService.getAllRFPs();
    res.json({
      success: true,
      data: rfps,
    });
  } catch (error) {
    next(error);
  }
}

/**
  Get RFP by ID with proposals
  GET /api/rfps/:id
 */
export async function getRFPById(req, res, next) {
  try {
    const data = await rfpService.getRFPById(req.params.id);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update RFP
 * PUT /api/rfps/:id
 */
export async function updateRFP(req, res, next) {
  try {
    const rfp = await rfpService.updateRFP(req.params.id, req.body);
    res.json({
      success: true,
      data: rfp,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete RFP
 * DELETE /api/rfps/:id
 */
export async function deleteRFP(req, res, next) {
  try {
    await rfpService.deleteRFP(req.params.id);
    res.json({
      success: true,
      message: "RFP deleted",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Send RFP to selected vendors
 * POST /api/rfps/:id/send
 */
export async function sendRFP(req, res, next) {
  try {
    const { vendorIds } = req.body;

    if (!vendorIds || vendorIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "vendorIds array is required",
      });
    }

    const rfp = await RFP.findById(req.params.id);
    if (!rfp) {
      return res.status(404).json({
        success: false,
        error: "RFP not found",
      });
    }

    const vendors = await Vendor.find({ _id: { $in: vendorIds } });
    if (vendors.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No valid vendors found",
      });
    }

    const results = await emailService.sendRFP(rfp, vendors);

    // Reload RFP to avoid version conflict and update with sent vendors
    const updatedRfp = await RFP.findById(req.params.id);
    updatedRfp.sentTo = [...new Set([...updatedRfp.sentTo, ...vendorIds])];
    updatedRfp.status = "sent";
    await updatedRfp.save();

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Compare proposals using AI
 * GET /api/rfps/:id/compare
 */
export async function compareProposals(req, res, next) {
  try {
    const rfpData = await rfpService.getRFPById(req.params.id);
    const { rfp, proposals } = rfpData;

    if (proposals.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No proposals to compare",
      });
    }

    // Populate vendor details for proposals
    const proposalsWithVendors = proposals.map((p) => ({
      ...p.toObject(),
      vendor: p.vendorId,
    }));

    const comparison = await aiService.compareProposals(
      rfp.toObject(),
      proposalsWithVendors
    );

    res.json({
      success: true,
      data: {
        rfp,
        proposals: proposalsWithVendors,
        comparison,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Receive incoming email (webhook for demo/testing)
 * POST /api/email/webhook
 */
export async function receiveEmail(req, res, next) {
  try {
    const { rawEmail, rfpId, vendorId } = req.body;

    if (!rawEmail || !rfpId || !vendorId) {
      return res.status(400).json({
        success: false,
        error: "rawEmail, rfpId, and vendorId are required",
      });
    }

    // Parse vendor proposal using AI
    const proposalData = await aiService.parseVendorProposal(rawEmail);

    // Create proposal
    const proposal = new Proposal({
      rfpId,
      vendorId,
      ...proposalData,
    });

    await proposal.save();

    res.json({
      success: true,
      data: proposal,
      message: "Proposal received and parsed",
    });
  } catch (error) {
    next(error);
  }
}

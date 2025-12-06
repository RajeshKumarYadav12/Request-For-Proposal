import Proposal from '../models/proposal.model.js';

export async function getAllProposals(req, res, next) {
  try {
    const proposals = await Proposal.find()
      .populate('rfpId')
      .populate('vendorId')
      .sort({ parsedAt: -1 });
    
    res.json({
      success: true,
      data: proposals,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProposalById(req, res, next) {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate('rfpId')
      .populate('vendorId');
    
    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: 'Proposal not found',
      });
    }

    res.json({
      success: true,
      data: proposal,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProposalStatus(req, res, next) {
  try {
    const { status } = req.body;
    
    if (!['received', 'reviewing', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status',
      });
    }

    const proposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('rfpId').populate('vendorId');

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: 'Proposal not found',
      });
    }

    res.json({
      success: true,
      data: proposal,
    });
  } catch (error) {
    next(error);
  }
}

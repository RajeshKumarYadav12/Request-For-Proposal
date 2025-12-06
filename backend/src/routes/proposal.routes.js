import express from 'express';
import * as proposalController from '../controllers/proposal.controller.js';

const router = express.Router();

/**
 * Proposal Routes
 */

router.get('/', proposalController.getAllProposals);
router.get('/:id', proposalController.getProposalById);
router.patch('/:id/status', proposalController.updateProposalStatus);

export default router;

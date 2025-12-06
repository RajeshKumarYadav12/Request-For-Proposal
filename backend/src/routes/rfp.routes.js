import express from 'express';
import * as rfpController from '../controllers/rfp.controller.js';

const router = express.Router();

/**
 * RFP Routes
 */

router.post('/', rfpController.createRFP);
router.get('/', rfpController.getAllRFPs);
router.get('/:id', rfpController.getRFPById);
router.put('/:id', rfpController.updateRFP);
router.delete('/:id', rfpController.deleteRFP);
router.post('/:id/send', rfpController.sendRFP);
router.get('/:id/compare', rfpController.compareProposals);

// Email webhook for receiving vendor replies
router.post('/email/webhook', rfpController.receiveEmail);

export default router;

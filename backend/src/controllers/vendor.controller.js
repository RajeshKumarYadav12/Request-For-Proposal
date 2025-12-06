import * as vendorService from '../services/vendor.service.js';


/**
 * Create new vendor
 * POST /api/vendors
 */
export async function createVendor(req, res, next) {
  try {
    const vendor = await vendorService.createVendor(req.body);
    res.status(201).json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all vendors
 * GET /api/vendors
 */
export async function getAllVendors(req, res, next) {
  try {
    const vendors = await vendorService.getAllVendors();
    res.json({
      success: true,
      data: vendors,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get vendor by ID
 * GET /api/vendors/:id
 */
export async function getVendorById(req, res, next) {
  try {
    const vendor = await vendorService.getVendorById(req.params.id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found',
      });
    }
    res.json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update vendor
 * PUT /api/vendors/:id
 */
export async function updateVendor(req, res, next) {
  try {
    const vendor = await vendorService.updateVendor(req.params.id, req.body);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found',
      });
    }
    res.json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete vendor
 * DELETE /api/vendors/:id
 */
export async function deleteVendor(req, res, next) {
  try {
    const vendor = await vendorService.deleteVendor(req.params.id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found',
      });
    }
    res.json({
      success: true,
      message: 'Vendor deleted',
    });
  } catch (error) {
    next(error);
  }
}

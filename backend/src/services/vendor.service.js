import Vendor from '../models/vendor.model.js';

/**
 * Vendor Service - Business logic for vendor management
 */

/**
 * Create a new vendor
 */
export async function createVendor(vendorData) {
  const vendor = new Vendor(vendorData);
  await vendor.save();
  return vendor;
}

/**
 * Get all vendors
 */
export async function getAllVendors() {
  return await Vendor.find().sort({ name: 1 });
}

/**
 * Get vendor by ID
 */
export async function getVendorById(id) {
  return await Vendor.findById(id);
}

/**
 * Update vendor
 */
export async function updateVendor(id, updates) {
  return await Vendor.findByIdAndUpdate(id, updates, { new: true });
}

/**
 * Delete vendor
 */
export async function deleteVendor(id) {
  return await Vendor.findByIdAndDelete(id);
}

/**
 * Validation Utilities
 * Helper functions for input validation
 */

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate MongoDB ObjectId format
 */
export function isValidObjectId(id) {
  return /^[a-f\d]{24}$/i.test(id);
}

/**
 * Validate RFP data
 */
export function validateRFPData(data) {
  const errors = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push('Description is required');
  }

  if (data.items && !Array.isArray(data.items)) {
    errors.push('Items must be an array');
  }

  if (data.items) {
    data.items.forEach((item, index) => {
      if (!item.name) {
        errors.push(`Item ${index + 1}: name is required`);
      }
      if (!item.qty || item.qty <= 0) {
        errors.push(`Item ${index + 1}: quantity must be positive`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate vendor data
 */
export function validateVendorData(data) {
  const errors = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Vendor name is required');
  }

  if (!data.contact_email || !isValidEmail(data.contact_email)) {
    errors.push('Valid contact email is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

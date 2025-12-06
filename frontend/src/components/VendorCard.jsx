import React from 'react';

/**
 * Vendor Card Component
 * Display vendor information with actions
 */
function VendorCard({ vendor, onDelete }) {
  return (
    <div className="card">
      <h3>{vendor.name}</h3>
      <p><strong>Email:</strong> {vendor.contact_email}</p>
      {vendor.contact_person && (
        <p><strong>Contact:</strong> {vendor.contact_person}</p>
      )}
      {vendor.notes && (
        <p style={{ color: '#7f8c8d', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          {vendor.notes}
        </p>
      )}
      <button
        className="btn btn-danger"
        style={{ marginTop: '1rem' }}
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
}

export default VendorCard;

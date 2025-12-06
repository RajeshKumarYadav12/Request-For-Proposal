import React, { useState, useEffect } from 'react';
import VendorCard from '../components/VendorCard';
import { getAllVendors, createVendor, deleteVendor } from '../api/api';

/**
 * Vendor List Page
 * Manage vendors - view, add, delete
 */
function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact_email: '',
    contact_person: '',
    notes: '',
  });

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const response = await getAllVendors();
      setVendors(response.data);
    } catch (err) {
      console.error('Failed to load vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createVendor(formData);
      setFormData({ name: '', contact_email: '', contact_person: '', notes: '' });
      setShowForm(false);
      loadVendors();
    } catch (err) {
      alert('Failed to create vendor: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this vendor?')) return;
    try {
      await deleteVendor(id);
      loadVendors();
    } catch (err) {
      alert('Failed to delete vendor');
    }
  };

  if (loading) return <div className="loading">Loading vendors...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Vendors</h2>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Vendor'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Add New Vendor</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Vendor Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Contact Email *</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Contact Person</label>
              <input
                type="text"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
              />
            </div>
            <button type="submit" className="btn">Save Vendor</button>
          </form>
        </div>
      )}

      <div className="vendor-list">
        {vendors.map((vendor) => (
          <VendorCard
            key={vendor._id}
            vendor={vendor}
            onDelete={() => handleDelete(vendor._id)}
          />
        ))}
      </div>

      {vendors.length === 0 && (
        <div className="card">
          <p>No vendors yet. Add your first vendor to get started.</p>
        </div>
      )}
    </div>
  );
}

export default VendorList;

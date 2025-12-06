import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRFPById, getAllVendors, sendRFPToVendors, simulateVendorReply } from '../api/api';

/**
 * RFP View Page
 * View RFP details, send to vendors, and see proposals
 */
function RFPView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rfp, setRfp] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [rfpData, vendorData] = await Promise.all([
        getRFPById(id),
        getAllVendors(),
      ]);
      setRfp(rfpData.data.rfp);
      setProposals(rfpData.data.proposals);
      setVendors(vendorData.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRFP = async () => {
    if (selectedVendors.length === 0) {
      alert('Please select at least one vendor');
      return;
    }

    try {
      await sendRFPToVendors(id, selectedVendors);
      alert('RFP sent to selected vendors!');
      setSelectedVendors([]);
      loadData();
    } catch (err) {
      alert('Failed to send RFP: ' + err.message);
    }
  };

  const handleSimulateReply = async (vendorId) => {
    const sampleReply = `Re: ${rfp.title}

Thank you for the RFP opportunity. Here is our proposal:

${rfp.items.map((item, idx) => 
  `${item.name}: $${(Math.random() * 500 + 100).toFixed(2)} per unit x ${item.qty} = $${((Math.random() * 500 + 100) * item.qty).toFixed(2)}`
).join('\n')}

Total Price: $${(Math.random() * 10000 + 5000).toFixed(2)}
Delivery: ${Math.floor(Math.random() * 20 + 5)} days
Warranty: ${Math.floor(Math.random() * 24 + 12)} months
Terms: Net 30

We look forward to working with you.`;

    try {
      await simulateVendorReply(id, vendorId, sampleReply);
      alert('Vendor reply simulated!');
      loadData();
    } catch (err) {
      alert('Failed to simulate reply: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Loading RFP...</div>;
  if (!rfp) return <div className="error">RFP not found</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>{rfp.title}</h2>
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('/rfps')}>
            Back to List
          </button>
          {proposals.length > 0 && (
            <button
              className="btn btn-success"
              style={{ marginLeft: '1rem' }}
              onClick={() => navigate(`/rfps/${id}/compare`)}
            >
              Compare Proposals
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <h3>RFP Details</h3>
        <p><strong>Description:</strong> {rfp.description}</p>
        <p><strong>Budget:</strong> {rfp.budget ? `$${rfp.budget}` : 'Not specified'}</p>
        <p><strong>Payment Terms:</strong> {rfp.payment_terms}</p>
        <p><strong>Status:</strong> <span className="badge">{rfp.status}</span></p>
        
        <h4 style={{ marginTop: '1.5rem' }}>Items:</h4>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Specifications</th>
            </tr>
          </thead>
          <tbody>
            {rfp.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.specs || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Send to Vendors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', margin: '1rem 0' }}>
          {vendors.map((vendor) => (
            <label key={vendor._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={selectedVendors.includes(vendor._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedVendors([...selectedVendors, vendor._id]);
                  } else {
                    setSelectedVendors(selectedVendors.filter(id => id !== vendor._id));
                  }
                }}
              />
              {vendor.name}
            </label>
          ))}
        </div>
        <button className="btn" onClick={handleSendRFP}>
          Send RFP to Selected Vendors
        </button>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Proposals Received ({proposals.length})</h3>
        {proposals.length === 0 ? (
          <p style={{ color: '#7f8c8d' }}>No proposals yet. Send the RFP to vendors first.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Total Price</th>
                <th>Warranty</th>
                <th>Status</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((proposal) => (
                <tr key={proposal._id}>
                  <td>{proposal.vendorId?.name || 'Unknown'}</td>
                  <td>${proposal.totalPrice.toLocaleString()}</td>
                  <td>{proposal.warranty} months</td>
                  <td><span className="badge">{proposal.status}</span></td>
                  <td>{new Date(proposal.parsedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {rfp.sentTo && rfp.sentTo.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h4>Simulate Vendor Replies (Demo)</h4>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              {rfp.sentTo.map((vendor) => (
                <button
                  key={vendor._id}
                  className="btn btn-secondary"
                  onClick={() => handleSimulateReply(vendor._id)}
                >
                  Simulate Reply from {vendor.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RFPView;

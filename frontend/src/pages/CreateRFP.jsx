import React, { useState } from 'react';
import ChatRFPForm from '../components/ChatRFPForm';
import { createRFP } from '../api/api';

/**
 * Create RFP Page
 * Allows users to create RFPs using natural language or structured input
 */
function CreateRFP() {
  const [createdRFP, setCreatedRFP] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (nlText) => {
    setLoading(true);
    setError('');
    setCreatedRFP(null);

    try {
      const response = await createRFP({ nl_text: nlText });
      setCreatedRFP(response.data);
    } catch (err) {
      setError(err.message || 'Failed to create RFP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h2>Create New RFP</h2>
      <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>
        Describe your procurement needs in natural language, and AI will structure it into an RFP.
      </p>

      <ChatRFPForm onSubmit={handleSubmit} loading={loading} />

      {error && <div className="error">{error}</div>}

      {createdRFP && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h3>✓ RFP Created Successfully</h3>
          <div style={{ marginTop: '1rem' }}>
            <p><strong>Title:</strong> {createdRFP.title}</p>
            <p><strong>Description:</strong> {createdRFP.description}</p>
            <p><strong>Budget:</strong> {createdRFP.budget ? `$${createdRFP.budget}` : 'Not specified'}</p>
            <p><strong>Payment Terms:</strong> {createdRFP.payment_terms}</p>
            
            <h4 style={{ marginTop: '1rem' }}>Items:</h4>
            <ul>
              {createdRFP.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} - Qty: {item.qty}
                  {item.specs && ` (${item.specs})`}
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '1.5rem' }}>
              <a href={`/rfps/${createdRFP._id}`} className="btn">
                View RFP Details
              </a>
              <button 
                className="btn btn-secondary" 
                style={{ marginLeft: '1rem' }}
                onClick={() => setCreatedRFP(null)}
              >
                Create Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateRFP;

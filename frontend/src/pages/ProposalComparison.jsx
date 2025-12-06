import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { compareProposals } from '../api/api';
import ComparisonTable from '../components/ComparisonTable';

/**
 * Proposal Comparison Page
 * AI-powered comparison of vendor proposals with recommendations
 */
function ProposalComparison() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadComparison();
  }, [id]);

  const loadComparison = async () => {
    try {
      const response = await compareProposals(id);
      setData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load comparison');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Analyzing proposals with AI...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return <div className="error">No data available</div>;

  const { rfp, proposals, comparison } = data;
  const recommendedProposal = proposals.find(
    p => p.vendorId._id === comparison.recommended_vendor_id
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Proposal Comparison</h2>
        <button className="btn btn-secondary" onClick={() => navigate(`/rfps/${id}`)}>
          Back to RFP
        </button>
      </div>

      <div className="card">
        <h3>{rfp.title}</h3>
        <p>{rfp.description}</p>
      </div>

      {recommendedProposal && (
        <div className="card" style={{ background: '#e8f8f5', border: '2px solid #27ae60', marginTop: '2rem' }}>
          <h3 style={{ color: '#27ae60' }}>🏆 AI Recommendation</h3>
          <h4>{recommendedProposal.vendorId.name}</h4>
          <p><strong>Total Price:</strong> ${recommendedProposal.totalPrice.toLocaleString()}</p>
          <p style={{ marginTop: '1rem' }}>{comparison.explanation}</p>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3>Detailed Comparison</h3>
        <ComparisonTable proposals={proposals} scores={comparison.scores} />
      </div>

      <div className="comparison-grid" style={{ marginTop: '2rem' }}>
        {proposals.map((proposal, idx) => {
          const score = comparison.scores[idx] || {};
          const isRecommended = proposal.vendorId._id === comparison.recommended_vendor_id;

          return (
            <div
              key={proposal._id}
              className={`proposal-card ${isRecommended ? 'recommended' : ''}`}
            >
              {isRecommended && <span className="badge success">Recommended</span>}
              <h4>{proposal.vendorId.name}</h4>
              <p><strong>Total:</strong> ${proposal.totalPrice.toLocaleString()}</p>
              <p><strong>Warranty:</strong> {proposal.warranty} months</p>
              <p><strong>Terms:</strong> {proposal.terms || 'N/A'}</p>
              
              {score && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #ddd' }}>
                  <p><strong>AI Scores (0-10):</strong></p>
                  <p>Cost: {score.cost || 'N/A'}</p>
                  <p>Delivery: {score.delivery || 'N/A'}</p>
                  <p>Warranty: {score.warranty || 'N/A'}</p>
                  <p>Completeness: {score.completeness || 'N/A'}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProposalComparison;

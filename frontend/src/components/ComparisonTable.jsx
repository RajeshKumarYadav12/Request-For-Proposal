import React from 'react';

/**
 * Comparison Table Component
 * Side-by-side comparison of proposals
 */
function ComparisonTable({ proposals, scores }) {
  if (!proposals || proposals.length === 0) {
    return <p>No proposals to compare</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Metric</th>
          {proposals.map((p) => (
            <th key={p._id}>{p.vendorId.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Total Price</strong></td>
          {proposals.map((p) => (
            <td key={p._id}>${p.totalPrice.toLocaleString()}</td>
          ))}
        </tr>
        <tr>
          <td><strong>Warranty (months)</strong></td>
          {proposals.map((p) => (
            <td key={p._id}>{p.warranty}</td>
          ))}
        </tr>
        <tr>
          <td><strong>Terms</strong></td>
          {proposals.map((p) => (
            <td key={p._id}>{p.terms || 'N/A'}</td>
          ))}
        </tr>
        <tr>
          <td><strong>Line Items</strong></td>
          {proposals.map((p) => (
            <td key={p._id}>{p.lineItems?.length || 0}</td>
          ))}
        </tr>
        {scores && scores.length > 0 && (
          <>
            <tr style={{ background: '#f8f9fa' }}>
              <td><strong>Cost Score (0-10)</strong></td>
              {scores.map((s, idx) => (
                <td key={idx}>{s.cost || 'N/A'}</td>
              ))}
            </tr>
            <tr style={{ background: '#f8f9fa' }}>
              <td><strong>Delivery Score</strong></td>
              {scores.map((s, idx) => (
                <td key={idx}>{s.delivery || 'N/A'}</td>
              ))}
            </tr>
            <tr style={{ background: '#f8f9fa' }}>
              <td><strong>Warranty Score</strong></td>
              {scores.map((s, idx) => (
                <td key={idx}>{s.warranty || 'N/A'}</td>
              ))}
            </tr>
            <tr style={{ background: '#f8f9fa' }}>
              <td><strong>Completeness Score</strong></td>
              {scores.map((s, idx) => (
                <td key={idx}>{s.completeness || 'N/A'}</td>
              ))}
            </tr>
          </>
        )}
      </tbody>
    </table>
  );
}

export default ComparisonTable;

import React, { useState } from 'react';

/**
 * Chat-like RFP Form Component
 * Natural language input for creating RFPs
 */
function ChatRFPForm({ onSubmit, loading }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
    }
  };

  const exampleText = "We need 20 laptops with 16GB RAM and i7 processors, plus 15 27-inch monitors. Budget is around $30,000. Need delivery within 30 days. Payment terms Net 30.";

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Describe your procurement needs:</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={exampleText}
            disabled={loading}
            rows="6"
          />
        </div>
        <button type="submit" className="btn" disabled={loading || !input.trim()}>
          {loading ? 'Creating RFP...' : 'Create RFP with AI'}
        </button>
        {!input && (
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginLeft: '1rem' }}
            onClick={() => setInput(exampleText)}
          >
            Use Example
          </button>
        )}
      </form>
    </div>
  );
}

export default ChatRFPForm;

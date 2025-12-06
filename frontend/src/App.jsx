import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CreateRFP from './pages/CreateRFP';
import VendorList from './pages/VendorList';
import ProposalComparison from './pages/ProposalComparison';
import RFPView from './pages/RFPView';
import './App.css';

/**
 * Main App Component with routing
 */
function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <h1>AI RFP Manager</h1>
          <ul>
            <li><Link to="/">Create RFP</Link></li>
            <li><Link to="/vendors">Vendors</Link></li>
            <li><Link to="/rfps">View RFPs</Link></li>
          </ul>
        </nav>

        <main className="container">
          <Routes>
            <Route path="/" element={<CreateRFP />} />
            <Route path="/vendors" element={<VendorList />} />
            <Route path="/rfps/:id" element={<RFPView />} />
            <Route path="/rfps/:id/compare" element={<ProposalComparison />} />
            <Route path="/rfps" element={<RFPList />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <p>&copy; 2025 AI RFP Manager. All rights reserved.</p>
            <p>Powered by OpenAI & MongoDB</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

/**
 * Simple RFP List Component (inline)
 */
function RFPList() {
  const [rfps, setRfps] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('http://localhost:4000/api/rfps')
      .then(res => res.json())
      .then(data => {
        setRfps(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>All RFPs</h2>
      <div className="rfp-list">
        {rfps.map(rfp => (
          <div key={rfp._id} className="card">
            <h3>{rfp.title}</h3>
            <p>{rfp.description.substring(0, 100)}...</p>
            <p><strong>Status:</strong> {rfp.status}</p>
            <p><strong>Budget:</strong> {rfp.budget ? `$${rfp.budget}` : 'N/A'}</p>
            <Link to={`/rfps/${rfp._id}`} className="btn">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

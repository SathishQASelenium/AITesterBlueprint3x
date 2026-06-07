import React, { useState } from 'react';

const SettingsPanel = ({ config, setConfig }) => (
  <div className="settings-panel">
    <h3>⚙️ API Configuration</h3>
    <div className="input-group">
      <label>JIRA Base URL</label>
      <input
        value={config.jiraBaseUrl}
        onChange={(e) => setConfig({...config, jiraBaseUrl: e.target.value})}
        placeholder="https://your-domain.atlassian.net"
      />
    </div>
    <div className="input-group">
      <label>JIRA Email</label>
      <input
        value={config.jiraEmail}
        onChange={(e) => setConfig({...config, jiraEmail: e.target.value})}
        placeholder="user@example.com"
      />
    </div>
    <div className="input-group">
      <label>JIRA API Token</label>
      <input
        type="password"
        value={config.jiraToken}
        onChange={(e) => setConfig({...config, jiraToken: e.target.value})}
        placeholder="••••••••"
      />
    </div>
    <div className="input-group">
      <label>GROQ API Key</label>
      <input
        type="password"
        value={config.groqKey}
        onChange={(e) => setConfig({...config, groqKey: e.target.value})}
        placeholder="gsk_••••••••"
      />
    </div>
  </div>
);

const TestPlanDisplay = ({ data }) => {
  if (!data) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="result-container">
      <h2>📋 Test Plan: {data.jiraId} - {data.title}</h2>

      <div className="summary-cards">
        <div className="card">Total: {data.summary.totalTests}</div>
        <div className="card positive">Pos: {data.summary.positiveTests}</div>
        <div className="card negative">Neg: {data.summary.negativeTests}</div>
        <div className="card security">Sec: {data.summary.securityTests}</div>
      </div>

      <div className="overview-section">
        <h3>Overview</h3>
        <p>{data.overview}</p>
      </div>

      <table className="test-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Steps</th>
            <th>Expected Result</th>
            <th>Type</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {data.testCases.map((tc, i) => (
            <tr key={i}>
              <td>{tc.testId}</td>
              <td>{tc.description}</td>
              <td dangerouslySetInnerHTML={{ __html: tc.steps }}></td>
              <td dangerouslySetInnerHTML={{ __html: tc.expectedResult }}></td>
              <td><span className={`badge ${tc.type.toLowerCase()}`}>{tc.type}</span></td>
              <td>{tc.priority}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="download-btn" onClick={() => copyToClipboard(data.markdown)}>
        Copy Markdown Plan
      </button>
    </div>
  );
};

export default function App() {
  const [config, setConfig] = useState({
    jiraBaseUrl: '', jiraEmail: '', jiraToken: '', groqKey: ''
  });
  const [jiraId, setJiraId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jiraId, config })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert('Error generating test plan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>🚀 AI Tester Blueprint 3x</h1>
        <p>B.L.A.S.T. Framework Implementation</p>
      </header>

      <div className="main-layout">
        <aside>
          <SettingsPanel config={config} setConfig={setConfig} />
        </aside>

        <main>
          <div className="input-section">
            <input
              value={jiraId}
              onChange={(e) => setJiraId(e.target.value)}
              placeholder="Enter JIRA ID (e.g. KAN-3)"
            />
            <button onClick={handleGenerate} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Test Plan'}
            </button>
          </div>

          {loading && <div className="loader">AI is thinking... 🧠</div>}
          <TestPlanDisplay data={result} />
        </main>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { testJiraConnection } from '../services/jiraApi';
import { testGroqConnection } from '../services/groqApi';

const GROQ_MODELS = [
  { value: 'openai/gpt-oss-120b', label: 'openai/gpt-oss-120b (FREE)' },
  { value: 'llama-3.3-70b-versatile', label: 'llama-3.3-70b-versatile' },
  { value: 'llama-3.1-70b-versatile', label: 'llama-3.1-70b-versatile' },
  { value: 'mixtral-8x7b-32768', label: 'mixtral-8x7b-32768' },
];

function StatusBadge({ status, message }) {
  if (!status) return null;
  const cls = status === 'testing' ? 'badge badge-info' : status === 'success' ? 'badge badge-success' : 'badge badge-error';
  return <span className={cls}>{message}</span>;
}

export default function SettingsPage({ onNavigate }) {
  const { settings, updateJiraSettings, updateGroqSettings, resetToEnvDefaults } = useSettings();
  const [jiraStatus, setJiraStatus] = useState(null);
  const [groqStatus, setGroqStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('jira');

  const jiraReady = settings.jira.baseUrl && settings.jira.email && settings.jira.token;
  const groqReady = settings.groq.apiKey && settings.groq.model;

  const testJira = async () => {
    setJiraStatus({ status: 'testing', message: 'Testing...' });
    try {
      const me = await testJiraConnection(settings.jira.email, settings.jira.token);
      setJiraStatus({ status: 'success', message: `Connected as ${me.displayName || me.emailAddress}` });
    } catch (e) {
      setJiraStatus({ status: 'error', message: e.message });
    }
  };

  const testGroq = async () => {
    setGroqStatus({ status: 'testing', message: 'Testing...' });
    try {
      await testGroqConnection(settings.groq.apiKey, settings.groq.model);
      setGroqStatus({ status: 'success', message: 'GROQ connected' });
    } catch (e) {
      setGroqStatus({ status: 'error', message: e.message });
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="subtitle">Credentials auto-loaded from .env — verify then proceed.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => onNavigate('generate')}
          disabled={!jiraReady || !groqReady}
        >
          Go to Generate →
        </button>
      </div>

      <div className="readiness-row">
        <div className={`readiness-chip ${jiraReady ? 'ready' : 'not-ready'}`}>
          {jiraReady ? '✓' : '✗'} Jira
        </div>
        <div className={`readiness-chip ${groqReady ? 'ready' : 'not-ready'}`}>
          {groqReady ? '✓' : '✗'} GROQ
        </div>
        <button className="btn btn-ghost btn-sm" onClick={resetToEnvDefaults}>
          Reset to .env defaults
        </button>
      </div>

      <div className="tabs">
        <button className={activeTab === 'jira' ? 'tab active' : 'tab'} onClick={() => setActiveTab('jira')}>
          Jira Configuration
        </button>
        <button className={activeTab === 'groq' ? 'tab active' : 'tab'} onClick={() => setActiveTab('groq')}>
          GROQ Configuration
        </button>
      </div>

      {activeTab === 'jira' && (
        <div className="card">
          <h2>Jira Settings</h2>
          <div className="form-group">
            <label>Base URL</label>
            <input
              type="url"
              value={settings.jira.baseUrl}
              onChange={(e) => updateJiraSettings({ baseUrl: e.target.value })}
              placeholder="https://your-domain.atlassian.net"
            />
            <small>Note: proxy target is fixed at dev-server start from VITE_JIRA_BASE_URL</small>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={settings.jira.email}
              onChange={(e) => updateJiraSettings({ email: e.target.value })}
              placeholder="you@company.com"
            />
          </div>
          <div className="form-group">
            <label>API Token</label>
            <input
              type="password"
              value={settings.jira.token}
              onChange={(e) => updateJiraSettings({ token: e.target.value })}
              placeholder="ATATT3x..."
            />
            <small>
              Generate at{' '}
              <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noreferrer">
                id.atlassian.com → Security → API Tokens
              </a>
            </small>
          </div>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={testJira} disabled={!jiraReady || jiraStatus?.status === 'testing'}>
              Test Connection
            </button>
            <StatusBadge {...(jiraStatus || {})} />
          </div>
        </div>
      )}

      {activeTab === 'groq' && (
        <div className="card">
          <h2>GROQ Settings</h2>
          <div className="form-group">
            <label>API Key</label>
            <input
              type="password"
              value={settings.groq.apiKey}
              onChange={(e) => updateGroqSettings({ apiKey: e.target.value })}
              placeholder="gsk_..."
            />
            <small>
              Get key at{' '}
              <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer">
                console.groq.com/keys
              </a>
            </small>
          </div>
          <div className="form-group">
            <label>Model</label>
            <select value={settings.groq.model} onChange={(e) => updateGroqSettings({ model: e.target.value })}>
              {GROQ_MODELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={testGroq} disabled={!groqReady || groqStatus?.status === 'testing'}>
              Test Connection
            </button>
            <StatusBadge {...(groqStatus || {})} />
          </div>
        </div>
      )}
    </div>
  );
}

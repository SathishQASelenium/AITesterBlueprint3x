import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { fetchJiraIssue, extractIssueData } from '../services/jiraApi';
import { generateTestStrategy } from '../services/groqApi';

const TEST_STRATEGY_TEMPLATE = `## Test Strategy for [Project Name]

**Objective**: [Clear objective statement]

### Scope
#### In Scope:
- [All workflows and features to test]
#### Out of Scope:
- [Exclusions]

### Focus Areas
- Functional correctness
- UI/Navigation
- Performance (load, stress, scalability)
- Security (OWASP Top 10, encryption)
- Compatibility (browsers, devices, OS)
- Usability (accessibility, ease of use)

### Approach
- Black box and white box testing
- Automated tests (Selenium/Appium/REST Assured)
- Exploratory testing for key workflows
- Load testing with JMeter (target: 1000+ concurrent users)
- Security testing for OWASP Top 10
- Cross-browser: Chrome, Firefox, Edge, Safari

### Deliverables
- Functional test cases and reports
- Performance test scripts and results
- Security vulnerabilities report
- UAT report
- Test coverage and defect metrics
- Automation regression suite

### Team & Schedule
- Team: [N members, M months]
- Phase 1: Functional and security testing
- Phase 2: Performance and load testing
- Phase 3: Compatibility and UAT
- Phase 4: Regression testing

### Entry & Exit Criteria
- Entry: User stories meet "Ready for Testing" definition of done
- Exit: All test cases executed, zero critical defects outstanding

### Risks
- [Risk 1]: [Mitigation]
- [Risk 2]: [Mitigation]`;

// --- Markdown Renderer ---
function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (/^\*[^*]+\*$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
    if (/^`[^`]+`$/.test(part)) return <code key={i}>{part.slice(1, -1)}</code>;
    return part;
  });
}

function MarkdownRenderer({ content }) {
  const lines = content.split('\n');
  const elements = [];
  let listItems = [];
  let k = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(<ul key={k++}>{[...listItems]}</ul>);
      listItems = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith('#### ')) {
      flushList();
      elements.push(<h4 key={k++}>{renderInline(line.slice(5))}</h4>);
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={k++}>{renderInline(line.slice(4))}</h3>);
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={k++}>{renderInline(line.slice(3))}</h2>);
    } else if (line.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={k++}>{renderInline(line.slice(2))}</h1>);
    } else if (/^[-*] /.test(line)) {
      listItems.push(<li key={k++}>{renderInline(line.slice(2))}</li>);
    } else if (/^---+$/.test(line.trim())) {
      flushList();
      elements.push(<hr key={k++} />);
    } else if (line.trim() === '') {
      flushList();
      elements.push(<div key={k++} className="md-spacer" />);
    } else {
      flushList();
      elements.push(<p key={k++}>{renderInline(line)}</p>);
    }
  }
  flushList();

  return <div className="markdown-body">{elements}</div>;
}

// --- Status helpers ---
const STEPS = {
  idle: null,
  fetching: { label: 'Fetching Jira issue...', pct: 30 },
  generating: { label: 'Generating test strategy...', pct: 70 },
  done: { label: 'Done!', pct: 100 },
  error: { label: 'Error', pct: 0 },
};

export default function GeneratePage({ onNavigate }) {
  const { settings } = useSettings();
  const [issueKey, setIssueKey] = useState('KAN-3');
  const [issueData, setIssueData] = useState(null);
  const [strategy, setStrategy] = useState('');
  const [step, setStep] = useState('idle');
  const [error, setError] = useState(null);

  const ready = settings.jira.email && settings.jira.token && settings.groq.apiKey;

  const run = async () => {
    if (!issueKey.trim() || !ready) return;
    setError(null);
    setIssueData(null);
    setStrategy('');

    // Step 1: fetch Jira
    setStep('fetching');
    let extracted;
    try {
      const raw = await fetchJiraIssue(settings.jira.email, settings.jira.token, issueKey.trim().toUpperCase());
      extracted = extractIssueData(raw);
      setIssueData(extracted);
    } catch (e) {
      setError(e.message);
      setStep('error');
      return;
    }

    // Step 2: generate strategy
    setStep('generating');
    try {
      const md = await generateTestStrategy(settings.groq.apiKey, settings.groq.model, extracted, TEST_STRATEGY_TEMPLATE);
      setStrategy(md);
      setStep('done');
    } catch (e) {
      setError(e.message);
      setStep('error');
    }
  };

  const download = () => {
    if (!strategy) return;
    const blob = new Blob([strategy], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: `Test_Strategy_${issueData?.key || issueKey}.md`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copy = () => {
    navigator.clipboard.writeText(strategy).then(() => alert('Copied to clipboard!'));
  };

  const currentStep = STEPS[step];
  const isRunning = step === 'fetching' || step === 'generating';

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Generate Test Strategy</h1>
          <p className="subtitle">One-click: fetch Jira issue → AI generates strategy.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => onNavigate('settings')}>
          ← Settings
        </button>
      </div>

      {!ready && (
        <div className="banner banner-warn">
          Jira or GROQ credentials incomplete.{' '}
          <button className="btn-link" onClick={() => onNavigate('settings')}>Configure in Settings</button>
        </div>
      )}

      <div className="card">
        <h2>Jira Issue</h2>
        <div className="input-row">
          <input
            className="input-issue-key"
            type="text"
            value={issueKey}
            onChange={(e) => setIssueKey(e.target.value.toUpperCase())}
            placeholder="KAN-3"
            disabled={isRunning}
          />
          <button className="btn btn-primary" onClick={run} disabled={isRunning || !ready || !issueKey.trim()}>
            {isRunning ? 'Working...' : 'Fetch & Generate'}
          </button>
        </div>

        {isRunning && (
          <div className="progress-block">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${currentStep?.pct || 0}%` }} />
            </div>
            <span className="progress-label">{currentStep?.label}</span>
          </div>
        )}

        {step === 'error' && <div className="banner banner-error">{error}</div>}

        {issueData && (
          <div className="issue-panel">
            <div className="issue-key-badge">{issueData.key}</div>
            <div className="issue-summary">{issueData.summary}</div>
            <div className="issue-meta">
              <span className="meta-chip">{issueData.issueType}</span>
              <span className="meta-chip">{issueData.status}</span>
              <span className="meta-chip">{issueData.priority}</span>
              <span className="meta-chip">→ {issueData.assignee}</span>
            </div>
            {issueData.description && (
              <div className="issue-desc">
                <strong>Description:</strong>
                <pre>{issueData.description}</pre>
              </div>
            )}
          </div>
        )}
      </div>

      {step === 'done' && strategy && (
        <div className="card result-card">
          <div className="result-header">
            <h2>Generated Test Strategy</h2>
            <div className="result-actions">
              <button className="btn btn-secondary" onClick={copy}>Copy</button>
              <button className="btn btn-primary" onClick={download}>Download .md</button>
            </div>
          </div>
          <MarkdownRenderer content={strategy} />
        </div>
      )}
    </div>
  );
}

// All Jira calls route through /jira-api Vite proxy to bypass CORS on Jira Cloud.
const JIRA_PROXY = '/jira-api/rest/api/3';

export async function fetchJiraIssue(email, token, issueKey) {
  const url = `${JIRA_PROXY}/issue/${issueKey}`;
  const auth = btoa(`${email}:${token}`);

  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      `Jira API ${response.status}: ${err.errorMessages?.join(', ') || response.statusText}`
    );
  }
  return response.json();
}

export async function testJiraConnection(email, token) {
  const url = `${JIRA_PROXY}/myself`;
  const auth = btoa(`${email}:${token}`);

  const response = await fetch(url, {
    headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Connection failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export function extractIssueData(issue) {
  const f = issue.fields || {};
  return {
    key: issue.key,
    summary: f.summary || '',
    description: f.description ? extractTextFromAdf(f.description) : '',
    issueType: f.issuetype?.name || '',
    status: f.status?.name || '',
    priority: f.priority?.name || '',
    assignee: f.assignee?.displayName || 'Unassigned',
    reporter: f.reporter?.displayName || 'Unknown',
    created: f.created || '',
    updated: f.updated || '',
    labels: f.labels || [],
    components: f.components?.map((c) => c.name) || [],
    fixVersions: f.fixVersions?.map((v) => v.name) || [],
    affectsVersions: f.versions?.map((v) => v.name) || [],
  };
}

function extractTextFromAdf(adf) {
  if (!adf) return '';
  if (typeof adf === 'string') return adf;
  let text = '';
  function traverse(node) {
    if (!node) return;
    if (node.type === 'text') {
      text += node.text + ' ';
    } else if (node.type === 'hardBreak') {
      text += '\n';
    } else if (Array.isArray(node.content)) {
      node.content.forEach(traverse);
      if (['paragraph', 'heading', 'listItem', 'bulletList', 'orderedList'].includes(node.type)) {
        text += '\n';
      }
    }
  }
  traverse(adf);
  return text.trim();
}

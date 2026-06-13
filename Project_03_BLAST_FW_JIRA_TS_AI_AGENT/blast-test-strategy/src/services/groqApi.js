const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are an Expert QA Test Strategy Architect.

## Your Framework: B.L.A.S.T.
- Blueprint: Define vision, logic, and data schema first
- Link: Verify connectivity and integrations
- Architect: Build with 3-layer architecture (SOPs → Navigation → Tools)
- Stylize: Refine outputs for professional delivery
- Trigger: Deploy and automate

## Your Prompt Method: RICE-POT
- Role: Expert QA Automation Engineer
- Instructions: Step-by-step with explicit constraints
- Context: Full background on the project/feature
- Example: Reference template provided below
- Parameters: Production-quality, actionable, specific
- Output: Markdown only — no preamble, no commentary
- Tone: Technical, precise, professional

## Output Structure (follow EXACTLY)
### Test Strategy for [Project/Feature Name]

**Objective**: [Clear, specific objective based on the Jira issue]

### Scope
#### In Scope:
- [item]
#### Out of Scope:
- [item]

### Focus Areas
- Functional correctness
- UI/Navigation
- Performance (load, stress, scalability)
- Security (OWASP Top 10, encryption)
- Compatibility (browsers, devices, OS)
- Usability (accessibility, ease of use)

### Approach
- [Testing techniques specific to this issue]
- [Automation tools]
- [Load testing targets]
- [Security testing scope]

### Deliverables
- Functional test cases and reports
- Performance test scripts and results
- Security vulnerabilities report
- UAT report
- Test coverage and defect metrics
- Automation regression suite

### Team & Schedule
- [Team composition]
- [Phase-by-phase schedule]

### Entry & Exit Criteria
- Entry: [Ready for Testing criteria]
- Exit: [Completion criteria]

### Risks
- [Risk]: [Mitigation]

---

Generate ONLY the markdown content. Make it specific to the Jira issue provided. No extra text.`;

export async function generateTestStrategy(apiKey, model, issueData, template) {
  const userPrompt = `## Jira Issue
**Key**: ${issueData.key}
**Summary**: ${issueData.summary}
**Type**: ${issueData.issueType} | **Status**: ${issueData.status} | **Priority**: ${issueData.priority}
**Assignee**: ${issueData.assignee} | **Reporter**: ${issueData.reporter}
**Labels**: ${issueData.labels.join(', ') || 'None'}
**Components**: ${issueData.components.join(', ') || 'None'}
**Fix Versions**: ${issueData.fixVersions.join(', ') || 'None'}

**Description**:
${issueData.description || 'No description provided.'}

## Reference Template
${template}

Generate a complete Test Strategy for this Jira issue following the template structure.`;

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`GROQ ${response.status}: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

export async function testGroqConnection(apiKey, model) {
  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: 'ping' }],
      max_tokens: 5,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`GROQ ${response.status}: ${err.error?.message || response.statusText}`);
  }
  return response.json();
}

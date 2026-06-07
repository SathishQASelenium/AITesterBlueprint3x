# 📜 Gemini.md: Project Constitution
## JIRA Test Plan Generator

**Last Updated:** 2026-06-07  
**Phase:** 1 (Blueprint) - ✅ APPROVED  
**Status:** ✅ APPROVED - READY FOR PHASE 2 (LINK)

---

## 1️⃣ Input Schema

### User Configuration (Settings)
```json
{
  "jiraConfig": {
    "baseUrl": "string (e.g., https://your-domain.atlassian.net)",
    "email": "string (e.g., user@example.com)",
    "apiToken": "string (securely stored, never in state)"
  },
  "groqConfig": {
    "apiKey": "string (securely stored, never in state)",
    "model": "string (default: openai/gpt-oss-120b)"
  }
}
```

### User Input (JIRA ID)
```json
{
  "jiraId": "string (e.g., KAN-3, AwesomeQA)"
}
```

### Combined Request to Backend
```json
{
  "jiraId": "string",
  "jiraConfig": {
    "baseUrl": "string",
    "email": "string",
    "apiToken": "string"
  },
  "groqConfig": {
    "apiKey": "string",
    "model": "string"
  }
}
```

---

## 2️⃣ JIRA Response Schema

**Endpoint:** `GET {baseUrl}/rest/api/3/issues/{jiraId}`  
**Auth:** Basic Auth (email:apiToken, base64 encoded)

### JIRA Issue Response (Relevant Fields)
```json
{
  "key": "string (KAN-3)",
  "fields": {
    "summary": "string (Title of the ticket)",
    "description": {
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "string (Ticket description text)"
            }
          ]
        }
      ]
    },
    "labels": ["string"],
    "customfield_10000": "string (Acceptance Criteria - if exists)",
    "components": [
      {
        "name": "string"
      }
    ],
    "status": {
      "name": "string (e.g., To Do, In Progress)"
    }
  }
}
```

### Extracted Data (Internal)
```json
{
  "jiraId": "string",
  "title": "string",
  "description": "string (cleaned plaintext)",
  "acceptanceCriteria": "string or null",
  "labels": ["string"],
  "components": ["string"],
  "status": "string"
}
```

---

## 3️⃣ GROQ Request Schema

**Model:** `openai/gpt-oss-120b`  
**API Endpoint:** `https://api.groq.com/openai/v1/chat/completions`

### System Prompt (Behavioral Rules)
```
You are an expert QA engineer. Generate comprehensive test cases following the RICE-POT framework:
- R: Risk Analysis (what could go wrong?)
- I: Impact (severity if fails)
- C: Coverage (which scenarios)
- E: Effort (complexity to test)
- P: Priority (1=critical, 2=high, 3=medium, 4=low)
- O: Outcome (what we expect)
- T: Type (Positive, Negative, Security)

Rules:
1. Generate ONLY Markdown table format (no prose, no JSON)
2. Include positive, negative, AND security test cases
3. Generate a summary overview first (2-3 bullets max)
4. Each test case must have:
   - Unique Test ID (TC_001, TC_002, etc.)
   - Description (one-liner)
   - Steps (numbered list or inline)
   - Expected Result
   - Type (Positive/Negative/Security)
   - Priority (1-4)
5. Do NOT include explanations outside the table
6. Do NOT make up test cases; derive from acceptance criteria
```

### User Prompt
```
Task: Generate comprehensive test cases for this JIRA ticket.

JIRA ID: {jiraId}
Title: {title}

Description:
{description}

Acceptance Criteria:
{acceptanceCriteria}

Components: {components}
Labels: {labels}

Generate test cases NOW in this EXACT format:
## Overview
- [1-2 line summary]

| Test ID | Description | Steps | Expected Result | Type | Priority |
|---------|-------------|-------|-----------------|------|----------|
| TC_001  | [One-liner] | [Step by step] | [What happens] | Positive/Negative/Security | 1-4 |

Do NOT add any text outside this table.
```

### Full GROQ Request Body
```json
{
  "model": "openai/gpt-oss-120b",
  "messages": [
    {
      "role": "system",
      "content": "[System Prompt as above]"
    },
    {
      "role": "user",
      "content": "[User Prompt with {jiraId}, {title}, {description}, etc.]"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000,
  "stream": false
}
```

---

## 4️⃣ GROQ Response Schema

### Raw Response
```json
{
  "choices": [
    {
      "message": {
        "content": "string (Markdown table with test cases)"
      }
    }
  ],
  "usage": {
    "prompt_tokens": "number",
    "completion_tokens": "number"
  }
}
```

### Extracted Test Cases (Internal)
```json
{
  "overview": "string (2-3 line summary)",
  "testCases": [
    {
      "testId": "TC_001",
      "description": "string",
      "steps": ["string"],
      "expectedResult": "string",
      "type": "Positive|Negative|Security",
      "priority": 1-4
    }
  ]
}
```

---

## 5️⃣ Output Schema (React Frontend)

### Test Plan Object
```json
{
  "jiraId": "string",
  "title": "string",
  "generatedAt": "ISO 8601 timestamp",
  "overview": "string",
  "summary": {
    "totalTests": "number",
    "positiveTests": "number",
    "negativeTests": "number",
    "securityTests": "number"
  },
  "testCases": [
    {
      "testId": "string",
      "description": "string",
      "steps": ["string"],
      "expectedResult": "string",
      "type": "Positive|Negative|Security",
      "priority": 1-4
    }
  ],
  "markdown": "string (Full Markdown ready to download)"
}
```

### Markdown File Output
```markdown
# Test Plan: {JIRA_ID}

**Title:** {title}  
**Generated:** {timestamp}  
**Total Tests:** {count}

## Overview
{overview}

## Summary
- Positive Tests: {count}
- Negative Tests: {count}
- Security Tests: {count}

## Test Cases

| Test ID | Description | Steps | Expected Result | Type | Priority |
|---------|-------------|-------|-----------------|------|----------|
| TC_001  | ... | ... | ... | Positive | 1 |
| ... | ... | ... | ... | ... | ... |
```

---

## 🎯 Architectural Invariants

### Never Break These Rules:

1. **Security:**
   - API credentials (email, token, apiKey) NEVER stored in React state
   - Always use `.env` or secure environment variables
   - Backend proxy for sensitive operations

2. **API Rate Limiting:**
   - GROQ free tier: ~30 requests/min
   - Implement 2-second delay between requests
   - Batch JIRA requests when possible

3. **Error Handling:**
   - Invalid JIRA ID → Return 404 error with helpful message
   - GROQ API failure → Return error + cached test template
   - Network timeout → Retry with exponential backoff (max 3 times)

4. **Data Integrity:**
   - All JIRA fetches must validate `acceptanceCriteria` field exists
   - GROQ response must be parsed for valid Markdown table
   - Invalid output → Log error and request retry

5. **Frontend State:**
   - React state: UI state, settings (non-sensitive), generated test cases
   - Never store: Raw API keys, tokens, passwords

---

## 📋 Data Flow Diagram

```
User Input (JIRA ID)
    ↓
[React Settings Panel - Get credentials]
    ↓
[Backend Request - Validate credentials]
    ↓
[Phase 2: Link - Test JIRA connection]
    ↓
[Fetch JIRA Issue Details]
    ↓
[Extract: Summary, Description, Acceptance Criteria]
    ↓
[Phase 3: Architect - Generate GROQ prompt]
    ↓
[Call GROQ API - Get test cases]
    ↓
[Parse Markdown - Extract structured test cases]
    ↓
[Phase 4: Stylize - Format for display]
    ↓
[React Component - Show results + summary]
    ↓
[User Downloads Markdown]
```

---

## ✅ Approval Checklist

- [x] User approves Input Schema
- [x] User approves JIRA Response Schema
- [x] User approves GROQ Request/Response Schemas
- [x] User approves Output Schemas
- [x] User approves Architectural Invariants
- [x] User approves Data Flow

**Status:** ✅ APPROVED BY USER

---

## 🚫 Forbidden Actions

1. Do NOT proceed to Phase 2 (Link) until schema is approved
2. Do NOT write Python tools until Phase 3 (Architect SOPs are ready)
3. Do NOT hardcode credentials anywhere
4. Do NOT skip error handling for API failures

---

## 📝 Maintenance & Updates

When making changes:
1. Update this file with any schema changes
2. Update `findings.md` with new constraints
3. Update `progress.md` with completed work
4. Commit to version control

---

**NEXT STEP:** Please review the above schemas and confirm they match your requirements. Any changes needed?

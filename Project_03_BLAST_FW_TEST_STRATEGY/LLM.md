# LLM.md — Project Constitution
*Authoritative reference for data schemas, behavioral rules, and architectural invariants. Update only when schema or architecture changes.*

## Project Identity
**Name**: BLAST Test Strategy Generator  
**Version**: 1.0 | **Date**: 2026-06-13  
**Stack**: React 19 + Vite 8 | **AI**: GROQ `openai/gpt-oss-120b`  
**Framework**: B.L.A.S.T. (Blueprint → Link → Architect → Stylize → Trigger)

---

## Data Schemas

### Input — Jira Issue (extracted from Atlassian REST API v3)
```json
{
  "key": "KAN-3",
  "summary": "string",
  "description": "string — plain text extracted from ADF JSON",
  "issueType": "Story | Bug | Task | Epic",
  "status": "To Do | In Progress | Done",
  "priority": "Highest | High | Medium | Low | Lowest",
  "assignee": "string (display name)",
  "reporter": "string (display name)",
  "labels": ["string"],
  "components": ["string"],
  "fixVersions": ["string"],
  "affectsVersions": ["string"],
  "created": "ISO8601 string",
  "updated": "ISO8601 string"
}
```

### Output — Test Strategy (Markdown document)
Structure follows `TestStrategy_Template.md` exactly:
1. Objective
2. Scope → In Scope / Out of Scope
3. Focus Areas
4. Approach
5. Deliverables
6. Team & Schedule
7. Entry & Exit Criteria
8. Risks

### Config Schema — App Settings (localStorage key: `blast-settings`)
```json
{
  "jira": {
    "baseUrl": "https://<domain>.atlassian.net",
    "email": "user@domain.com",
    "token": "Jira API token (used in Basic Auth)"
  },
  "groq": {
    "apiKey": "gsk_...",
    "model": "openai/gpt-oss-120b"
  }
}
```

---

## Behavioral Rules
1. Jira API calls MUST use `/jira-api` Vite proxy — direct browser fetch to `*.atlassian.net` is blocked by CORS.
2. GROQ API calls go direct (api.groq.com allows CORS).
3. Credentials auto-load from `VITE_*` env vars as defaults; user can override in UI.
4. Settings persist to `localStorage` — never written to disk or committed.
5. App is READ-ONLY from Jira — zero write/create/update/delete operations.
6. GROQ: `temperature: 0.3` (deterministic output), `max_tokens: 4000`.
7. System prompt encodes B.L.A.S.T. + RICE-POT frameworks verbatim.
8. Generated strategy is rendered as formatted markdown, not raw text.

## Architectural Invariants
| Layer | Location | Responsibility |
|---|---|---|
| Layer 1 — SOPs | `Project_03_BLAST_FW_TEST_STRATEGY/` | Docs, schemas, rules (this file) |
| Layer 2 — Navigation | `src/context/`, `src/App.jsx` | State, routing, credential management |
| Layer 3 — Tools | `src/services/` | Atomic API calls (jiraApi.js, groqApi.js) |

- No external state management lib — React Context API only
- No router lib — state-based page switching (`useState`)
- One-click generate: fetch Jira → extract → generate strategy (single user action)
- Vite proxy target resolved from `VITE_JIRA_BASE_URL` at dev-server start

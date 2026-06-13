# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

This directory contains the **reference documents** for Project 03. The deliverable (the React app) lives in the sibling directory `../Project_03_BLAST_FW_JIRA_TS_AI_AGENT/blast-test-strategy/`.

| File | Role |
|---|---|
| `B.L.A.S.T.md` | System prompt / agent protocol defining the 5-phase build process |
| `RICE_POT.md` | Prompt framework used to instruct the LLM (Role, Instructions, Context, Example, Parameters, Output, Tone) |
| `TestStrategy_Template.md` | Template the AI uses to structure generated test strategies |
| `Objective.md` | Original task brief: build a React app that fetches a Jira issue and auto-generates a test strategy via GROQ |

## React App (blast-test-strategy)

**Location:** `../Project_03_BLAST_FW_JIRA_TS_AI_AGENT/blast-test-strategy/`

### Commands

```bash
cd ../Project_03_BLAST_FW_JIRA_TS_AI_AGENT/blast-test-strategy

npm install       # first time only
npm run dev       # dev server (Vite, HMR)
npm run build     # production build
npm run lint      # ESLint
npm run preview   # preview production build
```

### Architecture

```
src/
  context/SettingsContext.jsx   # Global state — Jira + GROQ credentials, persisted to localStorage
  services/jiraApi.js           # Jira REST API v3 calls (fetch issue, test connection, ADF→text parser)
  services/groqApi.js           # GROQ API calls; embeds B.L.A.S.T. + RICE-POT system prompt
  components/SettingsPage.jsx   # UI to configure credentials
  components/GeneratePage.jsx   # UI to enter Jira ID and display generated strategy
  App.jsx                       # Single-page router (settings ↔ generate views, no router lib)
```

**Data flow:** User enters Jira issue key → `jiraApi.fetchJiraIssue` → `extractIssueData` normalises ADF → `groqApi.generateTestStrategy` sends issue data + `TestStrategy_Template.md` content as user prompt → rendered markdown output.

**Credentials** are stored in `localStorage` under key `blast-settings` (never committed). Default GROQ model: `openai/gpt-oss-120b`.

**Jira proxy note:** `jiraApi.js` calls `baseUrl + /rest/api/3/...` directly from the browser. CORS will block this for cloud Jira unless a Vite proxy or CORS-anywhere proxy is configured in `vite.config.js`.

## Frameworks & Methodologies

- **B.L.A.S.T.** (Blueprint → Link → Architect → Stylize → Trigger): the 5-phase build protocol; `B.L.A.S.T.md` is the authoritative reference.
- **RICE-POT**: prompt-engineering framework applied when constructing LLM system prompts; see `RICE_POT.md`.
- Generated test strategies follow the structure in `TestStrategy_Template.md` exactly.

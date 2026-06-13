# task_plan.md — Phases, Goals & Checklist

## North Star
Auto-generate professional Test Strategy documents from Jira issues in one click, using GROQ AI, following the B.L.A.S.T. framework and RICE-POT methodology.

## Integrations
- **Jira Cloud** — REST API v3 (Basic Auth: email + API token) → `assathish301.atlassian.net`
- **GROQ** — OpenAI-compatible API → `api.groq.com/openai/v1` → model: `openai/gpt-oss-120b`

## Source of Truth
Jira issue fields (fetched live via REST API at generate time).

## Delivery Payload
Markdown Test Strategy document — rendered in UI + downloadable as `.md` + copyable to clipboard.

---

## Phase Checklist

### Phase 0: Initialization ✅
- [x] Create `LLM.md` — Project Constitution (data schema, rules, invariants)
- [x] Create `task_plan.md` — phases & checklist
- [x] Create `findings.md` — discoveries & constraints
- [x] Create `progress.md` — work log

### Phase 1: Blueprint ✅
- [x] Define Jira issue data schema (LLM.md)
- [x] Define Test Strategy output schema (LLM.md)
- [x] Define App Settings config schema (LLM.md)
- [x] Confirm 3-layer architecture
- [x] Confirm payload shape: Jira JSON → GROQ → Markdown

### Phase 2: Link ✅
- [x] Create `blast-test-strategy/.env` with `VITE_` prefix vars
- [x] Configure Vite proxy `/jira-api` → Jira Cloud (CORS fix)
- [x] Verify Jira connection endpoint: `/jira-api/rest/api/3/myself`
- [x] Verify GROQ connection endpoint: `api.groq.com/openai/v1/chat/completions`

### Phase 3: Architect ✅
- [x] `SettingsContext.jsx` — auto-load from `import.meta.env.VITE_*`, persist to localStorage
- [x] `jiraApi.js` — proxy route, ADF text extraction, issue field normalisation
- [x] `groqApi.js` — B.L.A.S.T + RICE-POT system prompt, template injection
- [x] `SettingsPage.jsx` — configure credentials, test connections, show completion status
- [x] `GeneratePage.jsx` — one-click fetch+generate, markdown renderer, download/copy

### Phase 4: Stylize ✅
- [x] Professional dark theme CSS (`App.css`)
- [x] `MarkdownRenderer` component (headers, bold, lists, paragraphs, hr)
- [x] Loading states & progress indicators
- [x] Issue metadata panel
- [x] Generated strategy panel with copy + download

### Phase 5: Trigger ✅
- [x] Run `npm run dev` — Vite dev server on http://localhost:5173
- [x] Run `npm run build` — production bundle clean (207KB JS, 619ms)
- [x] Add `.env` to `.gitignore` in `blast-test-strategy/`
- [x] ESLint: 0 errors

## Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Jira CORS | Vite proxy `/jira-api` (dev); needs backend proxy in prod |
| GROQ model unavailable | Dropdown fallback: `llama-3.3-70b-versatile` |
| ADF complex nesting | Recursive text extractor; acceptable loss for MVP |
| Proxy target static | Fixed to env var at startup; single Jira instance assumption OK |

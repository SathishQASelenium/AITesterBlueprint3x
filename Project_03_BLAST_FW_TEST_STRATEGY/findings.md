# findings.md — Research, Discoveries & Constraints

## 2026-06-13

---

### F1: Jira Cloud CORS Blocks Direct Browser Fetch
**Discovery**: Jira Cloud (`*.atlassian.net`) rejects direct `fetch()` from browser — CORS header missing.  
**Root Cause**: Existing `jiraApi.js` called `${baseUrl}/rest/api/3/...` directly from browser.  
**Fix**: Vite `server.proxy` maps `/jira-api/*` → Jira target at dev-server level (server-to-server, no CORS).  
**Prod note**: Would need a Node/Express proxy or Cloudflare Worker to work outside Vite dev server.

---

### F2: Jira Description Uses Atlassian Document Format (ADF)
**Discovery**: `issue.fields.description` is ADF JSON, not a string. Cannot `.trim()` or render directly.  
**Example**:
```json
{
  "type": "doc",
  "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "..." }] }]
}
```
**Fix**: Recursive `extractTextFromAdf()` traverses node tree, collects all `type: "text"` leaf nodes.

---

### F3: GROQ Model Name is Exact
**Discovery**: GROQ returns `404 Not Found` for any model name not exactly matching their list.  
**Env value**: `openai/gpt-oss-120b` — this must be the exact string passed in `model` field.  
**Safe fallbacks**: `llama-3.3-70b-versatile`, `llama-3.1-70b-versatile`, `mixtral-8x7b-32768`

---

### F4: Vite Env Var Prefix Requirement
**Discovery**: Vite strips env vars without `VITE_` prefix from `import.meta.env` in browser code.  
**Source .env** (in `Project_03_BLAST_FW_TEST_STRATEGY/`) uses plain names (`JIRA_API_TOKEN`).  
**Fix**: Created `blast-test-strategy/.env` with all vars re-prefixed as `VITE_*`.  
**Note**: `vite.config.js` uses `loadEnv(mode, cwd, '')` to read un-prefixed vars for the proxy target.

---

### F5: Settings Friction — Manual Re-entry on Every Run
**Discovery**: Original `SettingsContext.jsx` had hardcoded empty defaults — credentials must be typed each session (unless localStorage still has them).  
**Fix**: `DEFAULT_SETTINGS` now reads from `import.meta.env.VITE_*`, so the app is pre-configured on first load with zero user action needed.

---

### F6: Vite Proxy Target is Static (Resolved at Startup)
**Constraint**: Vite proxy target cannot change at runtime. If user changes `baseUrl` in Settings UI, proxy still points to original env var URL.  
**Acceptable**: Single-user dev tool with one Jira instance. Noted in LLM.md behavioral rules.

---

### F7: Existing App Had No Markdown Rendering
**Discovery**: `GeneratePage.jsx` rendered output as `<div className="markdown-line">{line}</div>` — raw text with no formatting.  
**Fix**: Custom `MarkdownRenderer` component converts headers, bold, italic, inline code, lists, and `---` dividers to HTML elements.

---

### F8: GROQ System Prompt Size
**Discovery**: B.L.A.S.T. + RICE-POT system prompt + template is ~1200 tokens. Within GROQ free tier context window.  
**Observation**: Lower temperature (0.3) produces more consistent template-adherent output vs 0.7+ which drifts.

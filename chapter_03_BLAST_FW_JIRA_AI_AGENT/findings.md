# 🔍 Findings: JIRA Test Plan Generator

## Discovery Phase Findings

### JIRA Integration
- **API Type:** REST API
- **Authentication:** Email + API Token (Basic Auth)
- **Key Endpoints Needed:**
  - `GET /rest/api/3/issues/{issueKey}` - Fetch issue details
  - Retrieve: Summary, Description, Labels, Components, Custom Fields (Acceptance Criteria)

### GROQ API Integration
- **Model:** `openai/gpt-oss-120b` (free tier)
- **API Format:** Compatible with OpenAI API (drop-in replacement)
- **Rate Limits:** Free tier has limits - need to batch requests

### Test Case Framework
- **Format:** RICE-POT framework (from Project1_TC_Gen)
  - **R:** Risk Analysis
  - **I:** Impact Assessment
  - **C:** Coverage
  - **E:** Effort
  - **P:** Priority
  - **O:** Outcome
  - **T:** Type (Positive/Negative/Security)
- **Output:** Markdown table format

### Test Types to Generate
1. **Positive Tests:** Happy path scenarios
2. **Negative Tests:** Error handling, edge cases
3. **Security Tests:** Input validation, auth, injection

### UI Requirements (from user feedback)
- Settings panel for credentials
- Dark/Light mode support
- Copy-to-clipboard buttons
- Progress indicator during generation
- Markdown download functionality

### Tech Stack Recommendations
- **Frontend:** React (as requested) + TypeScript for type safety
- **Backend:** Node.js or Python Flask (for tool orchestration)
- **Environment:** `.env` file for credentials (NEVER commit)

---

## Constraints & Risks

### Rate Limiting
- **Risk:** GROQ free tier may rate-limit bulk requests
- **Mitigation:** Implement request batching and exponential backoff

### JIRA Token Security
- **Risk:** Credentials visible in frontend
- **Mitigation:** Use backend proxy or environment variables

### Prompt Engineering
- **Risk:** GROQ may generate inconsistent test format
- **Mitigation:** Use structured prompts with clear JSON/Markdown output specs

---

## Similar Projects in Workspace
- **Project1_TC_Gen/:** Uses RICE-POT framework - reuse format/prompts
- **Project2_REST_API_Framework/:** Uses REST Assured - can reference API testing patterns
- **Selenium Framework:** Has test case structure examples

---

## Technical Unknowns (To Resolve)
- [ ] Does JIRA API require CORS headers for frontend?
- [ ] What custom fields store "Acceptance Criteria"?
- [ ] Can GROQ handle streaming for long test plans?
- [ ] Best way to cache JIRA results to avoid re-fetching?

---

## Phase 2 Connection Validation Results ✅

### JIRA Connection - VALIDATED
- **Status:** ✅ Working
- **User:** Sathish Kumar (assathish.30+1@gmail.com)
- **Project:** KAN (AwesomeQA)
- **API Endpoint:** https://assathish301.atlassian.net/rest/api/3/
- **Authentication:** Basic Auth (Email + API Token)
- **Tests Passed:** 
  - ✅ User authentication
  - ✅ Project listing (1 project: KAN - AwesomeQA)
  - ⚠️ Issue fetch (KAN-3 not found - expected)

### GROQ Connection - VALIDATED  
- **Status:** ✅ Working
- **Model:** openai/gpt-oss-120b (free tier)
- **API Endpoint:** https://api.groq.com/openai/v1/chat/completions
- **Tests Passed:**
  - ✅ Client initialization
  - ✅ Simple API call (129 tokens)
  - ✅ Test case generation prompt works

### Test Scripts Created
- `tools/test_jira_connection.py` - JIRA validation
- `tools/test_groq_connection.py` - GROQ validation  
- `tools/validate_link.py` - Master orchestrator
- `.env` - Credentials securely stored
- `requirements.txt` - Dependencies listed

---

## Status
- ✅ **Phase 0:** Initialization complete
- ✅ **Phase 1:** Blueprint approved
- ✅ **Phase 2:** Link validated

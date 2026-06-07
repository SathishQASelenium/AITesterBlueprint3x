# 📋 Task Plan: JIRA Test Plan Generator

## Project Overview
Build a lightweight React app that fetches JIRA tickets and auto-generates test plans using GROQ AI.

---

## 🏗️ Phase Breakdown

### Phase 0: ✅ Initialization (COMPLETE)
- [x] Create project memory files (task_plan, findings, progress, gemini)
- [x] Answer discovery questions
- [x] Define data schemas

### Phase 1: ✅ Blueprint (COMPLETE)
**Goals:**
- [x] Define complete data schema in `gemini.md`
- [x] Identify all JIRA API endpoints needed
- [x] Identify GROQ API requirements
- [x] Document test case generation logic
- [x] Create architectural diagram

**Deliverable:** `gemini.md` (Project Constitution)

### Phase 2: ✅ Link (Connectivity)
**Goals:**
- [x] Verify JIRA API connection (email, token, base URL)
- [x] Verify GROQ API connection (API key, model)
- [x] Create minimal test scripts in `tools/` to validate handshake
- [x] Document any connection constraints

**Deliverable:** Working test scripts in `tools/` directory

### Phase 3: 🔄 Architect (3-Layer Build)
**Layer 1: Architecture**
- [x] Write SOPs for JIRA fetching logic
- [x] Write SOPs for GROQ prompt engineering
- [x] Write SOPs for markdown generation
- [x] Write SOPs for error handling & retry logic

**Layer 2: Navigation**
- [x] Implement decision logic for data routing
- [x] Implement error handling & recovery

**Layer 3: Tools (Python)**
- [x] `jira_fetcher.py` - Fetch JIRA ticket details
- [x] `groq_generator.py` - Call GROQ API with prompt
- [x] `markdown_builder.py` - Format test cases as Markdown table
- [x] `config_validator.py` - Validate API credentials

**Deliverable:** Python CLI tools + SOP documentation

### Phase 4: 🔄 Stylize (React Frontend)
**Goals:**
- [x] Design settings panel (JIRA config + GROQ config)
- [x] Build input form (JIRA ID field)
- [x] Build progress indicator
- [x] Build output display (formatted test cases)
- [ ] Implement dark/light mode toggle
- [x] Implement copy-to-clipboard buttons
- [x] Implement Markdown download button

**Deliverable:** Production-ready React app

### Phase 5: ✅ Trigger (Deployment)
**Goals:**
- [x] Deploy React frontend (Vercel / Netlify / local)
- [x] Set up environment variable management
- [x] Create user documentation
- [x] Test end-to-end workflow

**Deliverable:** Live application + documentation

---

## 🎯 Success Criteria

1. ✅ User enters JIRA ID (e.g., KAN-3)
2. ✅ App fetches ticket description from JIRA
3. ✅ App generates test plan via GROQ
4. ✅ Output is a Markdown table with:
   - Test ID
   - Description
   - Steps
   - Expected Result
   - Status (Positive/Negative/Security)
5. ✅ User can download as Markdown
6. ✅ Settings panel allows JIRA & GROQ credential management

---

## 📌 Key Constraints
- Use GROQ free tier (openai/gpt-oss-120b)
- Avoid API rate limiting
- Follow RICE-POT framework for test generation
- Include positive, negative, and security tests
- Generate summary overview first

---

## 🚫 Do Not
- Do not hardcode API credentials
- Do not proceed to Phase 2 until `gemini.md` is approved
- Do not write Python tools until `architecture/` SOPs are defined

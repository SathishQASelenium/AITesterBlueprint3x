# SOP-02: GROQ Test Case Generation

## Goal
Generate a comprehensive test plan based on the RICE-POT framework using the GROQ LLM.

## Inputs
- `extractedData`: {title, description, acceptanceCriteria, labels, components, jiraId}
- `apiKey`: GROQ API Key
- `model`: LLM model ID (default: `openai/gpt-oss-120b`)

## Process
1. **Prompt Construction**:
   - **System Prompt**: Define identity as Expert QA Engineer. Enforce RICE-POT framework. Mandate Markdown table output. No prose.
   - **User Prompt**: Inject `extractedData` into the template defined in `gemini.md`.
2. **API Execution**:
   - Endpoint: `POST https://api.groq.com/openai/v1/chat/completions`.
   - Payload:
     - `model`: {model}
     - `messages`: [{role: system, content: sys_prompt}, {role: user, content: user_prompt}]
     - `temperature`: 0.7
     - `max_tokens`: 2000
3. **Response Handling**:
   - Extract `choices[0].message.content`.
   - Ensure the response contains both the "Overview" and the "Markdown Table".

## Error Handling
- **429 Too Many Requests**: Implement 2-second wait. Retry once.
- **Content Filter/Safety**: If response is blocked, return "AI Generation Blocked".
- **Empty Response**: Log error and request retry with a simplified prompt.

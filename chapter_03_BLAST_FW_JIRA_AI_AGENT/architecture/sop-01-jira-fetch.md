# SOP-01: JIRA Ticket Data Fetching

## Goal
Retrieve structured data from a JIRA issue to be used as context for test case generation.

## Inputs
- `baseUrl`: JIRA instance URL (e.g., https://domain.atlassian.net)
- `email`: JIRA user email
- `apiToken`: JIRA API token
- `jiraId`: The unique issue key (e.g., KAN-3)

## Process
1. **Authentication**: 
   - Use Basic Authentication.
   - Construct header: `Authorization: Basic <base64(email:apiToken)>`.
2. **API Call**:
   - Endpoint: `GET {baseUrl}/rest/api/3/issues/{jiraId}`.
   - Set `Accept: application/json`.
3. **Data Extraction**:
   - Extract `fields.summary` $\rightarrow$ `title`.
   - Extract `fields.description.content` $\rightarrow$ iterate through paragraphs to extract plaintext $\rightarrow$ `description`.
   - Extract `fields.customfield_10000` (or designated AC field) $\rightarrow$ `acceptanceCriteria`.
   - Extract `fields.labels` $\rightarrow$ `labels`.
   - Extract `fields.components` $\rightarrow$ `components`.
4. **Validation**:
   - Ensure `jiraId` is present in response.
   - Verify `description` is not empty.

## Error Handling
- **401 Unauthorized**: Validate API token and email. Return "Authentication Failed".
- **404 Not Found**: JIRA ID does not exist. Return "Issue Not Found".
- **Network Timeout**: Retry up to 3 times with exponential backoff.
- **Malformed JSON**: Log error and return "Data Extraction Failed".

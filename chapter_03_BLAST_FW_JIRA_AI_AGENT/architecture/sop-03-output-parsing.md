# SOP-03: Test Plan Output Parsing

## Goal
Convert raw Markdown text from the LLM into a structured JSON object for frontend display.

## Inputs
- `rawMarkdown`: The content string returned by GROQ.

## Process
1. **Overview Extraction**:
   - Locate the "## Overview" section.
   - Extract text from "## Overview" until the start of the table.
2. **Table Extraction**:
   - Identify the Markdown table (lines starting with `|`).
   - Remove the header and separator rows.
3. **Row Parsing**:
   - For each row:
     - Split by `|`.
     - Map columns to fields: `testId`, `description`, `steps`, `expectedResult`, `type`, `priority`.
     - Trim whitespace from each value.
4. **Data Structuring**:
   - Calculate summary stats:
     - `totalTests`: Count of rows.
     - `positiveTests`: Count of `type == 'Positive'`.
     - `negativeTests`: Count of `type == 'Negative'`.
     - `securityTests`: Count of `type == 'Security'`.
5. **JSON Construction**:
   - Assemble the final `Test Plan Object` as defined in `gemini.md`.

## Error Handling
- **Missing Table**: If no `|` characters found, return "Invalid Format: Table Missing".
- **Column Mismatch**: If a row has fewer than 6 columns, log as warning and skip row.
- **Invalid Priority**: If priority is not 1-4, default to 3.

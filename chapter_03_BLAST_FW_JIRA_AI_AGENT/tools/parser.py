import re
from typing import Dict, Any, List, Optional

class TestPlanParser:
    """
    Parses raw Markdown output from GROQ into a structured JSON format.
    Follows SOP-03.
    """

    def parse(self, raw_markdown: str) -> Dict[str, Any]:
        overview = self._extract_overview(raw_markdown)
        test_cases = self._extract_table(raw_markdown)

        summary = {
            "totalTests": len(test_cases),
            "positiveTests": len([t for t in test_cases if t['type'].lower() == 'positive']),
            "negativeTests": len([t for t in test_cases if t['type'].lower() == 'negative']),
            "securityTests": len([t for t in test_cases if t['type'].lower() == 'security']),
        }

        return {
            "overview": overview,
            "summary": summary,
            "testCases": test_cases
        }

    def _extract_overview(self, text: str) -> str:
        # Find text between ## Overview and the start of the table (|)
        pattern = r"## Overview\s*(.*?)(?=\n\s*\|)"
        match = re.search(pattern, text, re.S | re.I)
        if match:
            return match.group(1).strip()
        return "No overview provided."

    def _extract_table(self, text: str) -> List[Dict[str, Any]]:
        cases = []
        lines = text.split('\n')

        # Find the table start
        table_started = False
        header_found = False

        for line in lines:
            line = line.strip()
            if not line: continue

            if not table_started and line.startswith('|'):
                table_started = True

            if not table_started:
                continue

            # Skip header and separator rows
            if 'Test ID' in line or '---' in line:
                header_found = True
                continue

            if header_found and line.startswith('|'):
                # Parse row
                cols = [col.strip() for col in line.split('|')]
                # Filter out empty first/last elements from splitting |...|
                cols = [c for c in cols if c != '']

                if len(cols) >= 6:
                    cases.append({
                        "testId": cols[0],
                        "description": cols[1],
                        "steps": cols[2],
                        "expectedResult": cols[3],
                        "type": cols[4],
                        "priority": int(cols[5]) if cols[5].isdigit() else 3
                    })

        return cases

if __name__ == "__main__":
    parser = TestPlanParser()
    mock_markdown = """
    ## Overview
    - User login functionality test plan
    - Covers positive, negative and security scenarios

    | Test ID | Description | Steps | Expected Result | Type | Priority |
    |---------|-------------|-------|-----------------|------|----------|
    | TC_001  | Valid Login  | 1. Enter email 2. Enter pass | Login success | Positive | 1 |
    | TC_002  | Invalid Pass  | 1. Enter email 2. Wrong pass | Error shown | Negative | 2 |
    | TC_003  | SQL Injection | 1. Enter ' OR 1=1 | Access denied | Security | 1 |
    """
    print(parser.parse(mock_markdown))

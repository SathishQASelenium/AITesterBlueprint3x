import requests
import os
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

class GroqClient:
    def __init__(self, api_key: str, model: str = "openai/gpt-oss-120b"):
        self.api_key = api_key
        self.model = model
        self.url = "https://api.groq.com/openai/v1/chat/completions"

    def generate_test_cases(self, extracted_data: Dict[str, Any]) -> Optional[str]:
        """
        Calls GROQ API to generate test cases using the RICE-POT framework.
        Follows SOP-02.
        """
        system_prompt = (
            "You are an expert QA engineer. Generate comprehensive test cases following the RICE-POT framework:\n"
            "- R: Risk Analysis (what could go wrong?)\n"
            "- I: Impact (severity if fails)\n"
            "- C: Coverage (which scenarios)\n"
            "- E: Effort (complexity to test)\n"
            "- P: Priority (1=critical, 2=high, 3=medium, 4=low)\n"
            "- O: Outcome (what we expect)\n"
            "- T: Type (Positive, Negative, Security)\n\n"
            "Rules:\n"
            "1. Generate ONLY Markdown table format (no prose, no JSON)\n"
            "2. Include positive, negative, AND security test cases\n"
            "3. Generate a summary overview first (2-3 bullets max)\n"
            "4. Each test case must have: Unique Test ID, Description, Steps, Expected Result, Type, Priority\n"
            "5. Do NOT include explanations outside the table\n"
            "6. Do NOT make up test cases; derive from acceptance criteria"
        )

        user_prompt = (
            f"Task: Generate comprehensive test cases for this JIRA ticket.\n\n"
            f"JIRA ID: {extracted_data.get('jiraId')}\n"
            f"Title: {extracted_data.get('title')}\n\n"
            f"Description:\n{extracted_data.get('description')}\n\n"
            f"Acceptance Criteria:\n{extracted_data.get('acceptanceCriteria')}\n\n"
            f"Components: {extracted_data.get('components')}\n"
            f"Labels: {extracted_data.get('labels')}\n\n"
            f"Generate test cases NOW in this EXACT format:\n"
            f"## Overview\n- [1-2 line summary]\n\n"
            f"| Test ID | Description | Steps | Expected Result | Type | Priority |\n"
            f"|---------|-------------|-------|-----------------|------|----------|\n"
            f"| TC_001  | [One-liner] | [Step by step] | [What happens] | Positive/Negative/Security | 1-4 |\n\n"
            f"Do NOT add any text outside this table."
        )

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 2000,
            "stream": False
        }

        try:
            response = requests.post(self.url, headers=headers, json=payload, timeout=15)

            if response.status_code == 429:
                print("Error: GROQ Rate limit reached.")
                return None

            response.raise_for_status()
            data = response.json()
            return data['choices'][0]['message']['content']

        except requests.exceptions.RequestException as e:
            print(f"Network error calling GROQ API: {e}")
            return None

if __name__ == "__main__":
    import os
    API_KEY = os.getenv("GROQ_API_KEY")
    if API_KEY:
        client = GroqClient(API_KEY)
        # Mock data for test
        mock_data = {
            "jiraId": "TEST-1",
            "title": "User Login",
            "description": "User should be able to login with email and password",
            "acceptanceCriteria": "Login works with valid credentials",
            "components": ["Auth"],
            "labels": ["Critical"]
        }
        print("Generating test cases...")
        print(client.generate_test_cases(mock_data))
    else:
        print("Missing GROQ_API_KEY in .env")

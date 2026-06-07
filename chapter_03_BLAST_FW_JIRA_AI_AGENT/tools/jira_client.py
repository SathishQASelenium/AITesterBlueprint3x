import requests
import base64
import os
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()


class JiraClient:
    def __init__(self, base_url: str, email: str, api_token: str):
        self.base_url = base_url.strip("/")
        self.email = email
        self.api_token = api_token
        self.auth_header = self._generate_auth_header()

    def _generate_auth_header(self) -> Dict[str, str]:
        auth_str = f"{self.email}:{self.api_token}"
        encoded_auth = base64.b64encode(auth_str.encode()).decode()
        return {"Authorization": f"Basic {encoded_auth}"}

    def fetch_issue(self, jira_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetches JIRA issue details and extracts relevant fields for test generation.
        Follows SOP-01.
        """
        url = f"{self.base_url}/rest/api/3/issue/{jira_id}"
        headers = {**self.auth_header, "Accept": "application/json"}

        try:
            response = requests.get(url, headers=headers, timeout=10)

            if response.status_code == 401:
                print(f"Error: Authentication failed for {self.email}")
                return None
            elif response.status_code == 404:
                print(f"Error: Issue {jira_id} not found")
                return None

            response.raise_for_status()
            data = response.json()

            return self._extract_relevant_fields(data)

        except requests.exceptions.RequestException as e:
            print(f"Network error fetching JIRA issue {jira_id}: {e}")
            return None

    def _extract_relevant_fields(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parses JIRA v3 JSON structure into a flat dictionary.
        """
        fields = data.get("fields", {})

        # Extract description plaintext from JIRA's complex Document Format (ADF)
        description_text = ""
        description_obj = fields.get("description")
        if description_obj and "content" in description_obj:
            for paragraph in description_obj["content"]:
                if paragraph.get("type") == "paragraph":
                    for text_node in paragraph.get("content", []):
                        if text_node.get("type") == "text":
                            description_text += text_node.get("text", "") + " "

        # Extract Acceptance Criteria (assuming customfield_10000 per gemini.md)
        # In a real scenario, this might need to be configurable
        ac = fields.get("customfield_10000")
        if isinstance(ac, dict) and "value" in ac:
            ac = ac["value"]
        elif isinstance(ac, list) and len(ac) > 0:
            ac = str(ac[0])

        return {
            "jiraId": data.get("key"),
            "title": fields.get("summary"),
            "description": description_text.strip(),
            "acceptanceCriteria": ac,
            "labels": fields.get("labels", []),
            "components": [c.get("name") for c in fields.get("components", [])],
            "status": fields.get("status", {}).get("name"),
        }


if __name__ == "__main__":
    # Simple test loop using .env if available
    import os

    B_URL = os.getenv("JIRA_BASE_URL")
    EMAIL = os.getenv("JIRA_EMAIL")
    TOKEN = os.getenv("JIRA_API_TOKEN")
    J_ID = "KAN-3"  # Replace with real ID for test

    if B_URL and EMAIL and TOKEN:
        client = JiraClient(B_URL, EMAIL, TOKEN)
        print(f"Fetching {J_ID}...")
        result = client.fetch_issue(J_ID)
        print(result)
    else:
        print("Missing environment variables for test.")

import os
from typing import Dict, Any
from dotenv import load_dotenv

from tools.config_validator import validate_config
from tools.jira_client import JiraClient
from tools.groq_client import GroqClient
from tools.parser import TestPlanParser

load_dotenv()


def run_generator(jira_id: str):
    """
    Navigation Layer: Orchestrates the flow from JIRA fetch to Test Plan generation.
    Follows the B.L.A.S.T. 3-layer architecture.
    """
    print(f"[START] Starting Generation for {jira_id}...")

    # 1. Validate Config
    is_valid, missing = validate_config()
    if not is_valid:
        print(f"[ERROR] Configuration Error: Missing {', '.join(missing)}")
        return

    # 2. Initialize Clients
    jira = JiraClient(
        base_url=os.getenv("JIRA_BASE_URL"),
        email=os.getenv("JIRA_EMAIL"),
        api_token=os.getenv("JIRA_API_TOKEN"),
    )
    groq = GroqClient(api_key=os.getenv("GROQ_API_KEY"))
    parser = TestPlanParser()

    # 3. Fetch JIRA Data (SOP-01)
    print(f"Fetching JIRA ticket {jira_id}...")
    jira_data = jira.fetch_issue(jira_id)
    if not jira_data:
        print("[ERROR] Failed to retrieve JIRA data.")
        return

    # 4. Generate Test Cases (SOP-02)
    print("Generating test cases via GROQ AI...")
    raw_markdown = groq.generate_test_cases(jira_data)
    if not raw_markdown:
        print("[ERROR] Failed to generate test cases.")
        return

    # 5. Parse Output (SOP-03)
    print("Parsing AI output into structured format...")
    final_payload = parser.parse(raw_markdown)

    # Enrich payload with JIRA context
    final_payload["jiraId"] = jira_data["jiraId"]
    final_payload["title"] = jira_data["title"]

    print("\n[SUCCESS] Test Plan Successfully Generated!")
    return final_payload


if __name__ == "__main__":
    # Example usage
    J_ID = input("Enter JIRA ID (e.g., KAN-3): ").strip()
    if J_ID:
        result = run_generator(J_ID)
        if result:
            import json

            print(json.dumps(result, indent=2))
    else:
        print("No JIRA ID provided.")

import os
from dotenv import load_dotenv
from typing import Tuple, List

load_dotenv()

def validate_config() -> Tuple[bool, List[str]]:
    """
    Validates that all required environment variables are present.
    Returns (is_valid, list_of_missing_keys).
    """
    required_keys = [
        "JIRA_BASE_URL",
        "JIRA_EMAIL",
        "JIRA_API_TOKEN",
        "GROQ_API_KEY"
    ]

    missing = [key for key in required_keys if not os.getenv(key)]

    if missing:
        return False, missing

    return True, []

if __name__ == "__main__":
    valid, missing = validate_config()
    if valid:
        print("✅ Configuration is valid.")
    else:
        print(f"❌ Missing configuration keys: {', '.join(missing)}")

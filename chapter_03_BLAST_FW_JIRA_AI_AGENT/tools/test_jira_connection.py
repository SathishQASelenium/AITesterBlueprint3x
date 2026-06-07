"""
JIRA Connection Validator
Tests connectivity and authentication with JIRA API
"""
import os
import base64
import requests
from datetime import datetime
from dotenv import load_dotenv

# Load .env from parent directory
env_file = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(env_file)

def validate_jira_connection():
    """Verify JIRA API connection and authentication"""
    
    jira_base_url = os.getenv("JIRA_BASE_URL", "").rstrip("/")
    jira_email = os.getenv("JIRA_EMAIL")
    jira_token = os.getenv("JIRA_API_TOKEN")
    
    print("\n" + "="*60)
    print("🔗 JIRA CONNECTION TEST")
    print("="*60)
    
    # Validate inputs
    if not all([jira_base_url, jira_email, jira_token]):
        print("❌ ERROR: Missing JIRA credentials in .env file")
        return False
    
    print(f"📍 JIRA Base URL: {jira_base_url}")
    print(f"📧 Email: {jira_email}")
    print(f"🔐 Token: {jira_token[:20]}...{jira_token[-10:]}")
    
    # Create Basic Auth header
    auth_string = f"{jira_email}:{jira_token}"
    auth_b64 = base64.b64encode(auth_string.encode()).decode()
    headers = {
        "Authorization": f"Basic {auth_b64}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    
    # Test 1: Fetch myself (basic auth test)
    try:
        print("\n[Test 1] Authenticating with JIRA...")
        response = requests.get(
            f"{jira_base_url}/rest/api/3/myself",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            user_data = response.json()
            print(f"✅ Authentication successful!")
            print(f"   User: {user_data.get('displayName', 'Unknown')}")
            print(f"   Email: {user_data.get('emailAddress', 'Unknown')}")
        else:
            print(f"❌ Authentication failed (Status: {response.status_code})")
            print(f"   Response: {response.text[:200]}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {str(e)}")
        return False
    
    # Test 2: Fetch projects (basic permissions test)
    try:
        print("\n[Test 2] Fetching projects...")
        response = requests.get(
            f"{jira_base_url}/rest/api/3/project",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            projects = response.json()
            print(f"✅ Projects fetched successfully!")
            print(f"   Total projects: {len(projects)}")
            if projects:
                print(f"   Sample: {projects[0].get('key')} - {projects[0].get('name')}")
        else:
            print(f"❌ Failed to fetch projects (Status: {response.status_code})")
            print(f"   Response: {response.text[:200]}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {str(e)}")
        return False
    
    # Test 3: Try to fetch a specific issue (KAN-3 from objective)
    try:
        print("\n[Test 3] Fetching specific issue (KAN-3)...")
        response = requests.get(
            f"{jira_base_url}/rest/api/3/issues/KAN-3",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            issue = response.json()
            print(f"✅ Issue fetched successfully!")
            print(f"   Key: {issue.get('key')}")
            print(f"   Summary: {issue.get('fields', {}).get('summary', 'N/A')[:50]}")
            print(f"   Status: {issue.get('fields', {}).get('status', {}).get('name', 'N/A')}")
        elif response.status_code == 404:
            print(f"⚠️  Issue KAN-3 not found (404)")
            print(f"   This is OK - the issue may not exist yet")
        else:
            print(f"❌ Failed to fetch issue (Status: {response.status_code})")
            print(f"   Response: {response.text[:200]}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {str(e)}")
        return False
    
    print("\n" + "="*60)
    print("✅ JIRA CONNECTION VALIDATED SUCCESSFULLY")
    print("="*60)
    return True


if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    validate_jira_connection()

"""
GROQ Connection Validator
Tests connectivity with GROQ API
"""
import os
from groq import Groq
from datetime import datetime
from dotenv import load_dotenv

# Load .env from parent directory
env_file = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(env_file)

def validate_groq_connection():
    """Verify GROQ API connection and basic functionality"""
    
    groq_api_key = os.getenv("GROQ_API_KEY")
    groq_model = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
    
    print("\n" + "="*60)
    print("🔗 GROQ CONNECTION TEST")
    print("="*60)
    
    # Validate inputs
    if not groq_api_key:
        print("❌ ERROR: Missing GROQ API key in .env file")
        return False
    
    print(f"🔑 API Key: {groq_api_key[:20]}...{groq_api_key[-10:]}")
    print(f"🤖 Model: {groq_model}")
    
    # Test 1: Initialize Groq client
    try:
        print("\n[Test 1] Initializing GROQ client...")
        client = Groq(api_key=groq_api_key)
        print(f"✅ GROQ client initialized successfully!")
        
    except Exception as e:
        print(f"❌ Failed to initialize GROQ client: {str(e)}")
        return False
    
    # Test 2: Make a simple API call
    try:
        print("\n[Test 2] Testing GROQ API with simple prompt...")
        print("   Sending: 'Say hello in 5 words or less'")
        
        response = client.chat.completions.create(
            model=groq_model,
            messages=[
                {
                    "role": "user",
                    "content": "Say hello in 5 words or less"
                }
            ],
            temperature=0.7,
            max_tokens=50,
        )
        
        if response and response.choices:
            message = response.choices[0].message.content
            print(f"✅ API call successful!")
            print(f"   Response: {message}")
            print(f"   Tokens used: {response.usage.total_tokens if response.usage else 'N/A'}")
        else:
            print(f"❌ Invalid response from GROQ API")
            return False
            
    except Exception as e:
        print(f"❌ GROQ API call failed: {str(e)}")
        return False
    
    # Test 3: Test with a test case generation prompt
    try:
        print("\n[Test 3] Testing GROQ with test case generation prompt...")
        
        test_prompt = """You are a QA engineer. Generate 2 test cases in Markdown table format.

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| TC_001  | Test login   | 1. Enter credentials | User logged in |
| TC_002  | Test logout  | 1. Click logout      | User logged out |

Respond ONLY with the table."""
        
        response = client.chat.completions.create(
            model=groq_model,
            messages=[
                {
                    "role": "user",
                    "content": test_prompt
                }
            ],
            temperature=0.7,
            max_tokens=200,
        )
        
        if response and response.choices:
            message = response.choices[0].message.content
            print(f"✅ Test case generation works!")
            print(f"   Response preview: {message[:100]}...")
        else:
            print(f"❌ Invalid response from GROQ API")
            return False
            
    except Exception as e:
        print(f"❌ Test case generation failed: {str(e)}")
        return False
    
    print("\n" + "="*60)
    print("✅ GROQ CONNECTION VALIDATED SUCCESSFULLY")
    print("="*60)
    return True


if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    validate_groq_connection()

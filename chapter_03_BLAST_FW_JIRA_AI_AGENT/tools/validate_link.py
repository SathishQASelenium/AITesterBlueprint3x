"""
Phase 2: Link Validation
Master test orchestrator for both JIRA and GROQ connections
"""
import os
import sys
import json
from datetime import datetime

# Import test modules
from test_jira_connection import validate_jira_connection
from test_groq_connection import validate_groq_connection


def run_all_tests():
    """Run all connection tests"""
    
    print("\n" + "█"*60)
    print("█" + " "*58 + "█")
    print("█" + "  PHASE 2: LINK VALIDATION".center(58) + "█")
    print("█" + "  Test Both API Connections".center(58) + "█")
    print("█" + " "*58 + "█")
    print("█"*60)
    
    # Load environment from parent directory
    from dotenv import load_dotenv
    env_file = os.path.join(os.path.dirname(__file__), "..", ".env")
    
    if not os.path.exists(env_file):
        print("\n❌ ERROR: .env file not found!")
        print(f"   Expected at: {os.path.abspath(env_file)}")
        print("   Please create .env file with JIRA and GROQ credentials")
        return False
    
    load_dotenv(env_file)
    
    results = {
        "timestamp": datetime.now().isoformat(),
        "tests": {
            "jira": False,
            "groq": False
        }
    }
    
    # Test JIRA
    print("\n\n")
    results["tests"]["jira"] = validate_jira_connection()
    
    # Test GROQ
    print("\n\n")
    results["tests"]["groq"] = validate_groq_connection()
    
    # Summary
    print("\n\n" + "█"*60)
    print("█" + " "*58 + "█")
    print("█" + "  SUMMARY".center(58) + "█")
    print("█" + " "*58 + "█")
    
    jira_status = "✅ PASS" if results["tests"]["jira"] else "❌ FAIL"
    groq_status = "✅ PASS" if results["tests"]["groq"] else "❌ FAIL"
    
    print(f"█  JIRA Connection: {jira_status:<50}█")
    print(f"█  GROQ Connection: {groq_status:<50}█")
    
    all_pass = results["tests"]["jira"] and results["tests"]["groq"]
    overall_status = "✅ ALL TESTS PASSED" if all_pass else "❌ SOME TESTS FAILED"
    
    print("█" + " "*58 + "█")
    print("█" + f"  {overall_status}".ljust(59) + "█")
    print("█" + " "*58 + "█")
    print("█"*60)
    
    # Save results
    results_file = os.path.join(os.path.dirname(__file__), "..", ".tmp", "link_validation_results.json")
    os.makedirs(os.path.dirname(results_file), exist_ok=True)
    with open(results_file, "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📄 Results saved to: {results_file}")
    
    return all_pass


if __name__ == "__main__":
    try:
        success = run_all_tests()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ FATAL ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

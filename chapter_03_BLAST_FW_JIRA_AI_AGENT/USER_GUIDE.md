# 📖 User Guide: JIRA Test Plan Generator

## Introduction
The JIRA Test Plan Generator uses the **B.L.A.S.T.** framework and **GROQ AI** to transform JIRA tickets into professional QA test plans using the **RICE-POT** methodology.

## 🚀 How to Use

### 1. Configuration
Open the **Settings Panel** on the left side of the app. Enter the following:
- **JIRA Base URL:** Your Atlassian instance URL.
- **JIRA Email:** Your registered email.
- **JIRA API Token:** Your generated API token.
- **GROQ API Key:** Your GROQ Cloud API key.

### 2. Generating a Plan
1. Enter a valid **JIRA Issue ID** (e.g., `KAN-123`) in the input field.
2. Click **Generate Test Plan**.
3. Wait for the AI to analyze the ticket and apply the RICE-POT framework.

### 3. Reviewing Results
The app will display:
- **Overview:** A brief summary of the test strategy.
- **Summary Cards:** Total count of Positive, Negative, and Security tests.
- **Test Table:** Detailed steps, expected results, and priorities.

### 4. Exporting
Click the **Copy Markdown Plan** button to copy the full professionally formatted table for use in JIRA, Confluence, or documentation.

## 🛡️ Framework Details (RICE-POT)
Every test case is generated considering:
- **R**isk: Potential failure points.
- **I**mpact: Severity of failure.
- **C**overage: Scenarios addressed.
- **E**ffort: Complexity of execution.
- **P**riority: Criticality (1-4).
- **O**utcome: Expected behavior.
- **T**ype: Positive, Negative, or Security.

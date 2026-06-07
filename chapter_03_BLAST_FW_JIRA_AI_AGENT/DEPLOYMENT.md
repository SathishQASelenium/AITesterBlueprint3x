# 🚀 Deployment Guide: JIRA Test Plan Generator

## Overview
This project consists of a **FastAPI Backend** (Python) and a **React Frontend**.

## 🛠️ Backend Setup (Local/Cloud)

### 1. Environment Variables
Create a `.env` file in the root directory:
```env
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=user@example.com
JIRA_API_TOKEN=your_api_token
GROQ_API_KEY=gsk_your_key
```

### 2. Installation
```bash
pip install -r requirements.txt
```

### 3. Execution
Run the API server:
```bash
python tools/api.py
```
The server will start at `http://localhost:8000`.

## 💻 Frontend Setup (Local/Cloud)

### 1. Installation
```bash
cd frontend
npm install
```

### 2. Execution
```bash
npm start
```
The app will be available at `http://localhost:3000`.

## ☁️ Cloud Deployment Recommendations
- **Backend:** Deploy to **Render** or **Railway.app** (supports Docker/Python). Set environment variables in the platform dashboard.
- **Frontend:** Deploy to **Vercel** or **Netlify**. Update the `fetch` URL in `App.js` to the production backend URL.

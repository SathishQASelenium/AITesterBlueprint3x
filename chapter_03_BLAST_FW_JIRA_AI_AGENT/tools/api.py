from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any

from tools.generator import run_generator

app = FastAPI(title="JIRA Test Plan Generator API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class GeneratorRequest(BaseModel):
    jiraId: str
    config: Dict[str, Any]

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/generate")
async def generate_test_plan(request: GeneratorRequest):
    """
    Endpoint to trigger the B.L.A.S.T. generator.
    """
    # Note: In a production app, we would use the config passed in the request
    # to override .env variables. For this blueprint, we rely on .env
    # but accept the config object for frontend compatibility.

    try:
        result = run_generator(request.jiraId)
        if result:
            return result
        else:
            raise HTTPException(status_code=500, detail="Generator failed to produce a result.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

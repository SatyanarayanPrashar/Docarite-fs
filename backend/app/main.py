from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from agents.docarite_worker import worker_docarite
from agents.readme_worker.readme_graph import readme_generator

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for all origins (not recommended in prod)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BuildRequest(BaseModel):
    git_url: str
    mssg: str

class ReadmeRequest(BaseModel):
    git_url: str
    include_section: str
    additional_mssg: str

@app.post("/docarite/build/")
async def build_docs(req: BuildRequest):
    try:
        result = worker_docarite(req.git_url, req.mssg)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/docarite/readme/build/")
async def build_readme(req: ReadmeRequest):
    try:
        result = readme_generator(req.git_url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

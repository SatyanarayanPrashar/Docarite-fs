from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from agents.docarite_worker import worker_docarite
from agents.readme_worker.readme_graph import readme_generator

app = FastAPI()

class BuildRequest(BaseModel):
    git_url: str
    mssg: str

class ReadmeRequest(BaseModel):
    git_url: str

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

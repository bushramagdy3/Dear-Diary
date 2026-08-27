from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from schemas import illustrationsGenrateRequest, portraitGenrateRequest
from agents import generate_illustration_agent, generate_portrait_agent
import os
import base64
import uuid

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def main():
    return {"message": "Hello World"}

@app.post("/illustrations/generate")
def illustrate(request :illustrationsGenrateRequest):
    peopleForAgent = []
    tmpPaths = []
    try:
        for person in request.people:
            base64String = person.portraitBlob.split(",")[1]
            image_bytes = base64.b64decode(base64String)
            with open(f'./portraits/{person.id}.png', "wb") as f:
                f.write(image_bytes)
                tmpPaths.append(f'./portraits/{person.id}.png')
            peopleForAgent.append({
                "id": person.id,
                "name": person.name,
                "relationship": person.relationship,
                "is_user": person.is_user,
                "imagePath": f"./portraits/{person.id}.png"
            })
        result = generate_illustration_agent.app.invoke({
            "snippet": request.prompt,
            "people": peopleForAgent
        })
    finally:
        for path in tmpPaths:
            if os.path.exists(path):
                os.remove(path)
    if result["people_missing_names"]:
        return JSONResponse(
            status_code= 409,
            content={
                "type": "missing_people",
                "people": result["people_missing_names"]
            }
        )
    return FileResponse(
        result["generated_image"],
        media_type="image/png"
    )

@app.post("/portraits/generate")
def generatePotrait(request :portraitGenrateRequest):
    tmpPath = None
    try:
        if request.reference_image_path:
            base64String = request.reference_image_path.split(",")[1]
            image_bytes = base64.b64decode(base64String)
            image_type = request.reference_image_path.split(";")[0].split("/")[1]
            with open(f'./references/reference.{image_type}', "wb") as f:
                f.write(image_bytes)
                tmpPath = f'./references/reference.{image_type}'
        result = generate_portrait_agent.app.invoke({
            "person_description": request.description,
            "reference_image_path": tmpPath
        })
    finally:
        if tmpPath and os.path.exists(tmpPath):
            os.remove(tmpPath)

    if result["input_type"] == "invalid":
        return JSONResponse(
            status_code= 409,
            content={
                "type": "invalid-input",
            }
        )
    return FileResponse(
        result["generated_portrait_path"],
        media_type="image/png"
    )
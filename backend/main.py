from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from schemas import illustrationsGenrateRequest, portraitGenrateRequest
from agents import generate_illustration_agent, generate_portrait_agent
import os

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

# class AgentState(TypedDict):
#     snippet :str
#     people :List[dict]
#     people_mentioned_ids :List[int]
#     people_missing_names :List[str]
#     image_request :ImageRequest
#     generated_image: str

@app.post("/illustrations/generate")
def illustrate(request :illustrationsGenrateRequest):
    peopleForAgent = []
    tmpPaths = []
    try:
        for person in request.people:
            with open(f'./portraits/{person.id}.png', "wb") as f:
                f.write(person.imageBlob)
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
    return FileResponse(
        result["generated_image"],
        media_type="image/png"
    )

@app.post("/illustrations/regenerate")
def regenerateIllustration(request :illustrationsGenrateRequest):
    result = generate_illustration_agent.app.invoke({
        "snippet": request.prompt,
        "people": [person.model_dump() for person in request.people]
    })
    return FileResponse(
        result["generated_image"],
        media_type="image/png"
    )

@app.post("/portraits/generate")
def generatePotrait(request :portraitGenrateRequest):
    result = generate_portrait_agent.app.invoke({
        "person_description": request.description,
        "reference_image_path": request.reference_image_path
    })
    return FileResponse(
        result["generated_portrait_path"],
        media_type="image/png"
    )

@app.post("/portraits/regenerate")
def regeneratePotrait(request :portraitGenrateRequest):
    result = generate_portrait_agent.app.invoke({
        "person_description": request.description,
        "reference_image_path": request.reference_image_path
    })
    return FileResponse(
        result["generated_portrait_path"],
        media_type="image/png"
    )
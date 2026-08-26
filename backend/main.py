from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from schemas import illustrationsGenrateRequest, portraitGenrateRequest
from agents import generate_illustration_agent, generate_portrait_agent

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
    result = generate_illustration_agent.app.invoke({
        "snippet": request.prompt,
        "people": [person.model_dump() for person in request.people]
    })
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
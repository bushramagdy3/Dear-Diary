from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from schemas import illustrationsGenrateRequest
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
    print("Text to illustrate:", request.prompt)
    return FileResponse(
        "test-images/generated-image.png",
        media_type="image/png"
    )

@app.post("/illustrations/regenerate")
def regenerateIllustration(request :illustrationsGenrateRequest):
    print("Text to regenerate:", request.prompt)
    return FileResponse(
        "test-images/regerated-image.png",
        media_type="image/png"
    )

@app.post("/portraits/generate")
def generatePotrait(request :illustrationsGenrateRequest):
    print("Text to generate potrait:", request.prompt)
    return FileResponse(
        "test-images/generated-potrait.png",
        media_type="image/png"
    )

@app.post("/portraits/regenerate")
def regeneratePotrait(request :illustrationsGenrateRequest):
    print("Text to regenerate potrait:", request.prompt)
    return FileResponse(
        "test-images/generated-potrait.png",
        media_type="image/png"
    )

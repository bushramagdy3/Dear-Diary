from typing import TypedDict
from langgraph.graph import StateGraph, START, END 
from settings import setting
from openai import OpenAI
import base64

client = OpenAI(api_key=setting.OPENAI_API_KEY)

class PortraitState(TypedDict):
    person_description :str
    reference_image_path :str
    input_type :str
    generated_portrait_path: str

def identify_input_type(state :PortraitState) -> PortraitState:
    has_description = state.get("person_description") != None and state.get("person_description") != ""
    has_image = state.get("reference_image_path") != None and state.get("reference_image_path") != ""

    if has_description and not has_image:
        return {"input_type": "description"}
    
    if has_image and not has_description:
        return {"input_type": "image"}
    
    return {"input_type": "invalid"}

def route_input_type(state :PortraitState) -> str:
    return state["input_type"]

def remove_background(state :PortraitState) -> PortraitState:
    from PIL import Image as PILImage
    import cv2
    import numpy as np

    image = PILImage.open(state["generated_portrait_path"]).convert("RGBA")
    pixels = np.array(image)
    rgb = pixels[:, :, :3]

    gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY).astype(np.float32)
    darkness = 255 - gray

    clear_threshold = 14
    visible_threshold = 80
    alpha = (darkness - clear_threshold) / (visible_threshold - clear_threshold)
    alpha = np.clip(alpha, 0, 1)
    alpha = (alpha * 255).astype(np.uint8)

    pixels[:, :, 0] = gray.astype(np.uint8)
    pixels[:, :, 1] = gray.astype(np.uint8)
    pixels[:, :, 2] = gray.astype(np.uint8)
    pixels[:, :, 3] = alpha

    PILImage.fromarray(pixels, "RGBA").save(state["generated_portrait_path"])

    return {"generated_portrait_path": state["generated_portrait_path"]}

def generate_from_description(state :PortraitState) -> PortraitState:
    prompt = f"""
    Create a standalone hand-drawn graphite pencil portrait of the following person:

    {state["person_description"]}

    REFERENCE ROLE:
    Reference image 1 is a STYLE REFERENCE ONLY.

    The final portrait must look as though it was physically drawn by the same artist who drew Reference image 1.

    Do NOT copy the person, facial features, pose, clothing, composition, or subject from Reference image 1.
    Copy only its drawing technique and visual language.

    DRAWING TECHNIQUE:
    Reproduce the actual graphite technique visible in Reference image 1:

    - visible individual pencil strokes
    - rough, irregular hand-drawn contours
    - broken and overlapping sketch lines
    - clearly varied pencil pressure
    - expressive graphite buildup in darker areas
    - visible hatching and cross-hatching
    - rough directional strokes following the form
    - natural graphite smudging
    - imperfect handmade transitions
    - construction marks and unfinished lines where natural
    - strong contrast created through graphite marks rather than smooth digital gradients
    - raw sketchbook-quality texture

    The face, hair, skin, and clothing must be constructed primarily from visible pencil marks.

    IMPORTANT:
    Do NOT render the face using smooth continuous grayscale shading.
    Do NOT make the skin look airbrushed or digitally blended.
    Do NOT create a photorealistic black-and-white portrait.
    Do NOT create a 3D-rendered face.
    Do NOT create soft CGI-like volume.
    Do NOT create glossy eyes or polished AI beauty rendering.
    Do NOT use perfectly clean contours.
    Do NOT create a digital painting with a pencil filter applied over it.
    Do NOT make the result look like a grayscale photograph.

    If an area needs darker value, build that value using visible graphite strokes, hatching, cross-hatching, pencil pressure, and smudging rather than smooth digital gradients.

    The result should immediately read as:
    REAL GRAPHITE DRAWING,
    not a grayscale rendered portrait.

    POSE:
    Choose a natural portrait pose.

    Do NOT automatically place the person directly facing the viewer.
    Do NOT force eye contact with the camera.

    The head may naturally be:
    - turned
    - tilted
    - in three-quarter view
    - in side view
    - looking downward
    - looking away

    The pose should feel like something an artist naturally chose to sketch.

    BACKGROUND:
    Generate the graphite drawing on a smooth, plain, pale white/off-white background.

    The background must have:
    - no texture
    - no pattern
    - no paper grain
    - no color variation
    - no colored background

    Keep the background clean and even so it can be removed cleanly afterward.

    EDGES:
    Do NOT make the portrait look like a rectangular image that was cropped.

    Do not abruptly stop the shoulders, hair, clothing, or shading at an invisible boundary.

    Toward the outer edges of the portrait, gradually reduce the density and darkness of the graphite.

    Let the drawing naturally dissolve into:
    - lighter strokes
    - incomplete lines
    - sparse hatching
    - unfinished pencil marks

    so the portrait appears to organically fade into a diary page.

    Do not include scenery, text, captions, notebook lines, borders, frames, paper texture, decorative elements, or watermarks.

    Output only the graphite portrait on the smooth pale white/off-white background.
    """
    image_file = open('./agents/inspo.jpeg', "rb") 
    try:
        result = client.images.edit(
            model="gpt-image-2",
            image=image_file,
            prompt=prompt,
            output_format="png",
            quality="low"
        )
        result.data[0].b64_json
        image_bytes = base64.b64decode(result.data[0].b64_json)
        output_path = "./generated/portrait-output.png"
        with open(output_path, "wb") as f:
            f.write(image_bytes)
    finally:
        image_file.close()

    return {"generated_portrait_path": output_path}

def generate_from_image(state :PortraitState) -> PortraitState:
    prompt = """
    Create a standalone hand-drawn graphite pencil portrait of the person shown in Reference image 1.

    REFERENCE ROLES:

    Reference image 1 is the IDENTITY REFERENCE.
    Preserve the person's recognizable identity, facial structure, distinctive facial features, hairstyle, and overall likeness.

    Reference image 2 is the STYLE REFERENCE ONLY.

    The final portrait must look as though it was physically drawn by the same artist who drew Reference image 2.

    Do NOT copy the person, pose, clothing, composition, or subject from Reference image 2.
    Copy only its graphite drawing technique and visual language.

    DRAWING TECHNIQUE:
    Reproduce the actual graphite technique visible in Reference image 2:

    - visible individual pencil strokes
    - rough, irregular hand-drawn contours
    - broken and overlapping sketch lines
    - clearly varied pencil pressure
    - expressive graphite buildup in darker areas
    - visible hatching and cross-hatching
    - rough directional strokes following facial and body form
    - natural graphite smudging
    - imperfect handmade transitions
    - construction marks and unfinished lines where natural
    - strong contrast created through graphite marks rather than smooth gradients
    - raw sketchbook-quality texture

    The face, hair, skin, and clothing must be constructed primarily through visible graphite marks.

    IMPORTANT:
    Do NOT render the face using smooth continuous grayscale shading.
    Do NOT make the skin look airbrushed or digitally blended.
    Do NOT create a photorealistic black-and-white portrait.
    Do NOT create a 3D-rendered face.
    Do NOT create soft CGI-like facial volume.
    Do NOT create glossy or polished AI beauty rendering.
    Do NOT use perfectly clean digital contours.
    Do NOT create a normal digital portrait and apply a pencil effect afterward.
    Do NOT make the result look like a grayscale photograph.

    If an area needs darker value, build the darkness using visible pencil strokes, hatching, cross-hatching, pressure changes, graphite buildup, and smudging.

    The result must immediately look like:
    REAL GRAPHITE DRAWING,
    not a digitally rendered grayscale portrait.

    IDENTITY AND POSE:
    Reference image 1 determines WHO the person is.
    It does NOT determine how they must pose.

    Do NOT copy the exact pose, expression, camera angle, framing, clothing, or background from Reference image 1 unless necessary for recognizable identity.

    Do NOT force the person to face the viewer.
    Do NOT force direct eye contact.
    Do NOT force the whole face to remain clearly visible.

    Choose a natural artistic pose.

    The person may naturally appear:
    - in three-quarter view
    - from the side
    - looking downward
    - looking away
    - with the head tilted
    - with the head naturally turned
    - with part of the face less visible

    while remaining recognizable as the person in Reference image 1.

    BACKGROUND:
    Generate the graphite drawing on a smooth, plain, pale white/off-white background.

    The background must have:
    - no texture
    - no pattern
    - no paper grain
    - no color variation
    - no colored background

    Keep the background clean and even so it can be removed cleanly afterward.

    EDGES:
    Do NOT create a hard rectangular crop.

    Do not abruptly stop the shoulders, clothing, hair, or graphite shading at the sides or bottom.

    Toward the outer edges, gradually reduce graphite density.

    Let the drawing dissolve into:
    - lighter pencil strokes
    - broken contours
    - incomplete marks
    - sparse hatching
    - unfinished graphite

    so it feels like a sketch naturally fading into a diary page.

    Do not include scenery, text, captions, notebook lines, paper texture, borders, frames, decorative elements, or watermarks.

    Output only the graphite portrait on the smooth pale white/off-white background.
    """
    image_files = [open(state["reference_image_path"], "rb"), open('./agents/inspo.jpeg', "rb")] 
    try:
        result = client.images.edit(
            model="gpt-image-2",
            image=image_files,
            prompt=prompt,
            output_format="png",
            quality="low"
        )
        result.data[0].b64_json
        image_bytes = base64.b64decode(result.data[0].b64_json)
        output_path = "./generated/portrait-output.png"
        with open(output_path, "wb") as f:
            f.write(image_bytes)
    finally:
        [image_file.close() for image_file in image_files]

    return {"generated_portrait_path": output_path}

graph = StateGraph(PortraitState)

graph.add_node("identify_input_type", identify_input_type)
graph.add_node("generate_from_description", generate_from_description)
graph.add_node("generate_from_image", generate_from_image)
graph.add_node("remove_background", remove_background)

graph.add_edge(START, "identify_input_type")
graph.add_conditional_edges(
    "identify_input_type",
    route_input_type,
    {
        "description": "generate_from_description",
        "image": "generate_from_image",
        "invalid": END
    }
)
graph.add_edge("generate_from_description", "remove_background")
graph.add_edge("generate_from_image", "remove_background")
graph.add_edge("remove_background", END)

app = graph.compile()

# with open("portrait-graph.png", "wb") as f:
#     f.write(app.get_graph().draw_mermaid_png())

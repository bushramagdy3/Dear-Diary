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

def generate_from_description(state :PortraitState) -> PortraitState:
    prompt = f"""
        Create a standalone monochrome black-and-white graphite pencil sketch portrait of the following person:

        {state["person_description"]}

        The portrait must look like an actual hand-drawn pencil sketch, with visible graphite linework, sketch lines, and soft gray pencil shading.

        Use only black, white, and gray tones. Do not use any color.

        The result should be a clean head-and-shoulders portrait showing only the person, suitable for later use as an identity reference in diary-scene illustration generation.

        Keep the portrait natural and visually clean.

        Use a truly transparent background.

        Do not simulate transparency with a checkerboard, grid, pattern, paper texture, or colored backdrop.

        Do not include any background scenery, notebook page, paper sheet, paper texture, spiral binding, frame, border, panel, mockup, caption, label, watermark, decorative surrounding elements, or text.

        Do not render the image as a digital painting, colored illustration, painterly artwork, glossy 3D art, or anime-style portrait.

        Output only the portrait illustration itself.

    """
    result = client.images.generate(
        model="gpt-image-2",
        prompt=prompt,
        background="transparent",
        output_format="png"
    )
    image_bytes = base64.b64decode(result.data[0].b64_json)
    output_path = "./generated/portrait-output.png"
    with open(output_path, "wb") as f:
        f.write(image_bytes)

    return {"generated_portrait_path": output_path}

def generate_from_image(state :PortraitState) -> PortraitState:
    prompt = f"""
        Create a standalone monochrome black-and-white graphite pencil sketch portrait of the same person shown in the provided reference image.

        Preserve the person's recognizable identity, facial structure, facial features, and overall likeness.

        Use the reference image only as an identity reference. Do not simply copy the original photo, and do not copy the exact pose, clothing, framing, lighting, or background unless needed for recognizable identity.

        The result must look like an actual hand-drawn pencil sketch, with visible graphite linework, sketch lines, and soft gray pencil shading.

        Use only black, white, and gray tones. Do not use any color.

        Show only the person in a clean portrait composition suitable for later use as an identity reference in diary-scene illustration generation.

        Use a truly transparent background.

        Do not simulate transparency with a checkerboard, grid, pattern, paper texture, or colored backdrop.

        Do not include any background scenery, notebook page, paper sheet, paper texture, spiral binding, frame, border, panel, mockup, caption, label, watermark, decorative surrounding elements, or text.

        Do not render the image as a digital painting, colored illustration, painterly artwork, glossy 3D art, or anime-style portrait.

        Output only the portrait illustration itself.
    """
    image_file = open(state["reference_image_path"], "rb")
    result = client.images.edit(
        model="gpt-image-2",
        image=image_file,
        prompt=prompt,
        background="transparent",
        output_format="png"
    )
    result.data[0].b64_json
    image_bytes = base64.b64decode(result.data[0].b64_json)
    output_path = "./generated/portrait-output.png"
    with open(output_path, "wb") as f:
        f.write(image_bytes)

    return {"generated_portrait_path": output_path}

def error_handling(state :PortraitState) -> PortraitState:
    return None

graph = StateGraph(PortraitState)

graph.add_node("identify_input_type", identify_input_type)
graph.add_node("generate_from_description", generate_from_description)
graph.add_node("generate_from_image", generate_from_image)
graph.add_node("error_handling", error_handling)

graph.add_edge(START, "identify_input_type")
graph.add_conditional_edges(
    "identify_input_type",
    route_input_type,
    {
        "description": "generate_from_description",
        "image": "generate_from_image",
        "invalid": "error_handling"
    }
)
graph.add_edge("generate_from_description", END)
graph.add_edge("generate_from_image", END)
graph.add_edge("error_handling", END)

app = graph.compile()

# with open("portrait-graph.png", "wb") as f:
#     f.write(app.get_graph().draw_mermaid_png())

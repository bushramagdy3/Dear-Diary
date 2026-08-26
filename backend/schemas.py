from pydantic import BaseModel
from typing import List

class Person(BaseModel):
    id :int
    name :str
    relationship :str
    is_user :bool
    image :str

class illustrationsGenrateRequest(BaseModel):
    prompt :str
    people :List[Person]

class portraitGenrateRequest(BaseModel):
    description: str | None
    reference_image_path: str | None
from pydantic import BaseModel
from typing import List

class Person(BaseModel):
    id :str
    name :str
    relationship :str
    is_user :bool
    portraitBlob :str

class illustrationsGenrateRequest(BaseModel):
    prompt :str
    people :List[Person]

class portraitGenrateRequest(BaseModel):
    description: str | None
    reference_image_path: str | None
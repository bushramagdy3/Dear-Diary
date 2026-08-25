from pydantic_settings import BaseSettings

class Setting(BaseSettings):
    OPENAI_API_KEY :str

    class Config:
        env_file = '.env'

setting = Setting()


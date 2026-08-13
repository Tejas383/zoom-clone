from fastapi import FastAPI

from .database import Base, engine
from . import models
from .routes.meetings import router as meetings_router

Base.metadata.create_all(bind=engine)
# this creates the tables from the models, if it doesn't exist

app = FastAPI()

app.include_router(meetings_router)
# Now FastAPI knows about the POST /meetings route defined inside meetings.py

@app.get("/")
def root():
    return {"message": "FastAPI is working!"}
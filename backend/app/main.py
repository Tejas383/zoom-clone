from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from . import models
from .routes.meetings import router as meetings_router

from .seed import seed_database

Base.metadata.create_all(bind=engine)
# this creates the tables from the models, if it doesn't exist

app = FastAPI()
seed_database()

app.include_router(meetings_router)
# Now FastAPI knows about the POST /meetings route defined inside meetings.py

app.add_middleware(
    CORSMiddleware,
    # tells fastAPI to allow requestis coming from the next.js frontend
    allow_origins = ["http://localhost:3000"],
    # allows my frontend specifically
    allow_credentials = True,
    # allows creds s.a. cookies, auth info
    allow_methods = ["*"],
    # allows HTTP methods
    allow_headers = ["*"],
    # allows normal request headers
)

@app.get("/")
def root():
    return {"message": "FastAPI is working!"}

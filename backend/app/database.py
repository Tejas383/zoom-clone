# Handles 4 purposes:

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./zoom.db"
# 1. points SQLAlchemy to backend/zoom.db (location of SQLite)

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)
# 2. creates database connection to SQLite

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
# 3. factory for creating database sessions
# allows api routes to interact with db

Base = declarative_base()
# 4. parent class for future SQLAlchemy models
# creates the base class for models
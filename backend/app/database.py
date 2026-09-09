# Handles 4 purposes:

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./zoom.db"
# 1. points SQLAlchemy to backend/zoom.db (location of SQLite)

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
    # allow the transaction to be used accross different theads
)
# 2. creates database connection to SQLite

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
    # use this engine to communicate with the db
)
# 3. factory for creating database sessions
# allows api routes to interact with db
# creates a new local session

Base = declarative_base()
# 4. parent class for future SQLAlchemy models
# creates the base class that SQLAlchemy uses to identify and manage the ORM models

# manages the lifecycle of a session
def get_db():
    db = SessionLocal()
    # create a session
    try:
        yield db
        # pause the fn and give a value back temporarily
    finally:
        db.close()
        # closing the session (executes even if sth goes wrong while handlling the request)
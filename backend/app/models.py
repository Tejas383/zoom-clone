# Meeting Model
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from .database import Base

# Basee -> comes from database.py
class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    scheduled_at = Column(DateTime, nullable=False)
    duration = Column(Integer, nullable=False)
    invite_link = Column(String, nullable=False)
    status = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False)

# Participant Model
class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False)
    display_name = Column(String, nullable=False)
    joined_at = Column(DateTime, nullable=False)
    left_at = Column(DateTime)
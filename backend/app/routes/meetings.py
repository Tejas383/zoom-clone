from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import secrets
from datetime import datetime

from ..database import get_db
from ..schemas import MeetingCreate, MeetingResponse, ParticipantCreate, ParticipantResponse
from ..models import Meeting, Participant

router = APIRouter()

@router.post("/meetings", response_model=MeetingResponse)
# format the response from this request using MeetingResponse (schema)
def create_meeting(
    meeting: MeetingCreate,
    # the meeting param must be a MeetingCreate Object
    db: Session = Depends(get_db)
    # db must be a SQLAlchemy Session
    # before calling the endpoint, run get_db() and return the result to fastAPI
):
    meeting_id = str(secrets.randbelow(900000000) + 100000000)
    # produces a random number between 100000000 and 999999999
    # exactly 9 digits

    while db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first():
        meeting_id = str(secrets.randbelow(900000000) + 100000000)

    invite_link = f"http://localhost:3000/meeting/{meeting_id}"

    meeting_db = Meeting(
        meeting_id = meeting_id,
        title = meeting.title,
        description = meeting.description,
        scheduled_at = meeting.scheduled_at,
        duration = meeting.duration,
        invite_link = invite_link,
        status = "scheduled",
        created_at = datetime.now()
    )

    db.add(meeting_db)
    # adds the new meeting object to the sqlalchemy session
    db.commit()
    # commits the transaction and permanently saves it to the db
    db.refresh(meeting_db)
    # make sure this Python object has the latest values from the database
    return meeting_db

@router.get("/meetings", response_model=list[MeetingResponse])
# the endpoint returns multiple meetings (list), each following the MeetingResponse schema
def get_meetings(
    db: Session = Depends(get_db)
):
    meetings = db.query(Meeting).all()
    return meetings

@router.get("/meetings/{meeting_id}", response_model=MeetingResponse)
def get_meeting(
    meeting_id: str,
    db: Session = Depends(get_db)
):
    meeting_db = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
    if meeting_db is None:
        raise HTTPException(
            status_code = 404,
            detail = "Meeting not found"
        )
    return meeting_db

@router.post("/meetings/{meeting_id}/join", response_model=ParticipantResponse)
def join_meeting(
    meeting_id: str,
    participant: ParticipantCreate,
    db: Session = Depends(get_db)
):
    meeting_db = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
    if meeting_db is None:
        raise HTTPException(
            status_code = 404,
            detail = "Meeting not found"
        )

    participant_db = Participant(
        meeting_id = meeting_db.id,
        display_name = participant.display_name,
        joined_at = datetime.now(),
        left_at = None
    )
    db.add(participant_db)
    db.commit()
    db.refresh(participant_db)
    return participant_db
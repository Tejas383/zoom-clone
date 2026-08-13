from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import secrets
from datetime import datetime

from ..database import get_db
from ..schemas import MeetingCreate, MeetingResponse
from ..models import Meeting

router = APIRouter()

@router.post("/meetings", response_model=MeetingResponse)
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
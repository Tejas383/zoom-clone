from datetime import datetime, timedelta

from .database import SessionLocal, engine, Base
from .models import Meeting

Base.metadata.create_all(bind=engine)


def seed_database():
    db = SessionLocal()

    try:
        if db.query(Meeting).first():
            print("Database already contains meetings.")
            return

        now = datetime.now()

        meetings = [
            Meeting(
                meeting_id="123456789",
                title="Team Standup",
                description="Daily project team meeting",
                scheduled_at=now + timedelta(hours=2),
                duration=30,
                invite_link="http://localhost:3000/meeting/123456789",
                status="scheduled",
                created_at=now,
            ),
            Meeting(
                meeting_id="234567890",
                title="Project Discussion",
                description="Discuss upcoming project milestones",
                scheduled_at=now + timedelta(days=1),
                duration=60,
                invite_link="http://localhost:3000/meeting/234567890",
                status="scheduled",
                created_at=now,
            ),
            Meeting(
                meeting_id="345678901",
                title="Sprint Review",
                description="Review completed sprint work",
                scheduled_at=now - timedelta(days=1),
                duration=45,
                invite_link="http://localhost:3000/meeting/345678901",
                status="completed",
                created_at=now - timedelta(days=2),
            ),
        ]

        db.add_all(meetings)
        db.commit()

        print("Sample meetings added successfully.")

    finally:
        db.close()
from datetime import datetime, timedelta

from .database import SessionLocal, engine, Base
from .models import Meeting

Base.metadata.create_all(bind=engine)

db = SessionLocal()


def seed_database():
    now = datetime.now()

    meetings = [
        # Upcoming meetings
        Meeting(
            meeting_id="123456789",
            title="Team Standup",
            description="Daily project team meeting",
            scheduled_at=now + timedelta(hours=1),
            duration=30,
            invite_link="http://localhost:3000/meeting/123456789",
            status="scheduled",
            created_at=now,
        ),

        Meeting(
            meeting_id="234567890",
            title="Project Discussion",
            description="Discuss upcoming project milestones",
            scheduled_at=now + timedelta(hours=3),
            duration=60,
            invite_link="http://localhost:3000/meeting/234567890",
            status="scheduled",
            created_at=now,
        ),

        Meeting(
            meeting_id="345678901",
            title="Frontend Development",
            description="Discuss frontend implementation and UI improvements",
            scheduled_at=now + timedelta(hours=5),
            duration=45,
            invite_link="http://localhost:3000/meeting/345678901",
            status="scheduled",
            created_at=now,
        ),

        Meeting(
            meeting_id="456789012",
            title="Backend API Review",
            description="Review FastAPI endpoints and database integration",
            scheduled_at=now + timedelta(days=1),
            duration=60,
            invite_link="http://localhost:3000/meeting/456789012",
            status="scheduled",
            created_at=now,
        ),

        Meeting(
            meeting_id="567890123",
            title="Database Design Meeting",
            description="Review database schema and relationships",
            scheduled_at=now + timedelta(days=1, hours=3),
            duration=45,
            invite_link="http://localhost:3000/meeting/567890123",
            status="scheduled",
            created_at=now,
        ),

        Meeting(
            meeting_id="678901234",
            title="Sprint Planning",
            description="Plan tasks and deliverables for the next sprint",
            scheduled_at=now + timedelta(days=2),
            duration=60,
            invite_link="http://localhost:3000/meeting/678901234",
            status="scheduled",
            created_at=now,
        ),

        Meeting(
            meeting_id="789012345",
            title="Design Review",
            description="Review the latest dashboard and meeting room designs",
            scheduled_at=now + timedelta(days=3),
            duration=45,
            invite_link="http://localhost:3000/meeting/789012345",
            status="scheduled",
            created_at=now,
        ),

        Meeting(
            meeting_id="890123456",
            title="Weekly Team Meeting",
            description="Weekly discussion about project progress",
            scheduled_at=now + timedelta(days=4),
            duration=60,
            invite_link="http://localhost:3000/meeting/890123456",
            status="scheduled",
            created_at=now,
        ),

        Meeting(
            meeting_id="901234567",
            title="Client Presentation",
            description="Present the latest project progress to the client",
            scheduled_at=now + timedelta(days=5),
            duration=90,
            invite_link="http://localhost:3000/meeting/901234567",
            status="scheduled",
            created_at=now,
        ),

        Meeting(
            meeting_id="912345678",
            title="Team Retrospective",
            description="Discuss what went well and what can be improved",
            scheduled_at=now + timedelta(days=7),
            duration=45,
            invite_link="http://localhost:3000/meeting/912345678",
            status="scheduled",
            created_at=now,
        ),

        # Recent / completed meetings
        Meeting(
            meeting_id="812345678",
            title="Sprint Review",
            description="Review completed sprint work",
            scheduled_at=now - timedelta(hours=2),
            duration=45,
            invite_link="http://localhost:3000/meeting/812345678",
            status="completed",
            created_at=now - timedelta(hours=5),
        ),

        Meeting(
            meeting_id="712345678",
            title="Code Review",
            description="Review recently submitted code changes",
            scheduled_at=now - timedelta(hours=6),
            duration=30,
            invite_link="http://localhost:3000/meeting/712345678",
            status="completed",
            created_at=now - timedelta(hours=8),
        ),

        Meeting(
            meeting_id="612345678",
            title="Project Kickoff",
            description="Initial project planning and team introduction",
            scheduled_at=now - timedelta(days=1),
            duration=60,
            invite_link="http://localhost:3000/meeting/612345678",
            status="completed",
            created_at=now - timedelta(days=2),
        ),

        Meeting(
            meeting_id="512345678",
            title="Requirements Gathering",
            description="Discuss project requirements and expected features",
            scheduled_at=now - timedelta(days=2),
            duration=60,
            invite_link="http://localhost:3000/meeting/512345678",
            status="completed",
            created_at=now - timedelta(days=3),
        ),

        Meeting(
            meeting_id="412345678",
            title="Architecture Discussion",
            description="Discuss application architecture and technology choices",
            scheduled_at=now - timedelta(days=4),
            duration=90,
            invite_link="http://localhost:3000/meeting/412345678",
            status="completed",
            created_at=now - timedelta(days=5),
        ),
    ]

        existing_ids = {
            meeting.meeting_id
            for meeting in db.query(Meeting).all()
        }

        new_meetings = [
            meeting
            for meeting in meetings
            if meeting.meeting_id not in existing_ids
        ]

        if new_meetings:
            db.add_all(new_meetings)
            db.commit()

        print(f"Added {len(new_meetings)} new seed meetings.")


seed_database()

db.close()
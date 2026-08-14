# Zoom Clone — Video Conferencing Platform

A full-stack **Zoom web application clone** built as an SDE Fullstack Assignment. The application provides a modern Zoom-inspired interface for creating, joining, and scheduling meetings.

## 🚀 Live Application

**Frontend:**
https://zoom-clone-2-mu.vercel.app

**Backend API:**
https://zoom-clone-mwuv.onrender.com

**API Documentation:**
https://zoom-clone-mwuv.onrender.com/docs

## 📂 GitHub Repository

Add your public GitHub repository URL here:

https://github.com/Tejas383/zoom-clone

---

## ✨ Features

### Dashboard

- Zoom-inspired landing dashboard
- Upcoming meetings
- Recent meetings
- New Meeting
- Join Meeting
- Schedule Meeting

### Instant Meetings

- Create a meeting instantly
- Automatically generate a unique Meeting ID
- Generate a shareable meeting link
- Redirect the host to the meeting room

### Join Meetings

- Join using a Meeting ID
- Join using an invite link
- Enter a display name before joining
- Validate whether the requested meeting exists
- Display appropriate errors for invalid meetings

### Schedule Meetings

- Set meeting title
- Add meeting description
- Select date and time
- Set meeting duration
- Automatically generate a meeting ID and invite link
- Store scheduled meetings in the database
- Display scheduled meetings in the Upcoming Meetings section

### Meeting Room

- Meeting information display
- Participant display name
- Join/leave meeting workflow
- Meeting status handling

---

## 🛠️ Tech Stack

### Frontend

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**

### Backend

- **Python**
- **FastAPI**
- **Pydantic**
- **Uvicorn**

### Database

- **SQLite**

### Deployment

- **Vercel** — Frontend
- **Render** — Backend

---

## 🏗️ Project Architecture

The application follows a client-server architecture.

```text
                    ┌─────────────────────┐
                    │      Next.js        │
                    │     Frontend        │
                    │      Vercel         │
                    └──────────┬──────────┘
                               │
                         REST API / HTTP
                               │
                               ▼
                    ┌─────────────────────┐
                    │      FastAPI        │
                    │      Backend        │
                    │       Render        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       SQLite        │
                    │      Database       │
                    └─────────────────────┘
```

The frontend communicates with the FastAPI backend through REST API endpoints. Meeting data is persisted in SQLite.

---

## 📁 Project Structure

### Frontend

```text
frontend
├── app
│   ├── components
│   │   └── Dashboard.tsx
│   ├── join
│   │   └── page.tsx
│   ├── lib
│   │   └── api.ts
│   ├── meeting
│   │   └── [meetingId]
│   │       ├── JoinMeeting.tsx
│   │       ├── LeaveMeeting.tsx
│   │       └── page.tsx
│   ├── page.tsx
│   └── schedule
│       └── page.tsx
├── bun.lock
└── README.md

```

### Backend

```text
backend
├── app
│   ├── __init__.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── routes
│   │   ├── __init__.py
│   │   └── meetings.py
│   ├── schemas.py
│   └── seed.py
└── requirements.txt
```

---

## 🗄️ Database Design

SQLite is used as the application's database.

The meeting data contains information such as:

| Field          | Description                |
| -------------- | -------------------------- |
| `id`           | Primary key                |
| `meeting_id`   | Unique meeting identifier  |
| `title`        | Meeting title              |
| `description`  | Meeting description        |
| `scheduled_at` | Scheduled date and time    |
| `duration`     | Meeting duration           |
| `invite_link`  | Shareable meeting URL      |
| `status`       | Meeting status             |
| `created_at`   | Meeting creation timestamp |

The `meeting_id` is used to identify meetings when users join through a meeting ID or invite link.

Sample meeting data is seeded into the database for demonstration purposes.

---

## 🔌 API Overview

The backend exposes FastAPI for meeting management.

### Meetings

| Method | Endpoint                      | Purpose                       |
| ------ | ----------------------------- | ----------------------------- |
| `GET`  | `/meetings`                   | Retrieve meetings             |
| `POST` | `/meetings`                   | Create a meeting              |
| `POST` | `/meetings/{meeting_id}/join` | Join a meeting                |
| `...`  | `...`                         | Additional meeting operations |

The complete API specification can be explored through FastAPI Swagger documentation:

https://zoom-clone-mwuv.onrender.com/docs

---

## ⚙️ Local Setup

### Prerequisites

Make sure the following are installed:

- Node.js
- bun
- Python 3
- Git

---

### 1. Clone the repository

```bash
git clone https://github.com/Tejas383/zoom-clone
cd zoom-clone
```

---

### 2. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
bun install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the development server:

```bash
bun dev
```

The frontend will normally be available at:

```text
http://localhost:3000
```

---

### 3. Backend Setup

Open another terminal and navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python3 -m venv venv
```

Activate it on macOS/Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will normally run at:

```text
http://localhost:8000
```

Swagger API documentation will be available at:

```text
http://localhost:8000/docs
```

---

## 🌱 Database Seeding

The application includes sample meeting data for demonstration.

Run the project's seed process from the backend directory according to the provided seed script.

The seeded meetings allow the dashboard and meeting workflows to be tested immediately after setup.

---

## 🔐 Environment Variables

### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production deployment, this variable points to the deployed FastAPI backend.

Example:

```env
NEXT_PUBLIC_API_URL=https://zoom-clone-mwuv.onrender.com
```

No authentication credentials are required because the assignment specifies that a default user can be assumed.

---

## 🚀 Deployment

### Frontend — Vercel

The Next.js frontend is deployed using Vercel.

The production frontend communicates with the deployed FastAPI backend through the `NEXT_PUBLIC_API_URL` environment variable.

### Backend — Render

The FastAPI backend is deployed using Render.

The backend provides the REST API consumed by the Next.js frontend.

---

## 🧪 Testing the Application

The following workflows should be tested:

### Create Meeting

1. Open the dashboard.
2. Click **New Meeting**.
3. A unique Meeting ID is generated.
4. The application redirects to the meeting room.

### Join Meeting

1. Select **Join Meeting**.
2. Enter a valid Meeting ID.
3. Enter a display name.
4. Join the meeting.

### Invalid Meeting

1. Enter a non-existent Meeting ID.
2. The backend validates the meeting.
3. An appropriate error is displayed.

### Schedule Meeting

1. Select **Schedule Meeting**.
2. Enter title and description.
3. Select date and time.
4. Set the duration.
5. Create the meeting.
6. The meeting appears in **Upcoming Meetings**.

---

## 🎯 Design & UX

The UI is designed to resemble the modern Zoom web experience, including:

- Minimal professional layout
- Meeting-focused dashboard
- Clear primary actions
- Meeting cards
- Navigation controls
- Meeting room workflow
- Responsive layout

The implementation was created specifically for this assignment rather than being copied from an existing repository.

---

## 📌 Assumptions

- Authentication is not implemented because the assignment explicitly allows assuming a default logged-in user.
- SQLite is used as required by the assignment.
- Meeting IDs are generated by the backend and uniquely identify meetings.
- The application focuses on the core meeting creation, joining, scheduling, and management workflows specified in the assignment.
- Advanced authentication and host controls are considered optional bonus features.

---

## 🔮 Future Improvements

Possible future enhancements include:

- User authentication and authorization
- Real-time video/audio using WebRTC
- Real-time participant synchronization
- Host controls
- Mute/unmute controls
- Participant removal
- Screen sharing
- Chat
- Meeting history per user
- Persistent user profiles
- Production database such as PostgreSQL

---

## 👨‍💻 Author

**Tejasvita**

Built as part of an **SDE Fullstack Assignment**.

### Technologies

`Next.js` · `React` · `TypeScript` · `Tailwind CSS` · `FastAPI` · `Python` · `SQLite`

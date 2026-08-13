export type Meeting = {
  id: number;
  meeting_id: string;
  title: string;
  description: string;
  scheduled_at: string;
  duration: number;
  invite_link: string;
  status: string;
  created_at: string;
};

export async function getMeetings(): Promise<Meeting[]> {
  const response = await fetch("http://localhost:8000/meetings");

  return response.json();
}

export async function getMeeting(meetingId: string): Promise<Meeting> {
  const response = await fetch(
    `http://localhost:8000/meetings/${meetingId}`
  );

  if (!response.ok) {
    throw new Error("Meeting not found");
  }

  return response.json();
}

export async function joinMeeting(
  meetingId: string,
  displayName: string
) {
  const response = await fetch(
    `http://localhost:8000/meetings/${meetingId}/join`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        display_name: displayName,
      }),
    }
  );

  return response.json();
}

export async function getParticipants(meetingId: string) {
  const response = await fetch(
    `http://localhost:8000/meetings/${meetingId}/participants`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch participants");
  }

  return response.json();
}

export async function leaveMeeting(
  meetingId: string,
  displayName: string
) {
  const response = await fetch(
    `http://localhost:8000/meetings/${meetingId}/leave`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        display_name: displayName,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to leave meeting");
  }

  return response.json();
}

export async function createInstantMeeting() {
  const response = await fetch(
    "http://localhost:8000/meetings/instant",
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create instant meeting");
  }

  return response.json();
}

export async function createMeeting(meeting: {
  title: string;
  description?: string;
  scheduled_at: string;
  duration: number;
}) {
  console.log("Sending meeting:", meeting);

  const response = await fetch(
    "http://localhost:8000/meetings",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(meeting),
    }
  );

  console.log("Status:", response.status);

  const data = await response.json();

  console.log("Backend response:", data);

  if (!response.ok) {
    throw new Error("Failed to create meeting");
  }

  return data;
}
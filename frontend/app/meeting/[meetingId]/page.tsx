import { getMeeting } from "@/app/lib/api";
import JoinMeeting from "./JoinMeeting";

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ meetingId: string }>;
}) {
  const { meetingId } = await params;

  const meeting = await getMeeting(meetingId);

  return (
    <div>
      <h1>Meeting Room</h1>
      <h2>{meeting.title}</h2>
      <p>Meeting ID: {meeting.meeting_id}</p>
      <p>{meeting.description}</p>
      <p>Status: {meeting.status}</p>

      {meeting.status !== "ended" && <JoinMeeting meetingId={meetingId} />}

      {meeting.status === "ended" && <p>This meeting has ended.</p>}
    </div>
  );
}

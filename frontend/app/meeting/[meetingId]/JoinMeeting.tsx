"use client";

import { useState } from "react";
import { joinMeeting, getParticipants, leaveMeeting } from "@/app/lib/api";

export default function JoinMeeting({ meetingId }: { meetingId: string }) {
  const [displayName, setDisplayName] = useState("");
  const [joined, setJoined] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);

  const handleJoin = async () => {
    await joinMeeting(meetingId, displayName);

    const data = await getParticipants(meetingId);
    setParticipants(data);

    setJoined(true);
  };

  const handleLeave = async () => {
    await leaveMeeting(meetingId, displayName);
    setJoined(false);
  };

  return (
    <div>
      <input
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Enter your name"
      />

      <button onClick={handleJoin}>Join Meeting</button>

      {joined && (
        <div>
          <p>Joined successfully!</p>

          <button onClick={handleLeave}>Leave Meeting</button>
        </div>
      )}

      {joined && (
        <div>
          <h3>Participants</h3>

          {participants.map((participant) => (
            <p key={participant.id}>{participant.display_name}</p>
          ))}
        </div>
      )}
    </div>
  );
}

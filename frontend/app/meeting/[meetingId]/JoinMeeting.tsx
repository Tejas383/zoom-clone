"use client";

import { useState } from "react";
import { joinMeeting, getParticipants, leaveMeeting } from "@/app/lib/api";
import { useSearchParams } from "next/navigation";

export default function JoinMeeting({ meetingId }: { meetingId: string }) {
  const searchParams = useSearchParams();

  const nameFromUrl = searchParams.get("name") || "";

  const [displayName, setDisplayName] = useState(nameFromUrl);
  const [joined, setJoined] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);

  const handleJoin = async () => {
    if (!displayName.trim()) {
      return;
    }

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
    <div className="mt-8">
      {!joined && (
        <div className="max-w-md bg-white border rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">
            Join this meeting
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Enter your name before joining the meeting.
          </p>

          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your name"
            className="mt-5 w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            onClick={handleJoin}
            className="mt-4 w-full rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 transition"
          >
            Join Meeting
          </button>
        </div>
      )}

      {joined && (
        <div className="max-w-md bg-white border rounded-2xl p-6 shadow-sm">
          <p className="text-green-600 font-medium">Joined successfully!</p>

          <button
            onClick={handleLeave}
            className="mt-5 rounded-xl bg-gray-100 px-5 py-3 text-gray-700 font-medium hover:bg-gray-200"
          >
            Leave Meeting
          </button>
        </div>
      )}

      {joined && (
        <div className="mt-6 max-w-md bg-white border rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">Participants</h3>

          <div className="mt-4 space-y-2">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="rounded-lg bg-gray-50 px-4 py-3 text-gray-700"
              >
                {participant.display_name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

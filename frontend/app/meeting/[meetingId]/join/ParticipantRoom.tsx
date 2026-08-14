"use client";

import { useEffect, useState } from "react";
import {
  Meeting,
  Participant,
  getParticipants,
  joinMeeting,
  leaveMeeting,
} from "@/app/lib/api";
import { useRouter } from "next/navigation";
import MeetingShell, {
  EndedNotice,
  Panel,
  Stage,
} from "../MeetingShell";

/** The participant side of a meeting: name preview, then the room. */
export default function ParticipantRoom({
  meeting,
  initialName,
}: {
  meeting: Meeting;
  initialName: string;
}) {
  const router = useRouter();

  const [displayName, setDisplayName] = useState(initialName);
  const [joinedName, setJoinedName] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // The roster is polled only while it is on screen.
  useEffect(() => {
    if (!joinedName || !showParticipants) return;

    let active = true;

    const poll = () => {
      getParticipants(meeting.meeting_id)
        .then((data) => {
          if (active) setParticipants(data);
        })
        .catch(() => {
          // A failed refresh keeps the last known roster on screen.
        });
    };

    poll();

    const timer = setInterval(poll, 5000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [joinedName, showParticipants, meeting.meeting_id]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = displayName.trim();

    if (!name) {
      setError("Please enter your name");
      return;
    }

    setError("");
    setBusy(true);

    try {
      await joinMeeting(meeting.meeting_id, name);

      setJoinedName(name);
    } catch {
      setError("Couldn't join this meeting. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleLeave = async () => {
    setBusy(true);

    try {
      await leaveMeeting(meeting.meeting_id, joinedName);
    } catch {
      // Leaving locally still takes the participant back to the portal.
    }

    router.push("/");
  };

  if (meeting.status === "ended") {
    return <EndedNotice onBack={() => router.push("/")} />;
  }

  // Preview screen — the participant picks a name before entering the room.
  if (!joinedName) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0b0f] px-6 text-white">
        <div className="w-[420px] rounded-2xl border border-white/10 bg-[#111116] p-8">
          <div className="text-3xl font-bold text-blue-500">zoom</div>

          <h1 className="mt-6 text-2xl font-semibold">{meeting.title}</h1>

          <p className="mt-2 text-sm text-gray-400">
            Meeting ID: {meeting.meeting_id}
          </p>

          <form onSubmit={handleJoin} className="mt-8">
            <label className="block text-sm text-gray-300" htmlFor="name">
              Your Name
            </label>

            <input
              id="name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              className="mt-2 h-11 w-full rounded-lg border border-white/15 bg-[#18181d] px-3 text-base outline-none placeholder:text-gray-500 focus:border-blue-500"
            />

            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="mt-6 h-11 w-full rounded-lg bg-blue-600 text-base font-medium transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Joining…" : "Join"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/join")}
              className="mt-3 h-10 w-full rounded-lg text-sm text-gray-400 transition hover:text-white"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <MeetingShell
      meeting={meeting}
      role="Participant"
      participantsOpen={showParticipants}
      onToggleParticipants={() => setShowParticipants((open) => !open)}
      controls={
        <button
          onClick={handleLeave}
          disabled={busy}
          className="h-12 rounded-full bg-red-600 px-6 font-medium transition hover:bg-red-700 disabled:opacity-60"
        >
          Leave
        </button>
      }
    >
      <Stage
        meeting={meeting}
        name={joinedName}
        caption="Your video will appear here"
      />

      {showParticipants && (
        <div className="mt-6">
          <Panel
            title="Participants"
            action={
              <span className="text-sm text-gray-400">
                {participants.length}
              </span>
            }
          >
            <div className="space-y-2">
              {participants.length === 0 ? (
                <p className="text-sm text-gray-400">No one else has joined.</p>
              ) : (
                participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 text-sm"
                  >
                    <span>{participant.display_name}</span>

                    {participant.left_at && (
                      <span className="text-xs text-gray-500">Left</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </Panel>
        </div>
      )}
    </MeetingShell>
  );
}

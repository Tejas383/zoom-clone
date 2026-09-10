"use client";

import { useEffect, useState } from "react";
import {
  Meeting,
  Participant,
  getParticipants,
  toggleMuteParticipant,
  muteAllParticipants,
  removeParticipant,
} from "@/app/lib/api";
import { useRouter } from "next/navigation";
import MeetingShell, { EndedNotice, Panel, Stage } from "../MeetingShell";

const HOST_NAME = "Tejasvita";

/** The host side of a meeting: no name prompt, plus invite and roster tools. */
export default function HostRoom({
  meeting,
  instant,
}: {
  meeting: Meeting;
  instant: boolean;
}) {
  const router = useRouter();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [copied, setCopied] = useState(false);

  // The host watches the roster fill up, but only while it is on screen.
  useEffect(() => {
    if (!showParticipants) return;

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
  }, [showParticipants, meeting.meeting_id]);

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(meeting.invite_link);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (meeting.status === "ended") {
    return <EndedNotice onBack={() => router.push("/")} />;
  }

  const handleToggleMute = async (participantId: number) => {
    try {
      const updatedParticipant = await toggleMuteParticipant(
        meeting.meeting_id,
        participantId,
      );

      setParticipants((current) =>
        current.map((participant) =>
          participant.id === participantId ? updatedParticipant : participant,
        ),
      );
    } catch {
      // Keep the current roster if the request fails.
    }
  };

  const handleMuteAll = async () => {
    try {
      const updatedParticipants = await muteAllParticipants(meeting.meeting_id);

      setParticipants(updatedParticipants);
    } catch {
      // Keep the current roster if the request fails.
    }
  };

  const handleRemove = async (participantId: number) => {
    try {
      const updatedParticipant = await removeParticipant(
        meeting.meeting_id,
        participantId,
      );

      setParticipants((current) =>
        current.map((participant) =>
          participant.id === participantId ? updatedParticipant : participant,
        ),
      );
    } catch {
      // Keep the current roster if the request fails.
    }
  };

  return (
    <MeetingShell
      meeting={meeting}
      role="Host"
      participantsOpen={showParticipants}
      onToggleParticipants={() => setShowParticipants((open) => !open)}
      controls={
        <button
          onClick={() => router.push("/")}
          className="h-12 rounded-full bg-red-600 px-6 font-medium transition hover:bg-red-700"
        >
          End
        </button>
      }
    >
      {/* An instant meeting has no invitees yet, so its link leads the room. */}
      {instant && (
        <div className="mb-6">
          <Panel
            title="Invite others"
            action={
              <button
                onClick={handleCopyInvite}
                className="rounded-lg bg-[#29292f] px-4 py-2 text-sm font-medium transition hover:bg-[#35353c]"
              >
                {copied ? "Copied" : "Copy link"}
              </button>
            }
          >
            <p className="truncate rounded-lg bg-white/5 px-4 py-3 text-sm text-gray-300">
              {meeting.invite_link}
            </p>

            <p className="mt-3 text-sm text-gray-400">
              Or share Meeting ID{" "}
              <span className="font-medium text-white">
                {meeting.meeting_id}
              </span>
            </p>
          </Panel>
        </div>
      )}

      <Stage
        meeting={meeting}
        name={HOST_NAME}
        caption="You are hosting this meeting"
      />

      {showParticipants && (
        <div className="mt-6">
          <Panel
            title="Participants"
            action={
              <span className="text-sm text-gray-400">
                {participants.length + 1}
              </span>
            }
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 text-sm">
                <span>{HOST_NAME}</span>

                <span className="text-xs text-blue-400">Host</span>
              </div>

              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span>{participant.display_name}</span>

                    {participant.state === "muted" && (
                      <span className="text-xs text-gray-500">Muted</span>
                    )}

                    {participant.state === "removed" && (
                      <span className="text-xs text-red-400">Removed</span>
                    )}

                    {participant.left_at && participant.state !== "removed" && (
                      <span className="text-xs text-gray-500">Left</span>
                    )}
                  </div>

                  {!participant.left_at && participant.state !== "removed" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleMute(participant.id)}
                        className="rounded-lg bg-[#29292f] px-3 py-1.5 text-xs font-medium transition hover:bg-[#35353c]"
                      >
                        {participant.state === "muted" ? "Unmute" : "Mute"}
                      </button>

                      <button
                        onClick={() => handleRemove(participant.id)}
                        className="rounded-lg bg-red-600/80 px-3 py-1.5 text-xs font-medium transition hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {participants.length === 0 && (
                <p className="text-sm text-gray-400">
                  Waiting for participants to join.
                </p>
              )}

              {participants.some(
                (participant) =>
                  !participant.left_at && participant.state !== "removed",
              ) && (
                <button
                  onClick={handleMuteAll}
                  className="mt-2 w-full rounded-lg bg-[#29292f] px-4 py-3 text-sm font-medium transition hover:bg-[#35353c]"
                >
                  Mute All
                </button>
              )}
            </div>
          </Panel>
        </div>
      )}
    </MeetingShell>
  );
}

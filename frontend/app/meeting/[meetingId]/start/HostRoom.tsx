"use client";

import { useEffect, useState } from "react";
import { Meeting, Participant, getParticipants } from "@/app/lib/api";
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
                  <span>{participant.display_name}</span>

                  {participant.left_at && (
                    <span className="text-xs text-gray-500">Left</span>
                  )}
                </div>
              ))}

              {participants.length === 0 && (
                <p className="text-sm text-gray-400">
                  Waiting for participants to join.
                </p>
              )}
            </div>
          </Panel>
        </div>
      )}
    </MeetingShell>
  );
}

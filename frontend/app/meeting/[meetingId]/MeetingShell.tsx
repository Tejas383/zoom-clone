"use client";

import { useEffect, useRef, useState } from "react";
import { Meeting } from "@/app/lib/api";

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>

      <p className="mt-1 text-sm break-words text-gray-200">{value}</p>
    </div>
  );
}

/** The header title doubles as the handle for the full meeting details. */
function MeetingTitle({ meeting }: { meeting: Meeting }) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  // Anything outside the details card — a click or Escape — puts it away.
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={wrapper}>
      <button
        onClick={() => setOpen((shown) => !shown)}
        aria-expanded={open}
        title="Meeting details"
        className="-mx-2 flex items-center gap-2 rounded-lg px-2 py-1 text-left transition hover:bg-white/5"
      >
        <span>
          <h1 className="text-sm font-medium">{meeting.title}</h1>

          <p className="text-xs text-gray-400">
            Meeting ID: {meeting.meeting_id}
          </p>
        </span>

        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className={`h-3 w-3 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="M5.5 7.5 10 12l4.5-4.5H5.5Z" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-20 mt-2 w-[360px] rounded-2xl border border-white/10 bg-[#111116] p-6 shadow-2xl">
          <h2 className="text-lg font-semibold">Meeting details</h2>

          <div className="mt-4 space-y-4">
            <Detail label="Title" value={meeting.title} />

            <Detail
              label="Description"
              value={meeting.description || "No description"}
            />

            <Detail label="Meeting ID" value={meeting.meeting_id} />

            <Detail
              label="Date and time"
              value={formatDateTime(meeting.scheduled_at)}
            />

            <Detail label="Duration" value={`${meeting.duration} minutes`} />

            <Detail label="Status" value={meeting.status} />

            <Detail label="Invite link" value={meeting.invite_link} />

            <Detail label="Created" value={formatDateTime(meeting.created_at)} />
          </div>
        </div>
      )}
    </div>
  );
}

/** Dark in-meeting chrome. The host and participant rooms fill it differently. */
export default function MeetingShell({
  meeting,
  role,
  controls,
  participantsOpen,
  onToggleParticipants,
  children,
}: {
  meeting: Meeting;
  role: "Host" | "Participant";
  controls: React.ReactNode;
  participantsOpen: boolean;
  onToggleParticipants: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0b0b0f] text-white">
      <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#111116] px-6">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold text-blue-500">zoom</div>

          <div className="h-6 w-px bg-white/20" />

          <MeetingTitle meeting={meeting} />
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
            {role}
          </span>

          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
            {meeting.status}
          </span>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700">
            {role === "Host" ? "H" : "P"}
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center p-8">
        <div className="w-full max-w-6xl">{children}</div>
      </main>

      <footer className="flex h-20 items-center justify-center border-t border-white/10 bg-[#111116]">
        <div className="flex items-center gap-4">
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#29292f] transition hover:bg-[#35353c]">
            🎤
          </button>

          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#29292f] transition hover:bg-[#35353c]">
            📹
          </button>

          {controls}

          {/* The roster stays hidden until the host or participant asks for it. */}
          <button
            onClick={onToggleParticipants}
            aria-pressed={participantsOpen}
            title="Participants"
            className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
              participantsOpen
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-[#29292f] hover:bg-[#35353c]"
            }`}
          >
            👥
          </button>

          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#29292f] transition hover:bg-[#35353c]">
            ⋯
          </button>
        </div>
      </footer>
    </div>
  );
}

/** The video tile the local user sees while the clone has no real media. */
export function Stage({
  meeting,
  name,
  caption,
}: {
  meeting: Meeting;
  name: string;
  caption: string;
}) {
  return (
    <div className="relative flex min-h-[500px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#18181d]">
      <div className="text-center">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gray-700 text-4xl font-semibold">
          {name.trim().charAt(0).toUpperCase() || "?"}
        </div>

        <h2 className="mt-5 text-xl font-medium">{name}</h2>

        <p className="mt-2 text-sm text-gray-400">{caption}</p>
      </div>

      <div className="absolute top-5 left-5 rounded-lg bg-black/50 px-4 py-2 backdrop-blur-sm">
        <p className="text-sm font-medium">{meeting.title}</p>

        <p className="mt-1 text-xs text-gray-400">{meeting.duration} minutes</p>
      </div>

      <div className="absolute top-5 right-5 flex items-center gap-2 rounded-lg bg-black/50 px-3 py-2 backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-green-500" />

        <span className="text-xs text-gray-300">Meeting active</span>
      </div>
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#111116] p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">{title}</h2>

        {action}
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Shown instead of a room once a meeting's scheduled window has passed. */
export function EndedNotice({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0b0f] px-6 text-white">
      <div className="w-[420px] rounded-2xl border border-white/10 bg-[#111116] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
          <span className="text-xl text-red-400">×</span>
        </div>

        <h1 className="mt-4 text-xl font-semibold">This meeting has ended</h1>

        <p className="mt-2 text-sm text-gray-400">
          This meeting is no longer available.
        </p>

        <button
          onClick={onBack}
          className="mt-6 rounded-lg bg-[#29292f] px-5 py-2.5 text-sm font-medium transition hover:bg-[#35353c]"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

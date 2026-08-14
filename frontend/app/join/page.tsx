"use client";

import { useState } from "react";
import { getMeeting } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { ZOOM } from "@/app/lib/theme";
import PortalHeader from "@/app/components/PortalHeader";
import PortalFooter from "@/app/components/PortalFooter";

const fieldClass =
  "h-11 w-full rounded-lg border px-3 text-base outline-none placeholder:text-[#9b9ba3] focus:border-[#0b5cff] focus:ring-2 focus:ring-[#0b5cff]/15";

export default function JoinPage() {
  const router = useRouter();

  const [meetingId, setMeetingId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!meetingId || !displayName) {
      setError("Please enter Meeting ID and your name");
      return;
    }

    setJoining(true);

    try {
      await getMeeting(meetingId);

      router.push(
        `/meeting/${meetingId}/join?name=${encodeURIComponent(displayName)}`,
      );
    } catch {
      setError("Meeting not found");
      setJoining(false);
    }
  };

  return (
    <div
      className="flex min-h-screen min-w-[1280px] flex-col bg-white"
      style={{ color: ZOOM.ink }}
    >
      <PortalHeader />

      <main className="flex flex-1 justify-center px-6 pt-16 pb-24">
        <div className="w-[400px]">
          <h1 className="text-center text-[32px] leading-tight font-medium">
            Join Meeting
          </h1>

          <form onSubmit={handleJoin} className="mt-10 space-y-4">
            <input
              type="text"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder="Meeting ID or Personal Link Name"
              aria-label="Meeting ID or Personal Link Name"
              className={fieldClass}
              style={{ borderColor: ZOOM.field }}
            />

            {/* This clone routes participants by name, so the portal asks for it up front. */}
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your Name"
              aria-label="Your Name"
              className={fieldClass}
              style={{ borderColor: ZOOM.field }}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <p className="pt-2 text-sm" style={{ color: ZOOM.muted }}>
              By clicking &quot;Join&quot;, you agree to our{" "}
              <span className="cursor-pointer" style={{ color: ZOOM.blue }}>
                Terms of Services
              </span>{" "}
              and{" "}
              <span className="cursor-pointer" style={{ color: ZOOM.blue }}>
                Privacy Statement
              </span>
            </p>

            <button
              type="submit"
              disabled={joining}
              className="mt-2 h-11 w-[190px] rounded-lg text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: ZOOM.blue }}
            >
              {joining ? "Joining…" : "Join"}
            </button>
          </form>

          <p className="mt-16 text-sm" style={{ color: ZOOM.muted }}>
            <span className="cursor-pointer" style={{ color: ZOOM.blue }}>
              Join a meeting from an H.323/SIP room system
            </span>
          </p>
        </div>
      </main>

      <PortalFooter />
    </div>
  );
}

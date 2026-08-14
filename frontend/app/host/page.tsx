"use client";

import { useEffect, useMemo, useState } from "react";
import { Meeting, createInstantMeeting, getMeetings } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { ZOOM } from "@/app/lib/theme";
import PortalHeader from "@/app/components/PortalHeader";
import PortalFooter from "@/app/components/PortalFooter";

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** The host entry point: start a new meeting, or start one you scheduled. */
export default function HostPage() {
  const router = useRouter();

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [now, setNow] = useState(0);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let active = true;

    getMeetings()
      .then((data) => {
        if (!active) return;

        setNow(Date.now());
        setMeetings(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!active) return;

        setError("Couldn't load your meetings. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const upcomingMeetings = useMemo(() => {
    const time = (meeting: Meeting) => new Date(meeting.scheduled_at).getTime();

    return meetings
      .filter((meeting) => meeting.status !== "ended" && time(meeting) > now)
      .sort((a, b) => time(a) - time(b));
  }, [meetings, now]);

  const visibleMeetings = showAll
    ? upcomingMeetings
    : upcomingMeetings.slice(0, 3);

  const handleNewMeeting = async () => {
    if (starting) return;

    setStarting(true);

    try {
      const meeting = await createInstantMeeting();

      router.push(`/meeting/${meeting.meeting_id}/start?instant=1`);
    } catch {
      setError("Couldn't start an instant meeting. Please try again.");
      setStarting(false);
    }
  };

  return (
    <div
      className="flex min-h-screen min-w-[1280px] flex-col bg-white"
      style={{ color: ZOOM.ink }}
    >
      <PortalHeader />

      <main className="flex flex-1 justify-center px-6 pt-16 pb-24">
        <div className="w-[520px]">
          <h1 className="text-center text-[32px] leading-tight font-medium">
            Host Meeting
          </h1>

          {error && (
            <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            onClick={handleNewMeeting}
            disabled={starting}
            className="mt-10 h-11 w-full rounded-lg text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: ZOOM.blue }}
          >
            {starting ? "Starting…" : "Start a New Meeting"}
          </button>

          <p className="mt-3 text-sm" style={{ color: ZOOM.muted }}>
            The meeting starts right away and you join as the host.
          </p>

          <div
            className="mt-10 border-t pt-8"
            style={{ borderColor: ZOOM.border }}
          >
            <h2 className="text-lg font-medium">Upcoming Meetings</h2>

            <p className="mt-1 text-sm" style={{ color: ZOOM.muted }}>
              Would you like to start one of these meetings?
            </p>

            <div className="mt-5 space-y-3">
              {loading ? (
                <p className="text-sm" style={{ color: ZOOM.muted }}>
                  Loading your meetings…
                </p>
              ) : upcomingMeetings.length === 0 ? (
                <p className="text-sm" style={{ color: ZOOM.muted }}>
                  You have no upcoming meetings.{" "}
                  <button
                    onClick={() => router.push("/schedule")}
                    className="hover:underline"
                    style={{ color: ZOOM.blue }}
                  >
                    Schedule a meeting
                  </button>
                </p>
              ) : (
                visibleMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between gap-4 rounded-xl border p-4"
                    style={{ borderColor: ZOOM.border }}
                  >
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-medium">
                        {meeting.title}
                      </h3>

                      <p
                        className="mt-1 text-sm"
                        style={{ color: ZOOM.muted }}
                      >
                        {formatDateTime(meeting.scheduled_at)}
                      </p>

                      <p
                        className="mt-1 text-sm"
                        style={{ color: ZOOM.muted }}
                      >
                        Meeting ID: {meeting.meeting_id}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        router.push(`/meeting/${meeting.meeting_id}/start`)
                      }
                      className="shrink-0 rounded-md px-5 py-2 text-sm font-medium text-white"
                      style={{ backgroundColor: ZOOM.blue }}
                    >
                      Start
                    </button>
                  </div>
                ))
              )}

              {!showAll && upcomingMeetings.length > visibleMeetings.length && (
                <button
                  onClick={() => setShowAll(true)}
                  className="text-sm hover:underline"
                  style={{ color: ZOOM.blue }}
                >
                  View more…
                </button>
              )}
            </div>
          </div>

          <p className="mt-10 text-sm" style={{ color: ZOOM.muted }}>
            Want to join someone else&apos;s meeting instead?{" "}
            <button
              onClick={() => router.push("/join")}
              className="hover:underline"
              style={{ color: ZOOM.blue }}
            >
              Join a meeting
            </button>
          </p>
        </div>
      </main>

      <PortalFooter />
    </div>
  );
}

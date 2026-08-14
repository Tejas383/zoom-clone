"use client";

import { useEffect, useMemo, useState } from "react";
import { getMeetings, Meeting, createInstantMeeting } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { ZOOM } from "@/app/lib/theme";
import PortalHeader from "@/app/components/PortalHeader";

const PRODUCTS = [
  "Meetings",
  "Recordings",
  "Summaries",
  "Hub",
  "Whiteboards",
  "Notes",
  "Clips",
  "Canvas",
  "Paper",
  "Sheets",
  "Slides",
  "Tasks",
  "Scheduler",
];

const ACCOUNT_LINKS = ["My Account", "Admin", "Support"];

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

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-8 w-8"
    >
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3 10h18M12 14v4M10 16h4" />
    </svg>
  );
}

function JoinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-8 w-8"
    >
      <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
      <path d="M10 8l4 4-4 4M14 12H4" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-8 w-8"
    >
      <rect x="2" y="6" width="13" height="12" rx="3" />
      <path d="m15 11 5-3.5v9L15 13z" />
    </svg>
  );
}

function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border bg-white shadow-sm ${className}`}
      style={{ borderColor: ZOOM.border }}
    >
      {children}
    </section>
  );
}

function QuickAction({
  label,
  color,
  hoverColor,
  icon,
  onClick,
  disabled,
}: {
  label: string;
  color: string;
  hoverColor: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  const [hover, setHover] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="text-center disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-white transition-colors"
        style={{ backgroundColor: hover && !disabled ? hoverColor : color }}
      >
        {icon}
      </div>

      <p className="mt-3 text-[15px]" style={{ color: ZOOM.ink }}>
        {label}
      </p>
    </button>
  );
}

function MeetingSkeleton() {
  return (
    <div
      className="animate-pulse rounded-xl border p-5"
      style={{ borderColor: ZOOM.border }}
    >
      <div className="h-4 w-1/3 rounded bg-gray-200" />
      <div className="mt-3 h-3 w-1/2 rounded bg-gray-100" />
      <div className="mt-2 h-3 w-1/4 rounded bg-gray-100" />
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [now, setNow] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);

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

  const { upcomingMeetings, recentMeetings } = useMemo(() => {
    const time = (meeting: Meeting) => new Date(meeting.scheduled_at).getTime();

    return {
      upcomingMeetings: meetings
        .filter((meeting) => time(meeting) > now)
        .sort((a, b) => time(a) - time(b)),
      recentMeetings: meetings
        .filter((meeting) => time(meeting) <= now)
        .sort((a, b) => time(b) - time(a)),
    };
  }, [meetings, now]);

  const handleInstantMeeting = async () => {
    if (starting) return;

    setStarting(true);

    try {
      const meeting = await createInstantMeeting();

      router.push(`/meeting/${meeting.meeting_id}`);
    } catch {
      setError("Couldn't start an instant meeting. Please try again.");
      setStarting(false);
    }
  };

  return (
    <div
      className="min-h-screen min-w-[1280px]"
      style={{ backgroundColor: ZOOM.page, color: ZOOM.ink }}
    >
      <PortalHeader onHost={handleInstantMeeting} starting={starting} />

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside
          className="sticky top-0 h-screen w-[300px] shrink-0 overflow-y-auto border-r py-3"
          style={{ backgroundColor: ZOOM.rail, borderColor: ZOOM.border }}
        >
          <button
            onClick={() => router.push("/")}
            className="w-full px-10 py-3 text-left text-base font-medium"
            style={{ backgroundColor: ZOOM.blueTint, color: ZOOM.blue }}
          >
            Home
          </button>

          <div className="px-10 py-8">
            <p className="mb-5 text-sm" style={{ color: ZOOM.muted }}>
              My Products
            </p>

            <nav className="flex flex-col items-start gap-4 text-base">
              {PRODUCTS.map((product) => (
                <button
                  key={product}
                  onClick={
                    product === "Meetings" ? () => router.push("/") : undefined
                  }
                  className="text-left hover:underline"
                >
                  {product}
                </button>
              ))}

              <button className="text-left hover:underline">
                Discover More Products
              </button>
            </nav>

            <nav className="mt-12 flex flex-col items-start gap-4 text-base">
              {ACCOUNT_LINKS.map((link) => (
                <button key={link} className="text-left hover:underline">
                  {link}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Center + Right */}
        <div className="flex flex-1 items-start gap-6 p-8">
          {/* Center Section */}
          <div className="min-w-0 flex-1 space-y-6">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Profile Card */}
            <Card className="p-8">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="h-20 w-20 rounded-2xl bg-gray-300" />

                  <div>
                    <h2 className="text-2xl font-semibold">Tejasvita</h2>

                    <p
                      className="mt-1.5 text-base"
                      style={{ color: ZOOM.muted }}
                    >
                      Plan: Workplace Basic
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    className="rounded-full bg-gray-100 px-7 py-2.5 text-base transition hover:bg-gray-200"
                    style={{ color: ZOOM.blue }}
                  >
                    Manage Plan
                  </button>

                  <p
                    className="mt-3 cursor-pointer text-sm hover:underline"
                    style={{ color: ZOOM.blue }}
                  >
                    View Plan Details
                  </p>
                </div>
              </div>
            </Card>

            {/* Promo Card */}
            <Card className="p-8">
              <div className="flex items-center justify-between gap-8">
                <div className="min-w-0">
                  <p
                    className="text-base font-semibold"
                    style={{ color: ZOOM.blue }}
                  >
                    Workplace Pro
                  </p>

                  <h2 className="mt-2 text-[32px] leading-tight font-bold">
                    Upgrade and save!
                  </h2>

                  <p
                    className="mt-3 max-w-lg text-base"
                    style={{ color: ZOOM.muted }}
                  >
                    Unlock savings up to 16% when you select an annual Zoom
                    Workplace Pro plan.
                  </p>

                  <button
                    className="mt-6 rounded-lg px-6 py-3 text-base font-medium text-white transition"
                    style={{ backgroundColor: ZOOM.blue }}
                  >
                    Upgrade today
                  </button>
                </div>

                <div
                  className="h-[200px] w-[260px] shrink-0 rounded-3xl"
                  style={{
                    background: `linear-gradient(135deg, ${ZOOM.blue}, #0b2fa8)`,
                  }}
                />
              </div>
            </Card>

            {/* Upcoming Meetings */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold">Upcoming Meetings</h2>

              <div className="mt-6 space-y-4">
                {loading ? (
                  <>
                    <MeetingSkeleton />
                    <MeetingSkeleton />
                  </>
                ) : upcomingMeetings.length === 0 ? (
                  <p className="text-base" style={{ color: ZOOM.muted }}>
                    No upcoming meetings.{" "}
                    <button
                      onClick={() => router.push("/schedule")}
                      className="hover:underline"
                      style={{ color: ZOOM.blue }}
                    >
                      Schedule a meeting
                    </button>
                  </p>
                ) : (
                  upcomingMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="flex items-start justify-between gap-4 rounded-xl border p-5"
                      style={{ borderColor: ZOOM.border }}
                    >
                      <div className="min-w-0">
                        <h3 className="truncate text-xl font-semibold">
                          {meeting.title}
                        </h3>

                        {meeting.description && (
                          <p
                            className="mt-1 line-clamp-2 text-sm"
                            style={{ color: ZOOM.muted }}
                          >
                            {meeting.description}
                          </p>
                        )}

                        <p className="mt-3 text-sm" style={{ color: ZOOM.ink }}>
                          {formatDateTime(meeting.scheduled_at)}
                        </p>

                        <p
                          className="mt-1 text-sm"
                          style={{ color: ZOOM.muted }}
                        >
                          Duration: {meeting.duration} minutes
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          router.push(`/meeting/${meeting.meeting_id}`)
                        }
                        className="rounded-md px-5 py-2 text-sm font-medium text-white transition"
                        style={{ backgroundColor: ZOOM.blue }}
                      >
                        Join
                      </button>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Recent Meetings */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold">Recent Meetings</h2>

              <div className="mt-6 space-y-4">
                {loading ? (
                  <>
                    <MeetingSkeleton />
                    <MeetingSkeleton />
                  </>
                ) : recentMeetings.length === 0 ? (
                  <p className="text-base" style={{ color: ZOOM.muted }}>
                    No recent meetings.
                  </p>
                ) : (
                  recentMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="rounded-xl border p-5"
                      style={{ borderColor: ZOOM.border }}
                    >
                      <h3 className="truncate text-xl font-semibold">
                        {meeting.title}
                      </h3>

                      {meeting.description && (
                        <p
                          className="mt-1 line-clamp-2 text-sm"
                          style={{ color: ZOOM.muted }}
                        >
                          {meeting.description}
                        </p>
                      )}

                      <p className="mt-3 text-sm" style={{ color: ZOOM.ink }}>
                        {formatDateTime(meeting.scheduled_at)}
                      </p>

                      <p className="mt-1 text-sm" style={{ color: ZOOM.muted }}>
                        Meeting ID: {meeting.meeting_id}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="w-[360px] shrink-0 space-y-6">
            {/* Quick Actions */}
            <Card className="p-8">
              <div className="grid grid-cols-3 gap-4">
                <QuickAction
                  label="Schedule"
                  color={ZOOM.blue}
                  hoverColor={ZOOM.blueHover}
                  icon={<CalendarIcon />}
                  onClick={() => router.push("/schedule")}
                />

                <QuickAction
                  label="Join"
                  color={ZOOM.blue}
                  hoverColor={ZOOM.blueHover}
                  icon={<JoinIcon />}
                  onClick={() => router.push("/join")}
                />

                <QuickAction
                  label={starting ? "Starting…" : "New Meeting"}
                  color={ZOOM.orange}
                  hoverColor={ZOOM.orangeHover}
                  icon={<VideoIcon />}
                  onClick={handleInstantMeeting}
                  disabled={starting}
                />
              </div>

              <div
                className="mt-8 border-t pt-6 text-center"
                style={{ borderColor: ZOOM.border }}
              >
                <h3 className="text-base font-semibold">Personal Meeting ID</h3>

                <p className="mt-2 text-base" style={{ color: ZOOM.muted }}>
                  937 337 3571
                </p>
              </div>
            </Card>

            {/* Meetings Card */}
            <Card className="p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Meetings</h2>

                <button
                  onClick={() => router.push("/schedule")}
                  className="text-sm font-medium hover:underline"
                  style={{ color: ZOOM.blue }}
                >
                  Schedule
                </button>
              </div>

              <div
                className="mt-5 rounded-lg bg-gray-100 px-4 py-2.5 text-sm"
                style={{ color: ZOOM.ink }}
              >
                Upcoming
              </div>

              <div className="mt-5 space-y-4">
                {loading ? (
                  <MeetingSkeleton />
                ) : upcomingMeetings.length === 0 ? (
                  <p className="text-base" style={{ color: ZOOM.muted }}>
                    No upcoming meetings.
                  </p>
                ) : (
                  upcomingMeetings.slice(0, 2).map((meeting) => (
                    <div
                      key={meeting.id}
                      className="rounded-2xl border p-5"
                      style={{ borderColor: ZOOM.border }}
                    >
                      <h3
                        className="truncate text-lg font-medium"
                        style={{ color: ZOOM.blue }}
                      >
                        {meeting.title}
                      </h3>

                      <p className="mt-2 text-base font-semibold">
                        {formatDateTime(meeting.scheduled_at)}
                      </p>

                      <p className="mt-2 text-sm" style={{ color: ZOOM.muted }}>
                        Meeting ID: {meeting.meeting_id}
                      </p>

                      <button
                        onClick={() =>
                          router.push(`/meeting/${meeting.meeting_id}`)
                        }
                        className="mt-4 rounded-xl bg-gray-100 px-5 py-2 text-sm font-medium transition hover:bg-blue-50"
                        style={{ color: ZOOM.blue }}
                      >
                        Join
                      </button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

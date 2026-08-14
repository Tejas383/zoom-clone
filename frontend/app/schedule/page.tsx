"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { createMeeting, createInstantMeeting } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { ZOOM } from "@/app/lib/theme";
import PortalHeader from "@/app/components/PortalHeader";

const PERSONAL_NAV = [
  "Profile",
  "Meetings",
  "Webinars",
  "Personal Contacts",
  "Personal Devices",
  "Whiteboards",
  "Recordings & Transcripts",
  "Scheduler",
  "Surveys",
  "Settings",
];

const ADMIN_NAV = [
  "Dashboard",
  "User Management",
  "Device Management",
  "Room Management",
  "Account Management",
  "Advanced",
];

const FOOTER_NAV = ["Attend Live Training", "Video Tutorials", "Knowledge Base"];

/** A slice of the portal's time zone catalog, labelled the way Zoom labels it. */
const TIME_ZONES = [
  { value: "Pacific/Honolulu", label: "(GMT-10:00) Hawaii" },
  {
    value: "America/Los_Angeles",
    label: "(GMT-8:00) Pacific Time (US and Canada)",
  },
  {
    value: "America/Denver",
    label: "(GMT-7:00) Mountain Time (US and Canada)",
  },
  {
    value: "America/Chicago",
    label: "(GMT-6:00) Central Time (US and Canada)",
  },
  {
    value: "America/New_York",
    label: "(GMT-5:00) Eastern Time (US and Canada)",
  },
  { value: "Europe/London", label: "(GMT+0:00) London" },
  { value: "Europe/Paris", label: "(GMT+1:00) Paris" },
  { value: "Asia/Dubai", label: "(GMT+4:00) Abu Dhabi, Muscat" },
  { value: "Asia/Kolkata", label: "(GMT+5:30) Mumbai, Kolkata, New Delhi" },
  { value: "Asia/Singapore", label: "(GMT+8:00) Singapore" },
  { value: "Asia/Tokyo", label: "(GMT+9:00) Osaka, Sapporo, Tokyo" },
  {
    value: "Australia/Sydney",
    label: "(GMT+10:00) Canberra, Melbourne, Sydney",
  },
];

const neverChanges = () => () => {};

/** Browser-only values, read without an effect so hydration stays clean. */
function useLocalTimeZone() {
  return useSyncExternalStore(
    neverChanges,
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    () => "Asia/Kolkata",
  );
}

function useToday() {
  return useSyncExternalStore(
    neverChanges,
    () => {
      const now = new Date();
      const pad = (value: number) => String(value).padStart(2, "0");

      return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    },
    () => "",
  );
}

const HOURS = Array.from({ length: 25 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

const inputClass =
  "h-9 rounded-lg border bg-white px-3 text-sm outline-none focus:border-[#0b5cff] focus:ring-2 focus:ring-[#0b5cff]/15";

/** A form line: label in the fixed left column, controls on the right. */
function Row({
  label,
  required,
  children,
  align = "center",
}: {
  label?: string;
  required?: boolean;
  children: React.ReactNode;
  align?: "center" | "start";
}) {
  return (
    <div className={`flex gap-6 ${align === "start" ? "items-start" : "items-center"}`}>
      <div
        className="w-[190px] shrink-0 pt-1 text-right text-sm"
        style={{ color: ZOOM.ink }}
      >
        {required && <span className="mr-0.5 text-red-600">*</span>}
        {label}
      </div>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function Checkbox({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4"
        style={{ accentColor: ZOOM.blue }}
      />

      <span className="text-sm">
        {label}

        {hint && (
          <span className="mt-1 block text-xs" style={{ color: ZOOM.muted }}>
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}

function Radio({
  name,
  label,
  checked,
  onChange,
}: {
  name: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4"
        style={{ accentColor: ZOOM.blue }}
      />

      {label}
    </label>
  );
}

export default function SchedulePage() {
  const router = useRouter();

  // Fields the API accepts.
  const [topic, setTopic] = useState("My Meeting");
  const [description, setDescription] = useState("");
  const [pickedDate, setPickedDate] = useState<string | null>(null);
  const [time, setTime] = useState("09:00");
  const [durationHours, setDurationHours] = useState(1);
  const [durationMinutes, setDurationMinutes] = useState(0);

  // Rows the portal shows but this backend has no field for — display only.
  const [pickedZone, setPickedZone] = useState<string | null>(null);
  const [recurring, setRecurring] = useState(false);
  const [meetingIdMode, setMeetingIdMode] = useState<"auto" | "personal">(
    "auto",
  );
  const [passcodeOn, setPasscodeOn] = useState(true);
  const [passcode, setPasscode] = useState("8Hn2Kq");
  const [waitingRoom, setWaitingRoom] = useState(true);
  const [requireAuth, setRequireAuth] = useState(false);
  const [hostVideo, setHostVideo] = useState<"on" | "off">("off");
  const [participantVideo, setParticipantVideo] = useState<"on" | "off">("off");
  const [audio, setAudio] = useState<"telephone" | "computer" | "both">("both");
  const [joinAnytime, setJoinAnytime] = useState(false);
  const [muteOnEntry, setMuteOnEntry] = useState(false);
  const [autoRecord, setAutoRecord] = useState(false);
  const [alternativeHosts, setAlternativeHosts] = useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [starting, setStarting] = useState(false);

  const localZone = useLocalTimeZone();
  const today = useToday();

  // The portal opens on today's date in the viewer's own zone.
  const date = pickedDate ?? today;
  const timeZone = pickedZone ?? localZone;

  const zoneOptions = useMemo(() => {
    const known = TIME_ZONES.some((zone) => zone.value === localZone);

    return known
      ? TIME_ZONES
      : [{ value: localZone, label: localZone }, ...TIME_ZONES];
  }, [localZone]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!topic.trim()) {
      setError("Please enter a topic for this meeting.");
      return;
    }

    if (!date || !time) {
      setError("Please choose a date and time for this meeting.");
      return;
    }

    const duration = durationHours * 60 + durationMinutes;

    if (duration <= 0) {
      setError("Please choose a duration longer than 0 minutes.");
      return;
    }

    setSaving(true);

    try {
      await createMeeting({
        title: topic,
        description,
        scheduled_at: `${date}T${time}`,
        duration,
      });

      router.replace("/");
    } catch {
      setError("Failed to schedule the meeting. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div
      className="min-h-screen min-w-[1280px] bg-white"
      style={{ color: ZOOM.ink }}
    >
      <PortalHeader onHost={handleInstantMeeting} starting={starting} />

      <div className="flex">
        {/* Portal Sidebar */}
        <aside
          className="sticky top-0 h-screen w-[230px] shrink-0 overflow-y-auto border-r py-6 text-sm"
          style={{ backgroundColor: ZOOM.rail, borderColor: ZOOM.border }}
        >
          <p
            className="px-6 pb-2 text-xs font-semibold tracking-wider"
            style={{ color: ZOOM.muted }}
          >
            PERSONAL
          </p>

          <nav className="flex flex-col">
            {PERSONAL_NAV.map((item) => {
              const active = item === "Meetings";

              return (
                <button
                  key={item}
                  onClick={active ? () => router.push("/") : undefined}
                  className="px-6 py-2 text-left hover:underline"
                  style={
                    active
                      ? {
                          backgroundColor: ZOOM.blueTint,
                          color: ZOOM.blue,
                          fontWeight: 500,
                        }
                      : undefined
                  }
                >
                  {item}
                </button>
              );
            })}
          </nav>

          <p
            className="px-6 pt-6 pb-2 text-xs font-semibold tracking-wider"
            style={{ color: ZOOM.muted }}
          >
            ADMIN
          </p>

          <nav className="flex flex-col">
            {ADMIN_NAV.map((item) => (
              <button
                key={item}
                className="px-6 py-2 text-left hover:underline"
              >
                {item}
              </button>
            ))}
          </nav>

          <div
            className="mt-6 flex flex-col border-t pt-4"
            style={{ borderColor: ZOOM.border }}
          >
            {FOOTER_NAV.map((item) => (
              <button
                key={item}
                className="px-6 py-2 text-left hover:underline"
              >
                {item}
              </button>
            ))}
          </div>
        </aside>

        {/* Form */}
        <main className="min-w-0 flex-1 px-10 py-8">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => router.push("/")}
              className="hover:underline"
              style={{ color: ZOOM.blue }}
            >
              Meetings
            </button>

            <span style={{ color: ZOOM.muted }}>&gt;</span>

            <span>Schedule Meeting</span>
          </div>

          <h1
            className="mt-4 border-b pb-4 text-2xl font-medium"
            style={{ borderColor: ZOOM.border }}
          >
            Schedule Meeting
          </h1>

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 max-w-[900px] space-y-7">
            <Row label="Topic" required>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={`${inputClass} w-[420px]`}
                style={{ borderColor: ZOOM.field }}
              />
            </Row>

            <Row label="Description (Optional)" align="start">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter your meeting description"
                rows={3}
                className="w-[560px] resize-none rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-[#0b5cff] focus:ring-2 focus:ring-[#0b5cff]/15"
                style={{ borderColor: ZOOM.field }}
              />
            </Row>

            <Row label="When" required>
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setPickedDate(e.target.value)}
                  className={`${inputClass} w-[170px]`}
                  style={{ borderColor: ZOOM.field }}
                />

                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={`${inputClass} w-[130px]`}
                  style={{ borderColor: ZOOM.field }}
                />
              </div>
            </Row>

            <Row label="Duration">
              <div className="flex items-center gap-3 text-sm">
                <select
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className={`${inputClass} w-[80px]`}
                  style={{ borderColor: ZOOM.field }}
                >
                  {HOURS.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>

                <span>hr</span>

                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className={`${inputClass} w-[80px]`}
                  style={{ borderColor: ZOOM.field }}
                >
                  {MINUTES.map((minute) => (
                    <option key={minute} value={minute}>
                      {minute}
                    </option>
                  ))}
                </select>

                <span>min</span>
              </div>
            </Row>

            <Row label="Time Zone">
              <select
                value={timeZone}
                onChange={(e) => setPickedZone(e.target.value)}
                className={`${inputClass} w-[420px]`}
                style={{ borderColor: ZOOM.field }}
              >
                {zoneOptions.map((zone) => (
                  <option key={zone.value} value={zone.value}>
                    {zone.label}
                  </option>
                ))}
              </select>
            </Row>

            <Row>
              <Checkbox
                label="Recurring meeting"
                checked={recurring}
                onChange={setRecurring}
              />
            </Row>

            <div className="border-t" style={{ borderColor: ZOOM.border }} />

            <Row label="Meeting ID" align="start">
              <div className="space-y-3">
                <Radio
                  name="meeting-id"
                  label="Generate Automatically"
                  checked={meetingIdMode === "auto"}
                  onChange={() => setMeetingIdMode("auto")}
                />

                <Radio
                  name="meeting-id"
                  label="Personal Meeting ID 937 337 3571"
                  checked={meetingIdMode === "personal"}
                  onChange={() => setMeetingIdMode("personal")}
                />
              </div>
            </Row>

            <div className="border-t" style={{ borderColor: ZOOM.border }} />

            <Row label="Security" align="start">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    label="Passcode"
                    checked={passcodeOn}
                    onChange={setPasscodeOn}
                  />

                  <input
                    type="text"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    disabled={!passcodeOn}
                    className={`${inputClass} w-[130px] disabled:bg-gray-100`}
                    style={{ borderColor: ZOOM.field }}
                  />
                </div>

                <p className="text-xs" style={{ color: ZOOM.muted }}>
                  Only users who have the invite link or passcode can join the
                  meeting
                </p>

                <Checkbox
                  label="Waiting Room"
                  hint="Only users admitted by the host can join the meeting"
                  checked={waitingRoom}
                  onChange={setWaitingRoom}
                />

                <Checkbox
                  label="Require authentication to join"
                  checked={requireAuth}
                  onChange={setRequireAuth}
                />
              </div>
            </Row>

            <div className="border-t" style={{ borderColor: ZOOM.border }} />

            <Row label="Video" align="start">
              <div className="space-y-3">
                <div className="flex items-center gap-8">
                  <span className="w-[90px] text-sm">Host</span>

                  <Radio
                    name="host-video"
                    label="on"
                    checked={hostVideo === "on"}
                    onChange={() => setHostVideo("on")}
                  />

                  <Radio
                    name="host-video"
                    label="off"
                    checked={hostVideo === "off"}
                    onChange={() => setHostVideo("off")}
                  />
                </div>

                <div className="flex items-center gap-8">
                  <span className="w-[90px] text-sm">Participant</span>

                  <Radio
                    name="participant-video"
                    label="on"
                    checked={participantVideo === "on"}
                    onChange={() => setParticipantVideo("on")}
                  />

                  <Radio
                    name="participant-video"
                    label="off"
                    checked={participantVideo === "off"}
                    onChange={() => setParticipantVideo("off")}
                  />
                </div>
              </div>
            </Row>

            <div className="border-t" style={{ borderColor: ZOOM.border }} />

            <Row label="Audio" align="start">
              <div className="space-y-3">
                <div className="flex items-center gap-8">
                  <Radio
                    name="audio"
                    label="Telephone"
                    checked={audio === "telephone"}
                    onChange={() => setAudio("telephone")}
                  />

                  <Radio
                    name="audio"
                    label="Computer Audio"
                    checked={audio === "computer"}
                    onChange={() => setAudio("computer")}
                  />

                  <Radio
                    name="audio"
                    label="Telephone and Computer Audio"
                    checked={audio === "both"}
                    onChange={() => setAudio("both")}
                  />
                </div>

                <p className="text-xs" style={{ color: ZOOM.muted }}>
                  Dial in from India{" "}
                  <span className="cursor-pointer" style={{ color: ZOOM.blue }}>
                    Edit
                  </span>
                </p>
              </div>
            </Row>

            <div className="border-t" style={{ borderColor: ZOOM.border }} />

            <Row label="Meeting Options" align="start">
              <div className="space-y-3">
                <Checkbox
                  label="Allow participants to join anytime"
                  checked={joinAnytime}
                  onChange={setJoinAnytime}
                />

                <Checkbox
                  label="Mute participants upon entry"
                  checked={muteOnEntry}
                  onChange={setMuteOnEntry}
                />

                <Checkbox
                  label="Automatically record meeting"
                  checked={autoRecord}
                  onChange={setAutoRecord}
                />
              </div>
            </Row>

            <div className="border-t" style={{ borderColor: ZOOM.border }} />

            <Row label="Alternative Hosts">
              <input
                type="text"
                value={alternativeHosts}
                onChange={(e) => setAlternativeHosts(e.target.value)}
                placeholder="Example: mary@company.com"
                className={`${inputClass} w-[420px]`}
                style={{ borderColor: ZOOM.field }}
              />
            </Row>

            <div className="border-t" style={{ borderColor: ZOOM.border }} />

            <Row>
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg px-6 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ backgroundColor: ZOOM.blue }}
                >
                  {saving ? "Saving…" : "Save"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="rounded-lg px-4 py-2 text-sm hover:underline"
                >
                  Cancel
                </button>
              </div>
            </Row>

            <p className="pl-[214px] text-xs" style={{ color: ZOOM.muted }}>
              <span className="text-red-600">*</span> Required information
            </p>
          </form>
        </main>
      </div>
    </div>
  );
}

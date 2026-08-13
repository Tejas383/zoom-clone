import { getMeeting } from "@/app/lib/api";
import JoinMeeting from "./JoinMeeting";

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ meetingId: string }>;
}) {
  const { meetingId } = await params;

  const meeting = await getMeeting(meetingId);

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white flex flex-col">
      {/* Top Bar */}
      <header className="h-16 bg-[#111116] border-b border-white/10 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold text-blue-500">zoom</div>

          <div className="h-6 w-px bg-white/20" />

          <div>
            <h1 className="font-medium text-sm">{meeting.title}</h1>

            <p className="text-xs text-gray-400">
              Meeting ID: {meeting.meeting_id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
            {meeting.status}
          </span>

          <div className="h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center">
            T
          </div>
        </div>
      </header>

      {/* Main Meeting Area */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-6xl">
          {/* Video Area */}
          <div className="relative bg-[#18181d] rounded-2xl border border-white/10 overflow-hidden min-h-[500px] flex items-center justify-center">
            {/* Fake video tile */}
            <div className="text-center">
              <div className="mx-auto h-28 w-28 rounded-full bg-gray-700 flex items-center justify-center text-4xl font-semibold">
                T
              </div>

              <h2 className="mt-5 text-xl font-medium">{meeting.title}</h2>

              <p className="mt-2 text-gray-400 text-sm">
                Your video will appear here
              </p>
            </div>

            {/* Meeting info */}
            <div className="absolute top-5 left-5">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-sm font-medium">{meeting.title}</p>

                <p className="text-xs text-gray-400 mt-1">
                  {meeting.duration} minutes
                </p>
              </div>
            </div>

            {/* Recording/status indicator */}
            <div className="absolute top-5 right-5 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />

              <span className="text-xs text-gray-300">Meeting active</span>
            </div>
          </div>

          {/* Meeting Details */}
          <div className="mt-6 bg-[#111116] border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">{meeting.title}</h2>

                {meeting.description && (
                  <p className="mt-2 text-gray-400 max-w-2xl">
                    {meeting.description}
                  </p>
                )}
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500">Meeting ID</p>

                <p className="mt-1 font-medium">{meeting.meeting_id}</p>
              </div>
            </div>
          </div>

          {/* Join Section */}
          {meeting.status !== "ended" && <JoinMeeting meetingId={meetingId} />}

          {/* Ended Meeting */}
          {meeting.status === "ended" && (
            <div className="mt-6 bg-[#111116] border border-white/10 rounded-2xl p-8 text-center">
              <div className="mx-auto h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center">
                <span className="text-red-400 text-xl">×</span>
              </div>

              <h2 className="mt-4 text-xl font-semibold">
                This meeting has ended
              </h2>

              <p className="mt-2 text-gray-400">
                This meeting is no longer available to join.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Meeting Controls */}
      <footer className="h-20 bg-[#111116] border-t border-white/10 flex items-center justify-center">
        <div className="flex items-center gap-4">
          <button className="h-12 w-12 rounded-full bg-[#29292f] hover:bg-[#35353c] flex items-center justify-center transition">
            🎤
          </button>

          <button className="h-12 w-12 rounded-full bg-[#29292f] hover:bg-[#35353c] flex items-center justify-center transition">
            📹
          </button>

          <button className="h-12 px-6 rounded-full bg-red-600 hover:bg-red-700 font-medium transition">
            Leave
          </button>

          <button className="h-12 w-12 rounded-full bg-[#29292f] hover:bg-[#35353c] flex items-center justify-center transition">
            👥
          </button>

          <button className="h-12 w-12 rounded-full bg-[#29292f] hover:bg-[#35353c] flex items-center justify-center transition">
            ⋯
          </button>
        </div>
      </footer>
    </div>
  );
}

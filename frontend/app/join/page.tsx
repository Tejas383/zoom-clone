"use client";

import { useState } from "react";
import { getMeeting } from "@/app/lib/api";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const router = useRouter();

  const [meetingId, setMeetingId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!meetingId || !displayName) {
      setError("Please enter Meeting ID and your name");
      return;
    }

    try {
      await getMeeting(meetingId);

      router.push(
        `/meeting/${meetingId}?name=${encodeURIComponent(displayName)}`,
      );
    } catch {
      setError("Meeting not found");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] flex items-center justify-center">
      <div className="w-[420px] bg-white rounded-2xl shadow-sm border p-10">
        <div className="text-4xl font-bold text-blue-600 text-center">zoom</div>

        <h1 className="text-3xl font-semibold text-center mt-8">
          Join Meeting
        </h1>

        <p className="text-gray-500 text-center mt-2">
          Enter the meeting information below
        </p>

        <form onSubmit={handleJoin} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting ID
            </label>

            <input
              type="text"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder="Enter Meeting ID"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>

            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700"
          >
            Join Meeting
          </button>
        </form>
      </div>
    </div>
  );
}

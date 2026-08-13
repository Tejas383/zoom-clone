"use client";

import { useState } from "react";
import { createMeeting } from "@/app/lib/api";
import { useRouter } from "next/navigation";

export default function SchedulePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState(60);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!scheduledAt) {
      alert("Please select a date and time");
      return;
    }

    const meeting = await createMeeting({
      title,
      description,
      scheduled_at: scheduledAt,
      duration,
    });

    router.push(`/meeting/${meeting.meeting_id}`);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      {/* Navbar */}
      <nav className="h-[72px] bg-white border-b flex items-center justify-between px-8">
        <div className="text-4xl font-bold text-blue-600">zoom</div>

        <div className="flex items-center gap-8 text-gray-600 text-sm">
          <span className="cursor-pointer hover:text-gray-900">Support</span>

          <span className="cursor-pointer hover:text-gray-900">Resources</span>

          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600 font-medium">T</span>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <button
            onClick={() => router.push("/")}
            className="hover:text-blue-600"
          >
            Home
          </button>

          <span>/</span>

          <span className="text-gray-800">Schedule Meeting</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-900">
            Schedule a Meeting
          </h1>

          <p className="mt-3 text-gray-500 text-lg">
            Set up a meeting and invite participants to join.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-[1fr_320px] gap-8">
          {/* Form Card */}
          <div className="bg-white border rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Meeting Details
            </h2>

            <p className="mt-2 text-gray-500 text-sm">
              Enter the information for your upcoming meeting.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Meeting Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Project Discussion"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description for your meeting"
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none resize-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Date and Duration */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Date & Time
                  </label>

                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Duration
                  </label>

                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 bg-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-4 flex items-center justify-end gap-4 border-t">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm"
                >
                  Schedule Meeting
                </button>
              </div>
            </form>
          </div>

          {/* Information Card */}
          <div className="space-y-6">
            <div className="bg-white border rounded-2xl shadow-sm p-7">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-semibold">
                +
              </div>

              <h3 className="mt-5 text-xl font-semibold text-gray-900">
                Meeting Link
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                A unique meeting ID and invitation link will be automatically
                generated after you schedule the meeting.
              </p>
            </div>

            <div className="bg-white border rounded-2xl shadow-sm p-7">
              <h3 className="text-xl font-semibold text-gray-900">
                Meeting Settings
              </h3>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Meeting ID</span>

                  <span className="text-gray-800 font-medium">
                    Auto generated
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>

                  <span className="text-green-600 font-medium">Scheduled</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>

                  <span className="text-gray-800 font-medium">
                    {duration} min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

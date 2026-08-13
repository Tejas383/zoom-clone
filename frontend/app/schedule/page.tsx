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
    <div>
      <h1>Schedule Meeting</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Meeting title"
          />
        </div>

        <div>
          <label>Description</label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Meeting description"
          />
        </div>

        <div>
          <label>Date & Time</label>

          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
        </div>

        <div>
          <label>Duration (minutes)</label>

          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>

        <button type="submit">Schedule Meeting</button>
      </form>
    </div>
  );
}

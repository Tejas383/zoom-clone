"use client";

import { useRouter } from "next/navigation";

export default function MeetingControls() {
  const router = useRouter();

  const handleLeave = () => {
    router.push("/");
  };

  return (
    <footer className="h-20 bg-[#111116] border-t border-white/10 flex items-center justify-center">
      <div className="flex items-center gap-4">
        <button className="h-12 w-12 rounded-full bg-[#29292f] hover:bg-[#35353c] flex items-center justify-center transition">
          🎤
        </button>

        <button className="h-12 w-12 rounded-full bg-[#29292f] hover:bg-[#35353c] flex items-center justify-center transition">
          📹
        </button>

        <button
          onClick={handleLeave}
          className="h-12 px-6 rounded-full bg-red-600 hover:bg-red-700 font-medium transition"
        >
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
  );
}

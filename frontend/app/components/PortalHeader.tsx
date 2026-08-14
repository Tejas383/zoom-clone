"use client";

import { useRouter } from "next/navigation";
import { ZOOM } from "@/app/lib/theme";

const UTILITY_LINKS = [
  "Search",
  "Support",
  "0008000503335",
  "Contact Sales",
  "Request a Demo",
];

const NAV_LINKS = ["Products", "Solutions", "Resources", "Plans & Pricing"];

export function ChevronDown() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="h-3 w-3"
    >
      <path d="M5.5 7.5 10 12l4.5-4.5H5.5Z" />
    </svg>
  );
}

/** The zoom.us chrome: navy utility bar above the white product navbar. */
export default function PortalHeader() {
  const router = useRouter();

  return (
    <>
      {/* Top Utility Bar */}
      <div
        className="flex h-10 items-center justify-end gap-8 px-8 text-sm text-white"
        style={{ backgroundColor: ZOOM.navy }}
      >
        {UTILITY_LINKS.map((item) => (
          <span key={item} className="cursor-pointer hover:underline">
            {item}
          </span>
        ))}
      </div>

      {/* Main Navbar */}
      <header
        className="flex h-[66px] items-center justify-between gap-4 border-b bg-white px-8"
        style={{ borderColor: ZOOM.border }}
      >
        <div className="flex items-center gap-10">
          <button
            onClick={() => router.push("/")}
            className="text-[30px] leading-none font-bold tracking-tight"
            style={{ color: ZOOM.blue }}
          >
            zoom
          </button>

          <nav className="flex items-center gap-8 text-base">
            {NAV_LINKS.map((item) => (
              <span
                key={item}
                className="flex cursor-pointer items-center gap-1.5 hover:underline"
              >
                {item}
              </span>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6 text-base">
          <button
            onClick={() => router.push("/schedule")}
            className="hover:underline"
          >
            Schedule
          </button>

          <button
            onClick={() => router.push("/join")}
            className="hover:underline"
          >
            Join
          </button>

          <button
            onClick={() => router.push("/host")}
            className="flex items-center gap-1.5 hover:underline"
          >
            Host
            <ChevronDown />
          </button>

          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 hover:underline"
          >
            Web App
            <ChevronDown />
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-600">
            T
          </div>
        </div>
      </header>
    </>
  );
}

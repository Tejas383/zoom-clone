"use client";

import { useEffect, useState } from "react";
import { getMeetings, Meeting, createInstantMeeting } from "@/app/lib/api";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    getMeetings().then((data) => {
      setMeetings(data);
      console.log(data);
    });
  }, []);

  const handleInstantMeeting = async () => {
    const meeting = await createInstantMeeting();

    router.push(`/meeting/${meeting.meeting_id}`);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      {/* Top Utility Bar */}
      <div className="h-11 bg-[#05052d] text-white flex items-center justify-end gap-8 px-8 text-sm">
        <span>Search</span>
        <span>Support</span>
        <span>0008000503335</span>
        <span>Contact Sales</span>
        <span>Request a Demo</span>
      </div>

      {/* Main Navbar */}
      <div className="h-[72px] bg-white border-b flex items-center justify-between px-8">
        <div className="flex items-center gap-10">
          <div className="text-5xl font-bold text-blue-600">zoom</div>

          <div className="flex items-center gap-10 text-gray-700 font-medium">
            <span>Products</span>
            <span>Solutions</span>
            <span>Resources</span>
            <span>Plans & Pricing</span>
          </div>
        </div>

        <div className="flex items-center gap-8 text-gray-700 font-semibold">
          <button onClick={() => router.push("/schedule")}>Schedule</button>
          <button onClick={() => router.push("/join")}>Join</button>
          <span onClick={handleInstantMeeting}>Host</span>
          <span>Web App</span>

          <div className="h-10 w-10 rounded-full bg-gray-300"></div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-[260px] bg-[#f3f4f6] border-r min-h-[calc(100vh-116px)]">
          <div className="bg-[#eaf2ff] text-blue-600 px-10 py-4 font-medium">
            Home
          </div>

          <div className="p-8">
            <p className="text-gray-500 text-sm mb-6">My Products</p>

            <div className="space-y-5 text-[18px] text-gray-800">
              <div>Meetings</div>
              <div>Recordings</div>
              <div>Summaries</div>
              <div>Hub</div>
              <div>Whiteboards</div>
              <div>Notes</div>
              <div>Clips</div>
              <div>Canvas</div>
              <div>Paper</div>
              <div>Sheets</div>
              <div>Slides</div>
              <div>Tasks</div>
              <div>Scheduler</div>
              <div>Discover More Products</div>
            </div>

            <div className="mt-16 space-y-6 text-gray-800">
              <div>My Account</div>
              <div>Admin</div>
              <div>Support</div>
            </div>
          </div>
        </aside>

        {/* Center + Right */}
        <div className="flex flex-1 gap-6 p-8">
          {/* Center Section */}
          <div className="flex-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <div className="flex items-center justify-between">
                <div className="flex gap-5 items-center">
                  <div className="h-20 w-20 rounded-2xl bg-gray-300"></div>

                  <div>
                    <h2 className="text-4xl font-semibold">Tejasvita</h2>

                    <p className="text-gray-600 mt-2">Plan: Workplace Basic</p>
                  </div>
                </div>

                <div className="text-right">
                  <button className="bg-gray-100 rounded-full px-8 py-3 text-blue-600">
                    Manage Plan
                  </button>

                  <p className="mt-4 text-blue-600">View Plan Details</p>
                </div>
              </div>
            </div>

            {/* Promo Card */}
            <div className="bg-white rounded-2xl p-10 shadow-sm border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-600 font-semibold">Workplace Pro</p>

                  <h2 className="text-5xl font-bold mt-3">Upgrade and save!</h2>

                  <p className="text-gray-500 mt-4 max-w-lg">
                    Unlock savings up to 16% when you select an annual Zoom
                    Workplace Pro plan.
                  </p>

                  <button className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl">
                    Upgrade today
                  </button>
                </div>

                <div className="w-[260px] h-[220px] rounded-3xl bg-blue-700"></div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <h2 className="text-4xl font-semibold mb-8">Recent activity</h2>

              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        {meeting.title}
                      </h2>

                      <p className="mt-1 text-sm text-gray-600">
                        {meeting.description}
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        {meeting.scheduled_at}
                      </p>
                    </div>

                    <a
                      href={meeting.invite_link}
                      className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                    >
                      Join
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-[360px] space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-8 border shadow-sm">
              <div className="flex justify-around">
                <button
                  onClick={() => router.push("/schedule")}
                  className="text-center"
                >
                  <div className="h-16 w-16 rounded-2xl bg-blue-600 mx-auto"></div>
                  <p className="mt-3">Schedule</p>
                </button>

                <button
                  onClick={() => router.push("/join")}
                  className="text-center"
                >
                  <div className="h-16 w-16 rounded-2xl bg-blue-600 mx-auto"></div>
                  <p className="mt-3">Join</p>
                </button>

                <button onClick={handleInstantMeeting} className="text-center">
                  <div className="h-16 w-16 rounded-2xl bg-orange-500 mx-auto"></div>
                  <p className="mt-3">Host</p>
                </button>
              </div>

              <div className="mt-10 text-center">
                <h3 className="font-semibold text-2xl">Personal Meeting ID</h3>

                <p className="mt-4 text-xl">937 337 3571</p>
              </div>
            </div>

            {/* Meetings Card */}
            <div className="bg-white rounded-2xl p-8 border shadow-sm">
              <div className="flex justify-between items-center">
                <h2 className="text-4xl font-semibold">Meetings</h2>

                <span className="text-blue-600">Visit Meetings</span>
              </div>

              <div className="mt-6 bg-gray-100 rounded-lg p-3">Today</div>

              <div className="mt-6 border rounded-2xl p-5">
                <h3 className="text-blue-600 text-2xl font-medium">
                  My Meeting
                </h3>

                <p className="mt-3 font-semibold">9:30 PM - 10:10 PM</p>

                <p className="mt-3 text-gray-500">Meeting ID: 723 414 0282</p>

                <button className="mt-5 bg-gray-100 rounded-xl px-4 py-2 text-blue-600">
                  Copy Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

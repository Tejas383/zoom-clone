import { notFound } from "next/navigation";
import { getMeeting } from "@/app/lib/api";
import HostRoom from "./HostRoom";

/** Hosts land here — from /host or the portal's Start buttons. */
export default async function StartMeetingPage({
  params,
  searchParams,
}: {
  params: Promise<{ meetingId: string }>;
  searchParams: Promise<{ instant?: string | string[] }>;
}) {
  const { meetingId } = await params;
  const { instant } = await searchParams;

  const meeting = await getMeeting(meetingId).catch(() => null);

  if (!meeting) notFound();

  return <HostRoom meeting={meeting} instant={instant === "1"} />;
}

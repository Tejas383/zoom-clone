import { notFound } from "next/navigation";
import { getMeeting } from "@/app/lib/api";
import ParticipantRoom from "./ParticipantRoom";

/** Participants land here — from /join, an invite link, or the portal. */
export default async function JoinMeetingPage({
  params,
  searchParams,
}: {
  params: Promise<{ meetingId: string }>;
  searchParams: Promise<{ name?: string | string[] }>;
}) {
  const { meetingId } = await params;
  const { name } = await searchParams;

  const meeting = await getMeeting(meetingId).catch(() => null);

  if (!meeting) notFound();

  return (
    <ParticipantRoom
      meeting={meeting}
      initialName={typeof name === "string" ? name : ""}
    />
  );
}

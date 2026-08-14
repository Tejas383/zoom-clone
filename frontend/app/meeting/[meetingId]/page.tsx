import { redirect } from "next/navigation";

/**
 * Invite links point at /meeting/{id}. The room itself is split by role, so
 * this bare link means "join as a participant" — hosts come in via /start.
 */
export default async function MeetingPage({
  params,
  searchParams,
}: {
  params: Promise<{ meetingId: string }>;
  searchParams: Promise<{ name?: string | string[] }>;
}) {
  const { meetingId } = await params;
  const { name } = await searchParams;

  const query =
    typeof name === "string" && name
      ? `?name=${encodeURIComponent(name)}`
      : "";

  redirect(`/meeting/${meetingId}/join${query}`);
}

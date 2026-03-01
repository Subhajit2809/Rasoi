"use client";

import type { MemberProfile } from "@/hooks/useHouseholdMembers";

interface AvatarProps {
  member: MemberProfile;
  size?: number;
  overlap?: boolean;
}

export function Avatar({ member, size = 32, overlap = false }: AvatarProps) {
  const initials = (member.display_name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const ring = overlap ? "ring-2 ring-white" : "";

  if (member.avatar_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={member.avatar_url}
        alt={member.display_name ?? ""}
        width={size}
        height={size}
        className={`rounded-full object-cover ${ring}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={`rounded-full bg-[#FFE8CC] flex items-center justify-center font-bold text-[#D2691E] ${ring}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}

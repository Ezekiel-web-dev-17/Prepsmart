"use server";

import { awardUserXP as awardXP, type XpEventType } from "@/lib/gamification";

export async function awardUserXPAction(
  userId: string,
  eventType: XpEventType
) {
  return await awardXP(userId, eventType);
}

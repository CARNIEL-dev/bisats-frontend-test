/** @format */

export const combineDateAndTimeToISO=(date: string, time: string)=> {
  if (!date || !time) {
    throw new Error("Date and time must both be provided");
  }

  // Combine into a full ISO string (local time)
  const combined = new Date(`${date}T${time}`);

  // Convert to ISO 8601 string (UTC)
  return combined.toISOString();
}

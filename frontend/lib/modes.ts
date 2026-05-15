export type ChatMode =
  | "general"
  | "symptom"
  | "disease"
  | "medication"
  | "mental_health"
  | "vaccination"
  | "outbreak"
  | "stats"
  | "accessibility";

export const MODES: { id: ChatMode; label: string; hint: string }[] = [
  { id: "general", label: "General", hint: "Health literacy and navigation" },
  { id: "symptom", label: "Symptom check", hint: "Possible causes & urgency (not diagnosis)" },
  { id: "disease", label: "Disease info", hint: "Plain-language explanations" },
  { id: "medication", label: "Medications", hint: "Drug info & interaction awareness" },
  { id: "mental_health", label: "Mental health", hint: "Screening-style support" },
  { id: "vaccination", label: "Vaccines", hint: "Schedules & prevention" },
  { id: "outbreak", label: "Outbreaks", hint: "Advisories & what to watch for" },
  { id: "stats", label: "Statistics", hint: "Trends and burden (general)" },
  { id: "accessibility", label: "Rural / remote", hint: "Access and telehealth options" },
];

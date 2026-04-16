export type MeetingStatus = "draft" | "published" | "archived";

export type Meeting = {
  id: string;
  title: string;
  meeting_date: string | null;
  status: MeetingStatus;

  arrival_silent_transition: string | null;
  opening_anchor: string | null;
  code_standard_reaffirmation: string | null;
  ownership_round: string | null;
  council_reflection: string | null;
  practical_alignment_block: string | null;
  open_business: string | null;
  commitment_declarations: string | null;
  closing_anchor: string | null;
  post_meeting_notes: string | null;
  next_meeting_date: string | null;

  created_at: string;
  updated_at: string;
};

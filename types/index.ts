export type ActionResult = {
	error: string;
};


export interface ProgressData {
  contentId: number;
  skor: number;
  startedAt: Date;
  group_id? : string | null;
  contentType: "kuis" | "cerita" | "puzzle"
}
export type ActionResult = {
	error: string;
};


export interface ProgressData {
  contentId: number;
  skor: number;
  startedAt: Date;
  contentType: "kuis" | "cerita" | "puzzle"
}
export type ActionResult = {
	error: string;
};

export interface IScene {
  scene_id: number
  cerita_id: number | null
  scene_key: string
  scene_text: string
  scene_choices?: any 
  condition?: any
  effect?: any
  is_ending: boolean
  ending_point: number
  ending_type?: string | null
  urutan?: number | null
}

export interface ProgressData {
  contentId: number;
  skor: number;
  startedAt: Date;
  contentType: "kuis" | "cerita" | "puzzle"
}
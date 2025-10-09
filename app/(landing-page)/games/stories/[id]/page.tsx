import { GetStoryById, GetScenesByStoryId } from "@/app/admin/dashboard/manage-stories/lib/data";
import { StoryPlayerClient } from "./_components/StoryPlayerClient";
import { CeritaInteraktif, Scene } from "@/lib/generated/prisma"; 

type PageProps = {
  params: { id: string };
};

export default async function StoryDetailPage({ params }: PageProps) {
  const [storyDetails, scenes] = await Promise.all([
    GetStoryById(params.id),
    GetScenesByStoryId(params.id),
  ]);

  if (!storyDetails || 
      'error' in storyDetails || 
      !Array.isArray(scenes) || 
      scenes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8 text-center bg-gray-50">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Cerita Tidak Ditemukan</h1>
          <p className="mt-2 text-gray-600">
            Cerita ini mungkin tidak ada atau belum memiliki adegan (scene).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <StoryPlayerClient 
        storyDetails={storyDetails as CeritaInteraktif} 
        scenes={scenes as Scene[]} 
      />
    </div>
  );
}
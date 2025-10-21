import { GetStoryById, GetCategories } from "../../lib/data"
import { UpdateStoryForm } from "../../_components/update-story"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"

interface UpdateStoryPageProps {
  params: {
    id: string
  }
}

const GURU_BASE_PATH = "/guru/dashboard/manage-stories";

export default async function UpdateStoryPage({ params }: UpdateStoryPageProps) {
  const session = await auth();
  const userId = Number(session?.user?.id);
  const userRole = session?.user?.role;
  
  const [story, categories] = await Promise.all([
    GetStoryById(params.id),
    GetCategories()
  ]);

  if (!story || "error" in story) {
    notFound();
  }
  
  const validCategories = Array.isArray(categories) ? categories : [];


  if (userRole === 'guru' && story.created_by !== userId) {
      redirect(`${GURU_BASE_PATH}?error=Akses ditolak. Anda hanya dapat mengedit cerita yang Anda buat.`);
  }

  const storyWithDetails = {
    ...story,
    kategori: story.kategori, 
    is_published: story.is_published, 
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Update Story</h1>
          <p className="text-muted-foreground">Edit informasi story dan simpan perubahan.</p>
        </div>

        <UpdateStoryForm story={storyWithDetails} categories={validCategories} />
      </div>
    </div>
  );
}
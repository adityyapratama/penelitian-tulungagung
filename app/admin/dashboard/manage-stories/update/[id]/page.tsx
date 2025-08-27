import { GetStoryById } from "../../lib/data"
import { UpdateStoryForm } from "../../components/update-story"
import { notFound } from "next/navigation"

interface UpdateStoryPageProps {
  params: {
    id: string
  }
}

export default async function UpdateStoryPage({ params }: UpdateStoryPageProps) {
  const story = await GetStoryById(params.id)

  if (!story || "error" in story) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Update Story</h1>
          <p className="text-muted-foreground">Edit the story details below and save your changes.</p>
        </div>

        <UpdateStoryForm story={story} />
      </div>
    </div>
  )
}

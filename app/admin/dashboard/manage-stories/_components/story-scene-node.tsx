import { Handle, Position } from "@xyflow/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import type { StoryScene } from "../configuration/[id]/page"

interface StorySceneNodeProps {
  data: StoryScene
}

export function StorySceneNode({ data }: StorySceneNodeProps) {
  return (
    <Card className="w-64 shadow-lg border-2 border-blue-200 bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-blue-700">{data.scene_key}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {data.scene_image && (
          <div className="mb-3">
            <Image
              src={data.scene_image || "/placeholder.svg"}
              alt={`Scene ${data.scene_key}`}
              width={256}
              height={96}
              className="w-full h-24 object-cover rounded-md"
              onError={() => {
                // Image component handles errors internally
              }}
            />
          </div>
        )}

        <p className="text-sm text-gray-700 mb-3 line-clamp-3">{data.scene_text}</p>

        {data.scene_choices.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500">Choices:</p>
            {data.scene_choices.map((choice, index) => (
              <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                {choice.text}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </Card>
  )
}

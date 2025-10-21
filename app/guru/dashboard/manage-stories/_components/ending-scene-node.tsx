import { Handle, Position } from "@xyflow/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Skull, Minus } from "lucide-react"
import Image from "next/image"
import type { StoryScene } from "../configuration/[id]/page"

interface EndingSceneNodeProps {
  data: StoryScene
}

export function EndingSceneNode({ data }: EndingSceneNodeProps) {
  const getEndingIcon = () => {
    switch (data.ending_type) {
      case "good":
        return <Crown className="w-4 h-4 text-yellow-500" />
      case "bad":
        return <Skull className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getEndingColor = () => {
    switch (data.ending_type) {
      case "good":
        return "border-green-200 bg-green-50"
      case "bad":
        return "border-red-200 bg-red-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  return (
    <Card className={`w-64 shadow-lg border-2 ${getEndingColor()}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {getEndingIcon()}
          {data.scene_key}
          <Badge variant="secondary" className="text-xs">
            ENDING
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {data.scene_image && (
          <div className="mb-3">
            <Image
              src={data.scene_image || "/placeholder.svg"}
              width={256}
              height={96}
              alt={`Scene ${data.scene_key}`}
              className="w-full h-24 object-cover rounded-md"
              onError={() => {
                // Image component handles errors internally
              }}
            />
          </div>
        )}

        <p className="text-sm text-gray-700 mb-3 line-clamp-3">{data.scene_text}</p>

        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Points:</span>
          <Badge variant="outline">{data.ending_point || 0}</Badge>
        </div>

        {data.ending_type && (
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-gray-500">Type:</span>
            <Badge
              variant={
                data.ending_type === "good" ? "default" : data.ending_type === "bad" ? "destructive" : "secondary"
              }
              className="text-xs"
            >
              {data.ending_type}
            </Badge>
          </div>
        )}
      </CardContent>

      <Handle type="target" position={Position.Top} className="w-3 h-3" />
    </Card>
  )
}

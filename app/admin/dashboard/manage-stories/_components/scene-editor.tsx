"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"
import type { StoryScene } from "@/app/[id]/page"

interface SceneEditorProps {
  scene: StoryScene
  onSave: (scene: StoryScene) => void
  onDelete: (sceneKey: string) => void
  onClose: () => void
}

export function SceneEditor({ scene, onSave, onDelete, onClose }: SceneEditorProps) {
  const [editedScene, setEditedScene] = useState<StoryScene>({ ...scene })

  const handleSave = () => {
    if (editedScene.scene_key.trim() === "") {
      alert("Scene key cannot be empty!")
      return
    }

    onSave(editedScene)
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this scene?")) {
      onDelete(scene.scene_key)
    }
  }

  const addChoice = () => {
    setEditedScene({
      ...editedScene,
      scene_choices: [...editedScene.scene_choices, { text: "", next: "" }],
    })
  }

  const updateChoice = (index: number, field: "text" | "next", value: string) => {
    const updatedChoices = editedScene.scene_choices.map((choice, i) =>
      i === index ? { ...choice, [field]: value } : choice,
    )
    setEditedScene({ ...editedScene, scene_choices: updatedChoices })
  }

  const removeChoice = (index: number) => {
    const updatedChoices = editedScene.scene_choices.filter((_, i) => i !== index)
    setEditedScene({ ...editedScene, scene_choices: updatedChoices })
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Scene: {scene.scene_key}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="scene_key">Scene Key</Label>
              <Input
                id="scene_key"
                value={editedScene.scene_key}
                onChange={(e) => setEditedScene({ ...editedScene, scene_key: e.target.value })}
                placeholder="Enter unique scene key"
              />
              <p className="text-sm text-gray-500 mt-1">Changing this will update all references in other scenes</p>
            </div>

            <div>
              <Label htmlFor="scene_text">Scene Text</Label>
              <Textarea
                id="scene_text"
                value={editedScene.scene_text}
                onChange={(e) => setEditedScene({ ...editedScene, scene_text: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_ending"
                checked={editedScene.is_ending}
                onCheckedChange={(checked) => setEditedScene({ ...editedScene, is_ending: checked })}
              />
              <Label htmlFor="is_ending">Is Ending Scene</Label>
            </div>
          </div>

          {/* Ending Scene Options */}
          {editedScene.is_ending && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ending Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ending_point">Ending Points</Label>
                  <Input
                    id="ending_point"
                    type="number"
                    value={editedScene.ending_point?.toString() || ""}
                    onChange={(e) => {
                      const value = e.target.value
                      setEditedScene({
                        ...editedScene,
                        ending_point: value === "" ? 0 : Number.parseInt(value) || 0,
                      })
                    }}
                    placeholder="Enter ending points"
                  />
                </div>

                <div>
                  <Label htmlFor="ending_type">Ending Type</Label>
                  <Select
                    value={editedScene.ending_type || "neutral"}
                    onValueChange={(value: "good" | "bad" | "neutral") =>
                      setEditedScene({ ...editedScene, ending_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="bad">Bad</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scene Choices */}
          {!editedScene.is_ending && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Scene Choices</CardTitle>
                <Button onClick={addChoice} size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Choice
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {editedScene.scene_choices.map((choice, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label>Choice Text</Label>
                      <Input
                        value={choice.text}
                        onChange={(e) => updateChoice(index, "text", e.target.value)}
                        placeholder="Enter choice text"
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Next Scene</Label>
                      <Input
                        value={choice.next}
                        onChange={(e) => updateChoice(index, "next", e.target.value)}
                        placeholder="scene_key"
                      />
                    </div>
                    <Button
                      onClick={() => removeChoice(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <Button onClick={handleDelete} variant="destructive">
              Delete Scene
            </Button>
            <div className="flex gap-2">
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

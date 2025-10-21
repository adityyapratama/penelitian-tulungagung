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
import type { StoryScene } from "../configuration/[id]/page"

interface SceneEditorProps {
  scene: StoryScene
  allScenes: StoryScene[]
  onSave: (scene: StoryScene) => void
  onDelete: (sceneKey: string) => void
  onClose: () => void
}

export function SceneEditor({ scene, allScenes, onSave, onDelete, onClose }: SceneEditorProps) {
  const [editedScene, setEditedScene] = useState<StoryScene>({ ...scene })

  const handleSave = () => {
    if (editedScene.scene_key.trim() === "") {
      alert("Scene key tidak boleh kosong!")
      return
    }
    onSave(editedScene)
  }

  const handleDelete = () => {
    if (confirm("Anda yakin ingin menghapus scene ini?")) {
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

  const availableNextScenes = allScenes.filter(s => s.scene_key !== editedScene.scene_key);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Scene: {scene.scene_key}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="scene_key">Scene Key</Label>
              <Input
                id="scene_key"
                value={editedScene.scene_key}
                onChange={(e) => setEditedScene({ ...editedScene, scene_key: e.target.value })}
                placeholder="Masukkan key unik untuk scene"
              />
              <p className="mt-1 text-sm text-gray-500">Mengubah ini akan memperbarui semua referensi.</p>
            </div>

            <div>
              <Label htmlFor="scene_text">Teks Scene</Label>
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
              <Label htmlFor="is_ending">Jadikan Scene Akhir (Ending)</Label>
            </div>
          </div>

          {editedScene.is_ending && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Opsi Ending</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ending_point">Poin Akhir</Label>
                  <Input
                    id="ending_point"
                    type="number"
                    value={editedScene.ending_point || 0}
                    onChange={(e) => setEditedScene({ ...editedScene, ending_point: parseInt(e.target.value) || 0 })}
                    placeholder="Masukkan poin akhir"
                  />
                </div>
                <div>
                  <Label htmlFor="ending_type">Tipe Ending</Label>
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
                      <SelectItem value="good">Baik</SelectItem>
                      <SelectItem value="bad">Buruk</SelectItem>
                      <SelectItem value="neutral">Netral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {!editedScene.is_ending && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Pilihan Adegan (Choices)</CardTitle>
                <Button onClick={addChoice} size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Tambah Pilihan
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {editedScene.scene_choices.map((choice, index) => (
                  <div key={index} className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label>Teks Pilihan</Label>
                      <Input
                        value={choice.text}
                        onChange={(e) => updateChoice(index, "text", e.target.value)}
                        placeholder="Teks yang muncul di tombol"
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Scene Berikutnya</Label>
                      <Select
                        value={choice.next}
                        onValueChange={(value) => updateChoice(index, "next", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih scene tujuan..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableNextScenes.map((s) => (
                            <SelectItem key={s.scene_key} value={s.scene_key}>
                              {s.scene_key}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={() => removeChoice(index)}
                      variant="outline"
                      size="icon"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            <Button onClick={handleDelete} variant="destructive">
              Hapus Scene
            </Button>
            <div className="flex gap-2">
              <Button onClick={onClose} variant="outline">
                Batal
              </Button>
              <Button onClick={handleSave}>Simpan Perubahan</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
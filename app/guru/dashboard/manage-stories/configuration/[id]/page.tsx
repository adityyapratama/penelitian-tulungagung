"use client"

import { useState, useCallback, useTransition, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type Connection,
  type EdgeChange,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { StorySceneNode } from "../../_components/story-scene-node"
import { EndingSceneNode } from "../../_components/ending-scene-node"
import { SceneEditor } from "../../_components/scene-editor"
import { Button } from "@/components/ui/button"
import { PlayCircle, Plus, Save, Upload, ArrowLeft } from "lucide-react"
import { saveScenes, GetScenesByStoryId } from "../../lib/data"
import { toast } from "sonner"
import Link from "next/link"

export interface StoryScene {
  scene_key: string
  scene_text: string
  scene_choices: Array<{ text: string; next: string }>
  is_ending: boolean
  ending_point?: number
  ending_type?: "good" | "bad" | "neutral"
  scene_image?: string
}

const nodeTypes = {
  storyScene: StorySceneNode,
  endingScene: EndingSceneNode,
}

const createNodesFromScenes = (scenes: StoryScene[]): Node[] => {
  return scenes.map((scene, index) => ({
    id: scene.scene_key,
    type: scene.is_ending ? "endingScene" : "storyScene",
    position: { x: (index % 4) * 280, y: Math.floor(index / 4) * 180 },
    data: scene as unknown as Record<string, unknown>,
  }))
}

const createEdgesFromScenes = (scenes: StoryScene[]): Edge[] => {
  const edges: Edge[] = []
  scenes.forEach((scene) => {
    scene.scene_choices.forEach((choice, choiceIndex) => {
      edges.push({
        id: `${scene.scene_key}-${choice.next}-${choiceIndex}`,
        source: scene.scene_key,
        target: choice.next,
        label: choice.text,
        type: "smoothstep",
        markerEnd: { type: "arrowclosed" },
      })
    })
  })
  return edges
}

const updateNodesFromScenes = (scenes: StoryScene[], currentNodes: Node[]): Node[] => {
  return scenes.map((scene, index) => {
    const existingNode = currentNodes.find((node) => node.id === scene.scene_key)
    return {
      id: scene.scene_key,
      type: scene.is_ending ? "endingScene" : "storyScene",
      position: existingNode?.position || { x: (index % 4) * 280, y: Math.floor(index / 4) * 180 },
      data: scene as unknown as Record<string, unknown>,
    }
  })
}

export default function ConfigurationPage() {
  const params = useParams()
  const router = useRouter()
  const storyId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [scenes, setScenes] = useState<StoryScene[]>([])
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedScene, setSelectedScene] = useState<StoryScene | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const loadInitialScenes = async () => {
      try {
        const result = await GetScenesByStoryId(storyId)
        if (Array.isArray(result) && result.length > 0) {
          const convertedScenes: StoryScene[] = result.map((scene: any) => ({
            scene_key: scene.scene_key,
            scene_text: scene.scene_text,
            scene_choices: scene.scene_choices || [],
            is_ending: scene.is_ending,
            ending_point: scene.ending_point || 0,
            ending_type: scene.ending_type,
            scene_image: scene.scene_image,
          }))
          setScenes(convertedScenes)
          setNodes(createNodesFromScenes(convertedScenes))
          setEdges(createEdgesFromScenes(convertedScenes))
        }
      } catch (error) {
        toast.error("Gagal memuat scene awal.")
      } finally {
        setIsLoading(false)
      }
    }
    loadInitialScenes()
  }, [storyId])

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return

      setScenes((currentScenes) => {
        const sourceScene = currentScenes.find((s) => s.scene_key === params.source)
        if (sourceScene) {
          const choiceExists = sourceScene.scene_choices.some((c) => c.next === params.target)
          if (!choiceExists) {
            sourceScene.scene_choices.push({
              text: "Pilihan baru...",
              next: params.target!,
            })
          }
        }
        setEdges(createEdgesFromScenes(currentScenes))
        return [...currentScenes]
      })
    },
    []
  )

  const onNodeClick = useCallback((event, node: Node) => {
    setSelectedScene(node.data as StoryScene)
    setIsEditorOpen(true)
  }, [])

  const addNewScene = useCallback(() => {
    setScenes((currentScenes) => {
      const newSceneKey = `scene_${String(currentScenes.length + 1).padStart(2, "0")}`
      const newScene: StoryScene = {
        scene_key: newSceneKey,
        scene_text: "Teks untuk scene baru...",
        scene_choices: [],
        is_ending: false,
      }
      const updatedScenes = [...currentScenes, newScene]
      setNodes(updateNodesFromScenes(updatedScenes, nodes))
      setEdges(createEdgesFromScenes(updatedScenes))
      return updatedScenes
    })
  }, [nodes])

  const updateScene = useCallback(
    (updatedScene: StoryScene) => {
      setScenes((currentScenes) => {
        const newScenes = currentScenes.map((s) =>
          s.scene_key === selectedScene?.scene_key ? updatedScene : s
        )
        setNodes(updateNodesFromScenes(newScenes, nodes))
        setEdges(createEdgesFromScenes(newScenes))
        return newScenes
      })
      setIsEditorOpen(false)
      setSelectedScene(null)
    },
    [nodes, selectedScene]
  )

  const deleteScene = useCallback(
    (sceneKey: string) => {
      setScenes((currentScenes) => {
        const newScenes = currentScenes.filter((s) => s.scene_key !== sceneKey)
        const finalScenes = newScenes.map(scene => ({
          ...scene,
          scene_choices: scene.scene_choices.filter(choice => choice.next !== sceneKey)
        }))
        setNodes(updateNodesFromScenes(finalScenes, nodes))
        setEdges(createEdgesFromScenes(finalScenes))
        return finalScenes
      })
      setIsEditorOpen(false)
      setSelectedScene(null)
    },
    [nodes]
  )

  const saveToDatabase = useCallback(() => {
    const formData = new FormData()
    formData.append("scenes", JSON.stringify(scenes))
    formData.append("cerita_id", storyId)

    startTransition(async () => {
      const result = await saveScenes(formData)
      if (result.success) {
        toast.success("Berhasil", { description: "Semua scene berhasil disimpan ke database." })
      } else {
        toast.error("Gagal", { description: result.error || "Terjadi kesalahan saat menyimpan." })
      }
    })
  }, [scenes, storyId])

  const loadFromDatabase = useCallback(() => {
    startTransition(async () => {
        const result = await GetScenesByStoryId(storyId)
        if (Array.isArray(result)) {
           const convertedScenes: StoryScene[] = result.map((scene: any) => ({
            scene_key: scene.scene_key,
            scene_text: scene.scene_text,
            scene_choices: scene.scene_choices || [],
            is_ending: scene.is_ending,
            ending_point: scene.ending_point || 0,
            ending_type: scene.ending_type,
            scene_image: scene.scene_image,
          }))
          setScenes(convertedScenes)
          setNodes(createNodesFromScenes(convertedScenes))
          setEdges(createEdgesFromScenes(convertedScenes))
          toast.success("Berhasil", { description: "Scene berhasil dimuat dari database." })
        } else {
            toast.error("Gagal", { description: "Tidak ada scene yang ditemukan di database." })
        }
    })
  }, [storyId])

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto flex h-full flex-col space-y-4 p-4 py-6 md:space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/guru/dashboard/manage-stories">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Konfigurasi Alur Cerita
            </h1>
            <p className="text-muted-foreground">
              Atur, hubungkan, dan simpan semua adegan (scene) untuk cerita interaktif Anda.
            </p>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center justify-start gap-2 md:w-auto">
          <Button onClick={addNewScene}>
            <Plus className="mr-2 h-4 w-4" /> Add Scene
          </Button>
          <Button onClick={saveToDatabase} disabled={isPending}>
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "Menyimpan..." : "Save to DB"}
          </Button>
          <Button onClick={loadFromDatabase} variant="outline" disabled={isPending}>
            <Upload className="mr-2 h-4 w-4" /> Load from DB
          </Button>
          <Button onClick={() => router.push(`/guru/dashboard/manage-stories/demo/${storyId}`)} variant="outline">
            <PlayCircle className="mr-2 h-4 w-4" /> Play
          </Button>
        </div>
      </div>

      <div className="relative flex-1 rounded-lg border bg-background shadow-sm" style={{ height: '70vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      {isEditorOpen && selectedScene && (
        <SceneEditor
          scene={selectedScene}
          allScenes={scenes} 
          onSave={updateScene}
          onDelete={deleteScene}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  )
}
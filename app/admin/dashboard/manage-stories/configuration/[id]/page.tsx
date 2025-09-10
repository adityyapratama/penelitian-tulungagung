"use client"

import { useState, useCallback, useTransition, useEffect } from "react"
import { redirect, useParams } from "next/navigation"
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
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
import { PlayCircle, Plus, Save, Upload } from "lucide-react"
import { saveScenes, loadScenes, GetScenesByStoryId } from "../../lib/data"

export interface StoryScene {
  scene_key: string
  scene_text: string
  scene_choices: Array<{ text: string; next: string }>
  is_ending: boolean
  ending_point?: number
  ending_type?: "good" | "bad" | "neutral"
}

const nodeTypes = {
  storyScene: StorySceneNode,
  endingScene: EndingSceneNode,
}

const initialScenes: StoryScene[] = []

const createNodesFromScenes = (scenes: StoryScene[]): Node[] => {
  return scenes.map((scene, index) => ({
    id: scene.scene_key,
    type: scene.is_ending ? "endingScene" : "storyScene",
    position: { x: (index % 3) * 300, y: Math.floor(index / 3) * 200 },
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
      position: existingNode?.position || { x: (index % 3) * 300, y: Math.floor(index / 3) * 200 },
      data: scene as unknown as Record<string, unknown>,
    }
  })
}

export default function Page() {
  const params = useParams()
  const storyId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [scenes, setScenes] = useState<StoryScene[]>(initialScenes)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedScene, setSelectedScene] = useState<StoryScene | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const loadInitialScenes = async () => {
      try {
        const result = await GetScenesByStoryId(storyId)
        if (Array.isArray(result)) {
          const convertedScenes: StoryScene[] = result.map((scene: any) => ({
            scene_key: scene.scene_key,
            scene_text: scene.scene_text,
            scene_choices: scene.scene_choices || [],
            is_ending: scene.is_ending,
            ending_point: scene.ending_point || 0,
            ending_type: scene.ending_type,
          }))

          setScenes(convertedScenes)
          setNodes(createNodesFromScenes(convertedScenes))
          setEdges(createEdgesFromScenes(convertedScenes))
        }
      } catch (error) {
        console.error("[v0] Error loading initial scenes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialScenes()
  }, [storyId])

  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  )

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((edgesSnapshot) => {
      const newEdges = applyEdgeChanges(changes, edgesSnapshot)

      const deletedEdges = changes.filter((change) => change.type === "remove")
      if (deletedEdges.length > 0) {
        setScenes((currentScenes) => {
          const updatedScenes = [...currentScenes]

          deletedEdges.forEach((change) => {
            const deletedEdge = edgesSnapshot.find((edge) => edge.id === change.id)
            if (deletedEdge) {
              const sourceSceneIndex = updatedScenes.findIndex((scene) => scene.scene_key === deletedEdge.source)
              if (sourceSceneIndex !== -1) {
                const sourceScene = updatedScenes[sourceSceneIndex]
                sourceScene.scene_choices = sourceScene.scene_choices.filter(
                  (choice) => choice.next !== deletedEdge.target,
                )
              }
            }
          })

          setNodes((currentNodes) => updateNodesFromScenes(updatedScenes, currentNodes))
          return updatedScenes
        })
      }

      return newEdges
    })
  }, [])

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return

      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot))

      setScenes((currentScenes) => {
        const updatedScenes = [...currentScenes]
        const sourceSceneIndex = updatedScenes.findIndex((scene) => scene.scene_key === params.source)
        const targetScene = updatedScenes.find((scene) => scene.scene_key === params.target)

        if (sourceSceneIndex !== -1 && targetScene) {
          const sourceScene = updatedScenes[sourceSceneIndex]
          const existingChoice = sourceScene.scene_choices.find((choice) => choice.next === params.target)
          if (!existingChoice) {
            sourceScene.scene_choices.push({
              text: `Go to ${targetScene.scene_key}`,
              next: params.target,
            })
          }
        }

        setNodes((currentNodes) => updateNodesFromScenes(updatedScenes, currentNodes))
        setEdges(createEdgesFromScenes(updatedScenes))
        return updatedScenes
      })
    },
    [updateNodesFromScenes],
  )

  const onNodeClick = useCallback((event, node: Node) => {
    setSelectedScene(node.data as StoryScene)
    setIsEditorOpen(true)
  }, [])

  const addNewScene = useCallback(() => {
    const newSceneKey = `scene_${String(scenes.length + 1).padStart(2, "0")}`
    const newScene: StoryScene = {
      scene_key: newSceneKey,
      scene_text: "Tulis cerita scene baru di sini...",
      scene_choices: [],
      is_ending: false,
    }

    const updatedScenes = [...scenes, newScene]
    setScenes(updatedScenes)
    setNodes((currentNodes) => updateNodesFromScenes(updatedScenes, currentNodes))
    setEdges(createEdgesFromScenes(updatedScenes))
  }, [scenes])

  const updateScene = useCallback(
    (updatedScene: StoryScene) => {
      const originalScene = scenes.find((scene) => scene.scene_key === selectedScene?.scene_key)
      const oldSceneKey = originalScene?.scene_key
      const newSceneKey = updatedScene.scene_key

      let updatedScenes = scenes.map((scene) => (scene.scene_key === oldSceneKey ? updatedScene : scene))

      if (oldSceneKey && newSceneKey && oldSceneKey !== newSceneKey) {
        updatedScenes = updatedScenes.map((scene) => ({
          ...scene,
          scene_choices: scene.scene_choices.map((choice) =>
            choice.next === oldSceneKey ? { ...choice, next: newSceneKey } : choice,
          ),
        }))
      }

      setScenes(updatedScenes)
      setNodes((currentNodes) => updateNodesFromScenes(updatedScenes, currentNodes))
      setEdges(createEdgesFromScenes(updatedScenes))
      setIsEditorOpen(false)
    },
    [scenes, selectedScene, updateNodesFromScenes],
  )

  const deleteScene = useCallback(
    (sceneKey: string) => {
      const updatedScenes = scenes.filter((scene) => scene.scene_key !== sceneKey)
      setScenes(updatedScenes)
      setNodes((currentNodes) => updateNodesFromScenes(updatedScenes, currentNodes))
      setEdges(createEdgesFromScenes(updatedScenes))
      setIsEditorOpen(false)
    },
    [scenes, updateNodesFromScenes],
  )

  const saveToDatabase = useCallback(async () => {
    const formData = new FormData()
    formData.append("scenes", JSON.stringify(scenes))
    formData.append("cerita_id", storyId)

    startTransition(async () => {
      try {
        const result = await saveScenes(formData)
        if (result.success) {
          console.log("[v0] Scenes saved successfully")
        } else {
          console.error("[v0] Error saving scenes:", result.error)
        }
      } catch (error) {
        console.error("[v0] Error saving scenes:", error)
      }
    })
  }, [scenes, storyId])

  const loadFromDatabase = useCallback(async () => {
    const formData = new FormData()
    formData.append("cerita_id", storyId)

    startTransition(async () => {
      try {
        const result = await loadScenes(formData)
        if (result.success && result.scenes) {
          const convertedScenes: StoryScene[] = result.scenes.map((scene: any) => ({
            scene_key: scene.scene_key,
            scene_text: scene.scene_text,
            scene_choices: scene.scene_choices || [],
            is_ending: scene.is_ending,
            ending_point: scene.ending_point,
            ending_type: scene.ending_type,
          }))

          setScenes(convertedScenes)
          setNodes(createNodesFromScenes(convertedScenes))
          setEdges(createEdgesFromScenes(convertedScenes))

          console.log("[v0] Scenes loaded successfully")
        } else {
          console.error("[v0] Error loading scenes:", result.error)
        }
      } catch (error) {
        console.error("[v0] Error loading scenes:", error)
      }
    })
  }, [storyId])

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-lg">Loading scenes...</div>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen relative">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button onClick={addNewScene} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Scene
        </Button>
        <Button onClick={saveToDatabase} disabled={isPending} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          {isPending ? "Saving..." : "Save to DB"}
        </Button>
        <Button
          onClick={loadFromDatabase}
          disabled={isPending}
          variant="outline"
          className="flex items-center gap-2 bg-transparent"
        >
          <Upload className="w-4 h-4" />
          {isPending ? "Loading..." : "Load from DB"}
        </Button>
        <Button
          onClick={() => redirect(`/admin/dashboard/manage-stories/demo/${storyId}`)}
          disabled={isPending}
          variant="outline"
          className="flex items-center gap-2 bg-transparent"
        >
          <PlayCircle className="w-4 h-4"/>
          {isPending ? "Loading..." : "Play"}
        </Button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      />

      {isEditorOpen && selectedScene && (
        <SceneEditor
          scene={selectedScene}
          onSave={updateScene}
          onDelete={deleteScene}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  )
}

import { useState, useCallback } from 'react';
import { ReactFlow, Background, Controls, applyNodeChanges, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css'
import FolderNode from './components/FolderNode'
import Sidebar from './components/SideBar';

function FlowArea() {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const { screenToFlowPosition } = useReactFlow()
  
  const nodeTypes = {
    folderNode: FolderNode,
  };

  const handleDrop = (e) => {
    e.preventDefault()
    const data = JSON.parse(e.dataTransfer.getData("text/plain"))
    console.log("HANDLEDROP DATA: ", data)
    console.log("data.parentId", data.parentId)

    const position = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    window.electronAPI.scanFolder(data.subfolderPath)
      .then((response) => {
        const newNode = {
          id: response.folderId,
          data: {
            name: response.folderName,
            files: response.files,
            subfolders: response.subfolders,
            parentId: data.parentId,
          },
          position: position,
          type: "folderNode"
        }

        const newNodes = nodes.concat(newNode)

        const newEdges = newNodes.map((node) => (
          {
            id: `${node.data.parentId}->${node.id}`,
            source: node.data.parentId,
            target: node.id
          }
        ))

        console.log("NEW NODES: ", newNodes)
        console.log("NEW EDGES: ", newEdges)

        setNodes(newNodes)
        setEdges(newEdges)
      })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const handleSelectFolder = async () => {
    const response = await window.electronAPI.selectFolder();
    if (response) {
      const { folderId, folderName, files, subfolders } = response

      const rootNode = [{
        id: folderId,
        position: {x: 100, y: 100},
        data: { label: folderName, files: files, subfolders: subfolders, parentId: null },
        type: "folderNode"
      }]
      setNodes(rootNode)
    }
  };

  return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden'}}>
        <Sidebar handleSelectFolder={handleSelectFolder}/>
        <div style={{ flexGrow: 1, height: '100vh' }} onDrop={handleDrop} onDragOver={handleDragOver}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            minZoom={0.1}
            maxZoom={2}
            style={{
              width: '100%',
              height: '100%'
            }}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div >
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowArea />
    </ReactFlowProvider>
  ) 
}

import { useState } from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import * as d3 from "d3";
import '@xyflow/react/dist/style.css';
import './App.css'
import FolderNode from './components/FolderNode'
import Sidebar from './components/SideBar';

export default function App() {
  const [edges, setEdges] = useState([])
  const [nodes, setNodes] = useState([])

  const nodeTypes = {
    folderNode: FolderNode,
  };

  const handleSelectFolder = async () => {
    const response = await window.electronAPI.selectFolder();
    if (response) {

      console.log("\n\n RESPONSE: ", response)

      const root = d3.stratify()(response)
      // console.log("root: ", root)
      
      const treeLayout = d3.tree()
      treeLayout.nodeSize([250, 260])
      treeLayout(root)

      console.log("DESCENDANTS: ", root.descendants())

      const nodes = root.descendants().map((descendant) => {
        return (
          {
            id: descendant.id,
            position: { x: descendant.x, y: descendant.y },
            data: { label: descendant.data.name, files: descendant.data.files, isEndNode: descendant.data.isEndNode},
            type: 'folderNode'
          }
        )
      })

      const edges = root.links().map((link) => {
        return (
          {
            id: `${link.source.id}->${link.target.id}`,
            source: link.source.id,
            target: link.target.id,
          }
        )
      })

      setNodes(nodes)
      setEdges(edges)
    }
  };

  return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden'}}>
        <Sidebar handleSelectFolder={handleSelectFolder}/>
        <div style={{ flexGrow: 1, height: '100vh' }} >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
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

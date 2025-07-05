import { useState } from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import * as d3 from "d3";
import '@xyflow/react/dist/style.css';
import './App.css'
import CleanNode from './components/CleanNode'

export default function App() {
  const [edges, setEdges] = useState([])
  const [nodes, setNodes] = useState([
    {
      id: '1',
      position: { x: 0, y: 0 },
      data: { label: "hello.txt" },
      type: 'clean'
    },
  ])

  const nodeTypes = {
    clean: CleanNode,
  };

  const handleSelectFolder = async () => {
    const response = await window.electronAPI.selectFolder();
    if (response) {

      console.log("\n\n RESPONSE: ", response)

      const root = d3.stratify()(response)
      console.log("root: ", root)
      
      const treeLayout = d3.tree()
      treeLayout.nodeSize([180, 130])
      treeLayout(root)

      const nodes = root.descendants().map((descendant) => {
        return (
          {
            id: descendant.id,
            position: { x: descendant.x, y: descendant.y },
            data: { label: descendant.data.name },
            type: 'clean'
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
    <>
      <button onClick={handleSelectFolder}>Select Folder</button>
      <div style={{ width: "700px", height: "500px" }} >
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </>
  )
}

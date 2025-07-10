import { useState, useCallback } from 'react';
import { ReactFlow, Background, Controls, applyNodeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css'
import FolderNode from './components/FolderNode'
import Sidebar from './components/SideBar';

export default function App() {
  const [nodes, setNodes] = useState([])

const onNodesChange = useCallback(
  (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
  [],
);

  const nodeTypes = {
    folderNode: FolderNode,
  };

  const handleSelectFolder = async () => {
    const response = await window.electronAPI.selectFolder();
    if (response) {
      console.log("response: ", response)
      const { folderId, folderName, files, subfolders } = response

      const rootNode = [{
        id: folderId,
        position: {x: 100, y: 100},
        data: { label: folderName, files: files, subfolders: subfolders },
        type: "folderNode"
      }]
      setNodes(rootNode)
      // setEdges(edges)
    }
  };

  return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden'}}>
        <Sidebar handleSelectFolder={handleSelectFolder}/>
        <div style={{ flexGrow: 1, height: '100vh' }} >
          <ReactFlow
            nodes={nodes}
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

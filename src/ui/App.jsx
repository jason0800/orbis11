import { useState } from 'react';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css'


export default function App() {
  const [fileNodes, setFileNodes] = useState([
    {
      id: '1',
      position: { x: 0, y: 0 },
      data: { label: "hello.txt" },
    },
  ])

  const handleSelectFolder = async () => {
    const response = await window.electronAPI.selectFolder();
    if (response) {
      console.log("This is the response: ", response)

      const nodes = response.map((file) => (
        {
          id: `${Math.random().toString(36).substring(2)}` ,
          position: { x: Math.random()*250, y: Math.random()*250 },
          data: { label: file }
        }
      ))

      console.log(nodes)

      setFileNodes(nodes)
    }
  };

  return (
    <>
      <button onClick={handleSelectFolder}>Select Folder</button>
      <div style={{ width: "700px", height: "500px" }} >
        <ReactFlow nodes={fileNodes}>
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </>
  )
}
